"""Session-slicing helpers.

The backtester works one *trading day* at a time. These helpers split a
continuous, tz-aware OHLCV frame into per-day slices and extract intraday time
windows (e.g. the New-York trading window) from a day's bars.
"""

from __future__ import annotations

from datetime import time
from typing import Iterator, Tuple

import pandas as pd


def iter_sessions(df: pd.DataFrame) -> Iterator[Tuple[pd.Timestamp, pd.DataFrame]]:
    """Yield ``(session_date, day_bars)`` for each calendar day in ``df``.

    Days are defined by the wall-clock date of the (already session-localized)
    index, so each slice contains exactly one New-York trading date.
    """
    if df.empty:
        return
    for day, group in df.groupby(df.index.normalize(), sort=True):
        yield pd.Timestamp(day), group


def slice_time_window(
    day_df: pd.DataFrame,
    start: time,
    end: time,
    inclusive_end: bool = True,
) -> pd.DataFrame:
    """Return the bars of ``day_df`` whose time falls in ``[start, end]``.

    Parameters
    ----------
    inclusive_end:
        If ``True`` the window is ``start <= t <= end``; if ``False`` it is
        ``start <= t < end``.
    """
    times = day_df.index.time
    if inclusive_end:
        mask = (times >= start) & (times <= end)
    else:
        mask = (times >= start) & (times < end)
    return day_df[mask]
