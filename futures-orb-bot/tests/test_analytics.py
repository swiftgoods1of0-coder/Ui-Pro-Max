"""Tests for expanded analytics: Sharpe, monthly / yearly tables."""

import pandas as pd

from orb_bot.analytics import (
    compute_metrics,
    monthly_pnl_table,
    yearly_performance,
    per_strategy_breakdown,
)
from orb_bot.engine.trade import ExitReason, Trade
from orb_bot.strategy import Side


def _trade(day, net, sid="orb", r=1.0) -> Trade:
    ts = pd.Timestamp(day, tz="America/New_York") + pd.Timedelta(hours=9)
    return Trade(
        date=ts.normalize(), side=Side.LONG, mode="breakout",
        entry_time=ts, entry_price=100.0, stop_price=99.0, target_price=102.0,
        contracts=1, strategy_id=sid, exit_time=ts + pd.Timedelta(minutes=30),
        exit_price=100 + net / 50.0, exit_reason=ExitReason.TARGET,
        gross_pnl=net, commission=0.0, net_pnl=net, realized_r=r,
        mae_points=0.0, mfe_points=0.0, equity_after=0.0,
    )


def _series(trades, start):
    eq = start
    pts = []
    for t in trades:
        eq += t.net_pnl
        pts.append((t.exit_time, eq))
    return pd.Series([v for _, v in pts],
                     index=pd.DatetimeIndex([t for t, _ in pts]))


def test_metrics_include_sharpe():
    trades = [_trade("2024-01-02", 500), _trade("2024-01-03", -200),
              _trade("2024-02-05", 300), _trade("2024-03-01", -100)]
    curve = _series(trades, 25000)
    m = compute_metrics(trades, curve, 25000)
    assert m.trades == 4
    assert hasattr(m, "sharpe_ratio")
    assert isinstance(m.sharpe_ratio, float)


def test_monthly_and_yearly_tables():
    trades = [_trade("2024-01-02", 500), _trade("2024-01-15", -200),
              _trade("2024-02-05", 300), _trade("2025-03-01", 100)]
    monthly = monthly_pnl_table(trades)
    assert "Jan" in monthly.columns and "Total" in monthly.columns
    assert monthly.loc[2024, "Jan"] == 300  # 500 - 200

    yearly = yearly_performance(trades)
    assert 2024 in yearly.index and 2025 in yearly.index
    assert yearly.loc[2024, "trades"] == 3


def test_per_strategy_breakdown():
    trades = [_trade("2024-01-02", 500, sid="a"),
              _trade("2024-01-03", -100, sid="b")]
    bd = per_strategy_breakdown(trades)
    assert set(bd.index) == {"a", "b"}
    assert bd.loc["a", "net_pnl"] == 500
