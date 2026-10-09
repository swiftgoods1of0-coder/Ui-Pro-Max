"""Core strategy abstractions.

The design keeps strategies *plug-and-play*:

* :class:`Signal`      – a fully-specified trade plan (entry / stop / target).
* :class:`DayContext`  – the shared, strategy-agnostic view of one session
  (bars, timeframes, volume profile, config, decision log). Each strategy
  computes its *own* indicators from this; the engine never bakes in
  strategy-specific logic.
* :class:`StrategyBase`– the abstract base every strategy extends. Strategies
  are configured entirely through a ``params`` dict, so new behaviour is a
  config change, not a code change.
* :class:`SignalFilter`– a pluggable confirmation gate (delta / footprint / ML).

Because the engine only depends on these interfaces, you can run any number of
strategies side by side, each enabled/disabled and parameterised from config.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, ClassVar, Dict, List, Optional, Protocol, runtime_checkable

import pandas as pd

from ..config import Config
from ..indicators.volume_profile import VolumeProfile


class Side(str, Enum):
    LONG = "long"
    SHORT = "short"

    @property
    def sign(self) -> int:
        return 1 if self is Side.LONG else -1


@dataclass
class Signal:
    """A ready-to-trade plan produced by a strategy."""

    timestamp: pd.Timestamp
    side: Side
    entry: float
    stop: float
    target: float
    mode: str                        # setup name, e.g. "breakout"
    strategy_id: str = ""            # which strategy produced it
    reason: str = ""
    meta: Dict[str, Any] = field(default_factory=dict)

    @property
    def risk_points(self) -> float:
        return abs(self.entry - self.stop)

    @property
    def reward_points(self) -> float:
        return abs(self.target - self.entry)

    @property
    def planned_rr(self) -> float:
        return self.reward_points / self.risk_points if self.risk_points else 0.0

    def is_valid(self) -> bool:
        if self.risk_points <= 0:
            return False
        if self.side is Side.LONG:
            return self.stop < self.entry < self.target
        return self.target < self.entry < self.stop


@dataclass
class DayContext:
    """Read-only, strategy-agnostic bundle for a single session."""

    date: pd.Timestamp
    day_df: pd.DataFrame                  # all primary-timeframe bars for the day
    session_window: pd.DataFrame          # bars inside the tradable window
    volume_profile: Optional[VolumeProfile]
    config: Config
    market: Optional[Any] = None          # MarketData (higher timeframes)
    decision_log: Optional[Any] = None    # DecisionLog for explainability


@runtime_checkable
class SignalFilter(Protocol):
    """A pluggable confirmation gate applied to every candidate signal."""

    name: str

    def accept(self, signal: Signal, context: DayContext) -> bool:
        ...


class StrategyBase(ABC):
    """Abstract base for all strategies.

    Subclasses set a class-level :attr:`name` (the registry key) and implement
    :meth:`generate`. All tunables come from ``params`` so a strategy's
    behaviour is fully described by config.
    """

    name: ClassVar[str] = "base"

    def __init__(
        self,
        config: Config,
        params: Optional[Dict[str, Any]] = None,
        strategy_id: Optional[str] = None,
        filters: Optional[List[SignalFilter]] = None,
    ):
        self.config = config
        self.params: Dict[str, Any] = dict(params or {})
        self.id = strategy_id or self.name
        self.filters: List[SignalFilter] = list(filters or [])

    # -- convenience --------------------------------------------------------

    def param(self, key: str, default: Any = None) -> Any:
        return self.params.get(key, default)

    def apply_filters(self, signal: Signal, context: DayContext) -> bool:
        for f in self.filters:
            if not f.accept(signal, context):
                signal.meta.setdefault("rejected_by", []).append(f.name)
                if context.decision_log is not None:
                    context.decision_log.veto(
                        self.id, signal.timestamp,
                        reason=f"filter:{f.name}", mode=signal.mode,
                    )
                return False
        return True

    # -- interface ----------------------------------------------------------

    @abstractmethod
    def generate(self, context: DayContext) -> List[Signal]:
        """Return candidate signals for the day, in chronological order."""
        raise NotImplementedError

    def __repr__(self) -> str:  # pragma: no cover - cosmetic
        return f"<{type(self).__name__} id={self.id!r}>"
