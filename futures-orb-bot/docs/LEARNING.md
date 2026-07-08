# Completed-Trade Learning System

`orb_bot.learning` turns a finished backtest into a research dataset, mines it
for what separates winners from losers, and writes a report — but only calls
something a *finding* when the evidence actually supports it.

```
backtest trades ─▶ FeatureExtractor ─▶ TradeFeatureStore ─▶ PatternMiner ─▶ report
                    (context @ entry)   (CSV/Parquet)        (stats-gated)
```

## What is stored per trade

For every completed trade the extractor reconstructs the market context **as it
was at entry** (look-ahead-safe) by running the analyzers + Confidence Engine on
the bars up to the entry bar, and pairs it with the outcome:

| Group | Fields |
|-------|--------|
| Prices | entry, exit, stop loss, take profit |
| Outcome | result (win/loss/scratch), R multiple, net P&L, exit reason |
| Timing | session (premarket/open/morning/afternoon), hour, minute, duration |
| Structure | trend (from swing highs/lows), structure confidence |
| Volume profile | value-area relation, POC side, distance to POC |
| Delta | delta direction/ratio, CVD direction |
| VWAP | side of VWAP, distance in ATR |
| Volatility | ATR, ATR ratio, regime |
| Confidence | Trade-Confidence-Engine quality, direction, alignment |
| Condition flags | with_trend, with_vwap, with_delta, with_cvd, poc_reclaim, engine_aligned, high_confidence, strong_rvol, expanding_vol, inside_value |

The dataset is written to `output/learning/trade_features.csv` — one row per
trade, ready for a spreadsheet or your own notebook.

## What the miner finds

`PatternMiner` compares winners vs losers across every dimension and reports:

- **Best / worst setups** (strategy × setup type)
- **Best / worst hours** (New-York wall-clock)
- **Best market conditions** (session, trend, VWAP side, value-area relation,
  volatility regime)
- **Common reasons trades win / lose** — the condition flags that most separate
  winners from losers

## Statistical honesty

Every group is compared with a **two-proportion z-test**; win-rate ranges are
**Wilson 95% intervals**. Each finding is labelled:

- **statistically supported** — sample ≥ `min_samples` *and* p < 0.05
- **observed (not significant)** — enough data, but the difference could be noise
- **speculative** — too few trades to judge

Only *statistically supported* findings become **recommendations**. Everything
else is listed under *Speculative observations (do not act yet)*. This is the
core guarantee: the system recommends new filters based on evidence, not
guesses.

Example (from `output/research_report.md`):

```
## Recommendations (statistically supported)
- ✅ Require setups on the correct side of VWAP — win 61% vs 41% without, n=140, p=0.002.

## Speculative observations (insufficient sample — do not act yet)
- ⚠️ Favor hour=9 — win 47% vs 37% baseline, n=32, p=0.185. [observed (not significant)]
```

## Usage

It runs automatically after every backtest (`run_backtest.py`) when
`learning.enabled` is true, producing `trade_features.csv` and
`research_report.md`. Programmatically:

```python
from orb_bot.learning import FeatureExtractor, TradeFeatureStore, PatternMiner
from orb_bot.learning.report import write_report

feats = FeatureExtractor(cfg).extract_all(result.trades, market)
store = TradeFeatureStore(feats); store.save_csv("output/learning/trade_features.csv")
mining = PatternMiner(min_samples=20).run(store.to_frame())
write_report(mining, "output/research_report.md", symbol=cfg.instrument.symbol)
```

## Configuration (`config.yaml`)

```yaml
learning:
  enabled: true
  min_samples: 20        # minimum group size before a finding can be "supported"
  min_lift: 0.08         # minimum win-rate edge to bother recommending
  features_file: "learning/trade_features.csv"
  report_file: "research_report.md"
```

## Closing the loop

The winning reasons map directly onto the Confidence Engine's condition flags
and the strategy `SignalFilter`s — so a supported finding like "require trades on
the correct side of VWAP" can be turned into an actual filter or a Confidence
Engine weight change. The learning system tells you *what* to change; the config
lets you change it without touching core code.
