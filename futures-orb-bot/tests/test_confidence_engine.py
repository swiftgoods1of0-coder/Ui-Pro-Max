"""Tests for the Trade Confidence Engine."""

from types import SimpleNamespace

import numpy as np
import pandas as pd

from orb_bot.analysis import AnalysisContext, ConfidenceEngine, ConfidenceFilter
from orb_bot.analysis.engine import TradeDirection
from orb_bot.config import Config
from orb_bot.strategy import Side, Signal


def _trend(n=90, up=True):
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz="America/New_York")
    d = np.linspace(0, 9, n) * (1 if up else -1)
    close = 100 + d
    if up:
        openp, high, low = close - 0.5, close + 0.05, close - 0.8
    else:
        openp, high, low = close + 0.5, close + 0.8, close - 0.05
    vol = np.linspace(800, 2400, n)
    return pd.DataFrame({"open": openp, "high": high, "low": low,
                         "close": close, "volume": vol}, index=idx)


def _chop(n=90):
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz="America/New_York")
    close = 100 + np.sin(np.linspace(0, 12, n)) * 2
    return pd.DataFrame({"open": close, "high": close + 0.6, "low": close - 0.6,
                         "close": close, "volume": np.full(n, 1000.0)}, index=idx)


def _score(df, **kw):
    eng = ConfidenceEngine(min_trade_confidence=kw.pop("min_conf", 60), **kw)
    return eng.score(AnalysisContext.from_history(df))


def test_uptrend_scores_long():
    s = _score(_trend(up=True))
    assert s.direction is TradeDirection.LONG
    assert s.long_score > s.short_score
    assert 0 <= s.quality <= 100 and s.quality > 50
    assert s.reasons  # has supporting reasons


def test_downtrend_scores_short():
    s = _score(_trend(up=False))
    assert s.direction is TradeDirection.SHORT
    assert s.short_score > s.long_score


def test_all_side_scores_present_and_bounded():
    s = _score(_trend())
    for v in (s.quality, s.long_score, s.short_score, s.no_trade_score):
        assert 0.0 <= v <= 100.0


def test_chop_is_no_trade_with_conflicts():
    s = _score(_chop())
    assert s.direction is TradeDirection.NO_TRADE
    assert s.no_trade_score > 50
    assert s.conflicts  # opposing signals detected


def test_min_confidence_gate_blocks_marginal_setups():
    s = _score(_trend(up=True), min_conf=99)
    assert s.direction is TradeDirection.NO_TRADE
    assert any("threshold" in w.lower() or "edge" in w.lower() for w in s.weaknesses)


def test_low_volume_raises_warning():
    df = _trend(up=True)
    df.iloc[-5:, df.columns.get_loc("volume")] = 50  # collapse recent volume
    s = _score(df)
    assert any("volume" in w.lower() for w in s.warnings)


def test_report_and_dict_shapes():
    s = _score(_trend())
    d = s.to_dict()
    for key in ("direction", "quality", "long_score", "short_score",
                "no_trade_score", "reasons", "warnings", "conflicts", "analyzers"):
        assert key in d
    assert "Trade Quality" in s.report()


def test_from_config_uses_config_threshold():
    cfg = Config()
    cfg.confidence.min_trade_confidence = 70
    eng = ConfidenceEngine.from_config(cfg)
    assert eng.min_trade_confidence == 70


def test_confidence_filter_gates_and_annotates():
    cfg = Config()
    market = SimpleNamespace(primary=_trend(up=True), frames={"1min": _trend(up=True)})
    ctx = SimpleNamespace(market=market, config=cfg, day_df=market.primary,
                          decision_log=None)
    sig_long = Signal(timestamp=market.primary.index[-1], side=Side.LONG,
                      entry=109.0, stop=108.0, target=111.0, mode="test",
                      strategy_id="s")
    filt = ConfidenceFilter(ConfidenceEngine(min_trade_confidence=50))
    accepted = filt.accept(sig_long, ctx)
    # The engine sees a clean uptrend, so a long should be accepted...
    assert accepted is True
    # ...and the full explainable score is attached to the signal.
    assert "confidence" in sig_long.meta
    assert "trade_quality" in sig_long.meta

    # A short in the same uptrend should be vetoed.
    sig_short = Signal(timestamp=market.primary.index[-1], side=Side.SHORT,
                       entry=109.0, stop=110.0, target=107.0, mode="test",
                       strategy_id="s")
    assert filt.accept(sig_short, ctx) is False
