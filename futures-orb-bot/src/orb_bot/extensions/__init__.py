"""Extension points for future confirmation logic.

Every class here implements the :class:`~orb_bot.strategy.base.SignalFilter`
protocol: a ``name`` attribute and an ``accept(signal, context) -> bool``
method. Pass instances into a strategy's ``filters`` list, or attach via
:func:`~orb_bot.strategy.registry.build_strategies`'s ``filters_by_id``, and
each candidate signal must be accepted by *all* filters to survive.

Order-flow confirmation (delta, cumulative volume delta, bid/ask imbalance,
absorption) is no longer a stub here — it's fully implemented as independent
analyzers in :mod:`orb_bot.analysis.order_flow`, feeding the
:class:`~orb_bot.analysis.ConfidenceEngine` and (by default)
:class:`~orb_bot.analysis.ConfidenceFilter`. See ``docs/ANALYZERS.md``.

What's still a genuine, unfilled extension point is a **machine-learning**
signal filter: train a classifier on historical trades and gate signals on its
predicted win probability. :class:`MLSignalFilter` ships as a transparent
pass-through with a starter feature vector, ready to fill in.
"""

from .ml_filter import MLSignalFilter

__all__ = ["MLSignalFilter"]
