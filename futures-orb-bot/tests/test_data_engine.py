"""Tests for the data engine: validation, timeframes, and storage."""

import numpy as np
import pandas as pd

from orb_bot.data import (
    build_market_data,
    clean_ohlcv,
    validate_ohlcv,
    DataStore,
    load_market_data,
)
from orb_bot.config import Config


def _frame(n=60, start="2024-01-02 08:00", tz="America/New_York"):
    idx = pd.date_range(start, periods=n, freq="1min", tz=tz)
    base = 100 + np.cumsum(np.random.default_rng(0).normal(0, 0.2, n))
    return pd.DataFrame(
        {
            "open": base,
            "high": base + 0.5,
            "low": base - 0.5,
            "close": base,
            "volume": 1000,
        },
        index=idx,
    )


def test_validation_flags_and_clean():
    df = _frame()
    # Corrupt a couple of rows: high < low, and a NaN close.
    df.iloc[5, df.columns.get_loc("high")] = df.iloc[5]["low"] - 1
    df.iloc[7, df.columns.get_loc("close")] = np.nan

    report = validate_ohlcv(df, expected_freq="1min")
    assert not report.ok
    assert report.n_errors >= 2

    cleaned = clean_ohlcv(df)
    clean_report = validate_ohlcv(cleaned, expected_freq="1min")
    assert clean_report.ok


def test_build_market_data_timeframes():
    df = _frame(n=60)
    md = build_market_data(df, symbol="ES", primary_timeframe="1min",
                           timeframes=["1min", "5min", "15min"])
    assert set(md.frames) == {"1min", "5min", "15min"}
    assert len(md.timeframe("5min")) < len(md.primary)
    # Higher-timeframe as-of lookup never returns a future bar.
    ts = df.index[30]
    bar = md.htf_bar_asof("15min", ts)
    assert bar is not None


def test_htf_bar_asof_excludes_bar_that_has_not_finished_forming():
    """Regression test: a higher-timeframe bar is labelled by its *start* time
    (label="left"), so "index <= ts" alone includes a bar that has only just
    begun — a real look-ahead leak for anything coarser than the primary
    timeframe. A 15-min bar starting exactly at `ts` must not be returned;
    the previous (fully elapsed) 15-min bar must be."""
    df = _frame(n=60, start="2024-01-02 08:00")  # 08:00..08:59, 1-min bars
    md = build_market_data(df, symbol="ES", primary_timeframe="1min",
                           timeframes=["1min", "15min"])

    ts = pd.Timestamp("2024-01-02 08:30", tz="America/New_York")
    bar = md.htf_bar_asof("15min", ts)
    assert bar is not None
    # The 08:30 bar (covering 08:30-08:44) has only just started at ts=08:30 —
    # it must NOT be returned. The 08:15 bar (covering 08:15-08:29) is the
    # most recent one that has fully closed by ts.
    assert bar.name == pd.Timestamp("2024-01-02 08:15", tz="America/New_York")
    assert bar.name + pd.Timedelta(minutes=15) <= ts

    # One minute later, the 08:30 bar still hasn't closed (closes at 08:45).
    bar_mid = md.htf_bar_asof("15min", ts + pd.Timedelta(minutes=1))
    assert bar_mid.name == pd.Timestamp("2024-01-02 08:15", tz="America/New_York")

    # At 08:45 exactly, the 08:30 bar has just closed and becomes available.
    bar_closed = md.htf_bar_asof("15min", pd.Timestamp("2024-01-02 08:45", tz="America/New_York"))
    assert bar_closed.name == pd.Timestamp("2024-01-02 08:30", tz="America/New_York")


def test_htf_bar_asof_primary_timeframe_uses_bar_at_ts():
    """For the *primary* timeframe, the bar at ts is the engine's current bar
    and is treated as known (matches AnalysisContext / backtester convention
    throughout the rest of the platform) — unlike a coarser timeframe."""
    df = _frame(n=60, start="2024-01-02 08:00")
    md = build_market_data(df, symbol="ES", primary_timeframe="1min", timeframes=["1min"])
    ts = df.index[10]
    bar = md.htf_bar_asof("1min", ts)
    assert bar.name == ts


def test_datastore_roundtrip(tmp_path):
    df = _frame()
    store = DataStore(cache_dir=tmp_path, fmt="parquet")
    store.save(df, "ES", "1min")
    loaded = store.load("ES", "1min")
    assert loaded is not None
    assert len(loaded) == len(df)
    pd.testing.assert_index_equal(loaded.index, df.index)


def test_load_market_data_reports_real_validation_state_on_cache_hit(tmp_path):
    """Regression test: load_market_data used to return a fabricated "no
    issues" ValidationReport on a cache hit (the closure that computed the
    real report only ran on a cache miss). Validation must reflect the data's
    actual state every time, cached or not."""
    data_dir = tmp_path / "raw"
    data_dir.mkdir()
    cache_dir = tmp_path / "cache"

    idx = pd.date_range("2024-01-02 08:00", periods=10, freq="1min", tz="UTC")
    rows = pd.DataFrame(
        {"open": 100.0, "high": 101.0, "low": 99.0, "close": 100.0, "volume": 500},
        index=idx,
    )
    rows.iloc[3, rows.columns.get_loc("high")] = 90.0  # corrupt: high < low
    out = rows.reset_index().rename(columns={"index": "timestamp"})
    out.to_csv(data_dir / "d.csv", index=False)

    cfg = Config.from_dict({
        "storage": {"enabled": True, "cache_dir": str(cache_dir), "format": "parquet"},
        "data": {"input_timezone": "UTC"},
    })

    _, report1 = load_market_data(cfg, data_dir)
    assert not report1.ok and report1.n_errors > 0  # first load: real parse

    _, report2 = load_market_data(cfg, data_dir)  # second load: cache hit
    assert not report2.ok and report2.n_errors > 0, (
        "cache hit must report the data's real validation state, not a "
        "fabricated clean report"
    )
    assert report1.n_errors == report2.n_errors
