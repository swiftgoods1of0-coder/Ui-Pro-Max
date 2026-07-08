"""Order-flow & market-structure analysis package.

Every concept is an **independent analyzer** implementing a uniform contract
(:class:`AnalyzerResult`: direction, confidence 0–100, explanation, levels,
invalidation, raw values). Importing this package registers all built-in
analyzers, so they are immediately discoverable via the registry.

Order-flow analyzers (this module set):
    volume_profile, poc, vah, val, hvn, lvn,   (volume profile family)
    vwap, atr, relative_volume,                (indicator family)
    delta, cvd, imbalance, absorption          (order-flow family)

Market-structure analyzers:
    swing_high, swing_low                      (more can be layered on this base)

Run them with :func:`analyze`, :func:`analyze_market`, or
:func:`analyze_multi_timeframe`.
"""

from .base import (
    Analyzer,
    AnalyzerResult,
    AnalysisContext,
    Bias,
    available_analyzers,
    build_analyzers,
    get_analyzer_class,
    register_analyzer,
)

# Importing these modules registers their analyzers.
from . import volume_profile      # noqa: F401
from . import indicators_flow     # noqa: F401
from . import order_flow          # noqa: F401
from . import swings              # noqa: F401

from .runner import analyze, analyze_market, analyze_multi_timeframe

__all__ = [
    "Analyzer",
    "AnalyzerResult",
    "AnalysisContext",
    "Bias",
    "available_analyzers",
    "build_analyzers",
    "get_analyzer_class",
    "register_analyzer",
    "analyze",
    "analyze_market",
    "analyze_multi_timeframe",
]
