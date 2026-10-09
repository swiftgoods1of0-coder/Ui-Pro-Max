"""Trading research report generator.

Combines the performance metrics and the learning system's pattern-mining output
into one detailed report and exports it as **HTML, PDF, and CSV**.

The report covers: total trades, win rate, profit factor, expectancy, average R,
max drawdown, best/worst setups, best/worst hours, common winner/loser traits,
and suggested filters — each suggestion carrying a confidence level and an
explicit *statistically supported* vs *speculative* label.

Export engines:
* **HTML** – always available; a self-contained, styled page.
* **CSV**  – always available; one tidy row per finding/suggestion.
* **PDF**  – rendered from the HTML by the best available engine (WeasyPrint or
  a headless Chromium via Playwright); if neither is installed it falls back to
  a dependency-free Matplotlib text PDF, so a PDF is always produced.
"""

from __future__ import annotations

import csv
import html
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional

from ..analytics.metrics import PerformanceMetrics
from ..learning.patterns import Finding, MiningResult, Suggestion


@dataclass
class ResearchReport:
    symbol: str
    metrics: PerformanceMetrics
    mining: MiningResult
    generated_at: str = ""

    def __post_init__(self):
        if not self.generated_at:
            self.generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def build_research_report(metrics: PerformanceMetrics, mining: MiningResult,
                          symbol: str = "") -> ResearchReport:
    return ResearchReport(symbol=symbol, metrics=metrics, mining=mining)


# --------------------------------------------------------------------------- #
# Row model (shared by CSV and, conceptually, every section)
# --------------------------------------------------------------------------- #

_CSV_COLUMNS = ["section", "item", "sample_size", "win_rate_pct", "avg_r",
                "lift_pct", "p_value", "confidence_pct", "evidence", "detail"]


def _metric_rows(m: PerformanceMetrics) -> List[Dict]:
    def row(item, **kw):
        base = dict.fromkeys(_CSV_COLUMNS, "")
        base.update(section="summary", item=item, **kw)
        return base
    pf = "inf" if m.profit_factor == float("inf") else round(m.profit_factor, 2)
    return [
        row("Total trades", sample_size=m.trades),
        row("Win rate", win_rate_pct=round(m.win_rate * 100, 1)),
        row("Profit factor", detail=pf),
        row("Expectancy ($/trade)", detail=round(m.expectancy, 2)),
        row("Average R", avg_r=round(m.avg_realized_r, 2)),
        row("Max drawdown ($)", detail=round(m.max_drawdown, 2)),
        row("Max drawdown (%)", detail=round(m.max_drawdown_pct, 2)),
        row("Sharpe", detail=round(m.sharpe_ratio, 2)),
    ]


def _finding_rows(section: str, findings: List[Finding]) -> List[Dict]:
    rows = []
    for f in findings:
        rows.append({
            "section": section, "item": f"{f.dimension}={f.value}",
            "sample_size": f.n, "win_rate_pct": round(f.win_rate * 100, 1),
            "avg_r": round(f.avg_r, 2), "lift_pct": round(f.lift * 100, 1),
            "p_value": round(f.p_value, 4), "confidence_pct": "",
            "evidence": f.support, "detail": "",
        })
    return rows


def _suggestion_rows(suggestions: List[Suggestion]) -> List[Dict]:
    rows = []
    for s in suggestions:
        rows.append({
            "section": "suggested_filter", "item": s.text.split(" — ")[0],
            "sample_size": s.n, "win_rate_pct": round(s.win_rate * 100, 1),
            "avg_r": "", "lift_pct": round(s.lift * 100, 1),
            "p_value": round(s.p_value, 4), "confidence_pct": s.confidence_pct,
            "evidence": ("statistically supported" if s.supported else s.support),
            "detail": s.text,
        })
    return rows


def _all_rows(report: ResearchReport) -> List[Dict]:
    m, r = report.metrics, report.mining
    rows: List[Dict] = []
    rows += _metric_rows(m)
    rows += _finding_rows("best_setup", r.best_setups)
    rows += _finding_rows("worst_setup", r.worst_setups)
    rows += _finding_rows("best_hour", r.best_hours)
    rows += _finding_rows("worst_hour", r.worst_hours)
    rows += _finding_rows("best_condition", r.best_conditions)
    rows += _finding_rows("winner_trait", r.win_reasons)
    rows += _finding_rows("loser_trait", r.lose_reasons)
    rows += _suggestion_rows(r.suggestions)
    return rows


# --------------------------------------------------------------------------- #
# CSV
# --------------------------------------------------------------------------- #


def to_csv(report: ResearchReport, path: str | Path) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    rows = _all_rows(report)
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=_CSV_COLUMNS)
        writer.writeheader()
        writer.writerows(rows)
    return path


# --------------------------------------------------------------------------- #
# HTML
# --------------------------------------------------------------------------- #


def _badge(support: str) -> str:
    if support == "statistically supported":
        return '<span class="badge ok">supported</span>'
    if support == "speculative":
        return '<span class="badge spec">speculative</span>'
    return '<span class="badge obs">not significant</span>'


def _kpi(label: str, value: str, cls: str = "") -> str:
    return (f'<div class="kpi"><div class="kpi-label">{label}</div>'
            f'<div class="kpi-value {cls}">{value}</div></div>')


def _findings_table(findings: List[Finding]) -> str:
    if not findings:
        return '<div class="muted">No qualifying groups.</div>'
    head = ("<tr><th>Item</th><th>Trades</th><th>Win%</th><th>Avg R</th>"
            "<th>Lift</th><th>p</th><th>Evidence</th></tr>")
    rows = []
    for f in findings:
        wr_cls = "pos" if f.win_rate >= f.baseline_win_rate else "neg"
        rows.append(
            f"<tr><td>{html.escape(f.value)}</td><td>{f.n}</td>"
            f"<td class='{wr_cls}'>{f.win_rate*100:.0f}%</td>"
            f"<td>{f.avg_r:+.2f}</td><td>{f.lift*100:+.0f}%</td>"
            f"<td>{f.p_value:.3f}</td><td>{_badge(f.support)}</td></tr>")
    return f"<table>{head}{''.join(rows)}</table>"


def _suggestions_html(suggestions: List[Suggestion]) -> str:
    if not suggestions:
        return '<div class="muted">No suggestions cleared the minimum effect size.</div>'
    head = ("<tr><th>Suggested filter</th><th>Confidence</th><th>Trades</th>"
            "<th>Win%</th><th>p</th><th>Evidence</th></tr>")
    rows = []
    for s in suggestions:
        rows.append(
            f"<tr><td>{html.escape(s.text.split(' — ')[0])}</td>"
            f"<td>{s.confidence_pct:.0f}%</td><td>{s.n}</td>"
            f"<td>{s.win_rate*100:.0f}%</td><td>{s.p_value:.3f}</td>"
            f"<td>{_badge('statistically supported' if s.supported else s.support)}</td></tr>")
    return f"<table>{head}{''.join(rows)}</table>"


def to_html(report: ResearchReport) -> str:
    m, r = report.metrics, report.mining
    pf = "∞" if m.profit_factor == float("inf") else f"{m.profit_factor:.2f}"

    kpis = "".join([
        _kpi("Total Trades", str(m.trades)),
        _kpi("Win Rate", f"{m.win_rate*100:.1f}%"),
        _kpi("Profit Factor", pf, "pos" if m.profit_factor >= 1 else "neg"),
        _kpi("Expectancy", f"${m.expectancy:,.0f}", "pos" if m.expectancy >= 0 else "neg"),
        _kpi("Average R", f"{m.avg_realized_r:+.2f}"),
        _kpi("Max Drawdown", f"${m.max_drawdown:,.0f}", "neg"),
    ])

    n_supported = sum(1 for s in r.suggestions if s.supported)
    sections = "".join([
        f'<section class="card"><h3>Best setups</h3>{_findings_table(r.best_setups)}</section>',
        f'<section class="card"><h3>Worst setups</h3>{_findings_table(r.worst_setups)}</section>',
        f'<section class="card"><h3>Best hours (NY)</h3>{_findings_table(r.best_hours)}</section>',
        f'<section class="card"><h3>Worst hours (NY)</h3>{_findings_table(r.worst_hours)}</section>',
        f'<section class="card"><h3>Best market conditions</h3>{_findings_table(r.best_conditions)}</section>',
        f'<section class="card"><h3>Common winner traits</h3>{_findings_table(r.win_reasons)}</section>',
        f'<section class="card"><h3>Common loser traits</h3>{_findings_table(r.lose_reasons)}</section>',
        f'<section class="card"><h3>Suggested filters '
        f'<span class="muted">({n_supported} statistically supported)</span></h3>'
        f'{_suggestions_html(r.suggestions)}</section>',
    ])

    return _HTML_TEMPLATE.format(
        symbol=html.escape(report.symbol or "Instrument"),
        generated=report.generated_at,
        overview=(f"{m.trades} trades · {r.n_decided} decided · "
                  f"baseline win {r.baseline_win_rate*100:.1f}%"),
        kpis=kpis, sections=sections,
    )


# --------------------------------------------------------------------------- #
# Plain text (used by the Matplotlib PDF fallback and console)
# --------------------------------------------------------------------------- #


def to_text(report: ResearchReport) -> str:
    m, r = report.metrics, report.mining
    L: List[str] = []
    pf = "inf" if m.profit_factor == float("inf") else f"{m.profit_factor:.2f}"
    L.append(f"TRADING RESEARCH REPORT — {report.symbol}")
    L.append(f"Generated {report.generated_at}")
    L.append("=" * 64)
    L.append("SUMMARY")
    L.append(f"  Total trades   : {m.trades}")
    L.append(f"  Win rate       : {m.win_rate*100:.1f}%")
    L.append(f"  Profit factor  : {pf}")
    L.append(f"  Expectancy     : ${m.expectancy:,.2f}/trade")
    L.append(f"  Average R      : {m.avg_realized_r:+.2f}")
    L.append(f"  Max drawdown   : ${m.max_drawdown:,.2f} ({m.max_drawdown_pct:.1f}%)")
    L.append("")

    def block(title, findings):
        L.append(title)
        if not findings:
            L.append("  (none)")
        for f in findings:
            L.append(f"  {f.value}: win {f.win_rate*100:.0f}% avg {f.avg_r:+.2f}R "
                     f"n={f.n} p={f.p_value:.3f} [{f.support}]")
        L.append("")

    block("BEST SETUPS", r.best_setups)
    block("WORST SETUPS", r.worst_setups)
    block("BEST HOURS", r.best_hours)
    block("WORST HOURS", r.worst_hours)
    block("BEST CONDITIONS", r.best_conditions)
    block("WINNER TRAITS", r.win_reasons)
    block("LOSER TRAITS", r.lose_reasons)

    L.append("SUGGESTED FILTERS (confidence · evidence)")
    if not r.suggestions:
        L.append("  (none)")
    for s in r.suggestions:
        tag = "SUPPORTED" if s.supported else s.support.upper()
        L.append(f"  [{tag} {s.confidence_pct:.0f}%] {s.text}")
    L.append("")
    L.append(f"Method: two-proportion z-test; 'supported' requires "
             f">= sample threshold and p < 0.05.")
    return "\n".join(L)


# --------------------------------------------------------------------------- #
# PDF (engine chain: WeasyPrint -> Playwright/Chromium -> Matplotlib fallback)
# --------------------------------------------------------------------------- #


def to_pdf(report: ResearchReport, path: str | Path) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    html_str = to_html(report)

    if _try_weasyprint(html_str, path):
        return path
    if _try_playwright(html_str, path):
        return path
    _matplotlib_pdf(report, path)
    return path


def _try_weasyprint(html_str: str, path: Path) -> bool:
    try:
        from weasyprint import HTML  # type: ignore
    except Exception:
        return False
    try:
        HTML(string=html_str).write_pdf(str(path))
        return True
    except Exception:
        return False


def _try_playwright(html_str: str, path: Path) -> bool:
    try:
        from playwright.sync_api import sync_playwright  # type: ignore
    except Exception:
        return False
    try:
        with sync_playwright() as p:
            browser = _launch_chromium(p)
            page = browser.new_page()
            page.set_content(html_str, wait_until="load")
            page.pdf(path=str(path), format="A4", print_background=True,
                     margin={"top": "12mm", "bottom": "12mm",
                             "left": "10mm", "right": "10mm"})
            browser.close()
        return True
    except Exception:
        return False


def _launch_chromium(p):
    import os
    exe = os.path.join(os.environ.get("PLAYWRIGHT_BROWSERS_PATH", ""), "chromium")
    if os.path.exists(exe):
        return p.chromium.launch(executable_path=exe)
    return p.chromium.launch()


def _matplotlib_pdf(report: ResearchReport, path: Path) -> None:
    """Dependency-free fallback: paginate the plain-text report into a PDF."""
    import matplotlib

    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    from matplotlib.backends.backend_pdf import PdfPages

    text = to_text(report)
    lines = text.split("\n")
    per_page = 52
    with PdfPages(path) as pdf:
        for i in range(0, len(lines), per_page):
            chunk = lines[i:i + per_page]
            fig = plt.figure(figsize=(8.27, 11.69))  # A4 portrait
            fig.text(0.06, 0.96, "\n".join(chunk), family="monospace",
                     fontsize=9, va="top")
            pdf.savefig(fig)
            plt.close(fig)


# --------------------------------------------------------------------------- #
# One-call export
# --------------------------------------------------------------------------- #


def export_report(report: ResearchReport, out_dir: str | Path,
                  basename: str = "research_report",
                  formats: Optional[List[str]] = None) -> Dict[str, Path]:
    """Export the report in the requested formats. Returns {fmt: path}."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    formats = formats or ["html", "csv", "pdf"]
    written: Dict[str, Path] = {}
    for fmt in formats:
        if fmt == "html":
            p = out_dir / f"{basename}.html"
            p.write_text(to_html(report), encoding="utf-8")
            written["html"] = p
        elif fmt == "csv":
            written["csv"] = to_csv(report, out_dir / f"{basename}.csv")
        elif fmt == "pdf":
            written["pdf"] = to_pdf(report, out_dir / f"{basename}.pdf")
        elif fmt in ("md", "markdown"):
            from ..learning.report import generate_markdown
            p = out_dir / f"{basename}.md"
            p.write_text(generate_markdown(report.mining, symbol=report.symbol),
                         encoding="utf-8")
            written["md"] = p
    return written


# --------------------------------------------------------------------------- #

_HTML_TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Research Report — {symbol}</title>
<style>
  :root {{ --bg:#0b1120; --panel:#111a2e; --line:#22304d; --text:#e2e8f0;
    --muted:#7c8aa5; --pos:#22c55e; --neg:#ef4444; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--text);
    font-family:-apple-system,Segoe UI,Roboto,sans-serif; font-size:14px; }}
  .wrap {{ max-width:1080px; margin:0 auto; padding:28px 22px 70px; }}
  header {{ border-bottom:1px solid var(--line); padding-bottom:16px; margin-bottom:22px; }}
  h1 {{ margin:0; font-size:22px; }}
  .sub {{ color:var(--muted); font-size:12.5px; margin-top:4px; }}
  .kpis {{ display:grid; grid-template-columns:repeat(6,1fr); gap:12px; margin-bottom:22px; }}
  @media(max-width:820px){{ .kpis{{ grid-template-columns:repeat(3,1fr); }} }}
  .kpi {{ background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:14px; }}
  .kpi-label {{ color:var(--muted); font-size:11px; text-transform:uppercase; letter-spacing:.5px; }}
  .kpi-value {{ font-size:22px; font-weight:700; margin-top:6px; }}
  .card {{ background:var(--panel); border:1px solid var(--line); border-radius:14px;
    padding:18px; margin-bottom:18px; break-inside:avoid; }}
  .card h3 {{ margin:0 0 12px; font-size:15px; }}
  table {{ border-collapse:collapse; width:100%; font-size:12.5px; }}
  th,td {{ padding:7px 9px; border-bottom:1px solid var(--line); text-align:right; }}
  th:first-child, td:first-child {{ text-align:left; }}
  th {{ color:var(--muted); font-weight:600; font-size:11px; text-transform:uppercase; }}
  .pos {{ color:var(--pos); }} .neg {{ color:var(--neg); }}
  .muted {{ color:var(--muted); font-size:12px; }}
  .badge {{ padding:2px 8px; border-radius:999px; font-size:10.5px; font-weight:600; }}
  .badge.ok {{ color:#86efac; background:rgba(22,101,52,.25); border:1px solid #166534; }}
  .badge.spec {{ color:#fcd34d; background:rgba(120,80,10,.25); border:1px solid #a16207; }}
  .badge.obs {{ color:#93c5fd; background:rgba(29,78,216,.2); border:1px solid #1d4ed8; }}
  footer {{ color:var(--muted); font-size:11px; text-align:center; margin-top:26px; }}
</style></head>
<body><div class="wrap">
  <header><h1>Trading Research Report — {symbol}</h1>
    <div class="sub">{overview} · generated {generated} · research only, not advice</div>
  </header>
  <div class="kpis">{kpis}</div>
  {sections}
  <footer>Method: two-proportion z-test vs comparison group; a finding is
    "supported" only with a sufficient sample and p &lt; 0.05.
    Win-rate figures use decided (win/loss) trades.</footer>
</div></body></html>"""
