"""Volume profile: Point of Control (POC) and value area.

A volume profile buckets traded volume by price rather than by time. The bucket
holding the most volume is the **Point of Control (POC)** — the price the market
spent the most effort at, and a natural magnet / support-resistance level. The
**value area** is the contiguous band of prices around the POC that contains a
target share (default 70%) of total volume.

Because bar data has no intra-bar price/volume distribution, volume for each bar
is spread evenly across the price buckets its high–low range touches. This is a
standard, transparent approximation. When you later add true footprint / delta
data (see ``extensions/``), you can replace :func:`build_volume_profile` with a
tick-accurate implementation without changing any caller.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import numpy as np
import pandas as pd


@dataclass(frozen=True)
class VolumeProfile:
    """A price/volume distribution and the levels derived from it."""

    poc: float                       # price of the highest-volume bucket
    value_area_high: float
    value_area_low: float
    bucket_edges: np.ndarray         # len == bins + 1
    bucket_volume: np.ndarray        # len == bins
    value_area_pct: float

    @property
    def bucket_centers(self) -> np.ndarray:
        return (self.bucket_edges[:-1] + self.bucket_edges[1:]) / 2.0


def build_volume_profile(
    df: pd.DataFrame,
    bins: int = 50,
    value_area_pct: float = 0.70,
) -> Optional[VolumeProfile]:
    """Build a volume profile from OHLCV bars.

    Parameters
    ----------
    df:
        OHLCV bars (any timeframe) to profile.
    bins:
        Number of equal-width price buckets between the range low and high.
    value_area_pct:
        Fraction of total volume the value area should contain (0–1).

    Returns
    -------
    VolumeProfile or None
        ``None`` if there is not enough data / volume to build a profile.
    """
    if df.empty or bins < 1:
        return None

    price_low = float(df["low"].min())
    price_high = float(df["high"].max())
    if not np.isfinite(price_low) or not np.isfinite(price_high):
        return None
    if price_high <= price_low:
        # Degenerate range (flat prices) — POC is that single price.
        return VolumeProfile(
            poc=price_high,
            value_area_high=price_high,
            value_area_low=price_low,
            bucket_edges=np.array([price_low, price_high]),
            bucket_volume=np.array([float(df["volume"].sum())]),
            value_area_pct=value_area_pct,
        )

    edges = np.linspace(price_low, price_high, bins + 1)
    volume = np.zeros(bins, dtype=float)

    lows = df["low"].to_numpy(dtype=float)
    highs = df["high"].to_numpy(dtype=float)
    vols = df["volume"].to_numpy(dtype=float)

    # Spread each bar's volume across the buckets its range overlaps.
    for lo, hi, vol in zip(lows, highs, vols):
        if vol <= 0:
            continue
        first = int(np.searchsorted(edges, lo, side="right") - 1)
        last = int(np.searchsorted(edges, hi, side="right") - 1)
        first = max(0, min(first, bins - 1))
        last = max(0, min(last, bins - 1))
        n = last - first + 1
        volume[first : last + 1] += vol / n

    if volume.sum() <= 0:
        return None

    poc_idx = int(np.argmax(volume))
    centers = (edges[:-1] + edges[1:]) / 2.0
    poc = float(centers[poc_idx])

    va_low_idx, va_high_idx = _value_area_bounds(volume, poc_idx, value_area_pct)

    return VolumeProfile(
        poc=poc,
        value_area_high=float(edges[va_high_idx + 1]),
        value_area_low=float(edges[va_low_idx]),
        bucket_edges=edges,
        bucket_volume=volume,
        value_area_pct=value_area_pct,
    )


def _value_area_bounds(
    volume: np.ndarray, poc_idx: int, value_area_pct: float
) -> tuple[int, int]:
    """Grow a band outward from the POC until it holds ``value_area_pct``.

    Standard approach: from the POC, repeatedly annex whichever neighbouring
    bucket (above or below the current band) holds more volume.
    """
    total = volume.sum()
    target = total * value_area_pct
    lo = hi = poc_idx
    acc = volume[poc_idx]
    n = len(volume)

    while acc < target and (lo > 0 or hi < n - 1):
        below = volume[lo - 1] if lo > 0 else -1.0
        above = volume[hi + 1] if hi < n - 1 else -1.0
        if above >= below:
            hi += 1
            acc += volume[hi]
        else:
            lo -= 1
            acc += volume[lo]
    return lo, hi
