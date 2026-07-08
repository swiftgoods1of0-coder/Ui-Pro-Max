"""Risk manager: the gatekeeper between a *signal* and an *order*.

Every candidate trade must pass the :class:`RiskManager` before the engine will
simulate it. The manager owns:

* **Account state** — current equity, evolving as trades close.
* **Sizing** — dynamic position sizing from an adjustable risk budget, either a
  fixed dollar amount or a fixed fraction of *current* equity (so size scales
  with the account).
* **Guardrails** — max trades per day, max consecutive losses, and a daily max
  loss (dollar or % of the day's starting equity). Once a guardrail trips, no
  further trades are allowed that day.

Keeping all of this in one auditable object (rather than sprinkled through the
engine) is what lets a firm reason about, test, and tune risk in isolation.
Each strategy gets its own manager instance, so their risk states are
independent.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from math import floor
from typing import Optional

import pandas as pd

from ..config import RiskConfig


@dataclass
class RiskState:
    """Mutable account + intraday risk state."""

    equity: float
    day: Optional[pd.Timestamp] = None
    day_start_equity: float = 0.0
    day_pnl: float = 0.0
    trades_today: int = 0
    consecutive_losses: int = 0


@dataclass
class RiskDecision:
    """The verdict for one candidate trade."""

    allowed: bool
    reason: str
    contracts: float = 0.0
    risk_dollars: float = 0.0


class RiskManager:
    """Adjustable account risk with guardrails and dynamic sizing."""

    def __init__(self, config: RiskConfig):
        self.cfg = config
        self.state = RiskState(equity=config.starting_equity_usd)

    # -- day lifecycle ------------------------------------------------------

    def start_day(self, day: pd.Timestamp) -> None:
        """Reset the intraday counters at the start of a new session."""
        self.state.day = day
        self.state.day_start_equity = self.state.equity
        self.state.day_pnl = 0.0
        self.state.trades_today = 0
        self.state.consecutive_losses = 0

    # -- gate ---------------------------------------------------------------

    def evaluate(self, risk_points: float, point_value: float) -> RiskDecision:
        """Decide whether a trade may be taken and, if so, at what size."""
        cfg = self.cfg

        # --- guardrails (checked before sizing) ---
        if cfg.max_trades_per_day and self.state.trades_today >= cfg.max_trades_per_day:
            return RiskDecision(False, "max_trades_per_day")

        if (
            cfg.max_consecutive_losses
            and self.state.consecutive_losses >= cfg.max_consecutive_losses
        ):
            return RiskDecision(False, "max_consecutive_losses")

        daily_limit = self._daily_loss_limit()
        if daily_limit is not None and self.state.day_pnl <= -daily_limit:
            return RiskDecision(False, "daily_max_loss")

        # --- sizing ---
        risk_dollars = self._risk_budget()
        risk_per_contract = risk_points * point_value
        if risk_per_contract <= 0:
            return RiskDecision(False, "invalid_risk")

        raw = risk_dollars / risk_per_contract
        contracts = raw if cfg.allow_fractional_contracts else float(floor(raw))
        if not cfg.allow_fractional_contracts and contracts < cfg.min_contracts:
            contracts = float(cfg.min_contracts)
        if cfg.max_contracts is not None:
            contracts = min(contracts, float(cfg.max_contracts))
        if contracts <= 0:
            return RiskDecision(False, "size_zero")

        return RiskDecision(True, "ok", contracts=contracts, risk_dollars=risk_dollars)

    # -- accounting ---------------------------------------------------------

    def register_fill(self) -> None:
        """Call when a trade is actually opened (counts toward daily cap)."""
        self.state.trades_today += 1

    def register_result(self, net_pnl: float) -> None:
        """Update equity and streaks when a trade closes."""
        self.state.equity += net_pnl
        self.state.day_pnl += net_pnl
        if net_pnl < 0:
            self.state.consecutive_losses += 1
        elif net_pnl > 0:
            self.state.consecutive_losses = 0
        # break-even leaves the streak unchanged

    # -- helpers ------------------------------------------------------------

    def _risk_budget(self) -> float:
        cfg = self.cfg
        if cfg.risk_model == "fixed_dollar":
            return cfg.risk_per_trade_usd
        # fixed_fractional: a percentage of *current* equity (dynamic).
        return self.state.equity * (cfg.risk_per_trade_pct / 100.0)

    def _daily_loss_limit(self) -> Optional[float]:
        cfg = self.cfg
        if cfg.daily_max_loss_usd is not None:
            return cfg.daily_max_loss_usd
        if cfg.daily_max_loss_pct is not None:
            base = self.state.day_start_equity or self.state.equity
            return base * (cfg.daily_max_loss_pct / 100.0)
        return None
