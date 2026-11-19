"""Completed-trade learning system.

Pipeline: extract per-trade features (market context at entry + outcome) →
store them → mine winners-vs-losers patterns with statistical gating → emit a
research report that separates supported findings from speculation.

    from orb_bot.learning import FeatureExtractor, TradeFeatureStore, PatternMiner
    from orb_bot.learning.report import write_report

    feats = FeatureExtractor(config).extract_all(result.trades, market)
    store = TradeFeatureStore(feats)
    mining = PatternMiner(min_samples=20).run(store.to_frame())
    write_report(mining, "output/research_report.md", symbol=config.instrument.symbol)
"""

from .features import FeatureExtractor, TradeFeatures
from .store import TradeFeatureStore
from .patterns import PatternMiner, MiningResult, Finding, Suggestion
from .report import generate_markdown, write_report

__all__ = [
    "FeatureExtractor",
    "TradeFeatures",
    "TradeFeatureStore",
    "PatternMiner",
    "MiningResult",
    "Finding",
    "Suggestion",
    "generate_markdown",
    "write_report",
]
