"""ConfidenceFilter — gate strategy signals on the Trade Confidence Engine.

Implements the :class:`~orb_bot.strategy.base.SignalFilter` protocol (a ``name``
and an ``accept(signal, context)`` method), so it plugs into any strategy. For
each candidate signal it:

1. builds a look-ahead-safe :class:`AnalysisContext` at the signal's timestamp,
2. scores it with the :class:`ConfidenceEngine`,
3. stores the full, explainable score on ``signal.meta['confidence']`` (so it
   flows into the trade journal and decision log — nothing is hidden), and
4. vetoes the signal unless the engine agrees with its direction and the quality
   clears ``min_trade_confidence``.

This is how "minimum trade confidence required before taking a trade" is
enforced, while keeping every decision traceable.
"""

from __future__ import annotations

from typing import Optional

from .base import AnalysisContext
from .engine import ConfidenceEngine, TradeDirection


class ConfidenceFilter:
    name = "confidence"

    def __init__(self, engine: ConfidenceEngine, min_confidence: Optional[float] = None,
                 enabled: bool = True):
        self.engine = engine
        self.min_confidence = (min_confidence if min_confidence is not None
                               else engine.min_trade_confidence)
        self.enabled = enabled

    @classmethod
    def from_config(cls, config) -> "ConfidenceFilter":
        engine = ConfidenceEngine.from_config(config)
        return cls(engine, config.confidence.min_trade_confidence,
                   enabled=config.confidence.enabled)

    def accept(self, signal, context) -> bool:
        if not self.enabled:
            return True

        market = getattr(context, "market", None)
        base_df = market.primary if market is not None and hasattr(market, "primary") \
            else context.day_df
        ctx = AnalysisContext.from_history(base_df, signal.timestamp,
                                           config=context.config, market=market)
        score = self.engine.score(ctx)

        # Attach the full explainable score to the signal (flows to journal/logs).
        signal.meta["confidence"] = score.to_dict()
        signal.meta["trade_quality"] = round(score.quality, 1)

        wanted = TradeDirection.LONG if signal.side.value == "long" else TradeDirection.SHORT
        ok = score.direction is wanted and score.quality >= self.min_confidence

        if not ok and context is not None and getattr(context, "decision_log", None):
            context.decision_log.veto(
                signal.strategy_id or "", signal.timestamp,
                reason="confidence", quality=round(score.quality, 1),
                engine_direction=score.direction.value,
                conflicts=len(score.conflicts),
            )
        return ok
