# Analyzers

The `orb_bot.analysis` package provides **independent, modular analyzers** for
order-flow and market-structure concepts. Each is a small class that reads a
look-ahead-safe snapshot of the market and returns a uniform result, so any set
of them can be combined, run across timeframes, and traced back to the data.

## The contract

Every analyzer returns an `AnalyzerResult` with:

| Field | Meaning |
|-------|---------|
| `direction` | `Bias`: **BULLISH / BEARISH / NEUTRAL** (the signal direction) |
| `confidence` | **0–100** — how strongly the concept reads right now |
| `explanation` | plain-English description of what was detected |
| `levels` | important price levels the read is built on (POC, VWAP, VAH, …) |
| `invalidation` | the price at which the read is wrong (where applicable) |
| `raw` | the raw numbers used, so the score is fully traceable |

`raw["approximation"] = True` marks reads derived from a bar-based proxy rather
than true bid/ask data (see below).

## Analyzers

| Key | Analyzer | Direction logic |
|-----|----------|-----------------|
| `volume_profile` | Volume Profile | price above value area = bullish, below = bearish, inside = neutral |
| `poc` | Point of Control | price above POC bullish, below bearish (distance → confidence) |
| `vah` | Value Area High | acceptance above VAH = bullish breakout; VAH as resistance |
| `val` | Value Area Low | acceptance below VAL = bearish breakdown; VAL as support |
| `hvn` | High Volume Nodes | nearest HVN acts as support (below price) / resistance (above) |
| `lvn` | Low Volume Nodes | thin zone — momentum direction when price is in play |
| `vwap` | VWAP | above session VWAP bullish, below bearish (distance in ATR) |
| `atr` | ATR | volatility regime (non-directional → NEUTRAL; confidence = expansion) |
| `relative_volume` | Relative Volume | RVOL × current bar direction = conviction |
| `delta` | Delta | net aggressive delta over recent bars |
| `cvd` | Cumulative Volume Delta | session CVD slope + price/CVD divergence |
| `imbalance` | Bid/Ask Imbalance | aggressive buy vs sell split on recent bars |
| `absorption` | Absorption | heavy volume + little progress → the absorbing side |
| `swing_high` | Swing Highs | higher highs bullish / lower highs bearish |
| `swing_low` | Swing Lows | higher lows bullish / lower lows bearish |

## Order-flow approximation

True delta, bid/ask imbalance, and absorption require **bid/ask (footprint)**
data, which OHLCV bars don't carry. Those analyzers approximate the aggressor
split using the **close-location value** — where a bar closes within its range —
in `orb_bot/analysis/common.py`. This is a standard, transparent proxy. Because
every analyzer is modular and shares that one helper, a tick-accurate
implementation can replace the proxy with no change to callers.

## Usage

```python
from orb_bot.config import Config
from orb_bot.data import load_market_data
from orb_bot.analysis import analyze_market, analyze_multi_timeframe, AnalysisContext

cfg = Config.from_yaml("config.yaml")
market, _ = load_market_data(cfg, "data/raw")

# One timeframe, latest bar:
for r in analyze_market(market, "5min", config=cfg):
    print(r.summary())

# Multiple timeframes at once:
mtf = analyze_multi_timeframe(market, timeframes=["1min", "5min", "15min"], config=cfg)

# A subset, on a custom context:
ctx = AnalysisContext.from_history(market.primary)
from orb_bot.analysis import analyze
results = analyze(ctx, ["vwap", "poc", "delta", "cvd"])
```

Or from the shell:

```bash
python scripts/analyze_orderflow.py --timeframes 1min 5min 15min
```

## Trade Confidence Engine

`ConfidenceEngine` (`orb_bot/analysis/engine.py`) combines every analyzer into
one explainable **trade-quality score (0–100)** plus separate **long**,
**short**, and **no-trade** scores, supporting reasons, risk warnings, and
conflicting-signal detection.

```python
from orb_bot.analysis import ConfidenceEngine, AnalysisContext
from orb_bot.config import Config

engine = ConfidenceEngine.from_config(Config())
score = engine.score(AnalysisContext.from_market(market, "5min", config=cfg))
print(score.report())
```

```
Trade Quality: 68/100   (LONG)
Long 68 | Short 0 | No-Trade 32

Reasons:
  • Price is above VWAP
  • POC reclaim confirmed
  • Delta supports direction
  • Cumulative delta confirms buying
  • Strong relative volume
```

### How the score is built (no black box)

Each analyzer contributes its 0–100 confidence, signed by direction and scaled
by a configurable weight (`ConfidenceConfig.weights`, defaults in
`DEFAULT_WEIGHTS`). Then:

| Quantity | Definition |
|----------|------------|
| `long_score` / `short_score` | weighted mean confidence of the bullish / bearish analyzers (normalised by *directional* weight, so neutral reads don't dilute) |
| `neutral_score` | weighted mean of neutral analyzers (market balance / uncertainty) |
| `agreement` | `winner / (winner + loser)` — 1.0 means no opposition |
| **`quality`** | `winner × agreement − 0.2 × neutral_score` |
| `no_trade_score` | `(100 − winner) + 0.4·loser + 0.2·neutral + risk penalty` |

A direction is only recommended when `quality ≥ min_trade_confidence` **and** the
winning side beats the other by `min_directional_edge`. Every input is preserved
in `score.raw` and `score.results`, so any recommendation is traceable to the
underlying analyzer readings and the raw data.

### Outputs

- `direction` — `LONG` / `SHORT` / `NO_TRADE`
- `quality`, `long_score`, `short_score`, `no_trade_score` — all 0–100
- `reasons` — why the setup is strong (top supporting analyzers)
- `weaknesses` — detracting factors (opposing analyzers, sub-threshold quality)
- `warnings` — risk messages (elevated ATR, low RVOL, CVD divergence, absorption
  against the bias, conflict present)
- `conflicts` — specific analyzers reading against the dominant bias

### Gating trades on confidence

`ConfidenceFilter` implements the strategy `SignalFilter` protocol: it scores
each candidate signal, attaches the full explainable score to `signal.meta`
(so it flows into the journal and decision log), and vetoes the trade unless the
engine agrees with the direction and quality clears `min_trade_confidence`.

```python
from orb_bot.analysis import ConfidenceFilter
from orb_bot.strategy import ORBStrategy

strat = ORBStrategy(cfg, filters=[ConfidenceFilter.from_config(cfg)])
```

Configure it under `confidence:` in `config.yaml` (`min_trade_confidence`,
`min_directional_edge`, `conflict_threshold`, per-analyzer `weights`).

## Adding an analyzer

```python
from orb_bot.analysis.base import Analyzer, AnalyzerResult, Bias, register_analyzer

@register_analyzer("my_signal")
class MySignalAnalyzer(Analyzer):
    label = "My Signal"
    def analyze(self, ctx):
        # ...read ctx.df / ctx.session / ctx.price (never past ctx.now)...
        return AnalyzerResult(self.label, Bias.BULLISH, 72.0,
                              "why it's bullish", levels={"key": 1.0}, raw={})
```

It is now discoverable via `available_analyzers()` and every runner.
