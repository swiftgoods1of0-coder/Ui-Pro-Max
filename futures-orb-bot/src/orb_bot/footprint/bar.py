"""The footprint bar: real per-price-level bid/ask volume built from ticks.

This is the actual depth-aware structure — not an approximation. Each
:class:`FootprintBar` covers one OHLCV-style bar period and breaks its volume
down by price level (one row per tick-size increment the bar touched), split
into:

* ``ask_volume``  — volume traded by **buyers lifting the offer** (aggressive buying)
* ``bid_volume``  — volume traded by **sellers hitting the bid** (aggressive selling)
* ``unknown_volume`` — ticks whose aggressor side couldn't be classified

This is what lets :mod:`orb_bot.footprint.signals` answer the real question —
*at which exact price did a side get run over, and who stepped in* — instead of
inferring it from a candle's overall shape.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

import numpy as np
import pandas as pd


@dataclass(frozen=True)
class PriceLevel:
    """Aggressor-split volume at a single price within one bar."""

    price: float
    bid_volume: float        # aggressive selling (hit the bid) at this price
    ask_volume: float        # aggressive buying (lifted the offer) at this price
    unknown_volume: float = 0.0

    @property
    def total_volume(self) -> float:
        return self.bid_volume + self.ask_volume + self.unknown_volume

    @property
    def delta(self) -> float:
        """Signed aggressor imbalance at this level: +buyers, −sellers."""
        return self.ask_volume - self.bid_volume

    @property
    def imbalance_ratio(self) -> float:
        """Dominant side's share of *classified* (non-unknown) volume, 0.5–1.0.

        0.5 = perfectly balanced; 1.0 = entirely one-sided. Returns 0.5 when
        there's no classified volume to compare.
        """
        classified = self.bid_volume + self.ask_volume
        if classified <= 0:
            return 0.5
        return max(self.bid_volume, self.ask_volume) / classified


@dataclass(frozen=True)
class FootprintBar:
    """One bar's full depth: OHLC plus a per-price-level volume breakdown."""

    timestamp: pd.Timestamp       # bar start (left-labelled, matches resample_ohlcv)
    tick_size: float
    open: float
    high: float
    low: float
    close: float
    levels: List[PriceLevel] = field(default_factory=list)   # sorted ascending by price

    # -- bar-level aggregates ------------------------------------------------

    @property
    def total_volume(self) -> float:
        return sum(l.total_volume for l in self.levels)

    @property
    def buy_volume(self) -> float:
        """Total aggressive-buy (ask-lifted) volume across every level."""
        return sum(l.ask_volume for l in self.levels)

    @property
    def sell_volume(self) -> float:
        """Total aggressive-sell (bid-hit) volume across every level."""
        return sum(l.bid_volume for l in self.levels)

    @property
    def delta(self) -> float:
        return self.buy_volume - self.sell_volume

    @property
    def delta_pct(self) -> float:
        """Delta as a fraction of total classified volume, −1..+1."""
        classified = self.buy_volume + self.sell_volume
        return (self.delta / classified) if classified else 0.0

    @property
    def poc_price(self) -> Optional[float]:
        """The price level with the most total volume in this bar."""
        if not self.levels:
            return None
        return max(self.levels, key=lambda l: l.total_volume).price

    @property
    def n_trades_levels(self) -> int:
        return len(self.levels)

    # -- lookups --------------------------------------------------------------

    def level_at(self, price: float) -> Optional[PriceLevel]:
        for l in self.levels:
            if abs(l.price - price) < self.tick_size / 2:
                return l
        return None

    def level_at_high(self) -> Optional[PriceLevel]:
        return self.level_at(self.high)

    def level_at_low(self) -> Optional[PriceLevel]:
        return self.level_at(self.low)

    def to_frame(self) -> pd.DataFrame:
        """Tabular view of the footprint — handy for inspection/export."""
        return pd.DataFrame(
            {
                "price": [l.price for l in self.levels],
                "bid_volume": [l.bid_volume for l in self.levels],
                "ask_volume": [l.ask_volume for l in self.levels],
                "delta": [l.delta for l in self.levels],
                "total_volume": [l.total_volume for l in self.levels],
            }
        ).sort_values("price", ascending=False).reset_index(drop=True)


# --------------------------------------------------------------------------- #
# Builders
# --------------------------------------------------------------------------- #


def build_footprint_bar(
    ticks: pd.DataFrame, bar_start: pd.Timestamp, bar_end: pd.Timestamp, tick_size: float,
) -> Optional[FootprintBar]:
    """Aggregate ticks in ``[bar_start, bar_end)`` into one :class:`FootprintBar`."""
    window = ticks[(ticks.index >= bar_start) & (ticks.index < bar_end)]
    if window.empty:
        return None
    return _bar_from_window(window, bar_start, tick_size)


def build_footprint_series(
    ticks: pd.DataFrame, bar_freq: str, tick_size: float,
) -> Dict[pd.Timestamp, FootprintBar]:
    """Build a :class:`FootprintBar` for every bar period covered by ``ticks``.

    Vectorized over the whole tick set in one pass (a single groupby), rather
    than looping and re-scanning per bar — this matters because a real tick
    feed can be orders of magnitude larger than the equivalent OHLCV series.
    """
    if ticks.empty:
        return {}

    bar_start = ticks.index.floor(bar_freq)
    price_level = np.round(ticks["price"].to_numpy() / tick_size) * tick_size
    side = ticks["side"].to_numpy()
    size = ticks["size"].to_numpy(dtype=float)

    agg = pd.DataFrame(
        {
            "bar": bar_start,
            "price": price_level,
            "buy_vol": np.where(side > 0, size, 0.0),
            "sell_vol": np.where(side < 0, size, 0.0),
            "unk_vol": np.where(side == 0, size, 0.0),
        }
    ).groupby(["bar", "price"], sort=True).sum()

    ohlc = ticks.groupby(bar_start)["price"].agg(["first", "max", "min", "last"])

    bars: Dict[pd.Timestamp, FootprintBar] = {}
    for bar_ts, group in agg.groupby(level="bar"):
        levels = [
            PriceLevel(price=float(p), bid_volume=float(row.sell_vol),
                      ask_volume=float(row.buy_vol), unknown_volume=float(row.unk_vol))
            for (_, p), row in group.iterrows()
        ]
        levels.sort(key=lambda l: l.price)
        o = ohlc.loc[bar_ts]
        bars[bar_ts] = FootprintBar(
            timestamp=bar_ts, tick_size=tick_size,
            open=float(o["first"]), high=float(o["max"]),
            low=float(o["min"]), close=float(o["last"]), levels=levels,
        )
    return bars


def _bar_from_window(window: pd.DataFrame, bar_start: pd.Timestamp, tick_size: float) -> FootprintBar:
    price_level = np.round(window["price"].to_numpy() / tick_size) * tick_size
    side = window["side"].to_numpy()
    size = window["size"].to_numpy(dtype=float)

    grouped = pd.DataFrame(
        {
            "price": price_level,
            "buy_vol": np.where(side > 0, size, 0.0),
            "sell_vol": np.where(side < 0, size, 0.0),
            "unk_vol": np.where(side == 0, size, 0.0),
        }
    ).groupby("price").sum()

    levels = [
        PriceLevel(price=float(p), bid_volume=float(row.sell_vol),
                  ask_volume=float(row.buy_vol), unknown_volume=float(row.unk_vol))
        for p, row in grouped.iterrows()
    ]
    levels.sort(key=lambda l: l.price)

    return FootprintBar(
        timestamp=bar_start, tick_size=tick_size,
        open=float(window["price"].iloc[0]), close=float(window["price"].iloc[-1]),
        high=float(window["price"].max()), low=float(window["price"].min()),
        levels=levels,
    )
