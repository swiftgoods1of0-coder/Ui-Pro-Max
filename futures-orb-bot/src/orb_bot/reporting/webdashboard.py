"""The visual dashboard.

Assembles a single, self-contained ``dashboard.html`` — a clean desktop report
(opens in any browser, no server, no external assets) that shows everything a
desk reviews after a run:

* KPI cards (net P&L, win rate, profit factor, expectancy, Sharpe, max DD)
* Strategy status board (each strategy: enabled, trades, win rate, P&L, equity)
* Equity curve + drawdown
* Price chart with entries and exits plotted
* Trade-distribution charts (R multiples, time of day, monthly)
* Monthly and yearly performance tables
* Open-positions panel (empty after a completed backtest) and the full
  closed-trade log
* Decision-log summary explaining why trades were and weren't taken

Everything is inline (charts as base64 PNGs, styles in a ``<style>`` block), so
the file is portable and archivable per run.
"""

from __future__ import annotations

import html
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import pandas as pd

from ..analytics.distributions import (
    monthly_pnl_table,
    per_strategy_breakdown,
    yearly_performance,
)
from ..analytics.metrics import PerformanceMetrics, compute_metrics
from ..engine.trade import Trade
from . import charts


def build_web_dashboard(
    result,
    metrics: PerformanceMetrics,
    market,
    out_dir: str | Path,
    title: str = "Quant Research Dashboard",
) -> Path:
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    imgs = {
        "equity": charts.equity_chart(result),
        "drawdown": charts.drawdown_chart(result),
        "price": charts.price_with_trades_chart(market, result.trades),
        "rdist": charts.r_distribution_chart(result.trades),
        "tod": charts.time_of_day_chart(result.trades),
        "monthly": charts.monthly_chart(result.trades),
    }

    body = "\n".join([
        _header(title, result, metrics),
        _kpi_cards(metrics),
        _strategy_board(result),
        _chart_card("Equity & Drawdown", [imgs["equity"], imgs["drawdown"]]),
        _chart_card("Price — Entries & Exits", [imgs["price"]]),
        _chart_card("Trade Distributions", [imgs["rdist"], imgs["tod"]]),
        _chart_card("Seasonality", [imgs["monthly"]]),
        _tables_section(result.trades),
        _open_positions_panel(),
        _trade_log(result.trades),
        _decision_summary(result.decision_log),
        _footer(),
    ])

    page = _PAGE_TEMPLATE.format(title=html.escape(title), body=body)
    path = out_dir / "dashboard.html"
    path.write_text(page, encoding="utf-8")
    return path


# --------------------------------------------------------------------------- #
# Sections
# --------------------------------------------------------------------------- #


def _header(title, result, metrics) -> str:
    gen = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"""
    <header>
      <div>
        <h1>{html.escape(title)}</h1>
        <div class="sub">{html.escape(result.symbol or 'Instrument')} &middot;
          {result.days_tested} sessions &middot; {metrics.trades} trades &middot;
          generated {gen}</div>
      </div>
      <div class="badge">RESEARCH / BACKTEST — NOT LIVE</div>
    </header>
    """


def _kpi_cards(m: PerformanceMetrics) -> str:
    pf = "∞" if m.profit_factor == float("inf") else f"{m.profit_factor:.2f}"
    cards = [
        ("Net P&L", f"${m.net_pnl:,.0f}", "pos" if m.net_pnl >= 0 else "neg"),
        ("Return", f"{m.return_pct:.1f}%", "pos" if m.return_pct >= 0 else "neg"),
        ("Win Rate", f"{m.win_rate * 100:.1f}%", ""),
        ("Profit Factor", pf, "pos" if m.profit_factor >= 1 else "neg"),
        ("Expectancy", f"${m.expectancy:,.0f}", "pos" if m.expectancy >= 0 else "neg"),
        ("Avg R", f"{m.avg_realized_r:.2f}", ""),
        ("Sharpe", f"{m.sharpe_ratio:.2f}", ""),
        ("Max DD", f"${m.max_drawdown:,.0f}", "neg"),
    ]
    inner = "".join(
        f'<div class="kpi"><div class="kpi-label">{lbl}</div>'
        f'<div class="kpi-value {cls}">{val}</div></div>'
        for lbl, val, cls in cards
    )
    return f'<section class="kpis">{inner}</section>'


def _strategy_board(result) -> str:
    rows = []
    for sid, res in getattr(result, "per_strategy", {}).items():
        sm = compute_metrics(res.trades, res.equity_curve, res.starting_equity)
        status = "ENABLED" if res.trades or True else "IDLE"
        pnl = sm.net_pnl
        rows.append(
            f"<tr><td><span class='dot'></span>{html.escape(sid)}</td>"
            f"<td>{html.escape(res.strategy_name)}</td>"
            f"<td><span class='pill ok'>{status}</span></td>"
            f"<td>{sm.trades}</td>"
            f"<td>{sm.win_rate * 100:.1f}%</td>"
            f"<td class='{'pos' if pnl >= 0 else 'neg'}'>${pnl:,.0f}</td>"
            f"<td>{sm.profit_factor:.2f}</td>"
            f"<td>{sm.sharpe_ratio:.2f}</td>"
            f"<td>${sm.ending_equity:,.0f}</td></tr>"
        )
    if not rows:
        rows.append("<tr><td colspan='9' class='muted'>No strategies.</td></tr>")
    head = ("<tr><th>Strategy</th><th>Type</th><th>Status</th><th>Trades</th>"
            "<th>Win%</th><th>Net P&L</th><th>PF</th><th>Sharpe</th><th>Equity</th></tr>")
    return _card("Strategy Status", f"<table>{head}{''.join(rows)}</table>")


def _tables_section(trades: List[Trade]) -> str:
    monthly = monthly_pnl_table(trades)
    yearly = yearly_performance(trades)
    m_html = _df_to_html(monthly, money=True) if not monthly.empty else _muted("No data")
    y_html = _df_to_html(yearly) if not yearly.empty else _muted("No data")
    return (
        _card("Monthly Net P&L", m_html)
        + _card("Yearly Performance", y_html)
    )


def _open_positions_panel() -> str:
    # A completed historical backtest ends flat; this panel is where live/paper
    # open positions will render once that layer exists.
    note = _muted("No open positions — backtest ends flat. "
                  "This panel will show live/paper open trades when that layer is added.")
    return _card("Open Positions", note)


def _trade_log(trades: List[Trade], limit: int = 300) -> str:
    if not trades:
        return _card("Closed Trades", _muted("No trades."))
    cols = ["date", "strategy", "side", "mode", "entry_time", "exit_time",
            "duration_min", "entry_price", "stop_loss", "take_profit",
            "exit_price", "exit_reason", "contracts", "realized_r", "net_pnl"]
    rows = [t.to_row() for t in sorted(trades, key=lambda t: t.entry_time)]
    shown = rows[-limit:]
    head = "<tr>" + "".join(f"<th>{c}</th>" for c in cols) + "</tr>"
    body_rows = []
    for r in shown:
        cls = "pos" if r["net_pnl"] >= 0 else "neg"
        tds = []
        for c in cols:
            v = r.get(c, "")
            if c == "net_pnl":
                tds.append(f"<td class='{cls}'>${v:,.0f}</td>")
            else:
                tds.append(f"<td>{html.escape(str(v))}</td>")
        body_rows.append("<tr>" + "".join(tds) + "</tr>")
    note = "" if len(rows) <= limit else f"<div class='muted'>Showing last {limit} of {len(rows)}.</div>"
    return _card("Closed Trades",
                 f"<div class='scroll'><table class='log'>{head}{''.join(body_rows)}</table></div>{note}")


def _decision_summary(decision_log) -> str:
    if decision_log is None or not getattr(decision_log, "records", None):
        return _card("Decision Log", _muted("Decision logging was not enabled for this run."))
    counts = decision_log.counts()
    # Break down veto reasons ("why a trade was NOT taken").
    veto_reasons: dict = {}
    for rec in decision_log.records:
        if rec.event == "veto":
            veto_reasons[rec.reason] = veto_reasons.get(rec.reason, 0) + 1
    chips = "".join(
        f"<span class='pill'>{html.escape(k)}: {v}</span>" for k, v in sorted(counts.items())
    )
    veto_rows = "".join(
        f"<tr><td>{html.escape(k)}</td><td>{v}</td></tr>"
        for k, v in sorted(veto_reasons.items(), key=lambda kv: -kv[1])
    ) or "<tr><td colspan='2' class='muted'>No vetoes.</td></tr>"
    inner = (
        f"<div class='chips'>{chips}</div>"
        f"<h4>Why trades were skipped</h4>"
        f"<table><tr><th>Reason</th><th>Count</th></tr>{veto_rows}</table>"
    )
    return _card("Decision Log — Explainability", inner)


def _footer() -> str:
    return ('<footer>Generated by the Futures Quant Research Platform. '
            'Backtesting only — no broker connection.</footer>')


# --------------------------------------------------------------------------- #
# Small render helpers
# --------------------------------------------------------------------------- #


def _card(title: str, inner: str) -> str:
    return f'<section class="card"><h3>{html.escape(title)}</h3>{inner}</section>'


def _chart_card(title: str, images: List[str]) -> str:
    imgs = "".join(f'<img src="data:image/png;base64,{b}" alt="chart">' for b in images)
    return f'<section class="card"><h3>{html.escape(title)}</h3><div class="charts">{imgs}</div></section>'


def _muted(text: str) -> str:
    return f'<div class="muted">{html.escape(text)}</div>'


def _df_to_html(df: pd.DataFrame, money: bool = False) -> str:
    df = df.copy()
    head = "<tr><th>" + str(df.index.name or "") + "</th>" + "".join(
        f"<th>{html.escape(str(c))}</th>" for c in df.columns
    ) + "</tr>"
    rows = []
    for idx, row in df.iterrows():
        tds = [f"<td><b>{html.escape(str(idx))}</b></td>"]
        for c in df.columns:
            v = row[c]
            if isinstance(v, (int, float)):
                cls = "pos" if v > 0 else ("neg" if v < 0 else "")
                txt = f"${v:,.0f}" if money else (f"{v:,.2f}" if isinstance(v, float) else str(v))
                tds.append(f"<td class='{cls}'>{txt}</td>")
            else:
                tds.append(f"<td>{html.escape(str(v))}</td>")
        rows.append("<tr>" + "".join(tds) + "</tr>")
    return f"<div class='scroll'><table>{head}{''.join(rows)}</table></div>"


# --------------------------------------------------------------------------- #
# Page shell
# --------------------------------------------------------------------------- #

_PAGE_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  :root {{
    --bg:#0b1120; --panel:#111a2e; --panel2:#0f1729; --line:#22304d;
    --text:#e2e8f0; --muted:#7c8aa5; --pos:#22c55e; --neg:#ef4444; --accent:#3b82f6;
  }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; background:var(--bg); color:var(--text);
    font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; font-size:14px; }}
  .wrap {{ max-width:1240px; margin:0 auto; padding:28px 22px 80px; }}
  header {{ display:flex; justify-content:space-between; align-items:center;
    padding-bottom:18px; border-bottom:1px solid var(--line); margin-bottom:22px; }}
  h1 {{ margin:0; font-size:22px; letter-spacing:-.3px; }}
  .sub {{ color:var(--muted); font-size:12.5px; margin-top:4px; }}
  .badge {{ background:rgba(59,130,246,.12); color:#93c5fd; border:1px solid #1d4ed8;
    padding:6px 12px; border-radius:999px; font-size:11px; font-weight:600; letter-spacing:.4px; }}
  .kpis {{ display:grid; grid-template-columns:repeat(4,1fr); gap:14px; margin-bottom:22px; }}
  @media(max-width:820px) {{ .kpis {{ grid-template-columns:repeat(2,1fr); }} }}
  .kpi {{ background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:16px; }}
  .kpi-label {{ color:var(--muted); font-size:11.5px; text-transform:uppercase; letter-spacing:.5px; }}
  .kpi-value {{ font-size:24px; font-weight:700; margin-top:6px; font-variant-numeric:tabular-nums; }}
  .card {{ background:var(--panel); border:1px solid var(--line); border-radius:14px;
    padding:20px; margin-bottom:20px; }}
  .card h3 {{ margin:0 0 14px; font-size:15px; }}
  .card h4 {{ margin:16px 0 8px; font-size:13px; color:var(--muted); }}
  .charts {{ display:flex; flex-wrap:wrap; gap:14px; }}
  .charts img {{ flex:1 1 340px; max-width:100%; border-radius:8px; background:#fff; }}
  table {{ border-collapse:collapse; width:100%; font-size:12.5px; }}
  th,td {{ padding:7px 9px; border-bottom:1px solid var(--line); text-align:right; white-space:nowrap; }}
  th:first-child, td:first-child {{ text-align:left; }}
  th {{ color:var(--muted); font-weight:600; font-size:11px; text-transform:uppercase; letter-spacing:.4px; }}
  td {{ font-variant-numeric:tabular-nums; }}
  .scroll {{ overflow-x:auto; }}
  table.log td {{ white-space:nowrap; }}
  .pos {{ color:var(--pos); }} .neg {{ color:var(--neg); }}
  .muted {{ color:var(--muted); font-size:12.5px; }}
  .pill {{ display:inline-block; background:var(--panel2); border:1px solid var(--line);
    color:var(--muted); padding:3px 9px; border-radius:999px; font-size:11px; margin:2px 4px 2px 0; }}
  .pill.ok {{ color:#86efac; border-color:#166534; background:rgba(22,101,52,.2); }}
  .chips {{ margin-bottom:6px; }}
  .dot {{ display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--accent);
    margin-right:8px; vertical-align:middle; }}
  footer {{ color:var(--muted); font-size:11.5px; text-align:center; margin-top:30px; }}
</style>
</head>
<body><div class="wrap">
{body}
</div></body>
</html>"""
