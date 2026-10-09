"""Tests for the plug-and-play strategy engine (registry + multi-strategy run)."""

import numpy as np
import pandas as pd

from orb_bot.config import Config
from orb_bot.engine import Backtester
from orb_bot.indicators.opening_range import compute_opening_range
from orb_bot.strategy import ORBStrategy, Side, VWAPReversionStrategy, available_strategies, build_strategies
from orb_bot.strategy.base import DayContext


def _breakout_day() -> pd.DataFrame:
    idx = pd.date_range("2024-01-02 08:00", "2024-01-02 08:59", freq="1min",
                        tz="America/New_York")
    rows = []
    for ts in idx:
        t = ts.strftime("%H:%M")
        if ts.time() < pd.Timestamp("08:15").time():
            o, h, l, c = 100.5, 101.0, 100.0, 100.5
        elif t == "08:20":
            o, h, l, c = 100.8, 102.2, 100.6, 102.0
        elif t == "08:30":
            o, h, l, c = 102.0, 107.5, 101.8, 107.0
        else:
            o, h, l, c = 100.7, 101.0, 100.4, 100.7
        rows.append({"open": o, "high": h, "low": l, "close": c, "volume": 1000})
    return pd.DataFrame(rows, index=idx)


def test_builtin_strategies_registered():
    assert "orb" in available_strategies()
    assert "vwap_reversion" in available_strategies()


def test_enable_disable_via_config():
    cfg = Config.from_dict({
        "strategies": [
            {"name": "orb", "id": "orb_a", "enabled": True},
            {"name": "vwap_reversion", "id": "vwap_a", "enabled": False},
        ]
    })
    built = build_strategies(cfg)
    ids = [s.id for s in built]
    assert ids == ["orb_a"]  # disabled one is excluded


def test_multi_strategy_independent_accounts():
    cfg = Config.from_dict({
        "volume_profile": {"enabled": False},
        "strategies": [
            {"name": "orb", "id": "orb_a", "enabled": True,
             "params": {"modes": ["breakout"]}},
            {"name": "orb", "id": "orb_b", "enabled": True,
             "params": {"modes": ["breakout"], "reward_multiple": 3.0}},
        ],
    })
    result = Backtester(cfg).run(_breakout_day())
    assert set(result.per_strategy) == {"orb_a", "orb_b"}
    # Each strategy runs on its own account seeded at starting equity.
    for res in result.per_strategy.values():
        assert res.starting_equity == cfg.risk.starting_equity_usd
    # Different reward multiples -> different realised outcomes.
    assert result.per_strategy["orb_a"].trades
    assert result.per_strategy["orb_b"].trades


def test_legacy_single_strategy_fallback():
    # No `strategies` block -> synthesize one ORB from legacy config.
    cfg = Config()
    built = build_strategies(cfg)
    assert len(built) == 1
    assert built[0].name == "orb"


def _sustained_breakout_day() -> pd.DataFrame:
    """OR high=101/low=100, then price stays extended above the breakout
    level for many consecutive bars — the scenario that used to generate a
    duplicate breakout signal on every single bar."""
    idx = pd.date_range("2024-01-02 08:00", "2024-01-02 08:59", freq="1min",
                        tz="America/New_York")
    rows = []
    for ts in idx:
        if ts.time() < pd.Timestamp("08:15").time():
            o, h, l, c = 100.5, 101.0, 100.0, 100.5
        elif ts.time() < pd.Timestamp("08:45").time():
            # 30 consecutive bars all closing well above orh + buffer.
            o, h, l, c = 103.0, 103.5, 102.8, 103.2
        else:
            o, h, l, c = 103.2, 103.6, 103.0, 103.3
        rows.append({"open": o, "high": h, "low": l, "close": c, "volume": 1000})
    return pd.DataFrame(rows, index=idx)


def test_orb_breakout_fires_once_per_side_not_once_per_bar():
    cfg = Config()
    cfg.volume_profile.enabled = False
    cfg.strategy.modes = ["breakout"]
    df = _sustained_breakout_day()
    strat = ORBStrategy(cfg)
    ctx = DayContext(date=df.index[0].normalize(), day_df=df, session_window=df,
                     volume_profile=None, config=cfg)
    signals = strat.generate(ctx)
    breakout_longs = [s for s in signals if s.mode == "breakout" and s.side is Side.LONG]
    assert len(breakout_longs) == 1, (
        f"expected exactly one long breakout signal for a sustained extension, "
        f"got {len(breakout_longs)}"
    )


def test_confidence_filter_attached_by_default():
    cfg = Config.from_dict({
        "strategies": [{"name": "orb", "id": "orb_a", "enabled": True}],
    })
    assert cfg.confidence.enabled is True  # dataclass default
    built = build_strategies(cfg)
    names = [f.name for f in built[0].filters]
    assert "confidence" in names


def test_confidence_filter_per_strategy_opt_out():
    cfg = Config.from_dict({
        "strategies": [
            {"name": "orb", "id": "trend_strat", "enabled": True},
            {"name": "vwap_reversion", "id": "counter_trend_strat", "enabled": True,
             "use_confidence_filter": False},
        ],
    })
    built = {s.id: s for s in build_strategies(cfg)}
    assert "confidence" in [f.name for f in built["trend_strat"].filters]
    assert "confidence" not in [f.name for f in built["counter_trend_strat"].filters]


def test_confidence_filter_disabled_globally():
    cfg = Config.from_dict({
        "confidence": {"enabled": False},
        "strategies": [{"name": "orb", "id": "orb_a", "enabled": True}],
    })
    built = build_strategies(cfg)
    assert "confidence" not in [f.name for f in built[0].filters]


class _RejectAllFilter:
    """Test double: vetoes every signal and counts how many it was asked about."""

    name = "reject_all"

    def __init__(self):
        self.calls = 0

    def accept(self, signal, context) -> bool:
        self.calls += 1
        return False


def _oscillating_day(n=180) -> pd.DataFrame:
    """A session that repeatedly stretches away from VWAP and snaps back —
    many bars satisfy the vwap_reversion entry condition."""
    idx = pd.date_range("2024-01-02 08:00", periods=n, freq="1min", tz="America/New_York")
    t = np.arange(n)
    wave = 3.0 * np.sin(t / 3.0)
    close = 100 + wave
    open_ = 100 + 3.0 * np.sin((t - 1) / 3.0)
    high = np.maximum(open_, close) + 0.2
    low = np.minimum(open_, close) - 0.2
    return pd.DataFrame({"open": open_, "high": high, "low": low, "close": close,
                         "volume": np.full(n, 1000.0)}, index=idx)


def test_vwap_reversion_caps_attempts_even_when_every_signal_is_rejected():
    """Regression test: before the fix, max_signals_per_day only capped
    *accepted* signals, so a filter that rejects everything let the strategy
    scan the entire session, generating/evaluating hundreds of candidates."""
    cfg = Config()
    df = _oscillating_day()
    max_signals = 3
    strat = VWAPReversionStrategy(cfg, params={"max_signals_per_day": max_signals,
                                               "warmup_bars": 5})
    reject_all = _RejectAllFilter()
    strat.filters = [reject_all]
    ctx = DayContext(date=df.index[0].normalize(), day_df=df, session_window=df,
                     volume_profile=None, config=cfg)
    signals = strat.generate(ctx)
    assert signals == []  # everything was rejected
    assert reject_all.calls <= max_signals, (
        f"expected at most {max_signals} candidates evaluated, got {reject_all.calls}"
    )


def test_duplicate_strategy_ids_raise_instead_of_silently_dropping_results():
    """Regression test: Backtester keyed per-strategy accounts/results by
    strategy.id in a plain dict, so two strategies sharing an id silently
    collapsed into one — the second's results overwrote the first's with no
    error. An unset `id` defaults to `name`, so two unlabeled entries of the
    same strategy type used to collide silently; now it must raise."""
    import pytest

    cfg = Config.from_dict({
        "strategies": [
            {"name": "orb", "enabled": True},   # id defaults to "orb"
            {"name": "orb", "enabled": True},   # id also defaults to "orb" -> collision
        ],
    })
    with pytest.raises(ValueError, match="[Dd]uplicate"):
        Backtester(cfg)
