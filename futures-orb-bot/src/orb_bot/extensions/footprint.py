"""Footprint / bid-ask imbalance confirmation filter (stub).

A footprint chart shows traded volume at each price *within* a bar, split by
bid and ask. It reveals absorption, stacked imbalances, and unfinished
auctions — powerful confirmation for sweep/reclaim setups in particular.

Bar OHLCV can't express this; you need per-price volume (from tick data or a
footprint feed). The intended path mirrors the delta filter:

1. Build a per-bar footprint structure (price -> (bid_vol, ask_vol)).
2. Expose it on ``DayContext``.
3. Implement absorption / imbalance checks in :meth:`accept`.

Ships as a pass-through until then.
"""

from __future__ import annotations

from ..strategy.base import DayContext, Signal


class FootprintFilter:
    name = "footprint"

    def __init__(self, min_imbalance_ratio: float = 3.0, enabled: bool = False):
        self.min_imbalance_ratio = min_imbalance_ratio
        self.enabled = enabled

    def accept(self, signal: Signal, context: DayContext) -> bool:
        if not self.enabled:
            return True

        # --- fill this in once footprint data is available ---
        # footprint = context.day_df.attrs.get("footprint", {}).get(signal.timestamp)
        # if footprint is None:
        #     return True
        # ... check stacked imbalances / absorption at the entry level ...
        return True
