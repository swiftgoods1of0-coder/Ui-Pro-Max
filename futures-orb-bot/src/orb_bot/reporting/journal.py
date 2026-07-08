"""Trade-journal export.

Writes one row per completed trade to CSV — the format a trader opens in a
spreadsheet to filter, pivot, and annotate. Each row carries the full lifecycle:
strategy, entry/exit, stop loss, take profit, time, duration, P&L, R multiple,
a **screenshot** placeholder, and an editable **notes** field.

Also exports the summary metrics and the monthly / yearly period tables so the
whole review pack is a set of plain CSVs.
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict, List

import pandas as pd

from ..analytics.distributions import monthly_pnl_table, yearly_performance
from ..analytics.metrics import PerformanceMetrics
from ..engine.trade import Trade


def export_journal(trades: List[Trade], path: str | Path) -> Path:
    """Write the full trade journal to ``path`` (CSV). Returns the path."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    df = pd.DataFrame([t.to_row() for t in trades])
    df.to_csv(path, index=False)
    return path


def export_per_strategy_journals(trades: List[Trade], out_dir: str | Path) -> Dict[str, Path]:
    """Write one journal CSV per strategy. Returns {strategy_id: path}."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    by_strat: Dict[str, List[Trade]] = {}
    for t in trades:
        by_strat.setdefault(t.strategy_id or "unknown", []).append(t)
    paths: Dict[str, Path] = {}
    for sid, group in by_strat.items():
        safe = sid.replace("/", "_")
        p = out_dir / f"journal_{safe}.csv"
        export_journal(group, p)
        paths[sid] = p
    return paths


def export_metrics_csv(metrics: PerformanceMetrics, path: str | Path) -> Path:
    """Write the summary metrics as a ``metric,value`` CSV."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    series = pd.Series(metrics.as_dict(), name="value")
    series.index.name = "metric"
    series.to_csv(path)
    return path


def export_period_tables(trades: List[Trade], out_dir: str | Path) -> Dict[str, Path]:
    """Write monthly and yearly performance tables as CSVs."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    paths: Dict[str, Path] = {}

    monthly = monthly_pnl_table(trades)
    if not monthly.empty:
        p = out_dir / "monthly_pnl.csv"
        monthly.to_csv(p)
        paths["monthly"] = p

    yearly = yearly_performance(trades)
    if not yearly.empty:
        p = out_dir / "yearly_performance.csv"
        yearly.to_csv(p)
        paths["yearly"] = p
    return paths
