"""Swing detection and swing-high / swing-low analyzers.

A **swing** (fractal pivot) is a local extreme: a swing high is a bar whose high
is greater than the ``left`` bars before and ``right`` bars after it; a swing low
is the mirror. Because confirmation needs bars on *both* sides, the most recent
``right`` bars are never treated as swings — this is what keeps the read
look-ahead-safe.

Swings are the atoms of market structure: break of structure, change of
character, trend and liquidity sweeps are all defined in terms of them.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import List, Literal

import pandas as pd

from .base import (
    Analyzer,
    AnalysisContext,
    AnalyzerResult,
    Bias,
    clamp,
    register_analyzer,
    scale,
)


@dataclass(frozen=True)
class Swing:
    position: int                 # integer position in the frame
    timestamp: pd.Timestamp
    price: float
    kind: Literal["high", "low"]


def detect_swings(df: pd.DataFrame, left: int = 2, right: int = 2) -> List[Swing]:
    """Return confirmed swing highs and lows in chronological order.

    A pivot at ``i`` is confirmed only if ``right`` bars exist after it, so the
    final ``right`` bars of ``df`` are intentionally excluded.
    """
    swings: List[Swing] = []
    highs = df["high"].to_numpy(dtype=float)
    lows = df["low"].to_numpy(dtype=float)
    idx = df.index
    n = len(df)
    for i in range(left, n - right):
        window_h = highs[i - left : i + right + 1]
        window_l = lows[i - left : i + right + 1]
        if highs[i] == window_h.max() and (window_h == highs[i]).sum() == 1:
            swings.append(Swing(i, idx[i], float(highs[i]), "high"))
        if lows[i] == window_l.min() and (window_l == lows[i]).sum() == 1:
            swings.append(Swing(i, idx[i], float(lows[i]), "low"))
    swings.sort(key=lambda s: s.position)
    return swings


def swings_of(swings: List[Swing], kind: str) -> List[Swing]:
    return [s for s in swings if s.kind == kind]


def _sequence_confidence(values: List[float]) -> tuple[Bias, float, int]:
    """Bias + confidence from a short sequence of like-kind swing prices.

    Confidence grows with the number of consecutive same-direction steps and the
    size of the most recent step relative to the sequence's range.
    """
    if len(values) < 2:
        return Bias.NEUTRAL, 0.0, 0
    diffs = [b - a for a, b in zip(values[:-1], values[1:])]
    last_sign = 1 if diffs[-1] > 0 else (-1 if diffs[-1] < 0 else 0)
    if last_sign == 0:
        return Bias.NEUTRAL, 20.0, 0
    streak = 0
    for d in reversed(diffs):
        if (d > 0) == (last_sign > 0) and d != 0:
            streak += 1
        else:
            break
    rng = max(values) - min(values)
    mag = scale(abs(diffs[-1]), 0.0, rng if rng > 0 else abs(diffs[-1]) or 1.0) * 0.3
    conf = clamp(40.0 + 15.0 * streak + mag, 0.0, 95.0)
    return Bias.from_sign(last_sign), conf, streak


@register_analyzer("swing_high")
class SwingHighAnalyzer(Analyzer):
    """Reads the sequence of swing highs (higher highs = bullish)."""

    label = "Swing Highs"

    def __init__(self, left: int = 2, right: int = 2, lookback: int = 3):
        self.left, self.right, self.lookback = left, right, lookback

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        swings = swings_of(detect_swings(ctx.df, self.left, self.right), "high")
        lows = swings_of(detect_swings(ctx.df, self.left, self.right), "low")
        if len(swings) < 2:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough swing highs to read structure.",
                                  timeframe=ctx.timeframe)
        recent = swings[-self.lookback:]
        prices = [s.price for s in recent]
        bias, conf, streak = _sequence_confidence(prices)
        last = swings[-1]
        prev = swings[-2]
        # Bullish HH structure is invalidated if price loses the last swing low.
        invalidation = lows[-1].price if lows else prev.price
        trend = "higher highs" if bias is Bias.BULLISH else (
            "lower highs" if bias is Bias.BEARISH else "flat highs")
        expl = (f"Last {len(recent)} swing highs show {trend} "
                f"({prev.price:.2f} → {last.price:.2f}); streak {streak}.")
        return AnalyzerResult(
            self.label, bias, conf, expl,
            levels={"last_swing_high": last.price, "prev_swing_high": prev.price},
            invalidation=invalidation,
            raw={"swing_high_prices": prices, "streak": streak, "n_swings": len(swings)},
            timeframe=ctx.timeframe,
        )


@register_analyzer("swing_low")
class SwingLowAnalyzer(Analyzer):
    """Reads the sequence of swing lows (higher lows = bullish)."""

    label = "Swing Lows"

    def __init__(self, left: int = 2, right: int = 2, lookback: int = 3):
        self.left, self.right, self.lookback = left, right, lookback

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        all_swings = detect_swings(ctx.df, self.left, self.right)
        lows = swings_of(all_swings, "low")
        highs = swings_of(all_swings, "high")
        if len(lows) < 2:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Not enough swing lows to read structure.",
                                  timeframe=ctx.timeframe)
        recent = lows[-self.lookback:]
        prices = [s.price for s in recent]
        bias, conf, streak = _sequence_confidence(prices)
        last, prev = lows[-1], lows[-2]
        invalidation = highs[-1].price if highs else prev.price
        trend = "higher lows" if bias is Bias.BULLISH else (
            "lower lows" if bias is Bias.BEARISH else "flat lows")
        expl = (f"Last {len(recent)} swing lows show {trend} "
                f"({prev.price:.2f} → {last.price:.2f}); streak {streak}.")
        return AnalyzerResult(
            self.label, bias, conf, expl,
            levels={"last_swing_low": last.price, "prev_swing_low": prev.price},
            invalidation=invalidation,
            raw={"swing_low_prices": prices, "streak": streak, "n_swings": len(lows)},
            timeframe=ctx.timeframe,
        )
