# Futures ORB Bot

A clean, professional **signal & backtesting** framework for a New-York-session
opening-range strategy on futures. It is intentionally **research-only** — there
is no broker connection anywhere in the codebase.

> ⚠️ **Not live trading.** This is a backtesting / signal-research tool.
> Nothing here places orders. Live execution is a deliberate future step.

## Strategy

Everything revolves around the **08:00–08:15 EST opening-range box** ("ORB"):

- **Breakout** — a bar *closes* beyond the OR high (long) or low (short).
- **Sweep / reclaim** — price pokes beyond the OR level far enough to grab the
  resting liquidity, then *reclaims* by closing back inside → fade the sweep.
- **Volume-profile POC** is available as a key level / confluence filter.
- **Risk/reward** is configurable (1:2, 1:3, …) with dollar-based position
  sizing, commissions, and slippage.
- Trades only inside the New-York window (default 08:00–11:00); anything open at
  the window close is flattened.

Reported metrics: **win rate, profit factor, max drawdown, average R,
expectancy, best/worst time of day**, streaks, hold time, per-setup breakdown.

## Quick start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Generate sample data (or drop your own CSVs into data/raw/)
python scripts/generate_sample_data.py --days 15

# 3. Run the backtest
python run_backtest.py
```

You'll get a console summary plus these files in `output/`:

| File                 | What it is                                    |
|----------------------|-----------------------------------------------|
| `trade_journal.csv`  | One row per trade — open in a spreadsheet      |
| `metrics.csv`        | Summary metrics as `metric,value`              |
| `dashboard.png`      | Six-panel results chart                        |
| `report.html`        | Self-contained HTML report (chart embedded)    |

## Configuration

All knobs live in [`config.yaml`](config.yaml) — the opening-range window, the
session window, which setups to trade, the RR multiple, risk per trade,
commissions/slippage, the instrument point value, and volume-profile settings.
Every field has a default (see `src/orb_bot/config.py`), so a partial file works.

```yaml
opening_range: { start: "08:00", end: "08:15" }
strategy:      { modes: ["breakout", "sweep_reclaim"], require_poc_confluence: false }
risk:          { reward_multiple: 2.0, risk_per_trade_usd: 250.0 }
```

## Project structure

```
futures-orb-bot/
├── config.yaml               # all strategy / risk / engine settings
├── run_backtest.py           # CLI entry point
├── requirements.txt
├── data/
│   ├── raw/                  # drop your OHLCV CSVs here
│   └── README.md             # accepted formats
├── scripts/
│   └── generate_sample_data.py
├── src/orb_bot/
│   ├── config.py             # typed config (dataclasses <- YAML)
│   ├── data/loader.py        # OHLCV CSV loading, tz handling, resampling
│   ├── indicators/
│   │   ├── opening_range.py  # the 08:00–08:15 ORB box
│   │   └── volume_profile.py # POC + value area
│   ├── strategy/
│   │   ├── base.py           # Signal, DayContext, Strategy + SignalFilter
│   │   └── orb_strategy.py   # breakout + sweep/reclaim rules
│   ├── engine/
│   │   ├── trade.py          # the Trade record
│   │   └── backtester.py     # event loop, sizing, fills, exits
│   ├── analytics/metrics.py  # win rate, PF, drawdown, R, time-of-day
│   ├── reporting/
│   │   ├── journal.py        # CSV export
│   │   └── dashboard.py      # charts + HTML report
│   └── extensions/           # <- future hooks (see below)
│       ├── delta.py
│       ├── footprint.py
│       └── ml_filter.py
└── tests/                    # pytest suite
```

## Extending it later

The architecture is built to grow. Each concern is behind a small interface so
you can add capability without rewriting the core.

### Signal filters (delta · footprint · ML)

A `SignalFilter` is any object with a `name` and an
`accept(signal, context) -> bool` method. Every candidate signal must be
accepted by all filters. Ready-to-fill stubs live in `src/orb_bot/extensions/`:

```python
from orb_bot.strategy import ORBStrategy
from orb_bot.extensions import DeltaFilter, MLSignalFilter

strategy = ORBStrategy(cfg, filters=[
    DeltaFilter(min_delta=500, enabled=True),
    MLSignalFilter(model=my_model, min_proba=0.6, enabled=True),
])
```

- **`delta.py`** — gate entries on order-flow delta once you have bid/ask
  volume.
- **`footprint.py`** — require stacked imbalances / absorption at the level.
- **`ml_filter.py`** — score signals with a trained classifier; includes a
  starter feature vector (`MLSignalFilter.features_from`). scikit-learn is
  loaded lazily, so it's not a hard dependency.

### Richer volume profile

`indicators/volume_profile.py` approximates intra-bar volume from OHLC. When you
add tick / footprint data, swap in a tick-accurate profile — every caller uses
the same `VolumeProfile` interface.

### New setups

Add a new `Strategy` (anything with `generate(context) -> list[Signal]`) and
hand it to the `Backtester`. The engine, analytics, and reporting are all
strategy-agnostic.

### Toward live trading (later)

The seam is clean: `Backtester._simulate_trade` is the only place fills are
modelled. A live layer would implement the same signal → order lifecycle
against a broker API. That is intentionally **not** built here.

## Tests

```bash
pip install pytest
python -m pytest tests/ -q
```

## Requirements

Python 3.9+, `pandas`, `numpy`, `matplotlib`, `PyYAML`.
