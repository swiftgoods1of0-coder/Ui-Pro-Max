"""Strategy engine: base abstractions, registry, and shipped strategies.

Importing this package registers every built-in strategy, so the registry is
populated as soon as ``orb_bot.strategy`` is imported.
"""

from .base import Signal, Side, DayContext, StrategyBase, SignalFilter
from .registry import register, build_strategies, available_strategies, get_strategy_class

# Importing the concrete strategies triggers their @register decorators.
from .orb_strategy import ORBStrategy
from .vwap_reversion import VWAPReversionStrategy

__all__ = [
    "Signal",
    "Side",
    "DayContext",
    "StrategyBase",
    "SignalFilter",
    "register",
    "build_strategies",
    "available_strategies",
    "get_strategy_class",
    "ORBStrategy",
    "VWAPReversionStrategy",
]
