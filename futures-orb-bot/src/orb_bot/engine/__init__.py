"""Backtesting engine: trade modelling and the event loop."""

from .trade import Trade, ExitReason
from .backtester import Backtester, BacktestResult, StrategyResult

__all__ = ["Trade", "ExitReason", "Backtester", "BacktestResult", "StrategyResult"]
