"""Session-VWAP mean-reversion strategy.

A deliberately different setup from the ORB, included to demonstrate that the
engine runs arbitrary strategies side by side with no special-casing.

Idea: intraday price tends to revert to the session VWAP. When price stretches a
configurable distance *away* from VWAP and then prints a reversal bar back
toward it, fade the extension:

* **Long**  – close is ``entry_stretch_ticks`` below VWAP and the bar closed up.
* **Short** – close is ``entry_stretch_ticks`` above VWAP and the bar closed down.

The stop sits beyond the reversal bar's extreme; the target is a standard R
multiple. A ``warmup_bars`` guard skips the first few bars while VWAP is noisy.

All parameters come from ``params`` — see ``config.yaml``.
"""

from __future__ import annotations

from typing import List, Optional

import numpy as np
import pandas as pd

from .base import DayContext, Side, Signal, StrategyBase
from .registry import register


@register("vwap_reversion")
class VWAPReversionStrategy(StrategyBase):
    name = "vwap_reversion"

    def _cfg(self):
        c = self.config
        return dict(
            stretch_ticks=self.param("entry_stretch_ticks", 8.0),
            warmup_bars=int(self.param("warmup_bars", 15)),
            reward=self.param("reward_multiple", c.risk.reward_multiple),
            stop_buf_ticks=self.param("stop_buffer_ticks", c.risk.stop_buffer_ticks),
            max_signals=int(self.param("max_signals_per_day", 3)),
        )

    def generate(self, context: DayContext) -> List[Signal]:
        p = self._cfg()
        tick = self.config.instrument.tick_size
        window = context.session_window
        if len(window) <= p["warmup_bars"]:
            return []

        vwap = _session_vwap(window)
        stretch = p["stretch_ticks"] * tick
        stop_buf = p["stop_buf_ticks"] * tick

        signals: List[Signal] = []
        for i, (ts, bar) in enumerate(window.iterrows()):
            if i < p["warmup_bars"]:
                continue
            vw = vwap.iloc[i]
            o, h, l, c = bar["open"], bar["high"], bar["low"], bar["close"]

            side: Optional[Side] = None
            if c < vw - stretch and c > o:            # stretched below, turning up
                side = Side.LONG
            elif c > vw + stretch and c < o:          # stretched above, turning down
                side = Side.SHORT
            if side is None:
                continue

            if side is Side.LONG:
                stop = l - stop_buf
            else:
                stop = h + stop_buf
            risk = abs(c - stop)
            if risk <= 0:
                continue
            target = c + p["reward"] * risk if side is Side.LONG else c - p["reward"] * risk

            sig = Signal(
                timestamp=ts, side=side, entry=float(c), stop=float(stop),
                target=float(target), mode="vwap_reversion", strategy_id=self.id,
                reason=f"vwap_reversion {side.value} @ {c:.2f} (vwap {vw:.2f})",
                meta={"vwap": float(vw), "stretch_points": float(abs(c - vw))},
            )
            if not sig.is_valid():
                continue
            if context.decision_log is not None:
                context.decision_log.signal(
                    self.id, ts, reason="vwap_reversion", side=side.value,
                    entry=round(c, 4), vwap=round(float(vw), 4),
                )
            if self.apply_filters(sig, context):
                signals.append(sig)
            if len(signals) >= p["max_signals"]:
                break
        return signals


def _session_vwap(window: pd.DataFrame) -> pd.Series:
    typical = (window["high"] + window["low"] + window["close"]) / 3.0
    vol = window["volume"].clip(lower=0)
    cum_vol = vol.cumsum().replace(0, np.nan)
    vwap = (typical * vol).cumsum() / cum_vol
    return vwap.ffill().fillna(typical)
