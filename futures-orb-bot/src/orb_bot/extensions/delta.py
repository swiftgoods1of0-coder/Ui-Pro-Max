"""Order-flow *delta* confirmation filter (stub).

Delta = buy (at-ask) volume minus sell (at-bid) volume. A breakout backed by
positive delta (for longs) is higher quality than one on fading delta.

To make this real you'll need trade-level or bid/ask volume data, which bar
OHLCV doesn't carry. The intended path:

1. Extend the data loader to also load a delta series (or compute it from
   tick data).
2. Attach it to ``DayContext`` (e.g. ``context.day_df["delta"]``).
3. Replace the body of :meth:`accept` with your threshold logic.

Until then this filter is a transparent pass-through so it can be wired in and
tested without changing behaviour.
"""

from __future__ import annotations

from ..strategy.base import DayContext, Side, Signal


class DeltaFilter:
    name = "delta"

    def __init__(self, min_delta: float = 0.0, enabled: bool = False):
        self.min_delta = min_delta
        self.enabled = enabled

    def accept(self, signal: Signal, context: DayContext) -> bool:
        if not self.enabled:
            return True

        # --- fill this in once delta data is available ---
        # delta_col = context.day_df.get("delta")
        # if delta_col is None:
        #     return True
        # bar_delta = float(delta_col.loc[signal.timestamp])
        # signal.meta["entry_delta"] = bar_delta
        # if signal.side is Side.LONG:
        #     return bar_delta >= self.min_delta
        # return bar_delta <= -self.min_delta
        return True
