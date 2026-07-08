"""Performance analytics computed from a completed backtest."""

from .metrics import PerformanceMetrics, compute_metrics, time_of_day_table
from .distributions import (
    monthly_pnl_table,
    yearly_performance,
    per_strategy_breakdown,
    trades_to_frame,
    r_multiples,
    hold_times_minutes,
)

__all__ = [
    "PerformanceMetrics",
    "compute_metrics",
    "time_of_day_table",
    "monthly_pnl_table",
    "yearly_performance",
    "per_strategy_breakdown",
    "trades_to_frame",
    "r_multiples",
    "hold_times_minutes",
]
