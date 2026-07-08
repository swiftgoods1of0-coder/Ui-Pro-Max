#!/usr/bin/env python3
"""Command-line entry point for the Futures ORB backtester.

A thin wrapper around ``orb_bot.cli`` that works without installing the package
(it puts ``src/`` on the path). If you `pip install` the project you can also
use the ``orb-backtest`` console script instead.

Examples
--------
    python run_backtest.py
    python run_backtest.py --data data/raw/ES_1min.csv --config config.yaml
    python run_backtest.py --output output/run_2024 --no-dashboard

This is research / backtesting only. It never connects to a broker.
"""

from __future__ import annotations

import sys
from pathlib import Path

# Make the `orb_bot` package importable when run from the project root.
PROJECT_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(PROJECT_ROOT / "src"))

from orb_bot.cli import main  # noqa: E402

if __name__ == "__main__":
    raise SystemExit(main())
