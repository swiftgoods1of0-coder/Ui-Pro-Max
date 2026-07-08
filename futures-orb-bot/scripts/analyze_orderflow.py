#!/usr/bin/env python3
"""Print every analyzer's read across timeframes for the latest bar.

A quick way to see the order-flow / market-structure analysis engine in action:

    python scripts/analyze_orderflow.py
    python scripts/analyze_orderflow.py --timeframes 1min 5min 15min
    python scripts/analyze_orderflow.py --data data/raw/ES_1min.csv

Each line shows: analyzer, bias, confidence (0–100), and the explanation. This is
research output only — it never places orders.
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from orb_bot.analysis import (  # noqa: E402
    AnalysisContext,
    ConfidenceEngine,
    analyze_multi_timeframe,
)
from orb_bot.config import Config  # noqa: E402
from orb_bot.data import load_market_data  # noqa: E402


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Order-flow / market-structure analysis")
    p.add_argument("--config", default="config.yaml")
    p.add_argument("--data", default=None)
    p.add_argument("--timeframes", nargs="*", default=None)
    args = p.parse_args(argv)

    cfg = Config.from_yaml(args.config) if Path(args.config).exists() else Config()
    market, _ = load_market_data(cfg, args.data)
    tfs = args.timeframes or sorted(market.frames)

    results = analyze_multi_timeframe(market, timeframes=tfs, config=cfg)
    for tf in tfs:
        print(f"\n===== Timeframe: {tf} =====")
        print(f"{'Analyzer':<26}{'Bias':<9}{'Conf':>5}   Explanation")
        print("-" * 100)
        for r in results[tf]:
            print(f"{r.name:<26}{r.direction.value:<9}{r.confidence:5.0f}   {r.explanation}")

    # Combine everything into one trade-quality score on the primary timeframe.
    engine = ConfidenceEngine.from_config(cfg)
    ctx = AnalysisContext.from_market(market, market.primary_timeframe, config=cfg)
    score = engine.score(ctx)
    print("\n" + "=" * 60)
    print("  TRADE CONFIDENCE ENGINE")
    print("=" * 60)
    print(score.report())

    print("\n(Research only — bar-based order-flow reads are approximations; "
          "see docs/ANALYZERS.md.)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
