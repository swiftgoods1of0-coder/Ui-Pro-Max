"""Tests for the plug-and-play strategy engine (registry + multi-strategy run)."""

import pandas as pd

from orb_bot.config import Config
from orb_bot.engine import Backtester
from orb_bot.strategy import available_strategies, build_strategies


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
