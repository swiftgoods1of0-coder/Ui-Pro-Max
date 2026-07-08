"""Indicator-style analyzers: VWAP, ATR, and Relative Volume.

* :class:`VWAPAnalyzer`           – directional: above VWAP bullish, below bearish
* :class:`ATRAnalyzer`            – volatility regime (non-directional by nature)
* :class:`RelativeVolumeAnalyzer` – conviction behind the current move
"""

from __future__ import annotations

import numpy as np

from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, clamp, register_analyzer, scale
from .common import atr, level_bias, relative_volume, session_vwap


@register_analyzer("vwap")
class VWAPAnalyzer(Analyzer):
    label = "VWAP"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        src = ctx.session if ctx.session is not None and len(ctx.session) else ctx.df
        if len(src) < 2:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data for VWAP.", timeframe=ctx.timeframe)
        vwap = session_vwap(src)
        vw = float(vwap.iloc[-1])
        # Distance normalised by ATR so "far from VWAP" adapts to volatility.
        a = float(atr(ctx.df, 14).iloc[-1]) or (src["high"].iloc[-1] - src["low"].iloc[-1])
        width = a * 3 if a else abs(ctx.price - vw) or 1.0
        bias, conf = level_bias(ctx.price, vw, width)
        side = "above" if ctx.price >= vw else "below"
        expl = f"Price {ctx.price:.2f} is {side} session VWAP ({vw:.2f}), {abs(ctx.price-vw)/ (a or 1):.1f} ATR away."
        return AnalyzerResult(self.label, bias, conf, expl,
                              levels={"vwap": vw}, invalidation=vw,
                              raw={"vwap": vw, "price": ctx.price, "atr": a},
                              timeframe=ctx.timeframe)


@register_analyzer("atr")
class ATRAnalyzer(Analyzer):
    """Volatility regime. ATR is not directional, so direction is NEUTRAL;
    confidence reflects how *expanded* volatility is versus its own baseline."""

    label = "ATR"

    def __init__(self, period: int = 14, baseline: int = 50):
        self.period, self.baseline = period, baseline

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        if len(ctx.df) < self.period + 2:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data for ATR.", timeframe=ctx.timeframe)
        a = atr(ctx.df, self.period)
        cur = float(a.iloc[-1])
        base = float(a.tail(self.baseline).mean())
        ratio = cur / base if base else 1.0
        # Confidence = how far from a "normal" regime (ratio 1.0), either way.
        conf = clamp(scale(abs(ratio - 1.0), 0.0, 1.0) , 0, 100)
        regime = "expanding" if ratio > 1.15 else ("contracting" if ratio < 0.85 else "normal")
        expl = f"ATR {cur:.2f} is {ratio:.2f}× its {self.baseline}-bar baseline — volatility {regime}."
        return AnalyzerResult(self.label, Bias.NEUTRAL, conf, expl,
                              levels={"atr": cur},
                              raw={"atr": cur, "atr_baseline": base, "ratio": ratio,
                                   "regime": regime},
                              timeframe=ctx.timeframe)


@register_analyzer("relative_volume")
class RelativeVolumeAnalyzer(Analyzer):
    """Relative volume (RVOL) with the direction of the current bar.

    High RVOL on an up bar is bullish conviction; on a down bar, bearish. Low
    RVOL means little conviction (chop) → low confidence, neutral.
    """

    label = "Relative Volume"

    def __init__(self, lookback: int = 20):
        self.lookback = lookback

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        if len(ctx.df) < 3:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough data for RVOL.", timeframe=ctx.timeframe)
        rvol = relative_volume(ctx.df, self.lookback)
        last = ctx.df.iloc[-1]
        bar_dir = np.sign(last["close"] - last["open"])
        if rvol < 1.0 or bar_dir == 0:
            bias, conf = Bias.NEUTRAL, clamp(scale(rvol, 0, 1) * 0.5, 0, 40)
            expl = f"RVOL {rvol:.2f}× — below-average participation (chop risk)."
        else:
            bias = Bias.from_sign(bar_dir)
            conf = clamp(40 + 20 * (rvol - 1.0), 0, 95)
            expl = (f"RVOL {rvol:.2f}× on a {'up' if bar_dir>0 else 'down'} bar — "
                    f"{'bullish' if bar_dir>0 else 'bearish'} conviction.")
        return AnalyzerResult(self.label, bias, conf, expl,
                              raw={"rvol": rvol, "bar_direction": float(bar_dir)},
                              timeframe=ctx.timeframe)
