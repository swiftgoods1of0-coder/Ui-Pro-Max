"""Data validation.

Historical data is never clean. Before a single backtest runs we check the
loaded OHLCV frame for the failure modes that silently corrupt results:

* missing / NaN values
* duplicate or non-monotonic timestamps
* OHLC inconsistency (high < low, high below the body, etc.)
* non-positive prices, negative volume
* unexpected time gaps inside a session

:func:`validate_ohlcv` returns a :class:`ValidationReport` describing every
issue by severity. :func:`clean_ohlcv` returns a repaired frame (dropping the
rows that can't be trusted). Nothing is silently swallowed — the report is
logged and can be surfaced in the dashboard.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional

import numpy as np
import pandas as pd

logger = logging.getLogger("orb_bot.data.validation")


class Severity(str, Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"


@dataclass
class ValidationIssue:
    severity: Severity
    code: str
    message: str
    count: int = 0


@dataclass
class ValidationReport:
    issues: List[ValidationIssue] = field(default_factory=list)
    rows: int = 0
    start: Optional[pd.Timestamp] = None
    end: Optional[pd.Timestamp] = None

    @property
    def ok(self) -> bool:
        """True if there are no ERROR-severity issues."""
        return not any(i.severity is Severity.ERROR for i in self.issues)

    @property
    def n_errors(self) -> int:
        return sum(1 for i in self.issues if i.severity is Severity.ERROR)

    @property
    def n_warnings(self) -> int:
        return sum(1 for i in self.issues if i.severity is Severity.WARNING)

    def add(self, severity: Severity, code: str, message: str, count: int = 0) -> None:
        self.issues.append(ValidationIssue(severity, code, message, count))

    def summary(self) -> str:
        if not self.issues:
            return f"OK — {self.rows} rows, no issues."
        parts = [f"{self.rows} rows, {self.n_errors} errors, {self.n_warnings} warnings"]
        for i in self.issues:
            parts.append(f"  [{i.severity.value}] {i.code}: {i.message}")
        return "\n".join(parts)


def validate_ohlcv(
    df: pd.DataFrame,
    expected_freq: Optional[str] = None,
    max_gap_bars: int = 3,
) -> ValidationReport:
    """Validate an OHLCV frame and return a structured report.

    Parameters
    ----------
    expected_freq:
        Optional pandas offset (e.g. ``"1min"``). When given, intraday gaps
        larger than ``max_gap_bars`` multiples are flagged.
    """
    report = ValidationReport(rows=len(df))
    if df.empty:
        report.add(Severity.ERROR, "empty", "Frame contains no rows.")
        return report

    report.start = df.index[0]
    report.end = df.index[-1]

    ohlc = ["open", "high", "low", "close"]

    # --- structural checks ---
    if not isinstance(df.index, pd.DatetimeIndex):
        report.add(Severity.ERROR, "index_type", "Index is not a DatetimeIndex.")
        return report
    if df.index.tz is None:
        report.add(Severity.WARNING, "tz_naive", "Index is timezone-naive.")
    if not df.index.is_monotonic_increasing:
        report.add(Severity.ERROR, "unsorted", "Timestamps are not sorted ascending.")
    dupes = int(df.index.duplicated().sum())
    if dupes:
        report.add(Severity.ERROR, "duplicate_ts", "Duplicate timestamps.", dupes)

    # --- missing values ---
    nan_counts = df[ohlc].isna().sum()
    total_nan = int(nan_counts.sum())
    if total_nan:
        report.add(
            Severity.ERROR, "nan_values",
            f"NaNs in OHLC ({nan_counts.to_dict()}).", total_nan,
        )

    # --- price / volume sanity ---
    nonpos = int((df[ohlc] <= 0).any(axis=1).sum())
    if nonpos:
        report.add(Severity.ERROR, "nonpositive_price",
                   "Rows with a non-positive OHLC value.", nonpos)
    if "volume" in df.columns:
        neg_vol = int((df["volume"] < 0).sum())
        if neg_vol:
            report.add(Severity.ERROR, "negative_volume", "Negative volume.", neg_vol)

    # --- OHLC consistency ---
    body_max = df[["open", "close"]].max(axis=1)
    body_min = df[["open", "close"]].min(axis=1)
    bad_high = int((df["high"] < body_max - 1e-9).sum())
    bad_low = int((df["low"] > body_min + 1e-9).sum())
    hl = int((df["high"] < df["low"] - 1e-9).sum())
    if bad_high:
        report.add(Severity.ERROR, "high_below_body",
                   "Bars where high < max(open, close).", bad_high)
    if bad_low:
        report.add(Severity.ERROR, "low_above_body",
                   "Bars where low > min(open, close).", bad_low)
    if hl:
        report.add(Severity.ERROR, "high_below_low", "Bars where high < low.", hl)

    # --- time gaps (per session day, intraday only) ---
    if expected_freq:
        gap_bars = _count_intraday_gaps(df, expected_freq, max_gap_bars)
        if gap_bars:
            report.add(
                Severity.WARNING, "time_gaps",
                f"{gap_bars} intraday gap(s) larger than {max_gap_bars} bars.",
                gap_bars,
            )

    if report.issues:
        logger.warning("Data validation:\n%s", report.summary())
    else:
        logger.info("Data validation OK — %d rows.", report.rows)
    return report


def clean_ohlcv(df: pd.DataFrame) -> pd.DataFrame:
    """Return a repaired copy: sorted, de-duplicated, and with corrupt/NaN rows
    dropped. Use after :func:`validate_ohlcv` when you want to proceed anyway.
    """
    ohlc = ["open", "high", "low", "close"]
    out = df.copy()
    out = out[~out.index.duplicated(keep="last")].sort_index()
    out = out.dropna(subset=ohlc)
    out = out[(out[ohlc] > 0).all(axis=1)]

    body_max = out[["open", "close"]].max(axis=1)
    body_min = out[["open", "close"]].min(axis=1)
    consistent = (
        (out["high"] >= body_max - 1e-9)
        & (out["low"] <= body_min + 1e-9)
        & (out["high"] >= out["low"] - 1e-9)
    )
    out = out[consistent]
    if "volume" in out.columns:
        out["volume"] = out["volume"].clip(lower=0)
    return out


def _count_intraday_gaps(df: pd.DataFrame, expected_freq: str, max_gap_bars: int) -> int:
    step = pd.Timedelta(pd.tseries.frequencies.to_offset(expected_freq))
    gaps = 0
    for _, day in df.groupby(df.index.normalize()):
        if len(day) < 2:
            continue
        deltas = day.index.to_series().diff().dropna()
        gaps += int((deltas > step * max_gap_bars).sum())
    return gaps
