"""Results dashboard.

Renders the backtest into a single PNG of charts and a self-contained HTML
report (the PNG is embedded, so the report is one portable file).

Charts:
    1. Equity curve
    2. Drawdown (underwater) curve
    3. Distribution of realised R multiples
    4. Net P&L by entry hour (best / worst time of day)
    5. Net P&L by setup mode
    6. Win / loss counts

Matplotlib runs on the non-interactive ``Agg`` backend so this works headless
(CI, servers) with no display.
"""

from __future__ import annotations

import base64
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import List

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

from ..analytics.metrics import PerformanceMetrics, time_of_day_table  # noqa: E402
from ..engine.trade import Trade  # noqa: E402

_WIN = "#16a34a"
_LOSS = "#dc2626"
_ACCENT = "#2563eb"
_MUTED = "#64748b"


def build_dashboard(
    trades: List[Trade],
    equity_curve: pd.Series,
    metrics: PerformanceMetrics,
    output_dir: str | Path,
    title: str = "Futures ORB Backtest",
) -> dict:
    """Render the dashboard PNG + HTML report into ``output_dir``.

    Returns a dict with the ``png`` and ``html`` paths written.
    """
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    fig = _build_figure(trades, equity_curve, metrics, title)

    png_path = output_dir / "dashboard.png"
    fig.savefig(png_path, dpi=120, bbox_inches="tight", facecolor="white")

    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=120, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    encoded = base64.b64encode(buf.getvalue()).decode("ascii")

    html_path = output_dir / "report.html"
    html_path.write_text(_render_html(metrics, encoded, title), encoding="utf-8")

    return {"png": png_path, "html": html_path}


# --------------------------------------------------------------------------- #
# Figure
# --------------------------------------------------------------------------- #


def _build_figure(trades, equity_curve, metrics, title):
    fig, axes = plt.subplots(3, 2, figsize=(14, 13))
    fig.suptitle(title, fontsize=16, fontweight="bold")

    _plot_equity(axes[0, 0], equity_curve, metrics.starting_equity)
    _plot_drawdown(axes[0, 1], equity_curve, metrics.starting_equity)
    _plot_r_distribution(axes[1, 0], trades)
    _plot_time_of_day(axes[1, 1], trades)
    _plot_by_mode(axes[2, 0], trades)
    _plot_win_loss(axes[2, 1], metrics)

    fig.tight_layout(rect=(0, 0, 1, 0.97))
    return fig


def _empty(ax, msg="No trades"):
    ax.text(0.5, 0.5, msg, ha="center", va="center", color=_MUTED, fontsize=12)
    ax.set_xticks([])
    ax.set_yticks([])


def _plot_equity(ax, equity_curve, starting_equity):
    ax.set_title("Equity Curve")
    if equity_curve.empty:
        return _empty(ax)
    series = pd.concat(
        [pd.Series([starting_equity], index=[equity_curve.index[0]]), equity_curve]
    )
    ax.plot(range(len(series)), series.values, color=_ACCENT, linewidth=1.6)
    ax.axhline(starting_equity, color=_MUTED, linestyle="--", linewidth=1)
    ax.set_xlabel("Trade #")
    ax.set_ylabel("Equity ($)")
    ax.grid(True, alpha=0.25)


def _plot_drawdown(ax, equity_curve, starting_equity):
    ax.set_title("Drawdown (Underwater)")
    if equity_curve.empty:
        return _empty(ax)
    series = pd.concat([pd.Series([starting_equity]), equity_curve.reset_index(drop=True)])
    dd = series - series.cummax()
    x = range(len(dd))
    ax.fill_between(x, dd.values, 0, color=_LOSS, alpha=0.35)
    ax.plot(x, dd.values, color=_LOSS, linewidth=1)
    ax.set_xlabel("Trade #")
    ax.set_ylabel("Drawdown ($)")
    ax.grid(True, alpha=0.25)


def _plot_r_distribution(ax, trades):
    ax.set_title("Realised R Multiple Distribution")
    if not trades:
        return _empty(ax)
    rs = np.array([t.realized_r for t in trades], dtype=float)
    colors = [_WIN if r > 0 else _LOSS for r in rs]
    ax.bar(range(len(rs)), sorted(rs), color=[c for _, c in sorted(zip(rs, colors))])
    ax.axhline(0, color=_MUTED, linewidth=1)
    ax.set_xlabel("Trade (sorted)")
    ax.set_ylabel("R multiple")
    ax.grid(True, alpha=0.25)


def _plot_time_of_day(ax, trades):
    ax.set_title("Net P&L by Entry Hour")
    table = time_of_day_table(trades)
    if table.empty:
        return _empty(ax)
    colors = [_WIN if v >= 0 else _LOSS for v in table["net_pnl"]]
    ax.bar(table.index.astype(int), table["net_pnl"].values, color=colors)
    ax.axhline(0, color=_MUTED, linewidth=1)
    ax.set_xlabel("Hour of day (NY)")
    ax.set_ylabel("Net P&L ($)")
    ax.grid(True, alpha=0.25)


def _plot_by_mode(ax, trades):
    ax.set_title("Net P&L by Setup")
    if not trades:
        return _empty(ax)
    agg: dict[str, float] = {}
    for t in trades:
        agg[t.mode] = agg.get(t.mode, 0.0) + t.net_pnl
    modes = list(agg.keys())
    values = [agg[m] for m in modes]
    colors = [_WIN if v >= 0 else _LOSS for v in values]
    ax.bar(modes, values, color=colors)
    ax.axhline(0, color=_MUTED, linewidth=1)
    ax.set_ylabel("Net P&L ($)")
    ax.grid(True, alpha=0.25, axis="y")


def _plot_win_loss(ax, metrics):
    ax.set_title("Win / Loss")
    if metrics.trades == 0:
        return _empty(ax)
    labels = ["Wins", "Losses", "Scratch"]
    values = [metrics.wins, metrics.losses, metrics.scratches]
    colors = [_WIN, _LOSS, _MUTED]
    ax.bar(labels, values, color=colors)
    ax.set_ylabel("Count")
    for i, v in enumerate(values):
        ax.text(i, v, str(v), ha="center", va="bottom")
    ax.grid(True, alpha=0.25, axis="y")


# --------------------------------------------------------------------------- #
# HTML
# --------------------------------------------------------------------------- #


def _render_html(metrics: PerformanceMetrics, png_b64: str, title: str) -> str:
    rows = "".join(
        f"<tr><td>{line.split(':', 1)[0].strip()}</td>"
        f"<td>{line.split(':', 1)[1].strip()}</td></tr>"
        for line in metrics.summary_lines()
    )
    generated = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<style>
  :root {{ color-scheme: light dark; }}
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif; margin: 0;
          background: #0f172a; color: #e2e8f0; }}
  .wrap {{ max-width: 1100px; margin: 0 auto; padding: 32px 20px 64px; }}
  h1 {{ font-size: 22px; margin: 0 0 4px; }}
  .sub {{ color: #94a3b8; font-size: 13px; margin-bottom: 24px; }}
  .card {{ background: #1e293b; border: 1px solid #334155; border-radius: 12px;
           padding: 20px; margin-bottom: 24px; }}
  table {{ border-collapse: collapse; width: 100%; font-size: 14px; }}
  td {{ padding: 8px 10px; border-bottom: 1px solid #334155; }}
  td:first-child {{ color: #94a3b8; width: 45%; }}
  td:last-child {{ font-variant-numeric: tabular-nums; font-weight: 600; }}
  img {{ width: 100%; height: auto; border-radius: 8px; }}
</style>
</head>
<body>
  <div class="wrap">
    <h1>{title}</h1>
    <div class="sub">Generated {generated} &middot; research / backtest only — not live trading</div>
    <div class="card"><table>{rows}</table></div>
    <div class="card"><img src="data:image/png;base64,{png_b64}" alt="dashboard"></div>
  </div>
</body>
</html>"""
