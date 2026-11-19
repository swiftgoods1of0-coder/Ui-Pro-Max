"""End-to-end engine test: a hand-built breakout that hits its target."""

import pandas as pd

from orb_bot.config import Config
from orb_bot.engine import Backtester
from orb_bot.engine.trade import ExitReason
from orb_bot.strategy import ORBStrategy, Side
from orb_bot.analytics import compute_metrics


def _build_breakout_day() -> pd.DataFrame:
    """One session with OR high=101, low=100, then a long breakout to target."""
    idx = pd.date_range(
        "2024-01-02 08:00", "2024-01-02 08:59", freq="1min", tz="America/New_York"
    )
    rows = []
    for ts in idx:
        t = ts.strftime("%H:%M")
        if ts.time() < pd.Timestamp("08:15").time():
            # Opening range: high 101, low 100.
            o = h = l = c = None
            h, l, c = 101.0, 100.0, 100.5
            o = 100.5
        elif t == "08:20":
            o, h, l, c = 100.8, 102.2, 100.6, 102.0   # breakout close above 101.25
        elif t == "08:30":
            o, h, l, c = 102.0, 107.5, 101.8, 107.0   # tags the 107 target
        else:
            o = h = l = c = 100.7
            h, l = 101.0, 100.4
        rows.append({"open": o, "high": h, "low": l, "close": c, "volume": 1000})
    return pd.DataFrame(rows, index=idx)


def test_breakout_hits_target():
    cfg = Config()
    cfg.volume_profile.enabled = False  # isolate the setup logic
    cfg.strategy.modes = ["breakout"]

    df = _build_breakout_day()
    result = Backtester(cfg, ORBStrategy(cfg)).run(df)

    assert len(result.trades) == 1
    trade = result.trades[0]
    assert trade.side is Side.LONG
    assert trade.mode == "breakout"
    assert trade.exit_reason is ExitReason.TARGET
    assert trade.net_pnl > 0
    # Planned RR is 1:2, so realised R should be ~2 (fills add minor slippage).
    assert 1.7 <= trade.realized_r <= 2.1

    metrics = compute_metrics(result.trades, result.equity_curve, result.starting_equity)
    assert metrics.trades == 1
    assert metrics.wins == 1
    assert metrics.win_rate == 1.0
    assert metrics.ending_equity > cfg.risk.starting_equity_usd


def test_no_trades_on_flat_data():
    cfg = Config()
    cfg.volume_profile.enabled = False
    idx = pd.date_range(
        "2024-01-02 08:00", "2024-01-02 08:59", freq="1min", tz="America/New_York"
    )
    df = pd.DataFrame(
        {"open": 100, "high": 100.1, "low": 99.9, "close": 100, "volume": 500},
        index=idx,
    )
    result = Backtester(cfg, ORBStrategy(cfg)).run(df)
    assert result.trades == []
    metrics = compute_metrics(result.trades, result.equity_curve, result.starting_equity)
    assert metrics.trades == 0
    assert metrics.profit_factor == 0.0
