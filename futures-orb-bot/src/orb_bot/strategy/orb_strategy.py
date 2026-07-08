"""The opening-range breakout / liquidity-sweep strategy.

Two setups, both traded around the 08:00–08:15 opening-range box:

**Breakout** — a bar *closes* beyond the OR high (long) or low (short) by at
least ``breakout_buffer_ticks``. This is the momentum expression of the range.

**Sweep / reclaim** — price first pokes beyond the OR level far enough to grab
the liquidity resting there (``sweep_min_ticks``), then *reclaims* by closing
back inside the range. A sweep below the low that reclaims goes long; a sweep
above the high that reclaims goes short. This is the "stop-run reversal"
expression of the range.

The volume-profile POC is available as optional confluence: with
``require_poc_confluence`` enabled, longs must be above the POC and shorts
below it. The POC distance is always attached to each signal's ``meta`` so
downstream filters / analytics can use it even when confluence isn't enforced.

Stops and targets come straight from the risk config, so the whole risk model
is data-driven and easy to sweep in optimisation.
"""

from __future__ import annotations

from typing import List, Optional, Sequence

import pandas as pd

from ..config import Config
from .base import DayContext, Side, Signal, SignalFilter


class ORBStrategy:
    """Opening-range breakout + sweep/reclaim strategy.

    Parameters
    ----------
    config:
        The full bot configuration.
    filters:
        Optional confirmation gates applied to every candidate signal. Any
        filter returning ``False`` vetoes the signal. This is the extension
        point for delta / footprint / ML confirmation.
    """

    def __init__(self, config: Config, filters: Optional[Sequence[SignalFilter]] = None):
        self.config = config
        self.filters: List[SignalFilter] = list(filters or [])

    # -- public API ---------------------------------------------------------

    def generate(self, context: DayContext) -> List[Signal]:
        modes = set(self.config.strategy.modes)
        tick = self.config.instrument.tick_size

        orh = context.opening_range.high
        orl = context.opening_range.low
        breakout_buf = self.config.strategy.breakout_buffer_ticks * tick
        sweep_dist = self.config.strategy.sweep_min_ticks * tick

        signals: List[Signal] = []

        # Sweep/reclaim needs to remember how far price extended beyond a level
        # before reclaiming, so the stop can sit at that extreme.
        swept_below = False
        sweep_low_extreme = orl
        swept_above = False
        sweep_high_extreme = orh

        for ts, bar in context.entry_window.iterrows():
            high, low, close = bar["high"], bar["low"], bar["close"]

            if "breakout" in modes:
                if close >= orh + breakout_buf:
                    signals.append(
                        self._build_signal(ts, Side.LONG, close, orh, orl, "breakout",
                                           ref_extreme=orh, context=context)
                    )
                elif close <= orl - breakout_buf:
                    signals.append(
                        self._build_signal(ts, Side.SHORT, close, orh, orl, "breakout",
                                           ref_extreme=orl, context=context)
                    )

            if "sweep_reclaim" in modes:
                # --- track / fire the bullish sweep below the low ---
                if low <= orl - sweep_dist:
                    swept_below = True
                    sweep_low_extreme = min(sweep_low_extreme, low)
                elif swept_below and close > orl:
                    signals.append(
                        self._build_signal(ts, Side.LONG, close, orh, orl,
                                           "sweep_reclaim", ref_extreme=sweep_low_extreme,
                                           context=context)
                    )
                    swept_below = False
                    sweep_low_extreme = orl

                # --- track / fire the bearish sweep above the high ---
                if high >= orh + sweep_dist:
                    swept_above = True
                    sweep_high_extreme = max(sweep_high_extreme, high)
                elif swept_above and close < orh:
                    signals.append(
                        self._build_signal(ts, Side.SHORT, close, orh, orl,
                                           "sweep_reclaim", ref_extreme=sweep_high_extreme,
                                           context=context)
                    )
                    swept_above = False
                    sweep_high_extreme = orh

        # Drop malformed plans and anything a filter vetoes.
        signals = [s for s in signals if s is not None and s.is_valid()]
        signals = [s for s in signals if self._passes_filters(s, context)]
        signals.sort(key=lambda s: s.timestamp)
        return signals

    # -- internals ----------------------------------------------------------

    def _build_signal(
        self,
        ts: pd.Timestamp,
        side: Side,
        entry: float,
        orh: float,
        orl: float,
        mode: str,
        ref_extreme: float,
        context: DayContext,
    ) -> Optional[Signal]:
        risk = self.config.risk
        tick = self.config.instrument.tick_size
        stop_buf = risk.stop_buffer_ticks * tick

        # --- POC confluence gate (optional) ---
        poc = context.volume_profile.poc if context.volume_profile else None
        if self.config.strategy.require_poc_confluence and poc is not None:
            if side is Side.LONG and entry < poc:
                return None
            if side is Side.SHORT and entry > poc:
                return None

        # --- stop placement ---
        if risk.stop_style == "sweep":
            # Tight stop just beyond the breakout level / sweep extreme.
            stop = (ref_extreme - stop_buf) if side is Side.LONG else (ref_extreme + stop_buf)
        else:  # "range" — opposite side of the box
            stop = (orl - stop_buf) if side is Side.LONG else (orh + stop_buf)

        risk_points = abs(entry - stop)
        if risk_points <= 0:
            return None

        target = (
            entry + risk.reward_multiple * risk_points
            if side is Side.LONG
            else entry - risk.reward_multiple * risk_points
        )

        meta = {
            "orh": orh,
            "orl": orl,
            "or_mid": (orh + orl) / 2.0,
            "poc": poc,
            "poc_distance": (entry - poc) if poc is not None else None,
            "ref_extreme": ref_extreme,
        }
        reason = f"{mode} {side.value} @ {entry:.2f} (stop {stop:.2f}, tgt {target:.2f})"
        return Signal(
            timestamp=ts,
            side=side,
            entry=float(entry),
            stop=float(stop),
            target=float(target),
            mode=mode,
            reason=reason,
            meta=meta,
        )

    def _passes_filters(self, signal: Signal, context: DayContext) -> bool:
        for f in self.filters:
            if not f.accept(signal, context):
                signal.meta.setdefault("rejected_by", []).append(f.name)
                return False
        return True
