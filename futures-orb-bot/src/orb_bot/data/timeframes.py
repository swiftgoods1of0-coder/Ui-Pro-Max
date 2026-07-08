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
from typing import Dict, List, Optional

import pandas as pd

from .loader import resample_ohlcv

logger = logging.getLogger("orb_bot.data.timeframes")


@dataclass
class MarketData:
    """A symbol's bars across one or more aligned timeframes."""

    symbol: str
    primary_timeframe: str
    frames: Dict[str, pd.DataFrame] = field(default_factory=dict)

    @property
    def primary(self) -> pd.DataFrame:
        return self.frames[self.primary_timeframe]

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
        """
        frame = self.timeframe(tf)
        closed = frame[frame.index <= ts]
        if closed.empty:
            return None
        return closed.iloc[-1]


def build_market_data(
    df: pd.DataFrame,
    symbol: str,
    primary_timeframe: str = "1min",
    timeframes: Optional[List[str]] = None,
) -> MarketData:
    """Build a :class:`MarketData` from a base (finest) OHLCV frame.

    The base frame is assumed to already be at ``primary_timeframe`` (or finer).
    Every requested timeframe is produced by resampling; the primary itself is
    stored as-is.
    """
    timeframes = timeframes or [primary_timeframe]
    frames: Dict[str, pd.DataFrame] = {}
    for tf in dict.fromkeys([primary_timeframe, *timeframes]):  # de-dupe, keep order
        if tf == primary_timeframe:
            frames[tf] = df
        else:
            frames[tf] = resample_ohlcv(df, tf)
        logger.debug("Built timeframe %s: %d bars", tf, len(frames[tf]))
    return MarketData(symbol=symbol, primary_timeframe=primary_timeframe, frames=frames)
