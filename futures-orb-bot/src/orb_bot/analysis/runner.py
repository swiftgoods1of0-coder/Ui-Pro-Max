"""Convenience runners that execute analyzers over data.

* :func:`analyze` — run a chosen set of analyzers on one context.
* :func:`analyze_market` — build a context from a MarketData timeframe and run.
* :func:`analyze_multi_timeframe` — run the same analyzers across several
  timeframes and return a per-timeframe mapping. This is how the order-flow read
  is assembled for multi-timeframe confluence.

All analyzers are independent, so these runners are thin: they just fan out and
collect :class:`AnalyzerResult` objects.
"""

from __future__ import annotations

from typing import Dict, List, Optional

import pandas as pd

from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, build_analyzers


def analyze(
    ctx: AnalysisContext,
    keys: Optional[List[str]] = None,
    analyzers: Optional[List[Analyzer]] = None,
) -> List[AnalyzerResult]:
    """Run analyzers on a single context. Pass ``keys`` to select a subset."""
    analyzers = analyzers if analyzers is not None else build_analyzers(keys)
    results: List[AnalyzerResult] = []
    for a in analyzers:
        try:
            results.append(a.analyze(ctx))
        except Exception as exc:  # an analyzer must never break the batch
            results.append(AnalyzerResult(
                getattr(a, "label", a.key), Bias.NEUTRAL, 0.0,
                f"analyzer error: {exc}", timeframe=ctx.timeframe))
    return results


def analyze_market(
    market, timeframe: str, now: Optional[pd.Timestamp] = None, *,
    config=None, keys: Optional[List[str]] = None,
) -> List[AnalyzerResult]:
    ctx = AnalysisContext.from_market(market, timeframe, now, config=config)
    return analyze(ctx, keys)


def analyze_multi_timeframe(
    market, now: Optional[pd.Timestamp] = None, *,
    timeframes: Optional[List[str]] = None, config=None,
    keys: Optional[List[str]] = None,
) -> Dict[str, List[AnalyzerResult]]:
    """Run analyzers across every timeframe and return {timeframe: [results]}."""
    timeframes = timeframes or sorted(market.frames)
    out: Dict[str, List[AnalyzerResult]] = {}
    for tf in timeframes:
        out[tf] = analyze_market(market, tf, now, config=config, keys=keys)
    return out
