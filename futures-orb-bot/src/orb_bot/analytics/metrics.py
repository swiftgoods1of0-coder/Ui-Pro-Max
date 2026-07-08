"""Performance metrics.

Turns a list of :class:`~orb_bot.engine.trade.Trade` plus the equity curve into
the numbers a discretionary trader actually reviews: win rate, profit factor,
max drawdown, average R, expectancy, and time-of-day performance.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from ..engine.trade import Trade


@dataclass
class PerformanceMetrics:
    trades: int = 0
    wins: int = 0
    losses: int = 0
    scratches: int = 0
    win_rate: float = 0.0
    profit_factor: float = 0.0
    net_pnl: float = 0.0
    gross_profit: float = 0.0
    gross_loss: float = 0.0
    return_pct: float = 0.0
    expectancy: float = 0.0             # avg net P&L per trade ($)
    avg_realized_r: float = 0.0
    avg_win_r: float = 0.0
    avg_loss_r: float = 0.0
    avg_win: float = 0.0                # $
    avg_loss: float = 0.0               # $
    max_drawdown: float = 0.0           # $
    max_drawdown_pct: float = 0.0
    max_consecutive_wins: int = 0
    max_consecutive_losses: int = 0
    avg_hold_minutes: float = 0.0
    starting_equity: float = 0.0
    ending_equity: float = 0.0
    best_hour: Optional[int] = None
    worst_hour: Optional[int] = None

    def as_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def summary_lines(self) -> List[str]:
        """Human-readable one-per-line summary for the console / report."""
        pf = "inf" if self.profit_factor == float("inf") else f"{self.profit_factor:.2f}"
        return [
            f"Trades              : {self.trades}",
            f"Win rate            : {self.win_rate * 100:.1f}%  "
            f"({self.wins}W / {self.losses}L / {self.scratches}S)",
            f"Profit factor       : {pf}",
            f"Net P&L             : ${self.net_pnl:,.2f}  ({self.return_pct:.2f}%)",
            f"Expectancy / trade  : ${self.expectancy:,.2f}",
            f"Avg realised R      : {self.avg_realized_r:.2f}R  "
            f"(win {self.avg_win_r:.2f}R / loss {self.avg_loss_r:.2f}R)",
            f"Avg win / loss ($)  : ${self.avg_win:,.2f} / ${self.avg_loss:,.2f}",
            f"Max drawdown        : ${self.max_drawdown:,.2f}  "
            f"({self.max_drawdown_pct:.2f}%)",
            f"Max consec W / L    : {self.max_consecutive_wins} / "
            f"{self.max_consecutive_losses}",
            f"Avg hold            : {self.avg_hold_minutes:.1f} min",
            f"Best / worst hour   : {_fmt_hour(self.best_hour)} / "
            f"{_fmt_hour(self.worst_hour)}",
            f"Equity              : ${self.starting_equity:,.2f} -> "
            f"${self.ending_equity:,.2f}",
        ]


def compute_metrics(
    trades: List[Trade],
    equity_curve: pd.Series,
    starting_equity: float,
) -> PerformanceMetrics:
    m = PerformanceMetrics(starting_equity=starting_equity, ending_equity=starting_equity)
    if not trades:
        return m

    pnls = np.array([t.net_pnl for t in trades], dtype=float)
    rs = np.array([t.realized_r for t in trades], dtype=float)

    wins_mask = pnls > 0
    losses_mask = pnls < 0

    m.trades = len(trades)
    m.wins = int(wins_mask.sum())
    m.losses = int(losses_mask.sum())
    m.scratches = m.trades - m.wins - m.losses
    decided = m.wins + m.losses
    m.win_rate = (m.wins / decided) if decided else 0.0

    m.gross_profit = float(pnls[wins_mask].sum())
    m.gross_loss = float(-pnls[losses_mask].sum())  # positive number
    m.net_pnl = float(pnls.sum())
    m.profit_factor = (
        m.gross_profit / m.gross_loss
        if m.gross_loss > 0
        else (float("inf") if m.gross_profit > 0 else 0.0)
    )

    m.expectancy = float(pnls.mean())
    m.avg_realized_r = float(rs.mean())
    m.avg_win_r = float(rs[wins_mask].mean()) if m.wins else 0.0
    m.avg_loss_r = float(rs[losses_mask].mean()) if m.losses else 0.0
    m.avg_win = float(pnls[wins_mask].mean()) if m.wins else 0.0
    m.avg_loss = float(pnls[losses_mask].mean()) if m.losses else 0.0

    m.max_consecutive_wins = _max_streak(wins_mask)
    m.max_consecutive_losses = _max_streak(losses_mask)
    m.avg_hold_minutes = float(np.mean([t.hold_minutes for t in trades]))

    # Drawdown from the equity curve, seeded with the starting equity.
    equity = pd.concat(
        [pd.Series([starting_equity]), equity_curve], ignore_index=True
    )
    running_max = equity.cummax()
    drawdown = equity - running_max
    m.max_drawdown = float(-drawdown.min())
    trough_peak = float(running_max.iloc[int(drawdown.idxmin())])
    m.max_drawdown_pct = float(m.max_drawdown / trough_peak * 100) if trough_peak else 0.0

    m.ending_equity = float(equity.iloc[-1])
    m.return_pct = (
        (m.ending_equity - starting_equity) / starting_equity * 100
        if starting_equity
        else 0.0
    )

    tod = time_of_day_table(trades)
    if not tod.empty:
        m.best_hour = int(tod["net_pnl"].idxmax())
        m.worst_hour = int(tod["net_pnl"].idxmin())

    return m


def time_of_day_table(trades: List[Trade]) -> pd.DataFrame:
    """Aggregate performance by entry hour (New-York wall-clock).

    Returns a DataFrame indexed by hour with columns:
    ``trades, wins, win_rate, net_pnl, avg_r``.
    """
    if not trades:
        return pd.DataFrame(
            columns=["trades", "wins", "win_rate", "net_pnl", "avg_r"]
        )
    df = pd.DataFrame(
        {
            "hour": [t.entry_time.hour for t in trades],
            "net_pnl": [t.net_pnl for t in trades],
            "win": [1 if t.net_pnl > 0 else 0 for t in trades],
            "r": [t.realized_r for t in trades],
        }
    )
    grouped = df.groupby("hour")
    table = pd.DataFrame(
        {
            "trades": grouped.size(),
            "wins": grouped["win"].sum(),
            "win_rate": grouped["win"].mean(),
            "net_pnl": grouped["net_pnl"].sum(),
            "avg_r": grouped["r"].mean(),
        }
    )
    return table.sort_index()


# --------------------------------------------------------------------------- #


def _max_streak(mask: np.ndarray) -> int:
    best = run = 0
    for v in mask:
        run = run + 1 if v else 0
        best = max(best, run)
    return int(best)


def _fmt_hour(hour: Optional[int]) -> str:
    if hour is None:
        return "n/a"
    return f"{hour:02d}:00"
