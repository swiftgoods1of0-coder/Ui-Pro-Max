"""Real order-flow / footprint engine.

Built from tick-level data (price, size, aggressor side) — not approximated
from OHLCV candle shape. See :mod:`orb_bot.data.ticks` for how to load tick
data (or :mod:`orb_bot.data.synth_ticks` to generate realistic synthetic ticks
for testing).

    ticks  ->  FootprintBar (per-price-level bid/ask volume)
           ->  detect_absorption / detect_stacked_imbalance
           ->  orb_bot.analysis.footprint_flow analyzers
           ->  ConfidenceEngine (dominant weight when real footprint is present)
"""

from .bar import FootprintBar, PriceLevel, build_footprint_bar, build_footprint_series
from .signals import (
    AbsorptionEvent,
    StackedImbalance,
    detect_absorption,
    detect_stacked_imbalance,
)

__all__ = [
    "FootprintBar",
    "PriceLevel",
    "build_footprint_bar",
    "build_footprint_series",
    "AbsorptionEvent",
    "StackedImbalance",
    "detect_absorption",
    "detect_stacked_imbalance",
]
