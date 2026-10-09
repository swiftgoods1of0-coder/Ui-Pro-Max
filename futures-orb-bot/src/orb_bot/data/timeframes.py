"""Multi-timeframe support.

Strategies frequently need more than one resolution: a 1-minute series to
detect the opening range and manage intrabar exits, plus 5- or 15-minute bars
for higher-timeframe bias. :class:`MarketData` holds a primary timeframe and a
set of derived, aligned timeframes built once and shared across strategies.

Higher timeframes are produced by resampling the primary series, so a single
clean 1-minute file yields every coarser view with no extra data files.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

import pandas as pd

from .loader import resample_ohlcv

logger = logging.getLogger("orb_bot.data.timeframes")


@dataclass
class MarketData:
    """A symbol's bars across one or more aligned timeframes.

    ``footprint``, when present, holds one
    :class:`~orb_bot.footprint.FootprintBar` per **primary-timeframe** bar —
    real per-price-level bid/ask volume built from tick data (see
    :func:`orb_bot.footprint.build_footprint_series` and
    :mod:`orb_bot.data.ticks`). It's optional: most data you'll have is
    OHLCV-only, and everything works without it — the order-flow analyzers
    fall back to an OHLCV approximation. When it is present, the platform
    prefers it, since it's the real thing instead of an estimate.
    """

    symbol: str
    primary_timeframe: str
    frames: Dict[str, pd.DataFrame] = field(default_factory=dict)
    footprint: Optional[Dict[pd.Timestamp, Any]] = None

    @property
    def primary(self) -> pd.DataFrame:
        return self.frames[self.primary_timeframe]

    @property
    def has_footprint(self) -> bool:
        return bool(self.footprint)

    def timeframe(self, tf: str) -> pd.DataFrame:
        if tf not in self.frames:
            raise KeyError(
                f"Timeframe '{tf}' not available. Have: {sorted(self.frames)}"
            )
        return self.frames[tf]

    def htf_bar_asof(self, tf: str, ts: pd.Timestamp) -> Optional[pd.Series]:
        """Return the most recent *closed* ``tf`` bar at or before ``ts``.

        This is the look-ahead-safe way for a strategy to read a higher
        timeframe: it never returns a bar that hasn't finished forming yet.

        Bars are labelled by their **start** time (see :func:`resample_ohlcv`,
        ``label="left"``), so a bar is only closed once a full period has
        elapsed from its start — e.g. a 15-minute bar starting at 09:30 isn't
        closed until 09:45, even though its timestamp (09:30) is `<= ts` for
        any ``ts`` in between. The one exception is the primary timeframe
        itself: by this codebase's convention (see ``AnalysisContext``, the
        backtest engine), the bar *at* ``ts`` is treated as fully known once
        reached — that's the granularity the engine walks bar-by-bar on, and
        every other look-ahead-safety check in the platform relies on that
        same convention.
        """
        frame = self.timeframe(tf)
        if tf == self.primary_timeframe:
            closed = frame[frame.index <= ts]
        else:
            offset = pd.tseries.frequencies.to_offset(tf)
            bar_end = frame.index + offset
            closed = frame[bar_end <= ts]
        if closed.empty:
            return None
        return closed.iloc[-1]


def build_market_data(
    df: pd.DataFrame,
    symbol: str,
    primary_timeframe: str = "1min",
    timeframes: Optional[List[str]] = None,
    ticks: Optional[pd.DataFrame] = None,
    tick_size: Optional[float] = None,
) -> MarketData:
    """Build a :class:`MarketData` from a base (finest) OHLCV frame.

    The base frame is assumed to already be at ``primary_timeframe`` (or finer).
    Every requested timeframe is produced by resampling; the primary itself is
    stored as-is.

    Pass ``ticks`` (from :func:`orb_bot.data.ticks.load_ticks`) and
    ``tick_size`` to also build real per-price-level footprint bars — one per
    primary-timeframe bar — attached as ``MarketData.footprint``. Without
    ticks, ``footprint`` stays ``None`` and the platform falls back to the
    OHLCV-approximation order-flow analyzers.
    """
    timeframes = timeframes or [primary_timeframe]
    frames: Dict[str, pd.DataFrame] = {}
    for tf in dict.fromkeys([primary_timeframe, *timeframes]):  # de-dupe, keep order
        if tf == primary_timeframe:
            frames[tf] = df
        else:
            frames[tf] = resample_ohlcv(df, tf)
        logger.debug("Built timeframe %s: %d bars", tf, len(frames[tf]))

    footprint = None
    if ticks is not None and not ticks.empty:
        if tick_size is None:
            raise ValueError("tick_size is required when ticks are provided")
        from ..footprint import build_footprint_series

        footprint = build_footprint_series(ticks, primary_timeframe, tick_size)
        logger.info("Built %d footprint bars from %d ticks.", len(footprint), len(ticks))

    return MarketData(symbol=symbol, primary_timeframe=primary_timeframe,
                      frames=frames, footprint=footprint)
