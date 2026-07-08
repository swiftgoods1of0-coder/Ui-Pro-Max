"""Extension points for future confirmation logic.

Every class here implements the :class:`~orb_bot.strategy.base.SignalFilter`
protocol: a ``name`` attribute and an ``accept(signal, context) -> bool``
method. Pass instances into :class:`~orb_bot.strategy.orb_strategy.ORBStrategy`
and each candidate signal must be accepted by *all* filters to survive.

These ship as transparent pass-through stubs so the wiring is real and tested
today; fill in the ``accept`` bodies (and feed richer data through
``DayContext``) when you're ready for delta, footprint, or ML confirmation.
"""

from .delta import DeltaFilter
from .footprint import FootprintFilter
from .ml_filter import MLSignalFilter

__all__ = ["DeltaFilter", "FootprintFilter", "MLSignalFilter"]
