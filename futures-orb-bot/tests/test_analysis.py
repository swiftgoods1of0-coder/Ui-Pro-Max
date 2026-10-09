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


def test_swing_detection_is_bounded_to_recent_window_not_full_history():
    """Regression test: swing_high/swing_low used to scan the *entire*
    backtest-to-date history on every call (an unvectorized O(n) Python loop),
    getting slower every session as the backtest progressed. They must only
    look at a bounded recent window, so the read — and the cost — doesn't
    depend on how much history precedes it."""
    from orb_bot.analysis.swings import SwingHighAnalyzer, SwingLowAnalyzer

    recent = _uptrend(300)
    # Prepend a long, differently-shaped history before the recent window.
    old_idx = pd.date_range(recent.index[0] - pd.Timedelta(days=5), periods=2000,
                            freq="1min", tz="America/New_York")
    old = pd.DataFrame({"open": 50.0, "high": 50.5, "low": 49.5, "close": 50.0,
                        "volume": 500.0}, index=old_idx)
    long_history = pd.concat([old, recent])

    analyzer_high = SwingHighAnalyzer(window_bars=300)
    analyzer_low = SwingLowAnalyzer(window_bars=300)

    ctx_long = AnalysisContext.from_history(long_history)
    ctx_tail = AnalysisContext.from_history(recent)

    result_long = analyzer_high.analyze(ctx_long)
    result_tail = analyzer_high.analyze(ctx_tail)
    assert result_long.raw.get("n_swings") == result_tail.raw.get("n_swings")
    assert result_long.confidence == result_tail.confidence
    assert result_long.direction == result_tail.direction

    result_long_lo = analyzer_low.analyze(ctx_long)
    result_tail_lo = analyzer_low.analyze(ctx_tail)
    assert result_long_lo.raw.get("n_swings") == result_tail_lo.raw.get("n_swings")


def test_swing_high_analyzer_does_not_recompute_detection_twice():
    """Regression test: SwingHighAnalyzer used to call detect_swings() twice
    per invocation (once filtering for highs, once for lows) instead of once,
    doubling its cost for no reason."""
    from orb_bot.analysis import swings as swings_mod

    calls = {"n": 0}
    original = swings_mod.detect_swings

    def counting_detect_swings(*args, **kwargs):
        calls["n"] += 1
        return original(*args, **kwargs)

    swings_mod.detect_swings = counting_detect_swings
    try:
        ctx = AnalysisContext.from_history(_uptrend(80))
        swings_mod.SwingHighAnalyzer().analyze(ctx)
    finally:
        swings_mod.detect_swings = original
    assert calls["n"] == 1
