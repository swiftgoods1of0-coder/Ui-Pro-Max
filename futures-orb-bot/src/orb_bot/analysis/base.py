"""The market-structure analyzer contract and shared machinery.

Every market-structure concept (swings, break of structure, change of character,
trend, liquidity sweeps, opening range, fair value gaps, order blocks) is an
**independent analyzer** that consumes an :class:`AnalysisContext` and returns a
uniform :class:`AnalyzerResult`:

* **direction**    – a :class:`Bias` (BULLISH / BEARISH / NEUTRAL)
* **confidence**   – 0–100, how strongly the concept reads *right now*
* **explanation**  – a plain-English sentence describing what was detected
* **levels**       – the important price levels the read is built on
* **invalidation** – the price at which the read is wrong (bias flips / setup dead)
* **raw**          – the raw numbers used, so any score is fully traceable

This uniform contract is what makes the system modular and transparent: analyzers
can be added, swapped, or run across several timeframes, and every output is
traceable back to the price data that produced it.

Look-ahead safety: an :class:`AnalysisContext` only ever exposes data up to and
including ``now``. Analyzers must never read beyond it. Swing-based analyzers
naturally leave the most recent bars "unconfirmed" because a pivot needs bars on
both sides — that is correct and intentional.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional

import pandas as pd


class Bias(str, Enum):
    BULLISH = "bullish"
    BEARISH = "bearish"
    NEUTRAL = "neutral"

    @property
    def sign(self) -> int:
        return {"bullish": 1, "bearish": -1, "neutral": 0}[self.value]

    @staticmethod
    def from_sign(x: float) -> "Bias":
        if x > 0:
            return Bias.BULLISH
        if x < 0:
            return Bias.BEARISH
        return Bias.NEUTRAL


@dataclass
class AnalyzerResult:
    """The uniform output every market-structure analyzer produces."""

    name: str
    direction: Bias
    confidence: float                       # 0–100
    explanation: str
    levels: Dict[str, float] = field(default_factory=dict)   # named price levels
    invalidation: Optional[float] = None    # price that invalidates the read
    raw: Dict[str, Any] = field(default_factory=dict)
    timeframe: Optional[str] = None         # set when run per timeframe

    def __post_init__(self) -> None:
        self.confidence = float(clamp(self.confidence, 0.0, 100.0))

    @property
    def signed_confidence(self) -> float:
        """Confidence signed by direction: +conf bullish, −conf bearish."""
        return self.direction.sign * self.confidence

    def to_dict(self) -> Dict[str, Any]:
        return {
            "name": self.name,
            "timeframe": self.timeframe,
            "direction": self.direction.value,
            "confidence": round(self.confidence, 1),
            "explanation": self.explanation,
            "levels": {k: round(v, 4) for k, v in self.levels.items()},
            "invalidation": round(self.invalidation, 4) if self.invalidation is not None else None,
            "raw": self.raw,
        }

    def summary(self) -> str:
        inval = f" | invalidation {self.invalidation:.2f}" if self.invalidation is not None else ""
        tf = f"[{self.timeframe}] " if self.timeframe else ""
        return f"{tf}{self.name}: {self.direction.value.upper()} {self.confidence:.0f}% — {self.explanation}{inval}"


@dataclass
class AnalysisContext:
    """Everything an analyzer needs to evaluate a moment in the market.

    ``df`` is all history up to and including the decision bar (so multi-day
    lookbacks work); ``session_df`` is the current session up to now. Nothing
    after ``now`` is ever included.
    """

    df: pd.DataFrame                        # history up to and including `now`
    now: pd.Timestamp
    price: float                            # reference price (last close)
    timeframe: Optional[str] = None
    config: Any = None                      # orb_bot.config.Config
    market: Any = None                      # MarketData (all timeframes)
    session_df: Optional[pd.DataFrame] = None
    extras: Dict[str, Any] = field(default_factory=dict)

    def recent(self, n: int) -> pd.DataFrame:
        return self.df.tail(n)

    @property
    def session(self) -> pd.DataFrame:
        return self.session_df if self.session_df is not None else self.df

    # -- construction -------------------------------------------------------

    @classmethod
    def from_history(
        cls, df: pd.DataFrame, now: Optional[pd.Timestamp] = None, *,
        timeframe: Optional[str] = None, config=None, market=None,
        session_df: Optional[pd.DataFrame] = None,
    ) -> "AnalysisContext":
        if now is None:
            now = df.index[-1]
        hist = df[df.index <= now]
        price = float(hist["close"].iloc[-1]) if len(hist) else float("nan")
        if session_df is None and len(hist):
            day = now.normalize()
            session_df = hist[hist.index.normalize() == day]
        return cls(df=hist, now=now, price=price, timeframe=timeframe,
                   config=config, market=market, session_df=session_df)

    @classmethod
    def from_market(
        cls, market, timeframe: str, now: Optional[pd.Timestamp] = None,
        *, config=None,
    ) -> "AnalysisContext":
        """Build a context on a specific timeframe of a MarketData object."""
        frame = market.timeframe(timeframe)
        return cls.from_history(frame, now, timeframe=timeframe, config=config,
                                market=market)


class Analyzer(ABC):
    """Base class for every analyzer.

    Subclasses set a class-level :attr:`key` (stable id used in config / output)
    and :attr:`label`, and implement :meth:`analyze`. Analyzers must be
    side-effect free and must never read data after ``ctx.now``.
    """

    key: str = "analyzer"
    label: str = "Analyzer"

    @abstractmethod
    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        raise NotImplementedError

    def _neutral(self, reason: str, **raw) -> AnalyzerResult:
        return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0, reason, raw=raw,
                              timeframe=None)


# --------------------------------------------------------------------------- #
# Registry — analyzers are discoverable and enable/disable-able
# --------------------------------------------------------------------------- #

_REGISTRY: Dict[str, type] = {}


def register_analyzer(key: str):
    def deco(cls):
        cls.key = key
        _REGISTRY[key] = cls
        return cls
    return deco


def available_analyzers() -> List[str]:
    return sorted(_REGISTRY)


def get_analyzer_class(key: str) -> type:
    if key not in _REGISTRY:
        raise KeyError(f"Unknown analyzer '{key}'. Registered: {available_analyzers()}")
    return _REGISTRY[key]


def build_analyzers(keys: Optional[List[str]] = None) -> List["Analyzer"]:
    """Instantiate analyzers by key (default: all registered)."""
    keys = keys if keys is not None else available_analyzers()
    return [get_analyzer_class(k)() for k in keys]


# --------------------------------------------------------------------------- #
# Numeric helpers
# --------------------------------------------------------------------------- #


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def scale(value: float, lo: float, hi: float) -> float:
    """Linearly map ``value`` in [lo, hi] to a 0–100 confidence, clamped."""
    if hi == lo:
        return 0.0
    return clamp((value - lo) / (hi - lo) * 100.0, 0.0, 100.0)
