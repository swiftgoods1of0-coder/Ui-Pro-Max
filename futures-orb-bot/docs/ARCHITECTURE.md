# Architecture

This document explains how the platform is put together, the data flow through
a backtest, and where to extend it. It is written for an engineer picking up the
codebase for the first time.

> **Scope:** research / backtesting only. There is no broker connectivity. Every
> component is designed to be exercised on historical data first.

---

## Design principles

1. **Separation of concerns.** Data, strategy, risk, execution simulation,
   analytics, and reporting are independent layers with narrow interfaces. You
   can replace any one without touching the others.
2. **Config over code.** Strategies, risk, sessions, storage, logging and
   filters are all described in `config.yaml`. Running a different experiment is
   a config change, not a code change.
3. **Plug-and-play strategies.** A strategy is a class that implements one
   method and registers itself. The engine discovers it from config.
4. **Explainability.** Every decision — signal, fill, and *veto* — is written to
   a structured decision log, so you can always answer "why was / wasn't this
   trade taken?"
5. **Testability.** Pure functions and small classes with injected dependencies;
   deterministic simulation; a fast pytest suite covering each layer.

---

## Package layout

```
src/orb_bot/
├── config.py            Typed, layered configuration (YAML -> dataclasses)
├── logging_utils.py     Logging setup + structured DecisionLog (JSONL)
│
├── data/                DATA ENGINE
│   ├── loader.py        OHLCV CSV loading, column aliases, timezone handling
│   ├── validation.py    Missing / corrupt / gap detection + repair
│   ├── timeframes.py    MarketData: multi-timeframe resample + as-of lookups
│   ├── store.py         DataStore: Parquet (or pickle) content cache
│   ├── ticks.py         Tick/trade CSV loading (price, size, aggressor side)
│   ├── synth_ticks.py   Synthetic tick generator (incl. engineered absorption
│   │                    / stacked-imbalance scenarios) for demo/testing
│   └── feed.py          load_market_data(): the one entry point that ties
│                        load -> validate -> cache -> multi-timeframe (+ ticks)
│                        together
│
├── footprint/            REAL ORDER FLOW (from tick data — see docs/ORDER_FLOW.md)
│   ├── bar.py            FootprintBar: real per-price-level bid/ask volume
│   └── signals.py        detect_absorption / detect_stacked_imbalance
│
├── indicators/          Reusable indicators
│   ├── opening_range.py Opening-range ("ORB") box
│   └── volume_profile.py Volume profile: POC + value area
│
├── strategy/            STRATEGY ENGINE
│   ├── base.py          Signal, DayContext, StrategyBase, SignalFilter
│   ├── registry.py      @register + build_strategies() (plug-and-play)
│   ├── orb_strategy.py  ORB breakout / liquidity-sweep strategy
│   └── vwap_reversion.py Session-VWAP mean-reversion strategy
│
├── risk/                RISK MANAGEMENT
│   └── manager.py       RiskManager: sizing + guardrails (one per strategy)
│
├── engine/              EXECUTION SIMULATION
│   ├── trade.py         The Trade record (plan + outcome + journal fields)
│   └── backtester.py    Event loop: days -> context -> signals -> risk -> fills
│
├── analytics/           PERFORMANCE ANALYTICS
│   ├── metrics.py       Win rate, PF, expectancy, Sharpe/Sortino, drawdown, R
│   └── distributions.py Monthly / yearly tables, per-strategy breakdown
│
├── analysis/            ORDER-FLOW / MARKET-STRUCTURE ANALYZERS
│   ├── base.py          AnalyzerResult contract, AnalysisContext, registry
│   ├── common.py        Shared math (ATR, VWAP, close-location-value proxy)
│   ├── swings.py        Swing highs/lows (market structure)
│   ├── volume_profile.py POC / VAH / VAL / HVN / LVN analyzers
│   ├── indicators_flow.py VWAP / ATR / Relative Volume analyzers
│   ├── order_flow.py    Delta / CVD / imbalance / absorption (OHLCV approximation)
│   ├── footprint_flow.py REAL absorption / stacked imbalance / delta (from
│   │                    orb_bot.footprint; supersedes order_flow.py's reads
│   │                    whenever tick data is available — docs/ORDER_FLOW.md)
│   ├── engine.py        ConfidenceEngine: combines analyzers into one
│   │                    0-100 trade-quality score with reasons/warnings
│   └── filter.py        ConfidenceFilter: gates strategy signals on that
│                        score (wired in by default — see docs/ANALYZERS.md)
│
├── learning/             COMPLETED-TRADE LEARNING SYSTEM
│   ├── features.py      Per-trade market-context snapshot at entry
│   ├── store.py         TradeFeatureStore (CSV/Parquet dataset)
│   ├── stats.py         Two-proportion z-test + Wilson intervals
│   ├── patterns.py      PatternMiner: winners-vs-losers, stats-gated
│   └── report.py        Markdown research report
│
├── reporting/           OUTPUTS
│   ├── journal.py       Trade-journal + period-table CSV export
│   ├── charts.py        Matplotlib chart builders (base64 PNG)
│   ├── webdashboard.py  Self-contained HTML desktop dashboard
│   ├── dashboard.py     Six-panel PNG summary (legacy/quick view)
│   └── research_report.py  HTML/PDF/CSV/Markdown export of metrics +
│                        learning findings (see docs/LEARNING.md)
│
├── extensions/          FUTURE HOOKS (machine-learning signal filter)
└── utils/               Time parsing, session slicing
cli.py                   Orchestration entry point (orb-backtest)
```

---

## Data flow of a backtest

```
                         config.yaml
                             │
              ┌──────────────┴───────────────┐
              ▼                              ▼
      load_market_data()              build_strategies()
        (data engine)                 (strategy registry)
              │                              │
   MarketData (1m/5m/15m,                List[StrategyBase]
   validated, cached)                        │
              └──────────────┬───────────────┘
                             ▼
                        Backtester.run()
        ┌────────────────────────────────────────────────┐
        │  for each SESSION (New-York day):               │
        │     build DayContext (session bars + POC)       │
        │     for each STRATEGY:                          │
        │        signals = strategy.generate(context)     │
        │          (each candidate runs through that      │
        │           strategy's filters — by default        │
        │           including ConfidenceFilter, unless     │
        │           use_confidence_filter: false)          │
        │        for each signal (1 position at a time):  │
        │            RiskManager.evaluate() ── veto? ─────┼─▶ DecisionLog
        │            simulate fill + stop/target exit     │
        │            RiskManager.register_result()        │
        │            record Trade                          │
        └────────────────────────────────────────────────┘
                             ▼
                       BacktestResult
              (per-strategy results + combined
               portfolio equity + decision log)
                             ▼
      ┌──────────────┬───────────────┬──────────────────┐
      ▼              ▼               ▼                  ▼
  compute_metrics  export_journal  export_period    build_web_dashboard
  (analytics)      (CSV journals)  _tables (CSV)    (HTML + charts)
```

### Key modelling choices (so results are interpretable)

- **No look-ahead.** Entries are only evaluated after a strategy's setup is
  confirmed. The volume-profile key level is built from the *previous* completed
  session (or today's opening range) — never future bars.
- **Entry fill** = the confirming bar's close plus adverse slippage.
- **Same-bar stop/target tie** resolves pessimistically as a stop.
- **One position at a time per strategy**, capped by the risk manager's daily
  guardrails.
- **Independent accounts.** Each strategy trades its own account seeded at
  `starting_equity`, so strategies are directly comparable. The dashboard also
  shows a combined portfolio equity curve (a single shared account funding all
  strategies, evolving by each trade's P&L in exit-time order). **Caveat:**
  because each strategy sizes its own positions as if it alone had the full
  `starting_equity` (they don't share a capital pool during the run), the
  combined curve effectively sums two fully-capitalized accounts rather than
  modelling one account split between them — treat it as "these strategies
  stacked" P&L, not a capital-constrained portfolio simulation.
- **Confidence-gated by default.** Every strategy's candidate signals run
  through that strategy's filters as part of `generate()` — by default
  including the shared `ConfidenceFilter`, unless `confidence.enabled: false`
  globally or `use_confidence_filter: false` on that strategy. See
  `docs/ANALYZERS.md` for the analyzer layer and the Trade Confidence Engine,
  and `docs/LEARNING.md` for the completed-trade learning system and research
  report that run after the backtest.

---

## Extension points

| I want to…                        | Do this                                                        |
|-----------------------------------|----------------------------------------------------------------|
| Add a strategy                    | Subclass `StrategyBase`, `@register("name")`, add to config     |
| Add a confirmation rule           | Implement `SignalFilter.accept()`, attach via `filters=[...]`   |
| Add an order-flow analyzer        | Subclass `Analyzer` in `analysis/`, `@register_analyzer("key")` (see `docs/ANALYZERS.md`) |
| Tune the Trade Confidence Engine  | Edit the `confidence` block in `config.yaml` (thresholds, per-analyzer weights, per-strategy `use_confidence_filter` opt-out) |
| Add an ML gate                    | Fill in `extensions/ml_filter.py` (`features_from` is provided) |
| Change risk / sizing              | Edit the `risk` block in `config.yaml`                          |
| Add a metric                      | Extend `analytics/metrics.py` or `distributions.py`             |
| Add a chart / dashboard panel     | Add a builder in `reporting/charts.py`, wire in `webdashboard`  |
| Support a new instrument          | Set `instrument` (point value / tick size) in config           |

### Toward live/paper trading (deliberately not built yet)

The only place fills are modelled is `Backtester._simulate_trade`. A future live
layer would implement the same *signal → risk check → order → fill* lifecycle
against a broker/paper API, reusing the strategy, risk, analytics and reporting
layers unchanged. The `DayContext`/`Signal`/`RiskManager` interfaces were chosen
so that this is an additive change.

---

## Testing

```bash
python -m pytest -q
```

The suite covers each layer independently: data loading & validation,
timeframes & storage, indicators, the risk manager's sizing and guardrails, the
strategy registry & multi-strategy run, the end-to-end engine, and analytics.
