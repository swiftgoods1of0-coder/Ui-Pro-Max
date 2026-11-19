"""Tick (trade-by-trade) data loader — the raw fuel for real order-flow.

OHLCV bars cannot tell you who was aggressive at which price; only individual
trades can. A **tick** here means one executed trade: a timestamp, a price, a
size, and — critically — which side was the **aggressor** (the order that
crossed the spread to trade: lifted the offer = buy aggressor, hit the bid =
sell aggressor). That aggressor flag is what everything in
:mod:`orb_bot.footprint` is built on; without it you're back to guessing.

Design goals mirror :mod:`orb_bot.data.loader`:

* **Forgiving input** — common column names and a few ways of expressing the
  aggressor side are all accepted (see :func:`load_ticks`).
* **Correct time** — same timezone handling as the OHLCV loader.
* **No silent data loss** — rows that can't be assigned a side are kept with
  side ``0`` (unknown) rather than dropped or guessed into a "wrong" trade;
  callers decide whether to exclude them.

If you don't have a tick feed yet, :func:`orb_bot.data.synth_ticks.generate_ticks`
produces realistic synthetic trades (including deliberate absorption and
stacked-imbalance scenarios) so the footprint engine can be exercised today.
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Optional

import numpy as np
import pandas as pd

TICK_COLUMNS: List[str] = ["price", "size", "side"]

# Header aliases -> canonical name. Matching is case-insensitive.
_COLUMN_ALIASES = {
    "timestamp": "timestamp", "time": "timestamp", "datetime": "timestamp",
    "ts": "timestamp",
    "price": "price", "px": "price", "trade_price": "price", "last": "price",
    "size": "size", "qty": "size", "quantity": "size", "volume": "size",
    "vol": "size", "lots": "size",
    "side": "side", "aggressor": "side", "aggressor_side": "side",
    "direction": "side", "buysell": "side", "trade_sign": "side",
    "bid": "bid", "bid_price": "bid",
    "ask": "ask", "ask_price": "ask", "offer": "ask",
}

# Values that mean "buy aggressor" / "sell aggressor" when the side column is
# textual/coded rather than already a signed number.
_BUY_TOKENS = {"buy", "b", "ask", "lift", "1", "+1", "true", "up"}
_SELL_TOKENS = {"sell", "s", "bid", "hit", "-1", "false", "down"}


def load_ticks(
    path: str | Path,
    input_timezone: str = "UTC",
    session_timezone: str = "America/New_York",
) -> pd.DataFrame:
    """Load a tick/trade CSV into a clean, tz-aware DataFrame.

    Output columns: ``price`` (float), ``size`` (float, >= 0), ``side``
    (int8: ``+1`` buy aggressor, ``-1`` sell aggressor, ``0`` unknown).

    Aggressor side is resolved, in priority order:

    1. An explicit side/aggressor/direction column (text, +1/-1, or bool).
    2. ``bid``/``ask`` columns present alongside price: classified by which
       side of the quoted spread the trade printed on (the standard Lee-Ready
       style classification), with midpoint trades left as side ``0``.
    3. Otherwise ``0`` (unknown) — never guessed from price movement alone,
       which would silently fabricate order-flow that was never observed.
    """
    path = Path(path)
    if not path.exists():
        raise FileNotFoundError(f"Tick file not found: {path}")

    df = pd.read_csv(path)
    df = _normalize_columns(df)
    df = _parse_timestamp(df, input_timezone, session_timezone)
    df = _resolve_side(df)
    df = _coerce_and_sort(df)
    df.attrs["source_file"] = str(path)
    return df


def load_tick_directory(directory: str | Path, pattern: str = "*.csv", **kwargs) -> pd.DataFrame:
    """Load and concatenate every tick CSV matching ``pattern`` in ``directory``."""
    directory = Path(directory)
    files = sorted(directory.glob(pattern))
    if not files:
        raise FileNotFoundError(f"No files matching '{pattern}' found in {directory}")
    frames = [load_ticks(f, **kwargs) for f in files]
    combined = pd.concat(frames).sort_index()
    return combined


# --------------------------------------------------------------------------- #
# Internals
# --------------------------------------------------------------------------- #


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    rename = {}
    for col in df.columns:
        key = str(col).strip().lower()
        if key in _COLUMN_ALIASES:
            rename[col] = _COLUMN_ALIASES[key]
    df = df.rename(columns=rename)
    missing = [c for c in ("timestamp", "price", "size") if c not in df.columns]
    if missing:
        raise ValueError(
            f"Tick CSV is missing required column(s): {missing}. "
            f"Found columns: {list(df.columns)}. Expected a timestamp, price, "
            f"and size column (side/bid/ask optional)."
        )
    return df


def _parse_timestamp(df: pd.DataFrame, input_timezone: str, session_timezone: str) -> pd.DataFrame:
    # format="mixed": pandas' whole-column fast-path format inference locks
    # onto the FIRST row's shape (e.g. "with fractional seconds") and silently
    # fails (-> NaT, masquerading as unparseable) on rows that don't match it
    # exactly — such as an exact-second timestamp with no fractional part,
    # entirely plausible in a real tick feed. "mixed" parses each value on its
    # own terms instead of forcing one uniform format across the column.
    ts = pd.to_datetime(df["timestamp"], utc=False, errors="coerce", format="mixed")
    if ts.isna().any():
        raise ValueError(f"{int(ts.isna().sum())} tick timestamp(s) could not be parsed.")
    if ts.dt.tz is None:
        ts = ts.dt.tz_localize(input_timezone, ambiguous="infer", nonexistent="shift_forward")
    ts = ts.dt.tz_convert(session_timezone)
    df = df.drop(columns=["timestamp"])
    df.index = pd.DatetimeIndex(ts, name="timestamp")
    return df


def _resolve_side(df: pd.DataFrame) -> pd.DataFrame:
    n = len(df)
    side = np.zeros(n, dtype=np.int8)

    if "side" in df.columns:
        raw = df["side"]
        numeric = pd.to_numeric(raw, errors="coerce")
        has_numeric = numeric.notna()
        side[has_numeric.to_numpy()] = np.sign(numeric[has_numeric].to_numpy()).astype(np.int8)

        remaining = ~has_numeric
        if remaining.any():
            text = raw[remaining].astype(str).str.strip().str.lower()
            buy_mask = text.isin(_BUY_TOKENS)
            sell_mask = text.isin(_SELL_TOKENS)
            idx = np.flatnonzero(remaining.to_numpy())
            side[idx[buy_mask.to_numpy()]] = 1
            side[idx[sell_mask.to_numpy()]] = -1
    elif "bid" in df.columns and "ask" in df.columns:
        price = pd.to_numeric(df["price"], errors="coerce")
        bid = pd.to_numeric(df["bid"], errors="coerce")
        ask = pd.to_numeric(df["ask"], errors="coerce")
        mid = (bid + ask) / 2.0
        side = np.where(price > mid, 1, np.where(price < mid, -1, 0)).astype(np.int8)

    df = df.drop(columns=[c for c in ("bid", "ask") if c in df.columns])
    df["side"] = side
    return df


def _coerce_and_sort(df: pd.DataFrame) -> pd.DataFrame:
    df["price"] = pd.to_numeric(df["price"], errors="coerce")
    df["size"] = pd.to_numeric(df["size"], errors="coerce").clip(lower=0)
    df["side"] = df["side"].astype(np.int8)
    df = df.dropna(subset=["price", "size"])
    df = df[df["size"] > 0]
    df = df[["price", "size", "side"]].sort_index()
    return df
