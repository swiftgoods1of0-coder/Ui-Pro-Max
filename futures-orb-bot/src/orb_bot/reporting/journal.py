"""Trade-journal export.

Writes one row per completed trade to CSV — the format a trader can open in a
spreadsheet, filter, pivot, and annotate. Also writes the summary metrics as a
tidy two-column CSV.
"""

from __future__ import annotations

from pathlib import Path
from typing import List

import pandas as pd

from ..analytics.metrics import PerformanceMetrics
from ..engine.trade import Trade


def export_journal(trades: List[Trade], path: str | Path) -> Path:
    """Write the trade journal to ``path`` (CSV). Returns the path written."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    rows = [t.to_row() for t in trades]
    df = pd.DataFrame(rows)
    df.to_csv(path, index=False)
    return path


def export_metrics_csv(metrics: PerformanceMetrics, path: str | Path) -> Path:
    """Write the summary metrics as a ``metric,value`` CSV."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    series = pd.Series(metrics.as_dict(), name="value")
    series.index.name = "metric"
    series.to_csv(path)
    return path
