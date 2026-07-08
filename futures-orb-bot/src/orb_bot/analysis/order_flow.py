"""Order-flow analyzers: Delta, Cumulative Volume Delta, Bid/Ask Imbalance,
and Absorption.

These read the balance between aggressive buyers and sellers. True order flow
needs bid/ask (footprint) data; with OHLCV bars we approximate it from the
close-location value (see :mod:`orb_bot.analysis.common`). Every analyzer here
sets ``raw["approximation"] = True`` and is written so a tick-accurate
implementation can replace the proxy without changing the interface.
"""

from __future__ import annotations

import numpy as np

from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, clamp, register_analyzer, scale
from .common import bar_delta, close_location_value, cumulative_delta, relative_volume


@register_analyzer("delta")
class DeltaAnalyzer(Analyzer):
    """Net aggressive delta over the last few bars."""

    label = "Delta"

    def __init__(self, window: int = 5):
        self.window = window

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        if len(ctx.df) < 2:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data for delta.", timeframe=ctx.timeframe)
        recent = ctx.df.tail(self.window)
        delta = bar_delta(recent)
        net = float(delta.sum())
        vol = float(recent["volume"].clip(lower=0).sum()) or 1.0
        ratio = net / vol                       # −1..+1
        bias = Bias.from_sign(net)
        conf = clamp(40 + 55 * abs(ratio), 0, 95)
        expl = (f"Net delta over {len(recent)} bars is {net:+.0f} "
                f"({ratio:+.0%} of volume) — {'buyers' if net>0 else 'sellers'} in control.")
        return AnalyzerResult(self.label, bias, conf, expl,
                              raw={"net_delta": net, "delta_ratio": ratio,
                                   "window": len(recent), "approximation": True},
                              timeframe=ctx.timeframe)


@register_analyzer("cvd")
class CumulativeVolumeDeltaAnalyzer(Analyzer):
    """Session cumulative delta slope, with price/CVD divergence detection."""

    label = "Cumulative Volume Delta"

    def __init__(self, slope_window: int = 10):
        self.slope_window = slope_window

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        src = ctx.session if ctx.session is not None and len(ctx.session) > 2 else ctx.df
        if len(src) < 3:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data for CVD.", timeframe=ctx.timeframe)
        cvd = cumulative_delta(src)
        w = min(self.slope_window, len(cvd) - 1)
        slope = float(cvd.iloc[-1] - cvd.iloc[-1 - w])
        price_chg = float(src["close"].iloc[-1] - src["close"].iloc[-1 - w])
        bias = Bias.from_sign(slope)
        rng = float(cvd.max() - cvd.min()) or abs(slope) or 1.0
        conf = clamp(40 + 55 * scale(abs(slope), 0, rng) / 100.0, 0, 95)

        divergence = (slope > 0 > price_chg) or (slope < 0 < price_chg)
        if divergence:
            conf = clamp(conf * 0.7, 0, 80)
            expl = (f"CVD rising while price falls (or vice versa) — divergence; "
                    f"CVD slope {slope:+.0f} vs price {price_chg:+.2f}.")
        else:
            expl = (f"CVD slope {slope:+.0f} over {w} bars confirms "
                    f"{'buying' if slope>0 else 'selling'} pressure (price {price_chg:+.2f}).")
        return AnalyzerResult(self.label, bias, conf, expl,
                              levels={"cvd": float(cvd.iloc[-1])},
                              raw={"cvd": float(cvd.iloc[-1]), "cvd_slope": slope,
                                   "price_change": price_chg, "divergence": divergence,
                                   "approximation": True},
                              timeframe=ctx.timeframe)


@register_analyzer("imbalance")
class BidAskImbalanceAnalyzer(Analyzer):
    """Aggressive buy/sell imbalance on the most recent bar(s)."""

    label = "Bid/Ask Imbalance"

    def __init__(self, window: int = 3):
        self.window = window

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        if len(ctx.df) < 1:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No data.", timeframe=ctx.timeframe)
        recent = ctx.df.tail(self.window)
        clv = close_location_value(recent)             # −1..+1 per bar
        vol = recent["volume"].clip(lower=0)
        buy = float((vol * (clv.clip(lower=0))).sum())
        sell = float((vol * (-clv.clip(upper=0))).sum())
        total = buy + sell or 1.0
        imbalance = (buy - sell) / total               # −1..+1
        bias = Bias.from_sign(imbalance)
        conf = clamp(35 + 60 * abs(imbalance), 0, 95)
        expl = (f"Aggressor imbalance {imbalance:+.0%} "
                f"(buy {buy:.0f} vs sell {sell:.0f}) over {len(recent)} bars.")
        return AnalyzerResult(self.label, bias, conf, expl,
                              raw={"imbalance": imbalance, "buy_volume": buy,
                                   "sell_volume": sell, "approximation": True},
                              timeframe=ctx.timeframe)


@register_analyzer("absorption")
class AbsorptionAnalyzer(Analyzer):
    """Detect absorption: heavy volume with little price progress.

    When aggressive orders hit but price barely moves, the opposite side is
    absorbing — often a precursor to a reversal in the absorbing side's favour.
    """

    label = "Absorption"

    def __init__(self, rvol_threshold: float = 1.5, body_ratio: float = 0.45):
        self.rvol_threshold = rvol_threshold
        self.body_ratio = body_ratio

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        if len(ctx.df) < 3:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data.", timeframe=ctx.timeframe)
        last = ctx.df.iloc[-1]
        rng = float(last["high"] - last["low"])
        if rng <= 0:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 10.0,
                                  "Zero-range bar.", timeframe=ctx.timeframe)
        body = abs(float(last["close"] - last["open"]))
        rvol = relative_volume(ctx.df)
        clv = float(close_location_value(ctx.df).iloc[-1])   # aggressor side
        body_frac = body / rng

        absorbing = rvol >= self.rvol_threshold and body_frac <= self.body_ratio
        if absorbing and clv != 0:
            # Aggressor is clv's sign; the *absorbing* side is the opposite.
            bias = Bias.from_sign(-clv)
            conf = clamp(45 + 25 * (rvol - self.rvol_threshold) + 20 * (1 - body_frac), 0, 92)
            aggressor = "buyers" if clv > 0 else "sellers"
            absorber = "sellers" if clv > 0 else "buyers"
            expl = (f"High volume (RVOL {rvol:.2f}×) but small body "
                    f"({body_frac:.0%} of range): {aggressor} aggressive, "
                    f"{absorber} absorbing → {bias.value}.")
        else:
            bias, conf = Bias.NEUTRAL, clamp(20 + 10 * (rvol - 1), 0, 40)
            expl = f"No absorption (RVOL {rvol:.2f}×, body {body_frac:.0%} of range)."
        return AnalyzerResult(self.label, bias, conf, expl,
                              raw={"rvol": rvol, "body_fraction": body_frac,
                                   "clv": clv, "absorbing": bool(absorbing),
                                   "approximation": True},
                              timeframe=ctx.timeframe)
