#!/usr/bin/env python3
"""Generate synthetic 1-minute OHLCV data for demoing the backtester.

Produces a realistic-looking futures-style series across several weekdays, each
with a genuine 08:00–08:15 opening range followed by a mix of breakouts,
sweeps, and chop — enough for every code path (target, stop, session-end,
both setups) to fire. Output is written as a vendor-neutral CSV the loader
understands out of the box.

    python scripts/generate_sample_data.py            # -> data/raw/SAMPLE_ES_1min.csv
    python scripts/generate_sample_data.py --days 20  # more history
"""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

NY_OFFSET = timedelta(hours=-5)  # sample data written in EST wall-clock, UTC-stamped


def generate(days: int, seed: int, start_price: float) -> pd.DataFrame:
    rng = np.random.default_rng(seed)
    rows = []
    price = start_price
    # Start on a Monday so weekdays are easy to reason about.
    day = datetime(2024, 1, 1, tzinfo=timezone.utc)

    generated = 0
    while generated < days:
        if day.weekday() >= 5:  # skip weekends
            day += timedelta(days=1)
            continue

        # Session: 08:00 -> 11:00 EST == 13:00 -> 16:00 UTC on the sample data.
        session_start = day.replace(hour=13, minute=0, second=0, microsecond=0)
        n_minutes = 180
        # Per-day regime so we get a spread of breakouts / sweeps / chop.
        regime = generated % 4
        drift, vol, sweep = _regime_params(regime, rng)

        open_price = price
        for i in range(n_minutes):
            ts = session_start + timedelta(minutes=i)
            minutes_in = i

            step = rng.normal(drift, vol)
            # Engineer a liquidity sweep just after the opening range on some days.
            if sweep and 16 <= minutes_in <= 20:
                step += sweep
            close = open_price + step
            high = max(open_price, close) + abs(rng.normal(0, vol * 0.6))
            low = min(open_price, close) - abs(rng.normal(0, vol * 0.6))
            volume = float(max(1, int(rng.normal(1200, 350))))
            # Volume clusters mid-session -> gives the profile a real POC.
            volume *= 1.0 + 0.8 * np.exp(-((minutes_in - 90) ** 2) / (2 * 40**2))

            rows.append(
                {
                    "timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
                    "open": round(open_price, 2),
                    "high": round(high, 2),
                    "low": round(low, 2),
                    "close": round(close, 2),
                    "volume": round(volume, 0),
                }
            )
            open_price = close

        price = open_price
        generated += 1
        day += timedelta(days=1)

    return pd.DataFrame(rows)


def _regime_params(regime: int, rng):
    """Return (drift, vol, sweep_kick) for a day's regime."""
    if regime == 0:      # bullish breakout day
        return 0.08, 1.1, 0.0
    if regime == 1:      # bearish breakout day
        return -0.08, 1.1, 0.0
    if regime == 2:      # bullish sweep-and-reclaim (sweep down, then reclaim)
        return 0.05, 1.0, -3.5
    return 0.0, 1.4, 0.0  # choppy / range day


def main(argv=None) -> int:
    p = argparse.ArgumentParser(description="Generate sample OHLCV data")
    p.add_argument("--days", type=int, default=12, help="Number of weekdays")
    p.add_argument("--seed", type=int, default=7, help="RNG seed")
    p.add_argument("--start-price", type=float, default=4800.0)
    p.add_argument(
        "--out",
        default="data/raw/SAMPLE_ES_1min.csv",
        help="Output CSV path (relative to project root)",
    )
    args = p.parse_args(argv)

    project_root = Path(__file__).resolve().parent.parent
    out_path = (project_root / args.out).resolve()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    df = generate(args.days, args.seed, args.start_price)
    df.to_csv(out_path, index=False)
    print(f"Wrote {len(df):,} bars across {args.days} sessions -> {out_path}")
    print("Note: timestamps are UTC; set data.input_timezone: \"UTC\" in config.yaml")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
