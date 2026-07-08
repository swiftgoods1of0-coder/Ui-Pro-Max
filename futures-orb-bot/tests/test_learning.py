"""Tests for the completed-trade learning system."""

import numpy as np
import pandas as pd

from orb_bot.config import Config
from orb_bot.data import build_market_data
from orb_bot.engine.trade import ExitReason, Trade
from orb_bot.learning import FeatureExtractor, PatternMiner, TradeFeatureStore
from orb_bot.learning.report import generate_markdown
from orb_bot.learning.stats import two_proportion_test, wilson_interval
from orb_bot.strategy import Side


# --------------------------------------------------------------------------- #
# Stats
# --------------------------------------------------------------------------- #


def test_two_proportion_test_detects_real_difference():
    t = two_proportion_test(45, 50, 10, 50)     # 90% vs 20%
    assert t.significant
    assert t.p_value < 0.001


def test_two_proportion_test_ignores_noise():
    t = two_proportion_test(26, 50, 24, 50)     # 52% vs 48%
    assert not t.significant


def test_wilson_interval_bounds():
    lo, hi = wilson_interval(9, 10)
    assert 0.0 <= lo <= hi <= 1.0


# --------------------------------------------------------------------------- #
# Feature extraction
# --------------------------------------------------------------------------- #


def _uptrend(n=240):
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz="America/New_York")
    close = 100 + np.linspace(0, 12, n)
    return pd.DataFrame({"open": close - 0.4, "high": close + 0.1,
                         "low": close - 0.6, "close": close,
                         "volume": np.linspace(900, 2200, n)}, index=idx)


def _trade(entry_ts, exit_ts, net):
    return Trade(
        date=entry_ts.normalize(), side=Side.LONG, mode="breakout",
        entry_time=entry_ts, entry_price=105.0, stop_price=104.0, target_price=107.0,
        contracts=1, strategy_id="orb", exit_time=exit_ts,
        exit_price=107.0 if net > 0 else 104.0,
        exit_reason=ExitReason.TARGET if net > 0 else ExitReason.STOP,
        gross_pnl=net, commission=0.0, net_pnl=net, realized_r=2.0 if net > 0 else -1.0,
        mae_points=0.0, mfe_points=0.0, equity_after=0.0)


def test_feature_extraction_captures_context():
    df = _uptrend()
    market = build_market_data(df, "ES", "1min", ["1min", "5min"])
    trade = _trade(df.index[150], df.index[170], +500)
    feats = FeatureExtractor(Config()).extract(trade, market)

    assert feats.result == "win"
    assert feats.entry_price == 105.0 and feats.take_profit == 107.0
    assert 0.0 <= feats.trade_quality <= 100.0
    assert feats.vwap_side in ("above", "below", "at")
    assert feats.vol_regime in ("expanding", "contracting", "normal", "unknown")
    # Flags exist and are booleans.
    assert set(feats.flags) >= {"with_trend", "with_vwap", "with_delta", "high_confidence"}
    assert all(isinstance(v, bool) for v in feats.flags.values())
    # Serialises with flag_ columns.
    row = feats.to_row()
    assert "flag_with_vwap" in row and "trade_quality" in row


def test_store_to_frame():
    df = _uptrend()
    market = build_market_data(df, "ES", "1min", ["1min"])
    trades = [_trade(df.index[120], df.index[140], +500),
              _trade(df.index[160], df.index[180], -250)]
    store = TradeFeatureStore(FeatureExtractor(Config()).extract_all(trades, market))
    frame = store.to_frame()
    assert len(frame) == 2
    assert "result" in frame.columns


# --------------------------------------------------------------------------- #
# Pattern mining
# --------------------------------------------------------------------------- #


def _synthetic_features(n_per=60):
    """Build a feature frame with a strong, real edge: trades on the correct
    side of VWAP win far more often than those that aren't."""
    rows = []
    for i in range(n_per):
        rows.append({"result": "win" if i < int(n_per * 0.75) else "loss",
                     "realized_r": 1.0, "net_pnl": 100.0, "setup": "orb/breakout",
                     "hour": 9, "flag_with_vwap": True})
    for i in range(n_per):
        rows.append({"result": "win" if i < int(n_per * 0.25) else "loss",
                     "realized_r": -0.5, "net_pnl": -50.0, "setup": "orb/breakout",
                     "hour": 9, "flag_with_vwap": False})
    return pd.DataFrame(rows)


def test_pattern_miner_finds_supported_edge():
    df = _synthetic_features(60)
    result = PatternMiner(min_samples=20, min_lift=0.08).run(df)
    assert result.n_decided == 120
    # The VWAP flag is a strong, significant edge -> a supported recommendation.
    assert result.recommendations
    assert any("VWAP" in rec for rec in result.recommendations)
    # It should appear as a winning reason.
    assert any("VWAP" in f.value for f in result.win_reasons)


def test_pattern_miner_gates_small_samples():
    df = _synthetic_features(6)   # only 6 per group -> under min_samples
    result = PatternMiner(min_samples=20).run(df)
    assert result.recommendations == []      # nothing supported
    # But the suggestive pattern is still surfaced as speculative.
    assert result.speculative


def test_report_has_all_sections():
    df = _synthetic_features(60)
    result = PatternMiner(min_samples=20).run(df)
    md = generate_markdown(result, symbol="ES", min_samples=20)
    for heading in ["Best setups", "Best hours", "Best market conditions",
                    "Common reasons trades **win**", "Common reasons trades **lose**",
                    "Recommendations", "Speculative observations"]:
        assert heading in md
