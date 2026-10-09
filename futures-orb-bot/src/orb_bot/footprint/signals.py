"""Footprint signal detectors: real absorption and stacked imbalance.

Everything here reads a :class:`~orb_bot.footprint.bar.FootprintBar` (or a
short sequence of them) and answers the two questions a discretionary
order-flow trader is actually asking:

* **Absorption** — *at this exact price*, did a large aggressive push fail to
  move the market? That means the passive side had enough size resting there
  to soak it up — and once the aggressor gives up, the absorbing side often
  takes control. This is located at a specific price with a specific volume,
  not inferred from the candle's overall shape.
* **Stacked imbalance** — several consecutive price levels all dominated by
  the same aggressor side (the classic footprint-chart signal prop desks
  watch for). A stack breaking through a prior high/low with real size behind
  it is a very different thing from one that fizzles mid-range — this module
  tells you which.

Both feed :mod:`orb_bot.analysis.footprint_flow`, which wraps them in the
platform's uniform analyzer contract.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Literal, Optional

from .bar import FootprintBar, PriceLevel


@dataclass(frozen=True)
class AbsorptionEvent:
    """A specific price level where one side's aggression was absorbed."""

    price: float
    aggressor: Literal["buy", "sell"]      # the side that was pushing
    absorbed_by: Literal["buy", "sell"]    # the side that held / took over
    aggressor_volume: float
    passive_ratio: float                   # how dominant the aggressor was (0.5-1.0)
    at_extreme: bool                       # did this happen at the bar's high/low?
    reason: str


@dataclass(frozen=True)
class StackedImbalance:
    """Consecutive price levels dominated by one aggressor side."""

    side: Literal["buy", "sell"]
    price_low: float
    price_high: float
    n_levels: int
    total_volume: float
    broke_through: bool    # did price close beyond this stack (continuation)?
    reason: str


def detect_absorption(
    bar: FootprintBar,
    min_level_volume: float,
    dominance_ratio: float = 0.65,
    body_fraction_max: float = 0.45,
) -> List[AbsorptionEvent]:
    """Find price levels in ``bar`` where aggression was absorbed.

    A level qualifies when: it carried at least ``min_level_volume`` (so a
    quiet level can't trigger this), one side dominated it by
    ``dominance_ratio`` or more, and the bar's body is small relative to its
    range (``body_fraction_max``) — i.e. all that one-sided volume bought
    little net price progress, the signature of the other side holding.
    Levels at the bar's high/low are flagged ``at_extreme``, the strongest
    form (aggression tested a level and was fully rejected there).
    """
    events: List[AbsorptionEvent] = []
    bar_range = bar.high - bar.low
    if bar_range <= 0 or not bar.levels:
        return events
    body = abs(bar.close - bar.open)
    body_fraction = body / bar_range

    if body_fraction > body_fraction_max:
        return events   # bar made real, decisive progress — nothing was absorbed

    for level in bar.levels:
        if level.total_volume < min_level_volume:
            continue
        ratio = level.imbalance_ratio
        if ratio < dominance_ratio:
            continue
        aggressor: Literal["buy", "sell"] = "buy" if level.ask_volume >= level.bid_volume else "sell"
        absorbed_by: Literal["buy", "sell"] = "sell" if aggressor == "buy" else "buy"
        at_extreme = (
            abs(level.price - bar.high) < bar.tick_size / 2
            or abs(level.price - bar.low) < bar.tick_size / 2
        )
        events.append(AbsorptionEvent(
            price=level.price, aggressor=aggressor, absorbed_by=absorbed_by,
            aggressor_volume=max(level.ask_volume, level.bid_volume),
            passive_ratio=ratio, at_extreme=at_extreme,
            reason=(
                f"{aggressor}s traded {max(level.ask_volume, level.bid_volume):.0f} "
                f"at {level.price:.2f} ({ratio:.0%} of level volume) but the bar "
                f"made little net progress ({body_fraction:.0%} of its range) — "
                f"{absorbed_by}s absorbed it"
                + (" right at the extreme" if at_extreme else "") + "."
            ),
        ))

    # Strongest signal first: at the extreme, then by size.
    events.sort(key=lambda e: (not e.at_extreme, -e.aggressor_volume))
    return events


def detect_stacked_imbalance(
    bar: FootprintBar,
    min_ratio: float = 3.0,
    min_levels: int = 3,
    min_level_volume: float = 0.0,
) -> List[StackedImbalance]:
    """Find runs of consecutive price levels imbalanced the same way.

    Classic footprint "diagonal" comparison: a level shows a **buy** imbalance
    when its ask (buy-aggressor) volume is at least ``min_ratio``× the bid
    volume of the level **one tick below** it (where a resting seller would
    have been) — and the mirror for a **sell** imbalance one tick above. A
    *stack* is ``min_levels`` or more such levels in a row.
    """
    levels = sorted(bar.levels, key=lambda l: l.price)
    if len(levels) < 2:
        return []
    by_price = {l.price: l for l in levels}
    tick = bar.tick_size

    marks: List[Optional[Literal["buy", "sell"]]] = []
    for l in levels:
        below = by_price.get(round(l.price - tick, 10))
        above = by_price.get(round(l.price + tick, 10))
        mark: Optional[Literal["buy", "sell"]] = None
        if below is not None and l.ask_volume >= min_level_volume:
            if below.bid_volume > 0 and l.ask_volume / below.bid_volume >= min_ratio:
                mark = "buy"
            elif below.bid_volume == 0 and l.ask_volume > 0:
                mark = "buy"
        if mark is None and above is not None and l.bid_volume >= min_level_volume:
            if above.ask_volume > 0 and l.bid_volume / above.ask_volume >= min_ratio:
                mark = "sell"
            elif above.ask_volume == 0 and l.bid_volume > 0:
                mark = "sell"
        marks.append(mark)

    stacks: List[StackedImbalance] = []
    i = 0
    n = len(levels)
    while i < n:
        side = marks[i]
        if side is None:
            i += 1
            continue
        j = i
        while j + 1 < n and marks[j + 1] == side:
            j += 1
        run_len = j - i + 1
        if run_len >= min_levels:
            run = levels[i:j + 1]
            price_low, price_high = run[0].price, run[-1].price
            broke_through = (
                bar.close >= price_high if side == "buy" else bar.close <= price_low
            )
            stacks.append(StackedImbalance(
                side=side, price_low=price_low, price_high=price_high,
                n_levels=run_len, total_volume=sum(l.total_volume for l in run),
                broke_through=broke_through,
                reason=(
                    f"{run_len} consecutive levels ({price_low:.2f}-{price_high:.2f}) "
                    f"show stacked {side} imbalance, "
                    f"{'confirmed by a close beyond the stack' if broke_through else 'but price did not follow through beyond it'}."
                ),
            ))
        i = j + 1

    stacks.sort(key=lambda s: (-s.n_levels, -s.total_volume))
    return stacks
