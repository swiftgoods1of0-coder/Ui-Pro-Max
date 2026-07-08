# Data

Drop your OHLCV CSV files into `raw/`. The loader
(`src/orb_bot/data/loader.py`) is forgiving about format:

## Required columns

A timestamp column plus **open, high, low, close**. `volume` is optional
(defaults to 0, though the volume-profile POC needs it to be meaningful).

Header names are auto-detected (case-insensitive), including common aliases:

| Canonical   | Accepted headers                                  |
|-------------|---------------------------------------------------|
| `timestamp` | `timestamp`, `time`, `date`, `datetime`, `date_time` |
| `open`      | `open`, `o`                                       |
| `high`      | `high`, `h`                                       |
| `low`       | `low`, `l`                                         |
| `close`     | `close`, `c`, `last`                              |
| `volume`    | `volume`, `vol`, `v`                             |

## Timezone

Set `data.input_timezone` in `config.yaml` to whatever timezone your file's
timestamps are in (e.g. `"UTC"` or `"America/Chicago"`). If your timestamps
already carry an offset (e.g. `2024-01-02T13:00:00-05:00`) it's respected
automatically. Everything is then converted to `data.session_timezone`
(default `America/New_York`) so "08:00" always means New York wall-clock.

## Example row

```csv
timestamp,open,high,low,close,volume
2024-01-02 13:00:00,4800.00,4801.25,4799.50,4800.75,1234
```

## No data yet?

Generate a synthetic sample to try the pipeline:

```bash
python scripts/generate_sample_data.py --days 15
```
