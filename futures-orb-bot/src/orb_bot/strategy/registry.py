"""Strategy registry — the plug-and-play mechanism.

A strategy registers itself with ``@register("name")``. The engine then builds
the live set of strategies straight from config via :func:`build_strategies`,
which reads :meth:`Config.effective_strategies` (respecting each entry's
``enabled`` flag and ``params``).

Adding a new strategy is therefore three steps, none of which touch the engine:

1. Subclass :class:`~orb_bot.strategy.base.StrategyBase`.
2. Decorate it with ``@register("my_strategy")``.
3. Add ``{name: my_strategy, enabled: true, params: {...}}`` to config.
"""

from __future__ import annotations

import logging
from typing import Dict, List, Optional, Type

from ..config import Config
from .base import SignalFilter, StrategyBase

logger = logging.getLogger("orb_bot.strategy.registry")

_REGISTRY: Dict[str, Type[StrategyBase]] = {}


def register(name: str):
    """Class decorator that registers a strategy under ``name``."""

    def decorator(cls: Type[StrategyBase]) -> Type[StrategyBase]:
        if name in _REGISTRY and _REGISTRY[name] is not cls:
            logger.warning("Overriding already-registered strategy '%s'.", name)
        cls.name = name
        _REGISTRY[name] = cls
        return cls

    return decorator


def get_strategy_class(name: str) -> Type[StrategyBase]:
    if name not in _REGISTRY:
        raise KeyError(
            f"Unknown strategy '{name}'. Registered: {sorted(_REGISTRY)}"
        )
    return _REGISTRY[name]


def available_strategies() -> List[str]:
    return sorted(_REGISTRY)


def build_strategies(
    config: Config,
    filters_by_id: Optional[Dict[str, List[SignalFilter]]] = None,
) -> List[StrategyBase]:
    """Instantiate every enabled strategy described in ``config``.

    ``filters_by_id`` optionally attaches signal filters to specific strategy
    ids (e.g. plug an ML filter onto just one strategy).
    """
    filters_by_id = filters_by_id or {}
    strategies: List[StrategyBase] = []
    for sc in config.effective_strategies():
        cls = get_strategy_class(sc.name)
        strat = cls(
            config,
            params=sc.params,
            strategy_id=sc.label,
            filters=filters_by_id.get(sc.label),
        )
        strategies.append(strat)
        logger.info("Loaded strategy '%s' (%s).", sc.label, sc.name)
    if not strategies:
        logger.warning("No enabled strategies configured.")
    return strategies
