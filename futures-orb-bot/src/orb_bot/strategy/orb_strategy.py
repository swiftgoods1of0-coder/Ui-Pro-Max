"""Opening-range breakout / liquidity-sweep strategy.

Two setups traded around a configurable opening-range box (default 08:00–08:15):

**Breakout** — a bar *closes* beyond the OR high (long) or low (short) by at
least ``breakout_buffer_ticks``.

**Sweep / reclaim** — price pokes beyond the OR level by at least
``sweep_min_ticks`` (grabbing resting liquidity), then *reclaims* by closing
back inside the range → fade the sweep.

The volume-profile POC is available as optional confluence. All knobs are read
from ``params`` (with sensible fallbacks to the legacy config blocks), so the
same class can be instantiated multiple times with different settings.
"""

from __future__ import annotations

from typing import List, Optional

import pandas as pd

from ..indicators.opening_range import compute_opening_range
from ..utils.timeparse import parse_hhmm
from .base import DayContext, Side, Signal, StrategyBase
from .registry import register


@register("orb")
class ORBStrategy(StrategyBase):
    name = "orb"

    # -- resolved params ----------------------------------------------------

    def _cfg(self):
        c = self.config
        return dict(
            or_start=self.param("opening_range_start", c.opening_range.start),
            or_end=self.param("opening_range_end", c.opening_range.end),
            modes=set(self.param("modes", c.strategy.modes)),
            require_poc=self.param("require_poc_confluence", c.strategy.require_poc_confluence),
            breakout_buf_ticks=self.param("breakout_buffer_ticks", c.strategy.breakout_buffer_ticks),
            sweep_ticks=self.param("sweep_min_ticks", c.strategy.sweep_min_ticks),
            reward=self.param("reward_multiple", c.risk.reward_multiple),
            stop_style=self.param("stop_style", c.risk.stop_style),
            stop_buf_ticks=self.param("stop_buffer_ticks", c.risk.stop_buffer_ticks),
        )

    # -- signal generation --------------------------------------------------

    def generate(self, context: DayContext) -> List[Signal]:
        p = self._cfg()
        tick = self.config.instrument.tick_size

        opening_range = compute_opening_range(context.day_df, p["or_start"], p["or_end"])
        if opening_range is None:
            return []

        or_end_t = parse_hhmm(p["or_end"])
        entry_window = context.session_window[
            context.session_window.index.time >= or_end_t
        ]
        if entry_window.empty:
            return []

        orh, orl = opening_range.high, opening_range.low
        breakout_buf = p["breakout_buf_ticks"] * tick
        sweep_dist = p["sweep_ticks"] * tick

        signals: List[Signal] = []
        swept_below = False
        sweep_low_extreme = orl
        swept_above = False
        sweep_high_extreme = orh

        for ts, bar in entry_window.iterrows():
            high, low, close = bar["high"], bar["low"], bar["close"]

            if "breakout" in p["modes"]:
                if close >= orh + breakout_buf:
                    signals.append(self._plan(ts, Side.LONG, close, orh, orl, "breakout", orh, p, context))
                elif close <= orl - breakout_buf:
                    signals.append(self._plan(ts, Side.SHORT, close, orh, orl, "breakout", orl, p, context))

            if "sweep_reclaim" in p["modes"]:
                if low <= orl - sweep_dist:
                    swept_below = True
                    sweep_low_extreme = min(sweep_low_extreme, low)
                elif swept_below and close > orl:
                    signals.append(self._plan(ts, Side.LONG, close, orh, orl, "sweep_reclaim", sweep_low_extreme, p, context))
                    swept_below = False
                    sweep_low_extreme = orl

                if high >= orh + sweep_dist:
                    swept_above = True
                    sweep_high_extreme = max(sweep_high_extreme, high)
                elif swept_above and close < orh:
                    signals.append(self._plan(ts, Side.SHORT, close, orh, orl, "sweep_reclaim", sweep_high_extreme, p, context))
                    swept_above = False
                    sweep_high_extreme = orh

        signals = [s for s in signals if s is not None and s.is_valid()]
        kept = []
        for s in signals:
            if context.decision_log is not None:
                context.decision_log.signal(
                    self.id, s.timestamp, reason=s.mode,
                    side=s.side.value, entry=round(s.entry, 4),
                    stop=round(s.stop, 4), target=round(s.target, 4),
                )
            if self.apply_filters(s, context):
                kept.append(s)
        kept.sort(key=lambda s: s.timestamp)
        return kept

    # -- plan construction --------------------------------------------------

    def _plan(self, ts, side, entry, orh, orl, mode, ref_extreme, p, context) -> Optional[Signal]:
        tick = self.config.instrument.tick_size
        stop_buf = p["stop_buf_ticks"] * tick

        poc = context.volume_profile.poc if context.volume_profile else None
        if p["require_poc"] and poc is not None:
            if side is Side.LONG and entry < poc:
                return None
            if side is Side.SHORT and entry > poc:
                return None

        if p["stop_style"] == "sweep":
            stop = (ref_extreme - stop_buf) if side is Side.LONG else (ref_extreme + stop_buf)
        else:
            stop = (orl - stop_buf) if side is Side.LONG else (orh + stop_buf)

        risk = abs(entry - stop)
        if risk <= 0:
            return None
        target = entry + p["reward"] * risk if side is Side.LONG else entry - p["reward"] * risk

        meta = {
            "orh": orh, "orl": orl, "or_mid": (orh + orl) / 2.0,
            "poc": poc,
            "poc_distance": (entry - poc) if poc is not None else None,
            "ref_extreme": ref_extreme,
        }
        return Signal(
            timestamp=ts, side=side, entry=float(entry), stop=float(stop),
            target=float(target), mode=mode, strategy_id=self.id,
            reason=f"{mode} {side.value} @ {entry:.2f}", meta=meta,
        )
