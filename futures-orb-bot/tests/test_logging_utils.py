"""Tests for logging setup and the structured decision log."""

import json
import logging

from orb_bot.logging_utils import DecisionLog, setup_logging


def test_setup_logging_reconfigures_on_second_call(tmp_path):
    """Regression test: setup_logging used to set a module-level "configured"
    flag and silently no-op on every call after the first, so a second call
    with a different log_dir/level had no effect — a real footgun for any
    programmatic use (e.g. running several backtests with different configs
    in one process). A second call must actually take effect."""
    dir_a = tmp_path / "a"
    dir_b = tmp_path / "b"

    setup_logging(level="INFO", log_dir=dir_a, console=False, run_log_file="run.log")
    root = logging.getLogger("orb_bot")
    assert root.level == logging.INFO
    assert (dir_a / "run.log").exists()

    setup_logging(level="DEBUG", log_dir=dir_b, console=False, run_log_file="run.log")
    assert root.level == logging.DEBUG, "second call must update the level"
    assert (dir_b / "run.log").exists(), "second call must log to the new directory"

    # Exactly one file handler should be attached — not one accumulating per call.
    file_handlers = [h for h in root.handlers if hasattr(h, "baseFilename")]
    assert len(file_handlers) == 1


def test_decision_log_records_and_streams_to_file(tmp_path):
    path = tmp_path / "decisions.jsonl"
    with DecisionLog(path) as log:
        log.signal("orb_breakout", "2024-01-02T08:20:00", reason="breakout", side="long")
        log.veto("orb_breakout", "2024-01-02T08:21:00", reason="confidence")
        log.opened("orb_breakout", "2024-01-02T08:22:00", reason="breakout")
        log.closed("orb_breakout", "2024-01-02T08:45:00", reason="target", net_pnl=100.0)

    assert log.counts() == {
        "signal_generated": 1, "veto": 1, "trade_opened": 1, "trade_closed": 1,
    }
    lines = path.read_text().strip().split("\n")
    assert len(lines) == 4
    first = json.loads(lines[0])
    assert first["event"] == "signal_generated"
    assert first["strategy"] == "orb_breakout"
    assert first["details"]["side"] == "long"


def test_decision_log_without_path_still_works_in_memory():
    log = DecisionLog()  # no file — in-memory only
    log.signal("s", None, reason="test")
    assert len(log.records) == 1
    assert log.counts() == {"signal_generated": 1}
