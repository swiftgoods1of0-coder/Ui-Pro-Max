# Real Order Flow (Footprint Engine)

This is the honest version of order-flow analysis: real per-price-level
bid/ask volume, built from actual trades — not inferred from candle shape.

## The one thing to understand first

**OHLCV bars cannot contain order-flow information.** Open, high, low, close,
and volume tell you nothing about *who* was aggressive at *which price*. No
amount of clever math recovers that from a candle — it was never there to
begin with.

What you do see in `orb_bot.analysis.order_flow` (`delta`, `cvd`, `imbalance`,
`absorption`) is a transparent **proxy**: it estimates the aggressor split from
where a bar closed within its range. It's a reasonable, widely-used estimate,
clearly labelled (`raw["approximation"] = True` on every result), and useful
when it's all you have.

**Real absorption, real stacked imbalances, real delta require tick-by-tick
trade data with an aggressor side** — the exact thing this module works with.
If you have a tick feed (your broker, a data vendor, your own capture), this
is where it gets used for real. If you don't yet, the synthetic generator
below lets you see the whole pipeline working today.

## The pipeline

```
tick data (price, size, aggressor side)
    │   orb_bot.data.ticks.load_ticks()
    ▼
FootprintBar — real per-price-level bid/ask volume
    │   orb_bot.footprint.build_footprint_series()
    ▼
detect_absorption() / detect_stacked_imbalance()
    │   orb_bot.footprint.signals
    ▼
FootprintAbsorptionAnalyzer / StackedImbalanceAnalyzer / FootprintDeltaAnalyzer
    │   orb_bot.analysis.footprint_flow  (uniform analyzer contract)
    ▼
ConfidenceEngine — real analyzers get the highest weight and
                   automatically suppress their OHLCV-approximated
                   counterparts for that call
    ▼
ConfidenceFilter — gates trades, same as any other analyzer
```

Nothing about the rest of the platform needs to change to use this: the
backtester, strategies, risk manager, journal, and dashboard all work exactly
as before. Real order flow slots into the same `AnalysisContext` /
`ConfidenceEngine` seam every other analyzer uses.

## Getting real tick data in

### 1. Tick CSV format

`orb_bot.data.ticks.load_ticks` is forgiving, like the OHLCV loader. Required:
a timestamp, a price, and a size column. The aggressor side is resolved, in
priority order:

1. **An explicit side column** — `side`, `aggressor`, `direction`, `buysell`,
   accepting `buy`/`sell`, `B`/`S`, `+1`/`-1`, or booleans.
2. **Bid/ask columns** alongside price — classified by which side of the
   quoted spread the trade printed on (trades at the ask = buy aggressor,
   at the bid = sell aggressor; exact midpoint trades are left unknown).
3. Otherwise **unknown** (`side = 0`) — never guessed from price movement
   alone, which would fabricate order flow that was never actually observed.

```csv
timestamp,price,size,side
2024-01-02 13:00:00.100,4800.25,5,buy
2024-01-02 13:00:00.250,4800.25,2,sell
```

or with bid/ask instead of an explicit side:

```csv
timestamp,price,size,bid,ask
2024-01-02 13:00:00.100,4800.25,5,4800.00,4800.25
```

### 2. Point the platform at it

```bash
python run_backtest.py --data data/raw/ES_1min.csv --ticks data/raw/ES_ticks.csv
```

or set it once in `config.yaml`:

```yaml
paths:
  data_dir: "data/raw"
  ticks_dir: "data/raw/ticks"   # file or directory; unset = OHLCV-only
```

A problem loading ticks is logged as a warning and the run continues
OHLCV-only — tick data is an enhancement, never a hard requirement.

### 3. Don't have a tick feed yet?

```bash
python scripts/generate_sample_ticks.py --days 10
python run_backtest.py \
    --data data/raw/SAMPLE_ES_1min_ticks.csv \
    --ticks data/raw/SAMPLE_ES_ticks.csv
```

This generates realistic synthetic trades — **not** OHLCV bars with noise
added, actual tick-by-tick data with aggressor tags — including deliberately
engineered absorption and stacked-imbalance scenarios each cycling through the
session, so the real detectors have genuine signatures to find. The matching
OHLCV file is *derived from the same ticks*, so the two are perfectly
consistent (what you'd see on a chart vs. what actually produced it).

## What the real analyzers do

| Key | What it finds |
|-----|----------------|
| `footprint_absorption` | A **specific price** where one side's aggressive volume failed to move the market — the other side had size resting there to absorb it. Flagged `at_extreme` when it happened right at the bar's high/low (a direct test-and-reject). |
| `footprint_imbalance` | **Stacked imbalance**: several consecutive price levels all dominated by the same aggressor side (the classic footprint-chart signal). Confidence is much higher when price actually closes beyond the stack (`broke_through`) — an unconfirmed stack is a weaker, tentative read. |
| `footprint_delta` | Real net aggressor volume (buy − sell) over a short window of footprint bars — the exact number, not the close-location-value estimate. |

Each follows the platform's uniform contract: `direction`, `confidence` (0–100),
a plain-English `explanation`, `levels` (the exact price involved), an
`invalidation` price, and `raw` values including `approximation: False` so
it's always traceable.

### Real data example

```
Stacked Imbalance: BEARISH 60% — 3 consecutive levels (4658.25-4658.75)
  show stacked sell imbalance, confirmed by a close beyond the stack.
  invalidation 4658.75
Footprint Delta: BEARISH 57% — Real net delta over 5 footprint bar(s) is
  -217 (-30% of actual traded volume) — sellers in control.
```

Both read from the same real trades; the stacked-sell levels and the net
delta agree, which is exactly the kind of corroboration the Confidence Engine
is built to surface and explain.

## Real data supersedes the approximation automatically

When a footprint analyzer has real tick data for a given bar, the
corresponding OHLCV-approximated analyzer is **automatically weighted to zero**
for that scoring call — real data is read instead of the proxy, not alongside
it diluting the result:

| Real analyzer | Suppresses (when it has data) |
|---------------|-------------------------------|
| `footprint_absorption` | `absorption` |
| `footprint_imbalance` | `imbalance` |
| `footprint_delta` | `delta`, `cvd` |

This happens inside `ConfidenceEngine._aggregate` — nothing to configure. When
there's no tick data for a run, the footprint analyzers report "no data"
(confidence 0, explicitly excluded from the weighted total, not just
neutral) and the approximations run exactly as they always have.

Real footprint analyzers also carry the **highest default weights** in the
engine (`footprint_absorption` 1.8, `footprint_imbalance` 1.6,
`footprint_delta` 1.5 — compare the approximations' 0.9–1.1), reflecting that
they're reading actual orders, not estimating from candle shape.

## Explore it directly

```bash
python scripts/analyze_orderflow.py \
    --data data/raw/SAMPLE_ES_1min_ticks.csv --ticks data/raw/SAMPLE_ES_ticks.csv
```

Prints "Real order flow: N footprint bars from tick data" and every
analyzer's read, then the combined Trade Confidence Engine score.

Or inspect a specific bar's full footprint in Python:

```python
from orb_bot.config import Config
from orb_bot.data import load_market_data

cfg = Config.from_yaml("config.yaml")
market, _ = load_market_data(cfg, "data/raw/SAMPLE_ES_1min_ticks.csv",
                             ticks_source="data/raw/SAMPLE_ES_ticks.csv")

bar = market.footprint[sorted(market.footprint)[100]]
print(bar.to_frame())       # price / bid_volume / ask_volume / delta per level
print(bar.poc_price, bar.delta, bar.buy_volume, bar.sell_volume)
```

## Performance note

`build_footprint_series` aggregates the entire tick set in a single vectorized
pass (one groupby), not a per-bar loop — tick feeds are routinely orders of
magnitude larger than the equivalent OHLCV series, so this matters. A full
10-day, ~85k-tick backtest builds its footprint bars in well under a second.

## What this doesn't do (yet)

* **No live/paper trading.** Same as the rest of the platform — this reads
  historical tick files for backtesting, not a live market-data feed.
* **No Level 2 / full order book.** This reads *executed trades*, which is
  enough for absorption and stacked imbalance (you can see what traded and
  who was aggressive). True resting-order depth (what's *waiting* at each
  price, not just what traded) would need L2 data — a natural next layer if
  you have it, following the same `Analyzer` contract.
