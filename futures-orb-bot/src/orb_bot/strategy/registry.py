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

    When a strategy's effective confidence setting is enabled — its own
    ``use_confidence_filter``, or ``config.confidence.enabled`` when that field
    is left unset — a shared :class:`~orb_bot.analysis.ConfidenceFilter` is
    appended to its filter chain, so the Trade Confidence Engine's
    ``min_trade_confidence`` / ``min_directional_edge`` actually gate trades
    (not just advisory scoring in the learning pipeline). One engine instance
    is shared across strategies that use it — analyzers are stateless per
    call, so this is safe and avoids rebuilding the full analyzer set
    repeatedly. Strategies that opt out (``use_confidence_filter: false``) are
    simply never given the filter — typically counter-trend strategies, whose
    best setups look "wrong" to the engine's trend-confirmation analyzers.
    """
    filters_by_id = filters_by_id or {}

    confidence_filter = None
    if config.confidence.enabled:
        from ..analysis import ConfidenceFilter  # lazy: avoid import-order coupling

        confidence_filter = ConfidenceFilter.from_config(config)

    strategies: List[StrategyBase] = []
    for sc in config.effective_strategies():
        cls = get_strategy_class(sc.name)
        filters = list(filters_by_id.get(sc.label) or [])
        wants_confidence = (
            sc.use_confidence_filter if sc.use_confidence_filter is not None
            else config.confidence.enabled
        )
        if confidence_filter is not None and wants_confidence:
            filters.append(confidence_filter)
        strat = cls(
            config,
            params=sc.params,
            strategy_id=sc.label,
            filters=filters,
        )
        strategies.append(strat)
        tag = " + confidence filter" if (confidence_filter is not None and wants_confidence) else ""
        logger.info("Loaded strategy '%s' (%s)%s.", sc.label, sc.name, tag)
    if not strategies:
        logger.warning("No enabled strategies configured.")
    return strategies
