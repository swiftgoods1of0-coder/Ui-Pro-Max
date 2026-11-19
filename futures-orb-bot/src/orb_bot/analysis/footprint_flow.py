"""Real order-flow analyzers, built from actual tick/footprint data.

Unlike :mod:`orb_bot.analysis.order_flow` (which approximates aggressor split
from candle shape), these read a real
:class:`~orb_bot.footprint.bar.FootprintBar` — per-price-level bid/ask volume
built from tick data — via ``ctx.current_footprint``. When no tick data was
supplied for the run, ``ctx.current_footprint`` is ``None`` and both analyzers
honestly report "no data" (neutral, zero confidence) rather than silently
falling back to a guess; the OHLCV-approximation analyzers remain available for
that case, and the :class:`~orb_bot.analysis.engine.ConfidenceEngine`
automatically steps back from them whenever real footprint data is present for
a call (see ``ConfidenceEngine._aggregate``'s approximation-suppression).
"""

from __future__ import annotations

from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, clamp, register_analyzer, scale
from ..footprint.signals import detect_absorption, detect_stacked_imbalance


def _no_data(label: str, timeframe) -> AnalyzerResult:
    return AnalyzerResult(
        label, Bias.NEUTRAL, 0.0,
        "No tick/footprint data for this run — real order flow isn't available "
        "(the OHLCV-approximation analyzers are still active).",
        raw={"has_data": False, "approximation": False}, timeframe=timeframe,
    )


@register_analyzer("footprint_absorption")
class FootprintAbsorptionAnalyzer(Analyzer):
    """Real absorption: a specific price level where one side's aggressive
    volume failed to move the market, because the other side had size resting
    there to absorb it. Located at an actual price, from actual trades — not
    inferred from the candle's overall shape.
    """

    label = "Footprint Absorption"

    def __init__(self, min_level_volume: float = 50.0, dominance_ratio: float = 0.65,
                body_fraction_max: float = 0.45):
        self.min_level_volume = min_level_volume
        self.dominance_ratio = dominance_ratio
        self.body_fraction_max = body_fraction_max

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        bar = ctx.current_footprint
        if bar is None:
            return _no_data(self.label, ctx.timeframe)

        events = detect_absorption(
            bar, min_level_volume=self.min_level_volume,
            dominance_ratio=self.dominance_ratio, body_fraction_max=self.body_fraction_max,
        )
        if not events:
            return AnalyzerResult(
                self.label, Bias.NEUTRAL, 15.0,
                f"Footprint checked ({bar.n_trades_levels} levels, "
                f"{bar.total_volume:.0f} total volume) — no absorption found.",
                raw={"has_data": True, "n_events": 0, "approximation": False},
                timeframe=ctx.timeframe,
            )

        best = events[0]
        bias = Bias.BULLISH if best.absorbed_by == "buy" else Bias.BEARISH

        # Confidence: dominance of the aggressor, size of the push relative to
        # the bar's average level volume, and a real bonus for happening right
        # at the bar's high/low (the clearest form — a direct test and reject).
        avg_level_vol = bar.total_volume / max(bar.n_trades_levels, 1)
        size_component = scale(best.aggressor_volume, avg_level_vol, avg_level_vol * 6)
        dominance_component = scale(best.passive_ratio, self.dominance_ratio, 1.0)
        extreme_bonus = 15.0 if best.at_extreme else 0.0
        conf = clamp(35 + 0.25 * size_component + 0.30 * dominance_component + extreme_bonus,
                    0, 97)

        return AnalyzerResult(
            self.label, bias, conf, best.reason,
            levels={"absorption_price": best.price},
            invalidation=best.price,
            raw={
                "has_data": True, "n_events": len(events),
                "price": best.price, "aggressor": best.aggressor,
                "absorbed_by": best.absorbed_by, "aggressor_volume": best.aggressor_volume,
                "passive_ratio": round(best.passive_ratio, 3), "at_extreme": best.at_extreme,
                "approximation": False,
            },
            timeframe=ctx.timeframe,
        )


@register_analyzer("footprint_imbalance")
class StackedImbalanceAnalyzer(Analyzer):
    """Real stacked imbalance: several consecutive price levels all dominated
    by the same aggressor side — the classic footprint-chart continuation /
    exhaustion signal. Confirmed when price actually closes beyond the stack;
    unconfirmed stacks still show direction but at reduced confidence.
    """

    label = "Stacked Imbalance"

    def __init__(self, min_ratio: float = 3.0, min_levels: int = 3,
                min_level_volume: float = 0.0):
        self.min_ratio = min_ratio
        self.min_levels = min_levels
        self.min_level_volume = min_level_volume

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        bar = ctx.current_footprint
        if bar is None:
            return _no_data(self.label, ctx.timeframe)

        stacks = detect_stacked_imbalance(
            bar, min_ratio=self.min_ratio, min_levels=self.min_levels,
            min_level_volume=self.min_level_volume,
        )
        if not stacks:
            return AnalyzerResult(
                self.label, Bias.NEUTRAL, 15.0,
                f"Footprint checked ({bar.n_trades_levels} levels) — no stacked "
                f"imbalance of {self.min_levels}+ levels found.",
                raw={"has_data": True, "n_stacks": 0, "approximation": False},
                timeframe=ctx.timeframe,
            )

        best = stacks[0]
        bias = Bias.BULLISH if best.side == "buy" else Bias.BEARISH

        level_component = scale(best.n_levels, self.min_levels, self.min_levels + 4)
        follow_through_bonus = 25.0 if best.broke_through else 0.0
        conf = clamp(35 + 0.35 * level_component + follow_through_bonus, 0, 95)

        return AnalyzerResult(
            self.label, bias, conf, best.reason,
            levels={"stack_low": best.price_low, "stack_high": best.price_high},
            invalidation=(best.price_low if best.side == "buy" else best.price_high),
            raw={
                "has_data": True, "n_stacks": len(stacks), "side": best.side,
                "n_levels": best.n_levels, "total_volume": best.total_volume,
                "broke_through": best.broke_through, "approximation": False,
            },
            timeframe=ctx.timeframe,
        )


@register_analyzer("footprint_delta")
class FootprintDeltaAnalyzer(Analyzer):
    """Real net aggressor delta over a short window of footprint bars — the
    exact buy-minus-sell volume from actual trades, not the close-location-
    value estimate :class:`orb_bot.analysis.order_flow.DeltaAnalyzer` uses
    when no tick data is available.
    """

    label = "Footprint Delta"

    def __init__(self, window: int = 5):
        self.window = window

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        bar = ctx.current_footprint
        if bar is None:
            return _no_data(self.label, ctx.timeframe)

        recent_bars = [bar]
        if ctx.footprint_bars:
            keys = sorted(k for k in ctx.footprint_bars if k <= ctx.now)
            recent_keys = keys[-self.window:]
            recent_bars = [ctx.footprint_bars[k] for k in recent_keys] or [bar]

        net_delta = sum(b.delta for b in recent_bars)
        total_vol = sum(b.buy_volume + b.sell_volume for b in recent_bars)
        ratio = (net_delta / total_vol) if total_vol else 0.0
        bias = Bias.from_sign(net_delta)
        conf = clamp(40 + 55 * abs(ratio), 0, 95)
        expl = (
            f"Real net delta over {len(recent_bars)} footprint bar(s) is "
            f"{net_delta:+.0f} ({ratio:+.0%} of actual traded volume) — "
            f"{'buyers' if net_delta > 0 else 'sellers'} in control."
        )
        return AnalyzerResult(
            self.label, bias, conf, expl,
            raw={"has_data": True, "net_delta": net_delta, "delta_ratio": round(ratio, 3),
                 "window": len(recent_bars), "approximation": False},
            timeframe=ctx.timeframe,
        )
