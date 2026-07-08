"""Command-line interface for the quant research platform.

Orchestrates the full pipeline:

    config -> logging -> data engine -> strategies -> risk-managed backtest
           -> analytics -> journal + period tables -> visual dashboard

Exposed as the ``orb-backtest`` console script and used by the root
``run_backtest.py`` wrapper. Research / backtesting only — never connects to a
broker.
"""

from __future__ import annotations

import argparse
import logging
from pathlib import Path

from .analytics import compute_metrics
from .config import Config
from .data import load_market_data
from .engine import Backtester
from .logging_utils import DecisionLog, setup_logging
from .reporting import (
    build_dashboard,
    build_web_dashboard,
    export_journal,
    export_metrics_csv,
    export_period_tables,
    export_per_strategy_journals,
)
from .strategy import available_strategies


def _run_learning(cfg, result, market, out_dir):
    """Extract per-trade features, mine patterns, and write the research report."""
    from .learning import FeatureExtractor, PatternMiner, TradeFeatureStore
    from .learning.report import write_report

    store = TradeFeatureStore(FeatureExtractor(cfg).extract_all(result.trades, market))
    store.save_csv(out_dir / cfg.learning.features_file)
    mining = PatternMiner(cfg.learning.min_samples, cfg.learning.min_lift).run(store.to_frame())
    report_path = write_report(mining, out_dir / cfg.learning.report_file,
                               symbol=cfg.instrument.symbol,
                               min_samples=cfg.learning.min_samples)

    print("\n" + "=" * 56)
    print("  LEARNING SYSTEM")
    print("=" * 56)
    print(f"Trades analysed     : {mining.n_trades} ({mining.n_decided} decided)")
    print(f"Baseline win rate   : {mining.baseline_win_rate*100:.1f}%")
    if mining.recommendations:
        print(f"Supported findings  : {len(mining.recommendations)}")
        for rec in mining.recommendations[:3]:
            print(f"  ✅ {rec}")
    else:
        print(f"Supported findings  : 0 (need >= {cfg.learning.min_samples} samples/group)")
    if mining.speculative:
        print(f"Speculative         : {len(mining.speculative)} (insufficient sample)")
    print(f"Feature dataset     : {out_dir / cfg.learning.features_file}")
    print(f"Research report     : {report_path}")


def parse_args(argv=None) -> argparse.Namespace:
    p = argparse.ArgumentParser(prog="orb-backtest", description="Futures quant research backtester")
    p.add_argument("--config", default="config.yaml", help="Path to YAML config")
    p.add_argument("--data", default=None, help="CSV file or directory (default: config paths.data_dir)")
    p.add_argument("--output", default=None, help="Output directory (default: config paths.output_dir)")
    p.add_argument("--log-level", default=None, help="Override logging level (DEBUG/INFO/...)")
    p.add_argument("--no-dashboard", action="store_true", help="Skip chart / HTML rendering")
    p.add_argument("--list-strategies", action="store_true", help="List registered strategies and exit")
    return p.parse_args(argv)


def load_config(path: str) -> Config:
    cfg_path = Path(path)
    if cfg_path.exists():
        return Config.from_yaml(cfg_path)
    return Config()


def main(argv=None) -> int:
    args = parse_args(argv)

    # Importing .strategy (above) has registered the built-ins.
    if args.list_strategies:
        print("Registered strategies:", ", ".join(available_strategies()))
        return 0

    cfg = load_config(args.config)
    out_dir = Path(args.output) if args.output else Path(cfg.paths.output_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    log_level = args.log_level or cfg.logging.level
    setup_logging(level=log_level, log_dir=cfg.logging.log_dir, console=cfg.logging.console,
                  run_log_file=cfg.logging.run_log_file)
    log = logging.getLogger("orb_bot.cli")

    # --- data engine ---
    try:
        market, report = load_market_data(cfg, args.data)
    except FileNotFoundError as exc:
        log.error("%s", exc)
        print(f"\nERROR: {exc}\nTip: python scripts/generate_sample_data.py")
        return 1
    print(report.summary())

    # --- risk-managed, multi-strategy backtest ---
    decisions_path = Path(cfg.logging.log_dir) / cfg.logging.decisions_file
    with DecisionLog(decisions_path) as decision_log:
        engine = Backtester(cfg, decision_log=decision_log)
        if not engine.strategies:
            print("No enabled strategies. Check the 'strategies' block in config.yaml.")
            return 1
        result = engine.run(market)

    metrics = compute_metrics(result.trades, result.equity_curve, result.starting_equity)

    # --- console summary ---
    print("\n" + "=" * 56)
    print(f"  BACKTEST RESULTS — {cfg.instrument.symbol}")
    print("=" * 56)
    print(f"Sessions tested     : {result.days_tested}")
    print(f"Strategies          : {', '.join(s.id for s in engine.strategies)}")
    for line in metrics.summary_lines():
        print(line)
    print("-" * 56)
    for sid, res in result.per_strategy.items():
        sm = compute_metrics(res.trades, res.equity_curve, res.starting_equity)
        print(f"  {sid:<16} trades={sm.trades:<4} win={sm.win_rate*100:4.1f}%  "
              f"PF={sm.profit_factor:4.2f}  net=${sm.net_pnl:,.0f}")
    print("=" * 56)

    # --- exports ---
    export_journal(result.trades, out_dir / "trade_journal.csv")
    export_per_strategy_journals(result.trades, out_dir / "journals")
    export_metrics_csv(metrics, out_dir / "metrics.csv")
    export_period_tables(result.trades, out_dir)
    print(f"\nJournal + metrics + period tables -> {out_dir}/")

    # --- completed-trade learning system ---
    if cfg.learning.enabled and result.trades:
        try:
            _run_learning(cfg, result, market, out_dir)
        except Exception:  # pragma: no cover - learning is best-effort
            log.exception("Learning system failed")

    if not args.no_dashboard:
        try:
            dash = build_web_dashboard(
                result, metrics, market, out_dir,
                title=f"{cfg.instrument.symbol} Quant Research Dashboard",
            )
            build_dashboard(result.trades, result.equity_curve, metrics, out_dir,
                            title=f"Futures ORB Backtest — {cfg.instrument.symbol}")
            print(f"Dashboard          -> {dash}")
        except Exception as exc:  # pragma: no cover
            log.exception("Dashboard rendering failed")
            print(f"WARNING: dashboard rendering failed: {exc}")

    return 0
