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
| `delta` | Delta | net aggressive delta over recent bars (OHLCV approximation) |
| `cvd` | Cumulative Volume Delta | session CVD slope + price/CVD divergence (OHLCV approximation) |
| `imbalance` | Bid/Ask Imbalance | aggressive buy vs sell split on recent bars (OHLCV approximation) |
| `absorption` | Absorption | heavy volume + little progress → the absorbing side (OHLCV approximation) |
| `footprint_absorption` | **Footprint Absorption** | real per-price absorption from tick data — see `docs/ORDER_FLOW.md` |
| `footprint_imbalance` | **Stacked Imbalance** | real consecutive-level imbalance from tick data — see `docs/ORDER_FLOW.md` |
| `footprint_delta` | **Footprint Delta** | real net aggressor volume from tick data — see `docs/ORDER_FLOW.md` |
| `swing_high` | Swing Highs | higher highs bullish / lower highs bearish |
| `swing_low` | Swing Lows | higher lows bullish / lower lows bearish |

## Order-flow approximation vs. the real thing

True delta, bid/ask imbalance, and absorption require **bid/ask (footprint)**
data, which OHLCV bars don't carry. `delta`/`cvd`/`imbalance`/`absorption`
approximate the aggressor split using the **close-location value** — where a
bar closes within its range — in `orb_bot/analysis/common.py`. This is a
standard, transparent proxy, clearly flagged (`raw["approximation"] = True`).

**If you have tick data, use it.** `footprint_absorption`, `footprint_imbalance`,
and `footprint_delta` read real per-price-level bid/ask volume built from
actual trades — not estimated from candle shape — and automatically take over
from their approximated counterparts when real data is available for a given
call. See **`docs/ORDER_FLOW.md`** for the full picture: the tick data format,
how to point the platform at a tick feed (`--ticks`), the synthetic tick
generator for trying it today, and exactly how the suppression works.

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

**It is wired in automatically.** `build_strategies()` attaches a shared
`ConfidenceFilter` to every strategy whose effective confidence setting is
enabled — each strategy's own `use_confidence_filter`, or the global
`confidence.enabled` when that's left unset. You don't need to attach it by
hand unless you're constructing a strategy directly (bypassing the registry),
as in the snippet below.

```python
from orb_bot.analysis import ConfidenceFilter
from orb_bot.strategy import ORBStrategy

strat = ORBStrategy(cfg, filters=[ConfidenceFilter.from_config(cfg)])
```

Configure it under `confidence:` in `config.yaml` (`min_trade_confidence`,
`min_directional_edge`, `conflict_threshold`, per-analyzer `weights`).

**Opt out per strategy — this matters for counter-trend strategies.** The
engine's analyzers are trend-confirmation reads: "price below VWAP" scores
bearish, a lower swing low scores bearish, and so on. That's the right read for
a breakout strategy, but a mean-reversion strategy's best setups are exactly
the ones that look "wrong" by those reads — it buys *because* price is
stretched below VWAP, expecting a bounce. Force the same filter onto it and it
can reject the strategy's entire premise, not just its weak trades (empirically:
100% of a mean-reversion strategy's candidates vetoed in one test run — not
useful quality control, just a structural lockout).

Set `use_confidence_filter: false` on that strategy's entry in `config.yaml`:

```yaml
strategies:
  - name: "orb"
    id: "orb_breakout"
    enabled: true
    # use_confidence_filter unset -> inherits confidence.enabled (trend-
    # confirmation reads are appropriate for a breakout strategy)

  - name: "vwap_reversion"
    id: "vwap_mr"
    enabled: true
    use_confidence_filter: false   # counter-trend: opt out
```

A strategy that opts out still gets every other benefit of the platform
(risk management, the learning system, the research report) — the learning
system in particular will independently discover if it's a loser, with proper
statistical evidence, rather than having it silently erased upstream.

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
