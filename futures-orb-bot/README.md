# Futures Quant Research Platform

A modular, production-quality **signal & backtesting** platform for futures
research. It began as a New-York-session opening-range bot and has grown into a
full research stack: a data engine, a plug-and-play strategy engine, a risk
manager, performance analytics, a visual dashboard, a trade journal, structured
logging, and configuration-driven everything.

> ⚠️ **Research / backtesting only.** There is no broker connection anywhere in
> the codebase. Everything is designed to be validated on historical data first.
> A live/paper layer is a deliberate, additive future step (see
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)).

## Highlights

| Area | What's included |
|------|-----------------|
| **Analysis engine** | Independent order-flow & structure analyzers (POC, VAH/VAL, HVN/LVN, VWAP, ATR, RVOL, Delta, CVD, imbalance, absorption, swings) — each outputs bias / 0–100 confidence / explanation / levels / raw values, across timeframes ([docs](docs/ANALYZERS.md)) |
| **Confidence engine** | Combines all analyzers into one 0–100 trade-quality score with long/short/no-trade sub-scores, reasons, risk warnings, and conflict detection — fully explainable ([docs](docs/ANALYZERS.md#trade-confidence-engine)) |
| **Learning system** | Captures full market context per completed trade, mines winners vs losers with statistical significance, and writes a research report that only recommends when the sample supports it ([docs](docs/LEARNING.md)) |
| **Data engine** | CSV import, multi-timeframe (1m/5m/15m…), Parquet cache, missing/corrupt-data validation |
| **Strategy engine** | Plug-and-play registry, multiple strategies running independently, enable/disable per config |
| **Risk management** | Adjustable account size & risk-per-trade, daily max loss, max consecutive losses, max trades/day, dynamic position sizing |
| **Analytics** | Win rate, profit factor, expectancy, Sharpe/Sortino, max drawdown, avg R, equity curve, monthly & yearly tables, distributions |
| **Dashboard** | Self-contained HTML: equity, open/closed trades, metrics, strategy status, trade log, price chart with entries/exits plotted |
| **Trade journal** | Every trade with entry/exit, stop, target, time, duration, strategy, P&L, screenshot placeholder, notes |
| **Configuration** | One layered `config.yaml` for strategies, risk, sessions, storage, logging, filters |
| **Logging** | Human-readable run log **and** a machine-readable decision log ("why was/wasn't this trade taken?") |
| **Docs & tests** | Architecture doc, module docstrings, pytest suite across every layer |

## Quick start

```bash
pip install -r requirements.txt

# Generate sample data (or drop your own CSVs into data/raw/)
python scripts/generate_sample_data.py --days 15

# Run the full pipeline
python run_backtest.py

# List available strategies
python run_backtest.py --list-strategies
```

Outputs land in `output/`:

| File | Contents |
|------|----------|
| `dashboard.html` | The full visual dashboard (open in a browser) |
| `trade_journal.csv` | Every trade, all fields |
| `journals/journal_<strategy>.csv` | Per-strategy journals |
| `metrics.csv` | Summary metrics |
| `monthly_pnl.csv`, `yearly_performance.csv` | Period tables |
| `logs/run.log` | Human-readable run log |
| `logs/decisions.jsonl` | Structured decision log (every signal / veto / fill) |
| `dashboard.png` | Quick six-panel PNG summary |
| `research_report.html` / `.pdf` / `.csv` / `.md` | Full research report: metrics, best/worst setups & hours, winner/loser traits, suggested filters with confidence + supported/speculative labels ([docs](docs/LEARNING.md)) |
| `learning/trade_features.csv` | Per-trade feature dataset (market context at entry + outcome) |

## Configuration

Everything is driven from [`config.yaml`](config.yaml). Strategies are a list —
toggle `enabled`, tune `params`, add your own:

```yaml
risk:
  starting_equity_usd: 25000.0
  risk_model: "fixed_fractional"   # % of equity (dynamic) or "fixed_dollar"
  risk_per_trade_pct: 1.0
  max_trades_per_day: 3
  max_consecutive_losses: 4
  daily_max_loss_pct: 3.0

strategies:
  - name: "orb"
    id: "orb_breakout"
    enabled: true
    params: { modes: ["breakout", "sweep_reclaim"], reward_multiple: 2.0 }
  - name: "vwap_reversion"
    id: "vwap_mr"
    enabled: true
    params: { entry_stretch_ticks: 10, reward_multiple: 1.5 }
```

## Adding a strategy (plug-and-play)

```python
from orb_bot.strategy import StrategyBase, Signal
from orb_bot.strategy.registry import register

@register("my_strategy")
class MyStrategy(StrategyBase):
    def generate(self, context):
        signals = []
        # ...read context.day_df / context.volume_profile / context.market...
        return signals
```

Then add `{ name: "my_strategy", enabled: true }` to the `strategies` list. The
engine, risk manager, analytics, journal and dashboard pick it up automatically.

## Architecture

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full layer map, the
backtest data flow, modelling choices (no look-ahead, fill assumptions), and the
extension points. In brief:

```
config → data engine → strategy engine → risk-managed backtest
       → analytics → journal + tables → visual dashboard
                         (decision log throughout)
```

## Tests

```bash
pip install pytest
python -m pytest -q
```

Covers data loading & validation, timeframes & storage, indicators, the risk
manager, the strategy registry & multi-strategy runs, the end-to-end engine, and
analytics.

## Requirements

Python 3.9+, `pandas`, `numpy`, `matplotlib`, `PyYAML`, `pyarrow` (optional but
recommended for the Parquet cache).
