"""Synthetic tick (trade-by-trade) data generator.

Produces realistic tick data — not OHLCV bars — with aggressor side on every
trade, including **deliberately engineered absorption and stacked-imbalance
scenarios** so the real footprint engine (:mod:`orb_bot.footprint`) has
something genuine to find when you don't have a live tick feed yet.

Also derives matching OHLCV bars from the *same* ticks (so the two datasets
are consistent by construction — the OHLCV is just what you'd see on a chart,
the ticks are what actually produced it), ready to feed into
``run_backtest.py --data ... --ticks ...``.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import List, Tuple

import numpy as np
import pandas as pd


@dataclass
class _Tick:
    offset_seconds: float   # position within the bar, 0-59.999
    price: float
    size: int
    side: int               # +1 buy aggressor, -1 sell aggressor


def _normal_bar(rng, open_price: float, drift: float, vol: float, tick_size: float) -> List[_Tick]:
    """An ordinary bar: a noisy random walk, aggressor side correlated with
    the instantaneous price move (as real tape naturally is)."""
    n = int(rng.integers(25, 70))
    offsets = np.sort(rng.uniform(0, 59.9, n))
    price = open_price
    ticks = []
    for off in offsets:
        step = rng.normal(drift, vol)
        price = round((price + step) / tick_size) * tick_size
        side = 1 if step > 0 else (-1 if step < 0 else int(rng.choice([1, -1])))
        size = int(max(1, rng.exponential(3.5)))
        ticks.append(_Tick(off, price, size, side))
    return ticks


def _absorption_bar(rng, open_price: float, tick_size: float, direction: int) -> List[_Tick]:
    """A level gets hit hard by one side, but the other side absorbs it and
    price is rejected — the exact signature detect_absorption looks for.

    ``direction`` = +1 means buyers push up and get absorbed by sellers
    (bearish outcome); -1 is the mirror (bullish outcome).
    """
    ticks: List[_Tick] = []
    t = 0.0
    price = open_price

    # Phase 1 (0-12s): grind toward the test level.
    for _ in range(12):
        price = round((price + direction * tick_size) / tick_size) * tick_size
        t += 0.6
        ticks.append(_Tick(t, price, int(max(1, rng.exponential(3))), direction))
    extreme = price

    # Phase 2 (12-35s): heavy aggression at the extreme.
    for _ in range(60):
        t += 0.3
        ticks.append(_Tick(min(t, 35), extreme, int(rng.integers(6, 16)), direction))

    # Phase 3 (35-50s): the other side absorbs it — matched/larger opposing size,
    # same price, price does NOT progress further.
    for _ in range(75):
        t += 0.18
        ticks.append(_Tick(min(t, 50), extreme, int(rng.integers(6, 16)), -direction))

    # Phase 4 (50-59s): rejected — price drifts back, closing well off the extreme.
    price = extreme
    for _ in range(14):
        price = round((price - direction * tick_size) / tick_size) * tick_size
        t = min(t + 0.6, 59.8)
        ticks.append(_Tick(t, price, int(max(1, rng.exponential(3))), -direction))

    return sorted(ticks, key=lambda tk: tk.offset_seconds)


def _stacked_imbalance_bar(rng, open_price: float, tick_size: float, direction: int,
                           n_levels: int = 5) -> List[_Tick]:
    """Several consecutive price levels each dominated by one side, with a
    real close beyond the stack — the confirmed-continuation signature
    detect_stacked_imbalance looks for."""
    ticks: List[_Tick] = []
    price = open_price
    t = 0.0
    per_level = 58.0 / (n_levels + 1)
    for lvl in range(n_levels):
        # A little opposing volume first (gives the "level below/above" a
        # reference for the diagonal imbalance comparison).
        for _ in range(8):
            t += per_level / 45
            ticks.append(_Tick(min(t, 59.9), price, int(rng.integers(2, 6)), -direction))
        for _ in range(35):
            t += per_level / 45
            ticks.append(_Tick(min(t, 59.9), price, int(rng.integers(5, 13)), direction))
        price = round((price + direction * tick_size) / tick_size) * tick_size

    for _ in range(10):
        t = min(t + 0.15, 59.95)
        ticks.append(_Tick(t, price, int(max(1, rng.exponential(3))), direction))

    return sorted(ticks, key=lambda tk: tk.offset_seconds)


_REGIMES = ["trend_up", "trend_down", "absorption_reversal", "stacked_breakout", "chop"]


def generate_ticks(
    days: int = 10,
    seed: int = 11,
    start_price: float = 4800.0,
    tick_size: float = 0.25,
    session_minutes: int = 180,
    session_start_hour_utc: int = 13,   # 08:00 EST == 13:00 UTC
) -> pd.DataFrame:
    """Generate ``days`` sessions of realistic synthetic tick data.

    Each session is assigned a regime (cycling through trend/absorption/
    stacked-imbalance/chop) so the demo output has genuine, varied scenarios
    for the footprint engine to find — not just uniform noise.

    Returns a DataFrame indexed by UTC timestamp with columns
    ``price, size, side`` (matching :mod:`orb_bot.data.ticks`'s output shape).
    """
    rng = np.random.default_rng(seed)
    rows: List[Tuple[datetime, float, int, int]] = []
    price = start_price
    day = datetime(2024, 1, 1, tzinfo=timezone.utc)

    produced = 0
    while produced < days:
        if day.weekday() >= 5:
            day += timedelta(days=1)
            continue

        session_start = day.replace(hour=session_start_hour_utc, minute=0, second=0, microsecond=0)
        regime = _REGIMES[produced % len(_REGIMES)]
        drift, vol = _regime_params(regime, rng)

        # Pick one "feature" minute (after the opening range) to inject the
        # engineered scenario, so it lands inside the strategies' trading window.
        feature_minute = int(rng.integers(16, 40))
        direction = 1 if regime in ("trend_up",) else (-1 if regime == "trend_down" else
                                                        int(rng.choice([1, -1])))

        open_price = price
        for minute in range(session_minutes):
            bar_start = session_start + timedelta(minutes=minute)
            if regime == "absorption_reversal" and minute == feature_minute:
                bar_ticks = _absorption_bar(rng, open_price, tick_size, direction)
            elif regime == "stacked_breakout" and minute == feature_minute:
                bar_ticks = _stacked_imbalance_bar(rng, open_price, tick_size, direction)
            else:
                bar_ticks = _normal_bar(rng, open_price, drift, vol, tick_size)

            for tk in bar_ticks:
                ts = bar_start + timedelta(seconds=tk.offset_seconds)
                rows.append((ts, tk.price, tk.size, tk.side))
            open_price = bar_ticks[-1].price if bar_ticks else open_price

        price = open_price
        produced += 1
        day += timedelta(days=1)

    df = pd.DataFrame(rows, columns=["timestamp", "price", "size", "side"])
    df = df.set_index("timestamp").sort_index()
    return df


def _regime_params(regime: str, rng) -> Tuple[float, float]:
    if regime == "trend_up":
        return 0.015, 0.35
    if regime == "trend_down":
        return -0.015, 0.35
    if regime == "chop":
        return 0.0, 0.45
    return 0.0, 0.3   # absorption_reversal / stacked_breakout: mild drift between features


def ticks_to_ohlcv(ticks: pd.DataFrame, bar_freq: str = "1min") -> pd.DataFrame:
    """Derive OHLCV bars from tick data — guaranteed consistent with it."""
    bucket = ticks.index.floor(bar_freq)
    agg = ticks.groupby(bucket).agg(
        open=("price", "first"), high=("price", "max"),
        low=("price", "min"), close=("price", "last"), volume=("size", "sum"),
    )
    agg.index.name = "timestamp"
    return agg
