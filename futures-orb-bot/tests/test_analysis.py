"""Tests for the order-flow / market-structure analyzers.

Each analyzer must honour the uniform contract (direction, 0–100 confidence,
explanation, raw values) and read the market in the expected direction on
hand-crafted data.
"""

import numpy as np
import pandas as pd

from orb_bot.analysis import (
    AnalysisContext,
    Bias,
    analyze,
    analyze_multi_timeframe,
    available_analyzers,
    build_analyzers,
)
from orb_bot.data import build_market_data

ORDER_FLOW_KEYS = [
    "volume_profile", "poc", "vah", "val", "hvn", "lvn",
    "vwap", "atr", "relative_volume",
    "delta", "cvd", "imbalance", "absorption",
]


def _uptrend(n=80, tz="America/New_York"):
    """Rising closes that print near the high, on rising volume (bullish flow)."""
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz=tz)
    close = 100 + np.linspace(0, 8, n)
    openp = close - 0.4
    high = close + 0.1          # closes near the high -> positive CLV/delta
    low = openp - 0.4
    vol = np.linspace(800, 2000, n)
    return pd.DataFrame({"open": openp, "high": high, "low": low,
                         "close": close, "volume": vol}, index=idx)


def _downtrend(n=80, tz="America/New_York"):
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz=tz)
    close = 100 - np.linspace(0, 8, n)
    openp = close + 0.4
    low = close - 0.1
    high = openp + 0.4
    vol = np.linspace(800, 2000, n)
    return pd.DataFrame({"open": openp, "high": high, "low": low,
                         "close": close, "volume": vol}, index=idx)


def _ctx(df):
    return AnalysisContext.from_history(df)


def test_all_order_flow_analyzers_registered():
    for k in ORDER_FLOW_KEYS:
        assert k in available_analyzers()


def test_contract_is_uniform():
    ctx = _ctx(_uptrend())
    results = analyze(ctx, ORDER_FLOW_KEYS)
    assert len(results) == len(ORDER_FLOW_KEYS)
    for r in results:
        assert isinstance(r.direction, Bias)
        assert 0.0 <= r.confidence <= 100.0
        assert r.explanation and isinstance(r.explanation, str)
        assert isinstance(r.raw, dict)


def test_directional_reads_uptrend():
    ctx = _ctx(_uptrend())
    by = {r.name: r for r in analyze(ctx, ORDER_FLOW_KEYS)}
    assert by["VWAP"].direction is Bias.BULLISH
    assert by["Point of Control"].direction is Bias.BULLISH
    assert by["Delta"].direction is Bias.BULLISH
    assert by["Cumulative Volume Delta"].direction is Bias.BULLISH
    assert by["Bid/Ask Imbalance"].direction is Bias.BULLISH


def test_directional_reads_downtrend():
    ctx = _ctx(_downtrend())
    by = {r.name: r for r in analyze(ctx, ["vwap", "delta", "imbalance"])}
    assert by["VWAP"].direction is Bias.BEARISH
    assert by["Delta"].direction is Bias.BEARISH
    assert by["Bid/Ask Imbalance"].direction is Bias.BEARISH


def test_delta_raw_marks_approximation():
    ctx = _ctx(_uptrend())
    d = analyze(ctx, ["delta"])[0]
    assert d.raw.get("approximation") is True
    assert "net_delta" in d.raw


def test_absorption_detects_buyers_absorbed_by_sellers():
    df = _uptrend(60)
    # Last bar: huge volume, tiny body, closes near the high (buyers aggressive)
    # but no progress -> sellers absorbing -> bearish.
    df.iloc[-1, df.columns.get_loc("open")] = 109.5
    df.iloc[-1, df.columns.get_loc("close")] = 109.6
    df.iloc[-1, df.columns.get_loc("high")] = 110.0
    df.iloc[-1, df.columns.get_loc("low")] = 100.0
    df.iloc[-1, df.columns.get_loc("volume")] = 20000
    a = analyze(_ctx(df), ["absorption"])[0]
    assert a.raw["absorbing"] is True
    assert a.direction is Bias.BEARISH


def test_atr_is_non_directional():
    a = analyze(_ctx(_uptrend()), ["atr"])[0]
    assert a.direction is Bias.NEUTRAL
    assert "regime" in a.raw


def test_levels_present_for_level_analyzers():
    ctx = _ctx(_uptrend())
    by = {r.name: r for r in analyze(ctx, ["poc", "vah", "val", "vwap"])}
    assert "poc" in by["Point of Control"].levels
    assert "vwap" in by["VWAP"].levels


def test_multi_timeframe_runner():
    md = build_market_data(_uptrend(240), symbol="ES",
                           primary_timeframe="1min", timeframes=["1min", "5min", "15min"])
    out = analyze_multi_timeframe(md, timeframes=["1min", "5min"], keys=["vwap", "poc"])
    assert set(out) == {"1min", "5min"}
    for tf, results in out.items():
        assert all(r.timeframe == tf for r in results)
        assert len(results) == 2


def test_analyzer_isolation_on_error():
    # An analyzer raising should not break the batch (runner catches it).
    empty = pd.DataFrame({"open": [], "high": [], "low": [], "close": [], "volume": []},
                         index=pd.DatetimeIndex([], tz="America/New_York"))
    ctx = AnalysisContext(df=empty, now=pd.Timestamp("2024-01-02", tz="America/New_York"),
                          price=float("nan"))
    results = analyze(ctx, ORDER_FLOW_KEYS)
    assert len(results) == len(ORDER_FLOW_KEYS)  # all returned, none raised
