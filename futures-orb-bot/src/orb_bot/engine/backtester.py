"""The backtesting event loop.

Responsibilities, kept deliberately separate from the *strategy*:

* Walk the data one New-York session at a time.
* Build the day's context (opening range + volume-profile key level).
* Ask the strategy for candidate signals.
* Simulate fills, position sizing, costs, and stop/target exits bar-by-bar.
* Emit an ordered list of :class:`Trade`s and an equity curve.

Modelling choices (documented so results are interpretable):

* **No look-ahead.** Entries are only considered *after* the opening range is
  complete. The volume-profile key level is built either from today's opening
  range or from the *previous* completed session — never from future bars.
* **Entry fill** is the price of the bar whose close confirmed the setup, plus
  ``slippage_ticks`` of adverse slippage.
* **Same-bar ambiguity** (a bar touching both stop and target) is resolved
  pessimistically as a stop.
* **One position at a time**; further signals are ignored until the current
  trade closes, capped by ``max_trades_per_day``.
* Anything still open at ``window_end`` is closed on that bar (``session_end``).
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import time
from math import floor
from typing import List, Optional, Sequence

import pandas as pd

from ..config import Config
from ..indicators.opening_range import compute_opening_range
from ..indicators.volume_profile import build_volume_profile
from ..strategy.base import DayContext, Side, Signal, Strategy
from ..utils.sessions import iter_sessions, slice_time_window
from ..utils.timeparse import parse_hhmm
from .trade import ExitReason, Trade


@dataclass
class BacktestResult:
    """Everything a backtest run produces."""

    trades: List[Trade] = field(default_factory=list)
    equity_curve: pd.Series = field(default_factory=lambda: pd.Series(dtype=float))
    starting_equity: float = 0.0
    config: Optional[Config] = None
    days_tested: int = 0
    days_with_signals: int = 0

    @property
    def ending_equity(self) -> float:
        if len(self.equity_curve):
            return float(self.equity_curve.iloc[-1])
        return self.starting_equity


class Backtester:
    """Runs a :class:`Strategy` over historical bars and produces trades."""

    def __init__(self, config: Config, strategy: Strategy):
        self.config = config
        self.strategy = strategy

    def run(self, df: pd.DataFrame) -> BacktestResult:
        cfg = self.config
        window_start = parse_hhmm(cfg.session.window_start)
        window_end = parse_hhmm(cfg.session.window_end)
        or_end = parse_hhmm(cfg.opening_range.end)
        # Entries begin once the OR is complete (or later, if the window says so).
        entry_start = max(window_start, or_end)

        equity = cfg.risk.starting_equity_usd
        trades: List[Trade] = []
        equity_points: list[tuple[pd.Timestamp, float]] = []

        days_tested = 0
        days_with_signals = 0
        prev_session_df: Optional[pd.DataFrame] = None

        for session_date, day_df in iter_sessions(df):
            days_tested += 1

            opening_range = compute_opening_range(
                day_df, cfg.opening_range.start, cfg.opening_range.end
            )
            if opening_range is None:
                prev_session_df = self._session_slice(day_df, window_start, window_end)
                continue

            entry_window = slice_time_window(
                day_df, entry_start, window_end, inclusive_end=True
            )
            if entry_window.empty:
                prev_session_df = self._session_slice(day_df, window_start, window_end)
                continue

            volume_profile = self._build_profile(
                cfg, day_df, opening_range, prev_session_df
            )

            context = DayContext(
                date=session_date,
                day_df=day_df,
                entry_window=entry_window,
                opening_range=opening_range,
                volume_profile=volume_profile,
                config=cfg,
            )

            signals = self.strategy.generate(context)
            if signals:
                days_with_signals += 1

            equity, day_trades = self._simulate_day(signals, entry_window, equity)
            for tr in day_trades:
                trades.append(tr)
                equity_points.append((tr.exit_time, tr.equity_after))

            prev_session_df = self._session_slice(day_df, window_start, window_end)

        equity_curve = pd.Series(
            data=[e for _, e in equity_points],
            index=pd.DatetimeIndex([t for t, _ in equity_points], name="exit_time"),
            dtype=float,
        )

        return BacktestResult(
            trades=trades,
            equity_curve=equity_curve,
            starting_equity=cfg.risk.starting_equity_usd,
            config=cfg,
            days_tested=days_tested,
            days_with_signals=days_with_signals,
        )

    # -- per-day simulation -------------------------------------------------

    def _simulate_day(
        self, signals: Sequence[Signal], entry_window: pd.DataFrame, equity: float
    ) -> tuple[float, List[Trade]]:
        trades: List[Trade] = []
        max_trades = self.config.strategy.max_trades_per_day or 0  # 0 => unlimited
        last_exit_time: Optional[pd.Timestamp] = None

        for signal in signals:
            # One position at a time: skip signals that fire before the prior
            # trade has closed.
            if last_exit_time is not None and signal.timestamp <= last_exit_time:
                continue
            if max_trades and len(trades) >= max_trades:
                break

            trade = self._simulate_trade(signal, entry_window, equity)
            if trade is None:
                continue
            equity = trade.equity_after
            last_exit_time = trade.exit_time
            trades.append(trade)

        return equity, trades

    def _simulate_trade(
        self, signal: Signal, entry_window: pd.DataFrame, equity: float
    ) -> Optional[Trade]:
        cfg = self.config
        tick = cfg.instrument.tick_size
        point_value = cfg.instrument.point_value
        slip = cfg.risk.slippage_ticks * tick
        sign = signal.side.sign

        contracts = self._position_size(signal)
        if contracts <= 0:
            return None

        # Adverse entry slippage.
        entry_fill = signal.entry + slip * sign

        # Bars strictly after the signal bar are where the trade can resolve.
        future = entry_window[entry_window.index > signal.timestamp]

        exit_price, exit_time, exit_reason, mae, mfe = self._resolve_exit(
            signal, future, slip
        )

        gross = (exit_price - entry_fill) * sign * contracts * point_value
        commission = cfg.risk.commission_per_contract * contracts * 2.0  # round turn
        net = gross - commission
        equity_after = equity + net

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
            exit_time=exit_time,
            exit_price=exit_price,
            exit_reason=exit_reason,
            gross_pnl=gross,
            commission=commission,
            net_pnl=net,
            realized_r=realized_r,
            mae_points=mae,
            mfe_points=mfe,
            equity_after=equity_after,
            reason=signal.reason,
            meta=signal.meta,
        )

    def _resolve_exit(
        self, signal: Signal, future: pd.DataFrame, slip: float
    ) -> tuple[float, pd.Timestamp, ExitReason, float, float]:
        """Walk forward bar-by-bar until stop, target, or session end."""
        sign = signal.side.sign
        entry = signal.entry
        mae = 0.0  # worst adverse move, in points (>= 0)
        mfe = 0.0  # best favourable move, in points (>= 0)

        if future.empty:
            # No bars after entry — flat exit at the entry price.
            return entry, signal.timestamp, ExitReason.SESSION_END, 0.0, 0.0

        for ts, bar in future.iterrows():
            high, low = bar["high"], bar["low"]

            # Track excursions.
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

            # Same-bar tie resolves as a stop (pessimistic).
            if hit_stop:
                return signal.stop + slip * (-sign), ts, ExitReason.STOP, mae, mfe
            if hit_target:
                return signal.target, ts, ExitReason.TARGET, mae, mfe

        # Ran out of session — exit at the last bar's close with slippage.
        last_ts = future.index[-1]
        last_close = float(future.iloc[-1]["close"])
        return last_close + slip * (-sign), last_ts, ExitReason.SESSION_END, mae, mfe

    def _position_size(self, signal: Signal) -> float:
        cfg = self.config
        risk_points = abs(signal.entry - signal.stop)
        risk_per_contract = risk_points * cfg.instrument.point_value
        if risk_per_contract <= 0:
            return 0.0

        raw = cfg.risk.risk_per_trade_usd / risk_per_contract
        if cfg.risk.allow_fractional_contracts:
            return max(raw, 0.0)
        sized = floor(raw)
        if sized < cfg.risk.min_contracts:
            sized = cfg.risk.min_contracts
        return float(sized)

    # -- volume profile selection ------------------------------------------

    def _build_profile(self, cfg, day_df, opening_range, prev_session_df):
        if not cfg.volume_profile.enabled:
            return None
        bins = cfg.volume_profile.bins
        if cfg.volume_profile.source == "opening_range":
            or_bars = slice_time_window(
                day_df,
                parse_hhmm(cfg.opening_range.start),
                parse_hhmm(cfg.opening_range.end),
                inclusive_end=False,
            )
            return build_volume_profile(or_bars, bins=bins)
        # "session": use the previous completed session as today's key level
        # (fully known at the open — no look-ahead).
        if prev_session_df is not None and not prev_session_df.empty:
            return build_volume_profile(prev_session_df, bins=bins)
        return None

    @staticmethod
    def _session_slice(day_df: pd.DataFrame, start: time, end: time) -> pd.DataFrame:
        return slice_time_window(day_df, start, end, inclusive_end=True)
