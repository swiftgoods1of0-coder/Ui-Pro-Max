"""Tests for the synthetic tick data generator."""

import pandas as pd

from orb_bot.data.synth_ticks import generate_ticks, ticks_to_ohlcv
from orb_bot.footprint import build_footprint_series, detect_absorption, detect_stacked_imbalance


def test_generate_ticks_basic_shape():
    ticks = generate_ticks(days=2, seed=1, tick_size=0.25)
    assert list(ticks.columns) == ["price", "size", "side"]
    assert ticks.index.is_monotonic_increasing
    assert set(ticks["side"].unique()) <= {-1, 1}
    assert (ticks["size"] > 0).all()
    assert (ticks["price"] > 0).all()


def test_generate_ticks_prices_land_on_tick_grid():
    tick_size = 0.25
    ticks = generate_ticks(days=2, seed=2, tick_size=tick_size)
    remainder = (ticks["price"] / tick_size).round(6) % 1
    assert ((remainder < 1e-6) | (remainder > 1 - 1e-6)).all()


def test_generate_ticks_skips_weekends():
    ticks = generate_ticks(days=5, seed=3)
    days = pd.DatetimeIndex(ticks.index).normalize().unique()
    assert all(d.dayofweek < 5 for d in days)


def test_ticks_to_ohlcv_consistent_with_source_ticks():
    ticks = generate_ticks(days=2, seed=4, tick_size=0.25)
    ohlcv = ticks_to_ohlcv(ticks, "1min")
    assert list(ohlcv.columns) == ["open", "high", "low", "close", "volume"]
    # Every bar's volume must equal the sum of its ticks' sizes.
    bucket = ticks.index.floor("1min")
    expected_vol = ticks.groupby(bucket)["size"].sum()
    pd.testing.assert_series_equal(ohlcv["volume"], expected_vol, check_names=False)
    # High/low must bound every tick price in that bar.
    expected_high = ticks.groupby(bucket)["price"].max()
    assert (ohlcv["high"] >= expected_high - 1e-9).all()


def test_generator_produces_genuine_absorption_and_stacked_imbalance_scenarios():
    """The whole point of this generator: unlike pure noise, it must produce
    footprint bars where the real detectors actually fire — proving the
    engineered scenarios (absorption_reversal / stacked_breakout regimes)
    work end-to-end through the real footprint pipeline, not just in
    isolation on hand-built bars."""
    ticks = generate_ticks(days=10, seed=11, tick_size=0.25)
    footprint = build_footprint_series(ticks, "1min", 0.25)
    assert len(footprint) > 1000

    n_absorption = sum(
        1 for bar in footprint.values()
        if detect_absorption(bar, min_level_volume=50, dominance_ratio=0.65)
    )
    n_stacked = sum(
        1 for bar in footprint.values()
        if detect_stacked_imbalance(bar, min_ratio=3.0, min_levels=3)
    )
    assert n_absorption > 0
    assert n_stacked > 0


def test_generate_ticks_is_deterministic_given_a_seed():
    a = generate_ticks(days=2, seed=42)
    b = generate_ticks(days=2, seed=42)
    pd.testing.assert_frame_equal(a, b)
