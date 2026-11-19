"""Tests for the footprint bar engine: real per-price-level bid/ask volume
and the absorption / stacked-imbalance signal detectors built on it."""

import pandas as pd
import pytest

from orb_bot.footprint import (
    FootprintBar,
    PriceLevel,
    build_footprint_bar,
    build_footprint_series,
    detect_absorption,
    detect_stacked_imbalance,
)


# --------------------------------------------------------------------------- #
# PriceLevel / FootprintBar
# --------------------------------------------------------------------------- #


def test_price_level_math():
    lvl = PriceLevel(price=100.0, bid_volume=30, ask_volume=70)
    assert lvl.total_volume == 100
    assert lvl.delta == 40
    assert lvl.imbalance_ratio == 0.7


def test_price_level_imbalance_ratio_with_no_classified_volume():
    lvl = PriceLevel(price=100.0, bid_volume=0, ask_volume=0, unknown_volume=50)
    assert lvl.imbalance_ratio == 0.5  # balanced/unknown, not an error


def test_footprint_bar_aggregates():
    levels = [
        PriceLevel(price=99.75, bid_volume=20, ask_volume=10),
        PriceLevel(price=100.00, bid_volume=10, ask_volume=50),  # POC
        PriceLevel(price=100.25, bid_volume=5, ask_volume=15),
    ]
    bar = FootprintBar(timestamp=pd.Timestamp("2024-01-02 08:00", tz="America/New_York"),
                       tick_size=0.25, open=99.75, high=100.25, low=99.75, close=100.25,
                       levels=levels)
    assert bar.total_volume == 110
    assert bar.buy_volume == 75
    assert bar.sell_volume == 35
    assert bar.delta == 40
    assert bar.poc_price == 100.00
    assert bar.level_at(100.0).ask_volume == 50
    assert bar.level_at_high().price == 100.25
    assert bar.level_at_low().price == 99.75
    assert bar.level_at(999.0) is None


def test_footprint_bar_to_frame():
    levels = [PriceLevel(price=100.0, bid_volume=10, ask_volume=20)]
    bar = FootprintBar(timestamp=pd.Timestamp("2024-01-02 08:00", tz="America/New_York"),
                       tick_size=0.25, open=100, high=100, low=100, close=100, levels=levels)
    df = bar.to_frame()
    assert list(df.columns) == ["price", "bid_volume", "ask_volume", "delta", "total_volume"]
    assert df.iloc[0]["delta"] == 10


# --------------------------------------------------------------------------- #
# Builders
# --------------------------------------------------------------------------- #


def _make_ticks(rows, tz="America/New_York"):
    """rows: list of (timestamp_str, price, size, side)."""
    idx = pd.DatetimeIndex([pd.Timestamp(r[0], tz=tz) for r in rows])
    return pd.DataFrame(
        {"price": [r[1] for r in rows], "size": [r[2] for r in rows], "side": [r[3] for r in rows]},
        index=idx,
    )


def test_build_footprint_bar_basic():
    ticks = _make_ticks([
        ("2024-01-02 08:00:01", 100.00, 5, 1),
        ("2024-01-02 08:00:02", 100.25, 3, 1),
        ("2024-01-02 08:00:03", 100.00, 2, -1),
        ("2024-01-02 08:00:59", 99.75, 4, -1),
    ])
    bar = build_footprint_bar(
        ticks, pd.Timestamp("2024-01-02 08:00", tz="America/New_York"),
        pd.Timestamp("2024-01-02 08:01", tz="America/New_York"), tick_size=0.25,
    )
    assert bar is not None
    assert bar.open == 100.00 and bar.close == 99.75
    assert bar.high == 100.25 and bar.low == 99.75
    assert bar.buy_volume == 8 and bar.sell_volume == 6


def test_build_footprint_bar_empty_window_returns_none():
    ticks = _make_ticks([("2024-01-02 09:00:00", 100.0, 1, 1)])
    bar = build_footprint_bar(
        ticks, pd.Timestamp("2024-01-02 08:00", tz="America/New_York"),
        pd.Timestamp("2024-01-02 08:01", tz="America/New_York"), tick_size=0.25,
    )
    assert bar is None


def test_build_footprint_series_matches_per_bar_builder():
    ticks = _make_ticks([
        ("2024-01-02 08:00:10", 100.00, 5, 1),
        ("2024-01-02 08:00:40", 100.25, 3, -1),
        ("2024-01-02 08:01:10", 100.50, 2, 1),
        ("2024-01-02 08:01:40", 100.25, 1, -1),
    ])
    series = build_footprint_series(ticks, "1min", tick_size=0.25)
    assert len(series) == 2
    bar0 = series[pd.Timestamp("2024-01-02 08:00", tz="America/New_York")]
    assert bar0.buy_volume == 5 and bar0.sell_volume == 3
    bar1 = series[pd.Timestamp("2024-01-02 08:01", tz="America/New_York")]
    assert bar1.buy_volume == 2 and bar1.sell_volume == 1


def test_build_footprint_series_empty_ticks():
    empty = pd.DataFrame({"price": [], "size": [], "side": []},
                         index=pd.DatetimeIndex([], tz="America/New_York"))
    assert build_footprint_series(empty, "1min", 0.25) == {}


# --------------------------------------------------------------------------- #
# Absorption detection
# --------------------------------------------------------------------------- #


def _bar(levels, open_, high, low, close, tick_size=0.25):
    return FootprintBar(timestamp=pd.Timestamp("2024-01-02 08:20", tz="America/New_York"),
                        tick_size=tick_size, open=open_, high=high, low=low, close=close,
                        levels=levels)


def test_absorption_detected_at_extreme():
    levels = [
        PriceLevel(price=4800.00, bid_volume=50, ask_volume=55),
        PriceLevel(price=4800.25, bid_volume=40, ask_volume=60),
        PriceLevel(price=4800.50, bid_volume=600, ask_volume=50),  # the high: sellers dominate
    ]
    bar = _bar(levels, 4800.0, 4800.5, 4799.9, 4800.05)
    events = detect_absorption(bar, min_level_volume=50, dominance_ratio=0.6)
    assert events
    best = events[0]
    assert best.price == 4800.50
    assert best.at_extreme is True
    assert best.aggressor == "sell"
    assert best.absorbed_by == "buy"


def test_absorption_none_when_bar_makes_real_progress():
    """A decisive bar (large body relative to range) means nothing was
    absorbed — the aggressor actually won."""
    levels = [
        PriceLevel(price=4800.00, bid_volume=10, ask_volume=200),
        PriceLevel(price=4800.50, bid_volume=5, ask_volume=180),
    ]
    bar = _bar(levels, 4800.0, 4800.5, 4799.95, 4800.48)  # body ~= full range
    events = detect_absorption(bar, min_level_volume=50, dominance_ratio=0.6)
    assert events == []


def test_absorption_requires_minimum_level_volume():
    levels = [PriceLevel(price=100.0, bid_volume=2, ask_volume=8)]  # tiny, 80% one-sided
    bar = _bar(levels, 100.0, 100.0, 99.9, 99.95, tick_size=0.1)
    events = detect_absorption(bar, min_level_volume=50, dominance_ratio=0.6)
    assert events == []  # too little volume to mean anything


def test_absorption_empty_bar():
    bar = _bar([], 100.0, 100.0, 100.0, 100.0)
    assert detect_absorption(bar, min_level_volume=1, dominance_ratio=0.5) == []


# --------------------------------------------------------------------------- #
# Stacked imbalance detection
# --------------------------------------------------------------------------- #


def test_stacked_imbalance_with_follow_through():
    levels = [
        PriceLevel(price=4800.00, bid_volume=50, ask_volume=55),
        PriceLevel(price=4800.25, bid_volume=40, ask_volume=200),
        PriceLevel(price=4800.50, bid_volume=30, ask_volume=180),
        PriceLevel(price=4800.75, bid_volume=20, ask_volume=160),
    ]
    bar = _bar(levels, 4800.0, 4800.75, 4799.9, 4800.75)  # closed AT the stack's top
    stacks = detect_stacked_imbalance(bar, min_ratio=2.0, min_levels=3)
    assert len(stacks) == 1
    s = stacks[0]
    assert s.side == "buy"
    assert s.n_levels == 3
    assert s.broke_through is True


def test_stacked_imbalance_without_follow_through():
    levels = [
        PriceLevel(price=4800.00, bid_volume=50, ask_volume=55),
        PriceLevel(price=4800.25, bid_volume=40, ask_volume=200),
        PriceLevel(price=4800.50, bid_volume=30, ask_volume=180),
        PriceLevel(price=4800.75, bid_volume=20, ask_volume=160),
    ]
    bar = _bar(levels, 4800.0, 4800.75, 4799.9, 4800.10)  # closed back down, no follow-through
    stacks = detect_stacked_imbalance(bar, min_ratio=2.0, min_levels=3)
    assert stacks[0].broke_through is False


def test_stacked_imbalance_requires_minimum_run_length():
    levels = [
        PriceLevel(price=4800.00, bid_volume=50, ask_volume=55),
        PriceLevel(price=4800.25, bid_volume=10, ask_volume=100),  # only 1 imbalanced level
        PriceLevel(price=4800.50, bid_volume=50, ask_volume=55),
    ]
    bar = _bar(levels, 4800.0, 4800.5, 4799.9, 4800.3)
    assert detect_stacked_imbalance(bar, min_ratio=2.0, min_levels=3) == []


def test_stacked_imbalance_sell_side():
    levels = [
        PriceLevel(price=4800.75, bid_volume=55, ask_volume=50),
        PriceLevel(price=4800.50, bid_volume=200, ask_volume=40),
        PriceLevel(price=4800.25, bid_volume=180, ask_volume=30),
        PriceLevel(price=4800.00, bid_volume=160, ask_volume=20),
    ]
    bar = _bar(levels, 4800.75, 4800.75, 4800.00, 4800.00)
    stacks = detect_stacked_imbalance(bar, min_ratio=2.0, min_levels=3)
    assert stacks and stacks[0].side == "sell"
    assert stacks[0].broke_through is True
