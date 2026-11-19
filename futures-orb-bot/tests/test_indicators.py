"""Tests for the opening range and volume profile indicators."""

import numpy as np
import pandas as pd

from orb_bot.indicators import compute_opening_range, build_volume_profile


def _day(index_times, highs, lows, closes=None, vols=None):
    idx = pd.DatetimeIndex(
        [pd.Timestamp(f"2024-01-02 {t}", tz="America/New_York") for t in index_times]
    )
    n = len(idx)
    closes = closes if closes is not None else [(h + l) / 2 for h, l in zip(highs, lows)]
    vols = vols if vols is not None else [1000] * n
    return pd.DataFrame(
        {"open": closes, "high": highs, "low": lows, "close": closes, "volume": vols},
        index=idx,
    )


def test_opening_range_bounds():
    day = _day(
        ["08:00", "08:05", "08:10", "08:14", "08:20"],
        highs=[101, 102, 101.5, 100.8, 105],   # 08:20 is outside the window
        lows=[100, 99.5, 100.2, 100.1, 104],
    )
    orb = compute_opening_range(day, "08:00", "08:15")
    assert orb is not None
    assert orb.high == 102       # ignores the 08:20 bar
    assert orb.low == 99.5
    assert orb.bars == 4
    assert orb.mid == (102 + 99.5) / 2


def test_opening_range_none_when_empty_window():
    day = _day(["09:00", "09:05"], highs=[101, 102], lows=[100, 101])
    assert compute_opening_range(day, "08:00", "08:15") is None


def test_volume_profile_poc():
    # Concentrate volume around price 100 so the POC lands there.
    day = _day(
        ["08:00", "08:01", "08:02", "08:03"],
        highs=[100.2, 100.2, 105.0, 100.2],
        lows=[99.8, 99.8, 104.0, 99.8],
        vols=[5000, 5000, 100, 5000],
    )
    vp = build_volume_profile(day, bins=50)
    assert vp is not None
    assert 99.5 <= vp.poc <= 100.5
    assert vp.value_area_low <= vp.poc <= vp.value_area_high
