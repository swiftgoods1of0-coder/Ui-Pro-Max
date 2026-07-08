"""Tests for the data engine: validation, timeframes, and storage."""

import numpy as np
import pandas as pd

from orb_bot.data import (
    build_market_data,
    clean_ohlcv,
    validate_ohlcv,
    DataStore,
)


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


def test_datastore_roundtrip(tmp_path):
    df = _frame()
    store = DataStore(cache_dir=tmp_path, fmt="parquet")
    store.save(df, "ES", "1min")
    loaded = store.load("ES", "1min")
    assert loaded is not None
    assert len(loaded) == len(df)
    pd.testing.assert_index_equal(loaded.index, df.index)
