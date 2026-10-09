"""Tests for the trading research report generator (HTML / PDF / CSV export)."""

import csv
import io

import pandas as pd
import pytest

from orb_bot.analytics.metrics import compute_metrics
from orb_bot.learning.patterns import PatternMiner
from orb_bot.reporting.research_report import (
    build_research_report,
    export_report,
    to_csv,
    to_html,
    to_pdf,
    to_text,
)


def _synthetic_features(n_per=30):
    rows = []
    for i in range(n_per):
        rows.append({"result": "win" if i < int(n_per * 0.75) else "loss",
                     "realized_r": 1.0, "net_pnl": 100.0, "setup": "orb/breakout",
                     "hour": 9, "flag_with_vwap": True})
    for i in range(n_per):
        rows.append({"result": "win" if i < int(n_per * 0.25) else "loss",
                     "realized_r": -0.5, "net_pnl": -50.0, "setup": "orb/breakout",
                     "hour": 9, "flag_with_vwap": False})
    return pd.DataFrame(rows)


def _fake_trades(n_per=30):
    """Build minimal Trade-like objects for compute_metrics."""
    from orb_bot.engine.trade import ExitReason, Trade
    from orb_bot.strategy import Side

    trades = []
    base = pd.Timestamp("2024-01-02 09:00", tz="America/New_York")
    for i in range(n_per * 2):
        win = i < int(n_per * 1.5)
        entry = base + pd.Timedelta(minutes=i)
        trades.append(Trade(
            date=entry.normalize(), side=Side.LONG, mode="breakout",
            entry_time=entry, entry_price=100.0, stop_price=99.0, target_price=102.0,
            contracts=1, strategy_id="orb", exit_time=entry + pd.Timedelta(minutes=10),
            exit_price=102.0 if win else 99.0,
            exit_reason=ExitReason.TARGET if win else ExitReason.STOP,
            gross_pnl=100.0 if win else -50.0, commission=2.0,
            net_pnl=98.0 if win else -52.0, realized_r=2.0 if win else -1.0,
            mae_points=0.0, mfe_points=0.0, equity_after=25000.0 + i,
        ))
    return trades


def _report(n_per=30):
    trades = _fake_trades(n_per)
    equity = pd.Series([t.equity_after for t in trades],
                       index=pd.DatetimeIndex([t.exit_time for t in trades]))
    metrics = compute_metrics(trades, equity, 25000.0)
    mining = PatternMiner(min_samples=20, min_lift=0.08).run(_synthetic_features(n_per))
    return build_research_report(metrics, mining, symbol="ES")


# --------------------------------------------------------------------------- #


def test_build_research_report_carries_metrics_and_mining():
    report = _report()
    assert report.symbol == "ES"
    assert report.metrics.trades > 0
    assert report.mining.n_decided > 0
    assert report.generated_at


def test_to_html_contains_all_required_sections():
    report = _report()
    html_str = to_html(report)
    for needle in ["Total Trades", "Win Rate", "Profit Factor", "Expectancy",
                   "Average R", "Max Drawdown", "Best setups", "Worst setups",
                   "Best hours", "Worst hours", "Best market conditions",
                   "Common winner traits", "Common loser traits",
                   "Suggested filters"]:
        assert needle in html_str, f"missing section: {needle}"


def test_to_html_shows_confidence_and_evidence_badges():
    report = _report()
    html_str = to_html(report)
    # Confidence percentages and evidence classification must be visible.
    assert "%</td>" in html_str
    assert ("badge ok" in html_str or "badge obs" in html_str or "badge spec" in html_str)


def test_to_csv_has_required_summary_metrics(tmp_path):
    report = _report()
    path = to_csv(report, tmp_path / "report.csv")
    assert path.exists()
    with path.open() as fh:
        rows = list(csv.DictReader(fh))
    items = {r["item"] for r in rows if r["section"] == "summary"}
    for required in ["Total trades", "Win rate", "Profit factor", "Expectancy ($/trade)",
                     "Average R", "Max drawdown ($)"]:
        assert required in items
    # Findings and suggestions are present too.
    sections = {r["section"] for r in rows}
    assert "suggested_filter" in sections


def test_to_csv_suggestions_carry_confidence_and_evidence(tmp_path):
    report = _report()
    path = to_csv(report, tmp_path / "report.csv")
    with path.open() as fh:
        rows = [r for r in csv.DictReader(fh) if r["section"] == "suggested_filter"]
    assert rows
    for r in rows:
        assert r["confidence_pct"] != ""
        assert r["evidence"] in ("statistically supported", "observed (not significant)",
                                 "speculative")


def test_to_text_is_readable():
    report = _report()
    text = to_text(report)
    assert "TRADING RESEARCH REPORT" in text
    assert "BEST SETUPS" in text
    assert "SUGGESTED FILTERS" in text


def test_supported_recommendation_flows_through_all_formats(tmp_path):
    # A strong, significant edge (n=60/group) should show up as "supported"
    # in HTML, CSV, and text.
    report = _report(n_per=60)
    assert any(s.supported for s in report.mining.suggestions)

    html_str = to_html(report)
    assert "badge ok" in html_str

    csv_path = to_csv(report, tmp_path / "r.csv")
    with csv_path.open() as fh:
        rows = [r for r in csv.DictReader(fh) if r["section"] == "suggested_filter"]
    assert any(r["evidence"] == "statistically supported" for r in rows)

    text = to_text(report)
    assert "[SUPPORTED" in text


def test_export_report_writes_all_formats(tmp_path):
    report = _report()
    written = export_report(report, tmp_path, basename="rr", formats=["html", "csv", "pdf", "md"])
    assert set(written) == {"html", "csv", "pdf", "md"}
    for fmt, path in written.items():
        assert path.exists() and path.stat().st_size > 0


def test_to_pdf_produces_a_valid_pdf(tmp_path):
    report = _report()
    path = to_pdf(report, tmp_path / "r.pdf")
    assert path.exists()
    data = path.read_bytes()
    assert data[:5] == b"%PDF-"
    assert path.stat().st_size > 500


def test_empty_trades_report_does_not_crash(tmp_path):
    from orb_bot.analytics.metrics import PerformanceMetrics
    from orb_bot.learning.patterns import MiningResult

    report = build_research_report(PerformanceMetrics(), MiningResult(), symbol="ES")
    html_str = to_html(report)
    assert "ES" in html_str
    written = export_report(report, tmp_path, formats=["html", "csv"])
    assert written["html"].exists() and written["csv"].exists()
