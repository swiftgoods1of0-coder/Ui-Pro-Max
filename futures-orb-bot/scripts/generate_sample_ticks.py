#!/usr/bin/env python3
"""Generate synthetic tick data (and matching OHLCV) for demoing real order flow.

Unlike ``generate_sample_data.py`` (which synthesizes OHLCV bars directly),
this generates individual aggressor-tagged **trades**, then derives the OHLCV
bars from those same trades — so the two files are perfectly consistent, and
feeding both into the backtester gives you the real footprint engine (per-
price-level absorption, stacked imbalance, real delta) instead of the OHLCV
approximation.

    python scripts/generate_sample_ticks.py --days 10

Writes:
    data/raw/SAMPLE_ES_ticks.csv       -- tick data, for --ticks
    data/raw/SAMPLE_ES_1min_ticks.csv  -- matching OHLCV, for --data

Then run:

    python run_backtest.py \\
        --data data/raw/SAMPLE_ES_1min_ticks.csv \\
        --ticks data/raw/SAMPLE_ES_ticks.csv

or see the analyzers fire directly:

    python scripts/analyze_orderflow.py \\
        --data data/raw/SAMPLE_ES_1min_ticks.csv \\
        --ticks data/raw/SAMPLE_ES_ticks.csv
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from orb_bot.data.synth_ticks import generate_ticks, ticks_to_ohlcv  # noqa: E402


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Generate synthetic tick + matching OHLCV data")
    p.add_argument("--days", type=int, default=10, help="Number of weekday sessions")
    p.add_argument("--seed", type=int, default=11, help="RNG seed")
    p.add_argument("--start-price", type=float, default=4800.0)
    p.add_argument("--tick-size", type=float, default=0.25)
    p.add_argument("--out-ticks", default="data/raw/SAMPLE_ES_ticks.csv")
    p.add_argument("--out-ohlcv", default="data/raw/SAMPLE_ES_1min_ticks.csv")
    args = p.parse_args(argv)

    ticks = generate_ticks(days=args.days, seed=args.seed, start_price=args.start_price,
                           tick_size=args.tick_size)
    ohlcv = ticks_to_ohlcv(ticks, "1min")

    ticks_path = (PROJECT_ROOT / args.out_ticks).resolve()
    ohlcv_path = (PROJECT_ROOT / args.out_ohlcv).resolve()
    ticks_path.parent.mkdir(parents=True, exist_ok=True)
    ohlcv_path.parent.mkdir(parents=True, exist_ok=True)

    ticks.reset_index().to_csv(ticks_path, index=False)
    ohlcv.reset_index().to_csv(ohlcv_path, index=False)

    print(f"Wrote {len(ticks):,} ticks across {args.days} sessions -> {ticks_path}")
    print(f"Wrote {len(ohlcv):,} matching 1-min bars              -> {ohlcv_path}")
    print(
        "\nTry it:\n"
        f"  python run_backtest.py --data {args.out_ohlcv} --ticks {args.out_ticks}\n"
        f"  python scripts/analyze_orderflow.py --data {args.out_ohlcv} --ticks {args.out_ticks}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
