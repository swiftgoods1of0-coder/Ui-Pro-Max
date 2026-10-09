"""Chart builders for the dashboard.

Each function returns a base64-encoded PNG string so charts can be embedded
directly into a self-contained HTML file (no external image files, no server).
Matplotlib runs on the headless ``Agg`` backend.

The most important one for a trader is :func:`price_with_trades_chart`, which
plots the price series with every entry and exit marked — long/short entries as
up/down triangles and exits coloured by outcome.
"""

from __future__ import annotations

import base64
from io import BytesIO
from typing import List, Optional

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

from ..analytics.distributions import monthly_pnl_table, r_multiples  # noqa: E402
from ..analytics.metrics import time_of_day_table  # noqa: E402
from ..engine.trade import Trade  # noqa: E402
from ..strategy.base import Side  # noqa: E402

WIN = "#16a34a"
LOSS = "#dc2626"
ACCENT = "#2563eb"
MUTED = "#94a3b8"
GRID = "#e2e8f0"

# Palette for per-strategy overlays.
PALETTE = ["#2563eb", "#a855f7", "#f59e0b", "#0ea5e9", "#ec4899", "#10b981"]


def _encode(fig) -> str:
    buf = BytesIO()
    fig.savefig(buf, format="png", dpi=110, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def _style(ax, title):
    ax.set_title(title, fontsize=12, fontweight="bold", color="#0f172a")
    ax.grid(True, alpha=0.3, color=GRID)
    ax.set_facecolor("white")
    for spine in ("top", "right"):
        ax.spines[spine].set_visible(False)


def _empty(ax, msg="No data"):
    ax.text(0.5, 0.5, msg, ha="center", va="center", color=MUTED, fontsize=12)
    ax.set_xticks([])
    ax.set_yticks([])


def equity_chart(result, per_strategy: bool = True) -> str:
    """Combined portfolio equity plus optional per-strategy overlays."""
    fig, ax = plt.subplots(figsize=(9, 3.6))
    _style(ax, "Equity Curve")

    curve = result.equity_curve
    if curve.empty:
        _empty(ax)
        return _encode(fig)

    y = np.concatenate([[result.starting_equity], curve.values])
    ax.plot(range(len(y)), y, color=ACCENT, linewidth=2, label="Portfolio", zorder=3)
    ax.axhline(result.starting_equity, color=MUTED, linestyle="--", linewidth=1)

    if per_strategy and getattr(result, "per_strategy", None):
        for i, (sid, res) in enumerate(result.per_strategy.items()):
            if res.equity_curve.empty:
                continue
            ys = np.concatenate([[res.starting_equity], res.equity_curve.values])
            ax.plot(range(len(ys)), ys, color=PALETTE[(i + 1) % len(PALETTE)],
                    linewidth=1.2, alpha=0.8, label=sid)

    ax.set_xlabel("Trade #")
    ax.set_ylabel("Equity ($)")
    ax.legend(loc="upper left", fontsize=8, frameon=False)
    return _encode(fig)


def drawdown_chart(result) -> str:
    fig, ax = plt.subplots(figsize=(9, 2.6))
    _style(ax, "Drawdown (Underwater)")
    curve = result.equity_curve
    if curve.empty:
        _empty(ax)
        return _encode(fig)
    eq = pd.concat([pd.Series([result.starting_equity]), curve.reset_index(drop=True)])
    dd = eq - eq.cummax()
    x = range(len(dd))
    ax.fill_between(x, dd.values, 0, color=LOSS, alpha=0.3)
    ax.plot(x, dd.values, color=LOSS, linewidth=1)
    ax.set_xlabel("Trade #")
    ax.set_ylabel("Drawdown ($)")
    return _encode(fig)


def r_distribution_chart(trades: List[Trade]) -> str:
    fig, ax = plt.subplots(figsize=(4.5, 3.2))
    _style(ax, "R-Multiple Distribution")
    if not trades:
        _empty(ax)
        return _encode(fig)
    rs = r_multiples(trades)
    order = np.argsort(rs)
    colors = [WIN if rs[i] > 0 else LOSS for i in order]
    ax.bar(range(len(rs)), rs[order], color=colors)
    ax.axhline(0, color="#334155", linewidth=1)
    ax.set_xlabel("Trade (sorted)")
    ax.set_ylabel("R")
    return _encode(fig)


def time_of_day_chart(trades: List[Trade]) -> str:
    fig, ax = plt.subplots(figsize=(4.5, 3.2))
    _style(ax, "Net P&L by Entry Hour")
    table = time_of_day_table(trades)
    if table.empty:
        _empty(ax)
        return _encode(fig)
    colors = [WIN if v >= 0 else LOSS for v in table["net_pnl"]]
    ax.bar(table.index.astype(int), table["net_pnl"].values, color=colors)
    ax.axhline(0, color="#334155", linewidth=1)
    ax.set_xlabel("Hour (NY)")
    ax.set_ylabel("Net P&L ($)")
    return _encode(fig)


def monthly_chart(trades: List[Trade]) -> str:
    fig, ax = plt.subplots(figsize=(9, 2.8))
    _style(ax, "Monthly Net P&L")
    table = monthly_pnl_table(trades)
    if table.empty:
        _empty(ax)
        return _encode(fig)
    months = table.drop(columns=["Total"])
    flat = months.stack()
    labels = [f"{yr}-{mo}" for yr, mo in flat.index]
    values = flat.values
    colors = [WIN if v >= 0 else (LOSS if v < 0 else MUTED) for v in values]
    ax.bar(range(len(values)), values, color=colors)
    ax.axhline(0, color="#334155", linewidth=1)
    step = max(1, len(labels) // 12)
    ax.set_xticks(range(0, len(labels), step))
    ax.set_xticklabels(labels[::step], rotation=45, ha="right", fontsize=7)
    ax.set_ylabel("Net P&L ($)")
    return _encode(fig)


def price_with_trades_chart(market, trades: List[Trade], max_points: int = 4000) -> str:
    """Plot the price series with entries and exits marked.

    X is plotted by bar position (not wall-clock) so overnight gaps don't create
    misleading diagonal lines.
    """
    fig, ax = plt.subplots(figsize=(11, 4.2))
    _style(ax, "Price with Entries & Exits")
    if market is None or not getattr(market, "frames", None):
        _empty(ax)
        return _encode(fig)

    df = market.primary
    if df.empty:
        _empty(ax)
        return _encode(fig)

    # Downsample for very long series to keep the PNG light.
    if len(df) > max_points:
        stride = len(df) // max_points + 1
        df = df.iloc[::stride]

    pos = np.arange(len(df))
    ax.plot(pos, df["close"].values, color="#334155", linewidth=0.8, alpha=0.8)

    idx = df.index
    def _pos_of(ts):
        i = idx.searchsorted(ts)
        return int(min(max(i, 0), len(idx) - 1))

    long_x, long_y, short_x, short_y = [], [], [], []
    win_x, win_y, loss_x, loss_y = [], [], [], []
    for t in trades:
        ex = _pos_of(t.entry_time)
        xx = _pos_of(t.exit_time)
        if t.side is Side.LONG:
            long_x.append(ex); long_y.append(t.entry_price)
        else:
            short_x.append(ex); short_y.append(t.entry_price)
        if t.net_pnl >= 0:
            win_x.append(xx); win_y.append(t.exit_price)
        else:
            loss_x.append(xx); loss_y.append(t.exit_price)

    ax.scatter(long_x, long_y, marker="^", s=55, color=WIN, edgecolor="white",
               linewidth=0.5, label="Long entry", zorder=5)
    ax.scatter(short_x, short_y, marker="v", s=55, color=LOSS, edgecolor="white",
               linewidth=0.5, label="Short entry", zorder=5)
    ax.scatter(win_x, win_y, marker="o", s=28, color=WIN, alpha=0.6,
               label="Exit (win)", zorder=4)
    ax.scatter(loss_x, loss_y, marker="x", s=34, color=LOSS,
               label="Exit (loss)", zorder=4)

    ax.set_xlabel("Bar #")
    ax.set_ylabel("Price")
    ax.legend(loc="upper left", fontsize=8, frameon=False, ncol=2)
    return _encode(fig)
