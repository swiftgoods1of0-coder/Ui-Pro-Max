"""Period aggregations and trade-distribution helpers.

These power the calendar-style tables (monthly / yearly P&L) and the
distribution charts (R multiples, hold time, per-strategy / per-setup) on the
dashboard. They operate purely on a list of :class:`Trade` records so they are
independent of the engine internals.
"""

from __future__ import annotations

from typing import Dict, List

import numpy as np
import pandas as pd

from ..engine.trade import Trade

_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
           "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def trades_to_frame(trades: List[Trade]) -> pd.DataFrame:
    """Flatten trades into a DataFrame indexed by exit time."""
    if not trades:
        return pd.DataFrame()
    rows = [t.to_row() for t in trades]
    df = pd.DataFrame(rows)
    df["exit_time"] = pd.to_datetime(df["exit_time"])
    return df.set_index("exit_time").sort_index()


def monthly_pnl_table(trades: List[Trade]) -> pd.DataFrame:
    """Year × month net-P&L matrix (with a Total column). Empty if no trades."""
    df = trades_to_frame(trades)
    if df.empty:
        return pd.DataFrame()
    g = df.groupby([df.index.year, df.index.month])["net_pnl"].sum()
    table = g.unstack().astype(float)
    table = table.reindex(columns=range(1, 13)).fillna(0.0)
    table.columns = _MONTHS
    table["Total"] = table.sum(axis=1)
    table.index.name = "Year"
    return table.round(2)


def yearly_performance(trades: List[Trade]) -> pd.DataFrame:
    """Per-year summary: trades, wins, win rate, net P&L, profit factor."""
    df = trades_to_frame(trades)
    if df.empty:
        return pd.DataFrame()

    def _agg(group: pd.DataFrame) -> pd.Series:
        wins = group[group["net_pnl"] > 0]
        losses = group[group["net_pnl"] < 0]
        gross_win = wins["net_pnl"].sum()
        gross_loss = -losses["net_pnl"].sum()
        pf = gross_win / gross_loss if gross_loss > 0 else np.inf
        decided = len(wins) + len(losses)
        return pd.Series({
            "trades": len(group),
            "wins": len(wins),
            "win_rate": (len(wins) / decided) if decided else 0.0,
            "net_pnl": group["net_pnl"].sum(),
            "profit_factor": pf,
        })

    out = df.groupby(df.index.year).apply(_agg, include_groups=False)
    out.index.name = "Year"
    return out.round({"win_rate": 3, "net_pnl": 2, "profit_factor": 2})


def per_strategy_breakdown(trades: List[Trade]) -> pd.DataFrame:
    """Net P&L / trades / win rate per strategy id."""
    df = trades_to_frame(trades)
    if df.empty:
        return pd.DataFrame()
    g = df.groupby("strategy")
    out = pd.DataFrame({
        "trades": g.size(),
        "net_pnl": g["net_pnl"].sum(),
        "win_rate": g["net_pnl"].apply(lambda s: (s > 0).mean()),
        "avg_r": g["realized_r"].mean(),
    })
    return out.round({"net_pnl": 2, "win_rate": 3, "avg_r": 2})


def r_multiples(trades: List[Trade]) -> np.ndarray:
    return np.array([t.realized_r for t in trades], dtype=float)


def hold_times_minutes(trades: List[Trade]) -> np.ndarray:
    return np.array([t.hold_minutes for t in trades], dtype=float)
