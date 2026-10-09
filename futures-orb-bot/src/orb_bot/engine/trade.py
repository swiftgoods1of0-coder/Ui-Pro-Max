"""The :class:`Trade` record — a single completed round-turn.

This is the atomic unit every downstream consumer (analytics, journal,
dashboard) reads. It captures both the *plan* (entry / stop / target / side)
and the *outcome* (exit, P&L, realised R multiple, excursions), so no
information is lost between the engine and the reports.
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from enum import Enum
from typing import Any, Dict, Optional

import pandas as pd

from ..strategy.base import Side


class ExitReason(str, Enum):
    TARGET = "target"
    STOP = "stop"
    SESSION_END = "session_end"


@dataclass
class Trade:
    # --- identity / plan ---
    date: pd.Timestamp
    side: Side
    mode: str
    entry_time: pd.Timestamp
    entry_price: float
    stop_price: float               # stop loss
    target_price: float             # take profit
    contracts: float
    strategy_id: str                # which strategy produced the trade
    # --- outcome ---
    exit_time: pd.Timestamp
    exit_price: float
    exit_reason: ExitReason
    gross_pnl: float
    commission: float
    net_pnl: float
    realized_r: float               # realised profit in R-multiples of risk
    mae_points: float               # max adverse excursion (points)
    mfe_points: float               # max favourable excursion (points)
    equity_after: float
    reason: str = ""
    notes: str = ""                  # free-text journal notes (editable)
    screenshot_path: str = ""        # placeholder for a chart screenshot
    meta: Dict[str, Any] = field(default_factory=dict)

    @property
    def is_win(self) -> bool:
        return self.net_pnl > 0

    @property
    def risk_points(self) -> float:
        return abs(self.entry_price - self.stop_price)

    @property
    def hold_minutes(self) -> float:
        return (self.exit_time - self.entry_time).total_seconds() / 60.0

    def to_row(self) -> Dict[str, Any]:
        """Flat, CSV-friendly representation for the trade journal.

        Column order mirrors what a trader reviews: identity, plan (entry / stop
        / take-profit), outcome, then journal fields (notes / screenshot).
        """
        return {
            "date": self.date.date().isoformat(),
            "strategy": self.strategy_id,
            "side": self.side.value,
            "mode": self.mode,
            "entry_time": self.entry_time.isoformat(),
            "exit_time": self.exit_time.isoformat(),
            "duration_min": round(self.hold_minutes, 2),
            "entry_price": round(self.entry_price, 4),
            "stop_loss": round(self.stop_price, 4),
            "take_profit": round(self.target_price, 4),
            "exit_price": round(self.exit_price, 4),
            "exit_reason": self.exit_reason.value,
            "contracts": self.contracts,
            "risk_points": round(self.risk_points, 4),
            "realized_r": round(self.realized_r, 3),
            "gross_pnl": round(self.gross_pnl, 2),
            "commission": round(self.commission, 2),
            "net_pnl": round(self.net_pnl, 2),
            "mae_points": round(self.mae_points, 4),
            "mfe_points": round(self.mfe_points, 4),
            "equity_after": round(self.equity_after, 2),
            "poc": self.meta.get("poc"),
            "screenshot": self.screenshot_path,
            "notes": self.notes,
            "reason": self.reason,
        }
