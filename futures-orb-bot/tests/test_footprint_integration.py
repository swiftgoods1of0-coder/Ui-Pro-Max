"""Tests for the real footprint analyzers and their wiring into
AnalysisContext / MarketData / the Confidence Engine."""

import numpy as np
import pandas as pd

from orb_bot.analysis import AnalysisContext, Bias, ConfidenceEngine, analyze
from orb_bot.data.timeframes import build_market_data
from orb_bot.footprint import FootprintBar, PriceLevel


def _ohlcv(n=30, tz="America/New_York"):
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz=tz)
    close = 4800 + np.cumsum(np.random.default_rng(4).normal(0, 0.2, n))
    return pd.DataFrame({"open": close, "high": close + 0.3, "low": close - 0.3,
                         "close": close, "volume": 1000}, index=idx)


def _ticks(n=30, tz="America/New_York", seed=9):
    """Plain noisy ticks, no engineered scenario — used for the generic
    has-data-but-nothing-special path."""
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz=tz)
    rng = np.random.default_rng(seed)
    close = 4800 + np.cumsum(rng.normal(0, 0.2, n))
    rows = []
    for i, ts in enumerate(idx):
        for _ in range(15):
            t = ts + pd.Timedelta(seconds=int(rng.integers(0, 59)))
            rows.append({"_t": t, "price": round(close[i] + rng.normal(0, 0.15), 2),
                        "size": int(rng.integers(1, 6)), "side": int(rng.choice([1, -1]))})
    return pd.DataFrame(rows).set_index("_t").sort_index()[["price", "size", "side"]]


# --------------------------------------------------------------------------- #
# AnalysisContext / MarketData wiring
# --------------------------------------------------------------------------- #


def test_market_data_has_footprint_flag():
    df = _ohlcv()
    market_no = build_market_data(df, "ES", "1min", ["1min"])
    assert market_no.has_footprint is False
    assert market_no.footprint is None

    market_yes = build_market_data(df, "ES", "1min", ["1min"], ticks=_ticks(), tick_size=0.25)
    assert market_yes.has_footprint is True
    assert len(market_yes.footprint) > 0


def test_context_current_footprint_direct_key_lookup():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"], ticks=_ticks(), tick_size=0.25)
    now = df.index[10]
    ctx = AnalysisContext.from_market(market, "1min", now=now)
    fp = ctx.current_footprint
    assert fp is not None
    assert fp.timestamp == now


def test_context_current_footprint_none_without_ticks():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"])
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[5])
    assert ctx.current_footprint is None


def test_footprint_not_attached_to_higher_timeframe_context():
    """Footprint bars are built one-per-primary-bar; they don't correspond to
    a resampled higher timeframe's boundaries, so from_market must not
    attach them when timeframe != primary_timeframe."""
    df = _ohlcv(n=60)
    market = build_market_data(df, "ES", "1min", ["1min", "5min"], ticks=_ticks(n=60), tick_size=0.25)
    ctx_5m = AnalysisContext.from_market(market, "5min", now=market.timeframe("5min").index[-1])
    assert ctx_5m.footprint_bars is None


# --------------------------------------------------------------------------- #
# Analyzer contract: has_data True/False paths
# --------------------------------------------------------------------------- #


def test_footprint_analyzers_report_no_data_cleanly():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"])  # no ticks
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[-1])
    for r in analyze(ctx, ["footprint_absorption", "footprint_imbalance", "footprint_delta"]):
        assert r.direction is Bias.NEUTRAL
        assert r.confidence == 0.0
        assert r.raw["has_data"] is False


def test_footprint_analyzers_report_has_data_with_real_ticks():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"], ticks=_ticks(), tick_size=0.25)
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[-1])
    for r in analyze(ctx, ["footprint_absorption", "footprint_imbalance", "footprint_delta"]):
        assert r.raw["has_data"] is True
        assert r.raw["approximation"] is False


def test_footprint_absorption_analyzer_finds_engineered_event():
    levels = [
        PriceLevel(price=4800.00, bid_volume=50, ask_volume=55),
        PriceLevel(price=4800.25, bid_volume=600, ask_volume=50),  # the high, sellers absorb
    ]
    bar = FootprintBar(timestamp=pd.Timestamp("2024-01-02 08:20", tz="America/New_York"),
                       tick_size=0.25, open=4800.0, high=4800.25, low=4799.9, close=4800.02,
                       levels=levels)
    ctx = AnalysisContext(df=pd.DataFrame(), now=bar.timestamp, price=4800.02,
                          footprint_bars={bar.timestamp: bar})
    from orb_bot.analysis.footprint_flow import FootprintAbsorptionAnalyzer
    r = FootprintAbsorptionAnalyzer(min_level_volume=50, dominance_ratio=0.6).analyze(ctx)
    assert r.direction is Bias.BULLISH   # sellers absorbed -> buyers take over
    assert r.confidence > 50
    assert r.levels["absorption_price"] == 4800.25


def test_footprint_delta_analyzer_sums_recent_bars():
    ts0 = pd.Timestamp("2024-01-02 08:00", tz="America/New_York")
    bars = {}
    for i in range(3):
        ts = ts0 + pd.Timedelta(minutes=i)
        bars[ts] = FootprintBar(timestamp=ts, tick_size=0.25, open=100, high=100.5,
                                low=99.5, close=100, levels=[
                                    PriceLevel(price=100.0, bid_volume=10, ask_volume=40)])
    now = ts0 + pd.Timedelta(minutes=2)
    ctx = AnalysisContext(df=pd.DataFrame(), now=now, price=100.0, footprint_bars=bars)
    from orb_bot.analysis.footprint_flow import FootprintDeltaAnalyzer
    r = FootprintDeltaAnalyzer(window=5).analyze(ctx)
    assert r.direction is Bias.BULLISH
    assert r.raw["net_delta"] == 90.0  # 3 bars * (40-10)
    assert r.raw["window"] == 3


# --------------------------------------------------------------------------- #
# Confidence Engine: weighting and suppression
# --------------------------------------------------------------------------- #


def test_engine_suppresses_approximation_when_real_footprint_has_data():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"], ticks=_ticks(), tick_size=0.25)
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[-1])
    engine = ConfidenceEngine()
    score = engine.score(ctx)
    suppressed = engine._suppressed_keys(score.results)
    assert {"absorption", "imbalance", "delta", "cvd"} <= suppressed

    by_key = {r.raw.get("_key"): r for r in score.results}
    for approx_key in ("absorption", "imbalance", "delta", "cvd"):
        assert engine._w(by_key[approx_key], suppressed) == 0.0
    for real_key in ("footprint_absorption", "footprint_imbalance", "footprint_delta"):
        assert engine._w(by_key[real_key], suppressed) > 0.0


def test_engine_no_suppression_without_tick_data():
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"])  # no ticks
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[-1])
    engine = ConfidenceEngine()
    score = engine.score(ctx)
    assert engine._suppressed_keys(score.results) == frozenset()


def test_no_data_results_excluded_from_weighted_total_not_just_neutral():
    """Regression test: a "no data" footprint result (confidence=0, nonzero
    weight) used to still count its weight toward wsum, diluting
    neutral_score's denominator and silently nudging every quality score
    whenever a currently-inapplicable analyzer merely existed in the
    registry. Must be fully excluded, matching the pre-footprint weight sum."""
    df = _ohlcv()
    market = build_market_data(df, "ES", "1min", ["1min"])  # no ticks
    ctx = AnalysisContext.from_market(market, "1min", now=df.index[-1])
    engine = ConfidenceEngine()
    score = engine.score(ctx)
    # Weight sum must equal the sum of non-footprint, non-zero-weight analyzers
    # only — footprint_absorption/imbalance/delta (has_data=False) contribute 0.
    expected = sum(w for k, w in engine.weights.items()
                   if w > 0 and not k.startswith("footprint_"))
    assert abs(score.raw["weight_sum"] - expected) < 1e-9
