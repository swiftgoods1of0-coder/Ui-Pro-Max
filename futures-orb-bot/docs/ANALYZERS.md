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
