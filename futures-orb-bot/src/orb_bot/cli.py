"""Command-line interface for the backtester.

Exposed as the ``orb-backtest`` console script (see ``pyproject.toml``) and used
by the root-level ``run_backtest.py`` wrapper. Research / backtesting only — it
never connects to a broker.
"""

from __future__ import annotations

import argparse
from pathlib import Path

from .analytics import compute_metrics
from .config import Config
from .data import load_directory, load_ohlcv
from .engine import Backtester
from .reporting import build_dashboard, export_journal, export_metrics_csv
from .strategy import ORBStrategy


def parse_args(argv=None) -> argparse.Namespace:
    p = argparse.ArgumentParser(prog="orb-backtest", description="Futures ORB backtester")
    p.add_argument("--config", default="config.yaml", help="Path to YAML config")
    p.add_argument(
        "--data",
        default=None,
        help="CSV file or directory of CSVs (defaults to config paths.data_dir)",
    )
    p.add_argument(
        "--output",
        default=None,
        help="Output directory (defaults to config paths.output_dir)",
    )
    p.add_argument(
        "--no-dashboard",
        action="store_true",
        help="Skip chart rendering (still writes the CSV journal)",
    )
    return p.parse_args(argv)


def load_config(path: str) -> Config:
    cfg_path = Path(path)
    if cfg_path.exists():
        print(f"Loading config: {cfg_path}")
        return Config.from_yaml(cfg_path)
    print(f"Config '{cfg_path}' not found — using built-in defaults.")
    return Config()


def load_data(cfg: Config, data_arg: str | None):
    kwargs = dict(
        input_timezone=cfg.data.input_timezone,
        session_timezone=cfg.data.session_timezone,
        resample=cfg.data.resample,
    )
    target = Path(data_arg) if data_arg else Path(cfg.paths.data_dir)
    if target.is_dir():
        print(f"Loading all CSVs in: {target}")
        return load_directory(target, **kwargs)
    print(f"Loading data file: {target}")
    return load_ohlcv(target, **kwargs)


def main(argv=None) -> int:
    args = parse_args(argv)
    cfg = load_config(args.config)

    try:
        df = load_data(cfg, args.data)
    except FileNotFoundError as exc:
        print(f"\nERROR: {exc}")
        print("Tip: generate sample data with scripts/generate_sample_data.py")
        return 1

    print(
        f"Loaded {len(df):,} bars "
        f"({df.index[0]} -> {df.index[-1]}, tz={cfg.data.session_timezone})"
    )

    strategy = ORBStrategy(cfg)  # add filters=[...] here to plug in extensions
    result = Backtester(cfg, strategy).run(df)

    metrics = compute_metrics(result.trades, result.equity_curve, result.starting_equity)

    print("\n" + "=" * 52)
    print(f"  BACKTEST RESULTS — {cfg.instrument.symbol}")
    print("=" * 52)
    print(
        f"Sessions tested     : {result.days_tested} "
        f"({result.days_with_signals} with signals)"
    )
    for line in metrics.summary_lines():
        print(line)
    print("=" * 52)

    out_dir = Path(args.output) if args.output else Path(cfg.paths.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    journal_path = export_journal(result.trades, out_dir / "trade_journal.csv")
    metrics_path = export_metrics_csv(metrics, out_dir / "metrics.csv")
    print(f"\nTrade journal : {journal_path}")
    print(f"Metrics       : {metrics_path}")

    if not args.no_dashboard:
        try:
            paths = build_dashboard(
                result.trades,
                result.equity_curve,
                metrics,
                out_dir,
                title=f"Futures ORB Backtest — {cfg.instrument.symbol}",
            )
            print(f"Dashboard PNG : {paths['png']}")
            print(f"Report HTML   : {paths['html']}")
        except Exception as exc:  # pragma: no cover - reporting is best-effort
            print(f"WARNING: dashboard rendering failed: {exc}")

    return 0
