"""The backtesting event loop.

Runs one or more strategies over historical bars, each on its own independent
account with its own :class:`~orb_bot.risk.RiskManager`, and produces per-strategy
results plus a combined portfolio view. Every meaningful decision is recorded to
the :class:`~orb_bot.logging_utils.DecisionLog` for full explainability.

Responsibilities (kept separate from the *strategies*):

* Walk the data one New-York session at a time.
* Build the shared, strategy-agnostic :class:`DayContext` (session-window bars +
  volume-profile key level).
* Ask each strategy for candidate signals.
* Run every candidate through that strategy's risk manager (guardrails + sizing).
* Simulate fills, costs, and stop/target exits bar-by-bar.

Modelling choices (documented so results are interpretable):

* **No look-ahead.** Entries are only considered after the strategy's setup is
  confirmed; the volume-profile key level uses the previous completed session or
  today's opening-range window — never future bars.
* **Entry fill** = the confirming bar's close plus adverse slippage.
* **Same-bar ambiguity** (a bar touching both stop and target) resolves
  pessimistically as a stop.
* **One position at a time per strategy**; further signals wait until the open
  trade closes, subject to the risk manager's daily caps.
* Anything open at ``window_end`` is closed on that bar (``session_end``).
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Sequence, Union

import pandas as pd

from ..config import Config
from ..indicators.volume_profile import build_volume_profile
from ..logging_utils import DecisionLog
from ..risk import RiskManager
from ..strategy.base import DayContext, Side, Signal, StrategyBase
from ..strategy.registry import build_strategies
from ..utils.sessions import iter_sessions, slice_time_window
from ..utils.timeparse import parse_hhmm
from .trade import ExitReason, Trade

logger = logging.getLogger("orb_bot.engine.backtester")


@dataclass
class StrategyResult:
    """Independent result for a single strategy."""

    strategy_id: str
    strategy_name: str
    trades: List[Trade] = field(default_factory=list)
    equity_curve: pd.Series = field(default_factory=lambda: pd.Series(dtype=float))
    starting_equity: float = 0.0
    ending_equity: float = 0.0


@dataclass
class BacktestResult:
    """Combined result across all strategies, plus per-strategy breakdowns."""

    per_strategy: Dict[str, StrategyResult] = field(default_factory=dict)
    trades: List[Trade] = field(default_factory=list)              # all, sorted by exit
    equity_curve: pd.Series = field(default_factory=lambda: pd.Series(dtype=float))
    starting_equity: float = 0.0
    config: Optional[Config] = None
    days_tested: int = 0
    decision_log: Optional[DecisionLog] = None
    symbol: str = ""

    @property
    def ending_equity(self) -> float:
        if len(self.equity_curve):
            return float(self.equity_curve.iloc[-1])
        return self.starting_equity


class Backtester:
    """Runs strategies over historical data and produces trades."""

    def __init__(
        self,
        config: Config,
        strategies: Union[StrategyBase, Sequence[StrategyBase], None] = None,
        decision_log: Optional[DecisionLog] = None,
    ):
        self.config = config
        if strategies is None:
            strategies = build_strategies(config)
        elif isinstance(strategies, StrategyBase):
            strategies = [strategies]
        self.strategies: List[StrategyBase] = list(strategies)
        self.decision_log = decision_log

    # -- public API ---------------------------------------------------------

    def run(self, data) -> BacktestResult:
        """Run the backtest. ``data`` may be a MarketData or a plain DataFrame."""
        df, market = self._as_market(data)
        cfg = self.config
        window_start = parse_hhmm(cfg.session.window_start)
        window_end = parse_hhmm(cfg.session.window_end)

        # One independent account per strategy.
        managers: Dict[str, RiskManager] = {
            s.id: RiskManager(cfg.risk) for s in self.strategies
        }
        results: Dict[str, StrategyResult] = {
            s.id: StrategyResult(
                strategy_id=s.id, strategy_name=s.name,
                starting_equity=cfg.risk.starting_equity_usd,
            )
            for s in self.strategies
        }
        equity_points: Dict[str, list] = {s.id: [] for s in self.strategies}

        days_tested = 0
        prev_session_df: Optional[pd.DataFrame] = None

        for session_date, day_df in iter_sessions(df):
            days_tested += 1
            session_window = slice_time_window(
                day_df, window_start, window_end, inclusive_end=True
            )
            if session_window.empty:
                prev_session_df = session_window
                continue

            volume_profile = self._build_profile(cfg, day_df, prev_session_df)
            context = DayContext(
                date=session_date,
                day_df=day_df,
                session_window=session_window,
                volume_profile=volume_profile,
                config=cfg,
                market=market,
                decision_log=self.decision_log,
            )

            for strat in self.strategies:
                mgr = managers[strat.id]
                mgr.start_day(session_date)
                if self.decision_log:
                    self.decision_log.record(
                        "session_start", timestamp=session_date, strategy=strat.id,
                        reason="new_session", equity=round(mgr.state.equity, 2),
                    )
                signals = strat.generate(context)
                day_trades = self._simulate_day(
                    strat, signals, session_window, mgr, context
                )
                for tr in day_trades:
                    results[strat.id].trades.append(tr)
                    equity_points[strat.id].append((tr.exit_time, tr.equity_after))

            prev_session_df = session_window

        # Finalise per-strategy curves.
        for sid, res in results.items():
            pts = equity_points[sid]
            res.equity_curve = pd.Series(
                data=[e for _, e in pts],
                index=pd.DatetimeIndex([t for t, _ in pts], name="exit_time"),
                dtype=float,
            )
            res.ending_equity = (
                float(res.equity_curve.iloc[-1]) if len(res.equity_curve)
                else res.starting_equity
            )

        combined = self._combine(results, cfg.risk.starting_equity_usd)
        combined.per_strategy = results
        combined.config = cfg
        combined.days_tested = days_tested
        combined.decision_log = self.decision_log
        combined.symbol = cfg.instrument.symbol
        logger.info(
            "Backtest complete: %d strategies, %d days, %d trades.",
            len(self.strategies), days_tested, len(combined.trades),
        )
        return combined

    # -- per-day simulation -------------------------------------------------

    def _simulate_day(self, strat, signals, session_window, mgr, context) -> List[Trade]:
        trades: List[Trade] = []
        last_exit_time: Optional[pd.Timestamp] = None

        for signal in signals:
            # One position at a time.
            if last_exit_time is not None and signal.timestamp <= last_exit_time:
                continue

            risk_points = abs(signal.entry - signal.stop)
            decision = mgr.evaluate(risk_points, self.config.instrument.point_value)
            if not decision.allowed:
                if self.decision_log:
                    self.decision_log.veto(
                        strat.id, signal.timestamp, reason=decision.reason,
                        mode=signal.mode,
                    )
                # Terminal daily guardrails: no point scanning further today.
                if decision.reason in ("max_trades_per_day", "max_consecutive_losses",
                                       "daily_max_loss"):
                    break
                continue

            mgr.register_fill()
            trade = self._simulate_trade(strat, signal, session_window, decision.contracts)
            mgr.register_result(trade.net_pnl)
            trade.equity_after = mgr.state.equity
            last_exit_time = trade.exit_time
            trades.append(trade)

            if self.decision_log:
                self.decision_log.opened(
                    strat.id, signal.timestamp, reason=signal.mode,
                    contracts=decision.contracts, entry=round(trade.entry_price, 4),
                )
                self.decision_log.closed(
                    strat.id, trade.exit_time, reason=trade.exit_reason.value,
                    net_pnl=round(trade.net_pnl, 2), r=round(trade.realized_r, 2),
                )
        return trades

    def _simulate_trade(self, strat, signal, session_window, contracts) -> Trade:
        cfg = self.config
        tick = cfg.instrument.tick_size
        point_value = cfg.instrument.point_value
        slip = cfg.risk.slippage_ticks * tick
        sign = signal.side.sign

        entry_fill = signal.entry + slip * sign
        future = session_window[session_window.index > signal.timestamp]
        exit_price, exit_time, exit_reason, mae, mfe = self._resolve_exit(signal, future, slip)

        gross = (exit_price - entry_fill) * sign * contracts * point_value
        commission = cfg.risk.commission_per_contract * contracts * 2.0
        net = gross - commission

        risk_points = abs(signal.entry - signal.stop)
        realized_r = ((exit_price - entry_fill) * sign) / risk_points if risk_points else 0.0

        return Trade(
            date=signal.timestamp.normalize(),
            side=signal.side,
            mode=signal.mode,
            entry_time=signal.timestamp,
            entry_price=entry_fill,
            stop_price=signal.stop,
            target_price=signal.target,
            contracts=contracts,
            strategy_id=strat.id,
            exit_time=exit_time,
            exit_price=exit_price,
            exit_reason=exit_reason,
            gross_pnl=gross,
            commission=commission,
            net_pnl=net,
            realized_r=realized_r,
            mae_points=mae,
            mfe_points=mfe,
            equity_after=0.0,  # filled by caller after register_result
            reason=signal.reason,
            meta=signal.meta,
        )

    def _resolve_exit(self, signal, future, slip):
        sign = signal.side.sign
        entry = signal.entry
        mae = mfe = 0.0

        if future.empty:
            return entry, signal.timestamp, ExitReason.SESSION_END, 0.0, 0.0

        for ts, bar in future.iterrows():
            high, low = bar["high"], bar["low"]
            fav = (high - entry) if sign > 0 else (entry - low)
            adv = (entry - low) if sign > 0 else (high - entry)
            mfe = max(mfe, fav)
            mae = max(mae, adv)

            if signal.side is Side.LONG:
                hit_stop = low <= signal.stop
                hit_target = high >= signal.target
            else:
                hit_stop = high >= signal.stop
                hit_target = low <= signal.target

            if hit_stop:  # pessimistic same-bar tie -> stop
                return signal.stop + slip * (-sign), ts, ExitReason.STOP, mae, mfe
            if hit_target:
                return signal.target, ts, ExitReason.TARGET, mae, mfe

        last_ts = future.index[-1]
        last_close = float(future.iloc[-1]["close"])
        return last_close + slip * (-sign), last_ts, ExitReason.SESSION_END, mae, mfe

    # -- helpers ------------------------------------------------------------

    def _combine(self, results: Dict[str, StrategyResult], starting_equity: float) -> BacktestResult:
        """Merge all strategies' trades into one portfolio equity curve.

        The portfolio is modelled as a single shared account funding every
        strategy: equity evolves by each trade's net P&L in exit-time order.
        """
        all_trades: List[Trade] = []
        for res in results.values():
            all_trades.extend(res.trades)
        all_trades.sort(key=lambda t: t.exit_time)

        equity = starting_equity
        times, values = [], []
        for tr in all_trades:
            equity += tr.net_pnl
            times.append(tr.exit_time)
            values.append(equity)

        curve = pd.Series(
            values, index=pd.DatetimeIndex(times, name="exit_time"), dtype=float
        )
        return BacktestResult(
            trades=all_trades, equity_curve=curve, starting_equity=starting_equity
        )

    def _build_profile(self, cfg, day_df, prev_session_df):
        if not cfg.volume_profile.enabled:
            return None
        bins = cfg.volume_profile.bins
        if cfg.volume_profile.source == "opening_range":
            or_bars = slice_time_window(
                day_df, parse_hhmm(cfg.opening_range.start),
                parse_hhmm(cfg.opening_range.end), inclusive_end=False,
            )
            return build_volume_profile(or_bars, bins=bins)
        if prev_session_df is not None and not prev_session_df.empty:
            return build_volume_profile(prev_session_df, bins=bins)
        return None

    @staticmethod
    def _as_market(data):
        """Accept a MarketData or a DataFrame; return (primary_df, market)."""
        if hasattr(data, "primary"):  # MarketData
            return data.primary, data
        # Plain DataFrame — wrap in a minimal MarketData.
        from ..data.timeframes import MarketData

        market = MarketData(symbol="", primary_timeframe="primary", frames={"primary": data})
        return data, market
