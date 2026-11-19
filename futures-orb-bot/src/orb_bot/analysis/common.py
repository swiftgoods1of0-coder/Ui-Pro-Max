"""Shared numeric helpers for the analyzers.

Kept in one place so every analyzer computes indicators the same way and so the
bar-based order-flow *approximations* are defined exactly once, clearly, and can
be swapped for tick-accurate versions later.

Order-flow note: real delta / imbalance / absorption need bid-ask (footprint)
data, which OHLCV bars don't carry. The proxies here use the **close-location
value** (where a bar closes within its range) to estimate the split of a bar's
volume between aggressive buyers and sellers. This is a standard, transparent
approximation — analyzers that rely on it set ``raw["approximation"] = True``.
"""

from __future__ import annotations

from typing import Tuple

import numpy as np
import pandas as pd

from .base import Bias, clamp, scale


# --------------------------------------------------------------------------- #
# Indicators
# --------------------------------------------------------------------------- #


def true_range(df: pd.DataFrame) -> pd.Series:
    prev_close = df["close"].shift(1)
    tr = pd.concat(
        [
            df["high"] - df["low"],
            (df["high"] - prev_close).abs(),
            (df["low"] - prev_close).abs(),
        ],
        axis=1,
    ).max(axis=1)
    return tr


def atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    """Wilder's Average True Range."""
    tr = true_range(df)
    return tr.ewm(alpha=1.0 / period, adjust=False, min_periods=1).mean()


def session_vwap(df: pd.DataFrame) -> pd.Series:
    """Cumulative session VWAP (typical price weighted by volume)."""
    typical = (df["high"] + df["low"] + df["close"]) / 3.0
    vol = df["volume"].clip(lower=0)
    cum_vol = vol.cumsum().replace(0, np.nan)
    vwap = (typical * vol).cumsum() / cum_vol
    return vwap.ffill().fillna(typical)


def close_location_value(df: pd.DataFrame) -> pd.Series:
    """Where each bar closes within its range: +1 at the high, −1 at the low."""
    rng = (df["high"] - df["low"]).replace(0, np.nan)
    clv = ((df["close"] - df["low"]) - (df["high"] - df["close"])) / rng
    return clv.fillna(0.0)


def bar_delta(df: pd.DataFrame) -> pd.Series:
    """Approximate per-bar delta (aggressive buy − sell volume).

    delta = close_location_value * volume. A bar that closes near its high is
    treated as mostly buyer-driven, near its low as seller-driven.
    """
    return close_location_value(df) * df["volume"].clip(lower=0)


def cumulative_delta(df: pd.DataFrame) -> pd.Series:
    return bar_delta(df).cumsum()


def relative_volume(df: pd.DataFrame, lookback: int = 20) -> float:
    """Current bar volume relative to the trailing average (RVOL)."""
    vol = df["volume"].clip(lower=0)
    if len(vol) < 2:
        return 1.0
    ref = vol.iloc[-lookback - 1 : -1] if len(vol) > lookback else vol.iloc[:-1]
    avg = ref.mean()
    if not avg or np.isnan(avg):
        return 1.0
    return float(vol.iloc[-1] / avg)


# --------------------------------------------------------------------------- #
# Confidence helpers
# --------------------------------------------------------------------------- #


def level_bias(
    price: float, level: float, width: float, deadband: float = 0.1
) -> Tuple[Bias, float]:
    """Bias + confidence from where ``price`` sits relative to a ``level``.

    ``width`` is the natural scale for "far" (e.g. value-area width or ATR).
    Within ``deadband × width`` of the level the read is neutral; beyond that,
    confidence grows with distance up to a saturating 50→100.
    """
    if width <= 0 or np.isnan(price) or np.isnan(level):
        return Bias.NEUTRAL, 0.0
    dist = price - level
    if abs(dist) < deadband * width:
        return Bias.NEUTRAL, 40.0 * (abs(dist) / (deadband * width))
    conf = 50.0 + 0.5 * scale(abs(dist), 0.0, width)
    return Bias.from_sign(dist), clamp(conf, 0.0, 100.0)
