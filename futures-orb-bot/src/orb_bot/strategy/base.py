"""Core strategy abstractions.

Three pieces live here:

* :class:`Signal`     – a fully-specified trade plan (entry / stop / target).
* :class:`DayContext` – everything a strategy needs to reason about one day.
* :class:`Strategy`   – the interface the engine calls, plus the
  :class:`SignalFilter` protocol used to bolt on extra confirmation logic
  (delta, footprint, ML, ...) without editing the strategy itself.

Keeping the strategy and its filters behind these small interfaces is what makes
the system easy to expand: a new setup is a new :class:`Strategy`; a new
confirmation rule is a new :class:`SignalFilter`.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Protocol, runtime_checkable

import pandas as pd

from ..config import Config
from ..indicators.opening_range import OpeningRange
from ..indicators.volume_profile import VolumeProfile


class Side(str, Enum):
    LONG = "long"
    SHORT = "short"

    @property
    def sign(self) -> int:
        """+1 for long, -1 for short — handy for direction-agnostic math."""
        return 1 if self is Side.LONG else -1


@dataclass
class Signal:
    """A ready-to-trade plan produced by a strategy.

    The strategy is responsible for a coherent ``entry``/``stop``/``target``
    (stop on the losing side, target on the winning side). The engine handles
    sizing, costs, and fill simulation.
    """

    timestamp: pd.Timestamp
    side: Side
    entry: float
    stop: float
    target: float
    mode: str                       # "breakout" | "sweep_reclaim" | custom
    reason: str = ""
    meta: Dict[str, Any] = field(default_factory=dict)

    @property
    def risk_points(self) -> float:
        """Absolute distance from entry to stop, in points."""
        return abs(self.entry - self.stop)

    @property
    def reward_points(self) -> float:
        return abs(self.target - self.entry)

    @property
    def planned_rr(self) -> float:
        return self.reward_points / self.risk_points if self.risk_points else 0.0

    def is_valid(self) -> bool:
        """Sanity-check that stop/target sit on the correct sides of entry."""
        if self.risk_points <= 0:
            return False
        if self.side is Side.LONG:
            return self.stop < self.entry < self.target
        return self.target < self.entry < self.stop


@dataclass
class DayContext:
    """Read-only bundle of everything a strategy needs for a single session."""

    date: pd.Timestamp
    day_df: pd.DataFrame                 # all bars for the day
    entry_window: pd.DataFrame           # bars eligible for entries
    opening_range: OpeningRange
    volume_profile: Optional[VolumeProfile]
    config: Config


@runtime_checkable
class SignalFilter(Protocol):
    """A pluggable confirmation gate applied to every candidate signal.

    Return ``True`` to let a signal through, ``False`` to veto it. This is the
    seam where delta / footprint / ML confirmation slots in. See
    ``orb_bot/extensions`` for ready-to-fill stubs.
    """

    name: str

    def accept(self, signal: Signal, context: DayContext) -> bool:
        ...


class Strategy(Protocol):
    """The interface the backtesting engine depends on."""

    def generate(self, context: DayContext) -> List[Signal]:
        """Return candidate signals for the day, in chronological order."""
        ...
