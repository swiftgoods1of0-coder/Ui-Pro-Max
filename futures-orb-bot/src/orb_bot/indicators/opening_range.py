"""Opening-range ("ORB box") computation.

The opening range is the high/low envelope traced out during a fixed window at
the start of the session — by default 08:00–08:15 New York time. Its high and
low become the key breakout / liquidity levels the strategy trades around.
"""

from __future__ import annotations

from dataclasses import dataclass
from datetime import time
from typing import Optional

import pandas as pd

from ..utils.timeparse import parse_hhmm


@dataclass(frozen=True)
class OpeningRange:
    """The opening-range box for a single trading day."""

    date: pd.Timestamp          # the session date (normalized to midnight)
    start: time                 # window start (wall-clock)
    end: time                   # window end (wall-clock, exclusive)
    high: float                 # ORB high  (ORH)
    low: float                  # ORB low   (ORL)
    bars: int                   # number of bars that formed the range

    @property
    def mid(self) -> float:
        """Midpoint of the box — a common mean-reversion / bias pivot."""
        return (self.high + self.low) / 2.0

    @property
    def height(self) -> float:
        """Box height in points (ORH − ORL)."""
        return self.high - self.low


def compute_opening_range(
    day_df: pd.DataFrame,
    start: str = "08:00",
    end: str = "08:15",
) -> Optional[OpeningRange]:
    """Compute the opening range for one day's worth of bars.

    Parameters
    ----------
    day_df:
        Bars for a *single* session date, tz-aware and sorted (as produced by
        the loader). Bars outside the OR window are ignored.
    start, end:
        Window bounds as ``"HH:MM"`` strings. ``end`` is exclusive so an
        08:00–08:15 window on 1-minute data captures the 08:00…08:14 bars.

    Returns
    -------
    OpeningRange or None
        ``None`` if no bars fall inside the window (e.g. a holiday / data gap).
    """
    if day_df.empty:
        return None

    start_t = parse_hhmm(start)
    end_t = parse_hhmm(end)

    times = day_df.index.time
    mask = (times >= start_t) & (times < end_t)
    window = day_df[mask]
    if window.empty:
        return None

    session_date = day_df.index[0].normalize()
    return OpeningRange(
        date=session_date,
        start=start_t,
        end=end_t,
        high=float(window["high"].max()),
        low=float(window["low"].min()),
        bars=int(len(window)),
    )
