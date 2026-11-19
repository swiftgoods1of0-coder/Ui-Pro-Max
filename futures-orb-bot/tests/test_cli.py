"""End-to-end tests for the CLI (orb_bot.cli.main), the platform's primary
user-facing entry point. Exercises the full pipeline (config -> data engine ->
backtest -> analytics -> exports -> dashboard) against real files on disk, the
same way a user invoking `python run_backtest.py` would.
"""

from pathlib import Path

import numpy as np
import pandas as pd

from orb_bot.cli import main


def _write_sample_csv(path: Path, days: int = 5, seed: int = 7) -> None:
    """A few days of 1-min OHLCV data with a clean morning breakout each day,
    written as a vendor-neutral CSV the loader understands."""
    rng = np.random.default_rng(seed)
    rows = []
    price = 4800.0
    day = pd.Timestamp("2024-01-02", tz="UTC")  # Tuesday
    produced = 0
    while produced < days:
        if day.dayofweek >= 5:
            day += pd.Timedelta(days=1)
            continue
        session_start = day + pd.Timedelta(hours=13)  # 08:00 EST == 13:00 UTC
        open_price = price
        for i in range(180):
            ts = session_start + pd.Timedelta(minutes=i)
            drift = 0.08 if i >= 15 else 0.0  # push a breakout after the OR window
            step = rng.normal(drift, 0.6)
            close = open_price + step
            high = max(open_price, close) + abs(rng.normal(0, 0.4))
            low = min(open_price, close) - abs(rng.normal(0, 0.4))
            vol = max(1, int(rng.normal(1200, 300)))
            rows.append({"timestamp": ts.strftime("%Y-%m-%d %H:%M:%S"),
                        "open": round(open_price, 2), "high": round(high, 2),
                        "low": round(low, 2), "close": round(close, 2),
                        "volume": vol})
            open_price = close
        price = open_price
        produced += 1
        day += pd.Timedelta(days=1)

    path.parent.mkdir(parents=True, exist_ok=True)
    pd.DataFrame(rows).to_csv(path, index=False)


def _write_config(path: Path, data_dir: Path) -> None:
    path.write_text(f"""
data:
  input_timezone: "UTC"
paths:
  data_dir: "{data_dir.as_posix()}"
storage:
  enabled: false
strategies:
  - name: "orb"
    id: "orb_breakout"
    enabled: true
    params: {{ modes: ["breakout"] }}
""")


def test_cli_runs_full_pipeline_and_produces_expected_outputs(tmp_path):
    data_dir = tmp_path / "data"
    _write_sample_csv(data_dir / "sample.csv", days=5)
    config_path = tmp_path / "config.yaml"
    out_dir = tmp_path / "out"
    _write_config(config_path, data_dir)

    code = main(["--config", str(config_path), "--output", str(out_dir), "--no-dashboard"])
    assert code == 0

    assert (out_dir / "trade_journal.csv").exists()
    assert (out_dir / "metrics.csv").exists()
    assert (out_dir / "monthly_pnl.csv").exists()
    assert (out_dir / "journals").is_dir()
    # Research report (learning system) outputs.
    assert (out_dir / "research_report.html").exists()
    assert (out_dir / "research_report.csv").exists()


def test_cli_output_flag_relocates_logs_not_just_results(tmp_path):
    """Regression test: --output used to relocate the journal/metrics/
    dashboard but not the run log or decision log, which stayed pinned to
    cfg.logging.log_dir (a fixed config path) — so two parameterized runs with
    different --output dirs would silently overwrite each other's decision
    log in one shared location, disconnected from the journal it explains."""
    data_dir = tmp_path / "data"
    _write_sample_csv(data_dir / "sample.csv", days=3)
    config_path = tmp_path / "config.yaml"
    _write_config(config_path, data_dir)

    out_a = tmp_path / "run_a"
    out_b = tmp_path / "run_b"
    assert main(["--config", str(config_path), "--output", str(out_a),
                "--no-dashboard"]) == 0
    assert main(["--config", str(config_path), "--output", str(out_b),
                "--no-dashboard"]) == 0

    assert (out_a / "logs" / "decisions.jsonl").exists()
    assert (out_a / "logs" / "run.log").exists()
    assert (out_b / "logs" / "decisions.jsonl").exists()
    assert (out_b / "logs" / "run.log").exists()


def test_cli_list_strategies(capsys):
    code = main(["--list-strategies"])
    assert code == 0
    out = capsys.readouterr().out
    assert "orb" in out
    assert "vwap_reversion" in out


def test_cli_missing_data_dir_fails_gracefully(tmp_path, capsys):
    config_path = tmp_path / "config.yaml"
    _write_config(config_path, tmp_path / "nonexistent")
    code = main(["--config", str(config_path), "--output", str(tmp_path / "out"),
                "--no-dashboard"])
    assert code == 1
    assert "ERROR" in capsys.readouterr().out


def test_cli_report_formats_flag_limits_export(tmp_path):
    data_dir = tmp_path / "data"
    _write_sample_csv(data_dir / "sample.csv", days=3)
    config_path = tmp_path / "config.yaml"
    out_dir = tmp_path / "out"
    _write_config(config_path, data_dir)

    code = main(["--config", str(config_path), "--output", str(out_dir),
                "--no-dashboard", "--report-formats", "csv"])
    assert code == 0
    assert (out_dir / "research_report.csv").exists()
    assert not (out_dir / "research_report.pdf").exists()
    assert not (out_dir / "research_report.html").exists()
