"""OHLCV CSV loader.

Turns arbitrary OHLCV CSV files into a clean, timezone-aware
:class:`pandas.DataFrame` indexed by timestamp with exactly these columns::

    open, high, low, close, volume

Design goals:

* **Forgiving input** — common column-name variants and timestamp formats are
  auto-detected, so you can drop in files from most data vendors.
* **Correct time** — timestamps are localized from the CSV's timezone and
  converted to the session timezone, so "8:00 AM" always means New York
  wall-clock regardless of how the file was stored.
* **Deterministic output** — sorted, de-duplicated, and validated, so every
  downstream module can assume a well-formed frame.
"""

from __future__ import annotations

from pathlib import Path
from typing import Iterable, List, Optional

import pandas as pd

OHLCV_COLUMNS: List[str] = ["open", "high", "low", "close", "volume"]

# Accepted header aliases -> canonical name. Matching is case-insensitive.
_COLUMN_ALIASES = {
    "timestamp": "timestamp",
    "time": "timestamp",
    "date": "timestamp",
    "datetime": "timestamp",
    "date_time": "timestamp",
    "open": "open",
    "o": "open",
    "high": "high",
    "h": "high",
    "low": "low",
    "l": "low",
    "close": "close",
    "c": "close",
    "last": "close",
    "volume": "volume",
    "vol": "volume",
    "v": "volume",
}


def load_ohlcv(
    path: str | Path,
    input_timezone: str = "UTC",
    session_timezone: str = "America/New_York",
    resample: Optional[str] = None,
) -> pd.DataFrame:
    """Load a single OHLCV CSV file into a clean, tz-aware DataFrame.

    Parameters
    ----------
    path:
        Path to the CSV file.
    input_timezone:
        Timezone the CSV timestamps are expressed in. If the timestamps are
        already tz-aware (contain an offset), this is ignored.
    session_timezone:
        Timezone all downstream logic runs in. The frame's index is converted
        to this zone.
    resample:
        Optional pandas offset alias (e.g. ``"5min"``) to resample the bars to.
        Leave ``None`` to keep the file's native resolution.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Data file not found: {path}")

    df = pd.read_csv(path)
    df = _normalize_columns(df)
    df = _parse_timestamp(df, input_timezone, session_timezone)
    df = _coerce_and_validate(df)

    if resample:
        df = resample_ohlcv(df, resample)

    df.attrs["source_file"] = str(path)
    return df


def load_directory(
    directory: str | Path,
    pattern: str = "*.csv",
    **kwargs,
) -> pd.DataFrame:
    """Load and concatenate every CSV matching ``pattern`` in ``directory``.

    Useful when your history is split across per-month or per-symbol files.
    Extra keyword arguments are forwarded to :func:`load_ohlcv`.
    """
    directory = Path(directory)
    files = sorted(directory.glob(pattern))
    if not files:
        raise FileNotFoundError(
            f"No files matching '{pattern}' found in {directory}"
        )
    frames: List[pd.DataFrame] = [load_ohlcv(f, **kwargs) for f in files]
    combined = pd.concat(frames).sort_index()
    combined = combined[~combined.index.duplicated(keep="last")]
    return combined


def resample_ohlcv(df: pd.DataFrame, rule: str) -> pd.DataFrame:
    """Resample OHLCV bars to a coarser ``rule`` (e.g. ``"5min"``)."""
    agg = {
        "open": "first",
        "high": "max",
        "low": "min",
        "close": "last",
        "volume": "sum",
    }
    out = df.resample(rule, label="left", closed="left").agg(agg)
    return out.dropna(subset=["open", "high", "low", "close"])


# --------------------------------------------------------------------------- #
# Internals
# --------------------------------------------------------------------------- #


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename: dict[str, str] = {}
    for col in df.columns:
        key = str(col).strip().lower()
        if key in _COLUMN_ALIASES:
            rename[col] = _COLUMN_ALIASES[key]
    df = df.rename(columns=rename)

    missing = [c for c in ("timestamp", *OHLCV_COLUMNS[:4]) if c not in df.columns]
    if missing:
        raise ValueError(
            "CSV is missing required column(s): "
            f"{missing}. Found columns: {list(df.columns)}. "
            "Expected a timestamp column plus open/high/low/close "
            "(volume optional)."
        )
    if "volume" not in df.columns:
        df["volume"] = 0.0
    return df


def _parse_timestamp(
    df: pd.DataFrame,
    input_timezone: str,
    session_timezone: str,
) -> pd.DataFrame:
    ts = pd.to_datetime(df["timestamp"], utc=False, errors="coerce")
    if ts.isna().any():
        bad = int(ts.isna().sum())
        raise ValueError(f"{bad} timestamp(s) could not be parsed.")

    # Localize naive timestamps to the input timezone; convert aware ones.
    if ts.dt.tz is None:
        ts = ts.dt.tz_localize(
            input_timezone, ambiguous="infer", nonexistent="shift_forward"
        )
    ts = ts.dt.tz_convert(session_timezone)

    df = df.drop(columns=["timestamp"])
    df.index = pd.DatetimeIndex(ts, name="timestamp")
    return df


def _coerce_and_validate(df: pd.DataFrame) -> pd.DataFrame:
    df = df[OHLCV_COLUMNS].apply(pd.to_numeric, errors="coerce")
    df = df.dropna(subset=["open", "high", "low", "close"])
    df["volume"] = df["volume"].fillna(0.0)

    df = df.sort_index()
    df = df[~df.index.duplicated(keep="last")]

    # Basic sanity: high must be the bar's max, low the min.
    bad = (df["high"] < df[["open", "close"]].max(axis=1)) | (
        df["low"] > df[["open", "close"]].min(axis=1)
    )
    if bad.any():
        df = df[~bad]
    return df
