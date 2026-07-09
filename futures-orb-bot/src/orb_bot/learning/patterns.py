"""Winners-vs-losers pattern mining.

Given the extracted feature table, this finds where win rate and expectancy
differ meaningfully across setups, hours, and market conditions — and, crucially,
only calls a difference a *finding* when the sample is large enough and the
difference is statistically significant. Everything else is labelled
speculative, so the research report never dresses up noise as signal.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional

import numpy as np
import pandas as pd

from .stats import confidence_label, two_proportion_test, wilson_interval

# Dimensions treated as "market conditions".
CONDITION_DIMS = ["session", "trend", "vwap_side", "vp_relation", "vol_regime"]

# Human phrasing for the boolean condition flags.
FLAG_PHRASES: Dict[str, str] = {
    "with_trend": "aligned with the trend",
    "with_vwap": "on the correct side of VWAP",
    "with_delta": "delta confirming direction",
    "with_cvd": "CVD confirming direction",
    "poc_reclaim": "on the trade's side of POC",
    "engine_aligned": "confidence engine agreed",
    "high_confidence": "high confidence score (≥60)",
    "strong_rvol": "strong relative volume",
    "expanding_vol": "expanding volatility",
    "inside_value": "entered inside the value area",
}


@dataclass
class Finding:
    dimension: str
    value: str
    n: int
    wins: int
    win_rate: float
    avg_r: float
    baseline_win_rate: float
    lift: float                       # win_rate − comparison group
    p_value: float
    ci: tuple
    support: str                      # from confidence_label()
    helps: bool                       # True = better than comparison

    @property
    def supported(self) -> bool:
        return self.support == "statistically supported"

    def describe(self) -> str:
        lo, hi = self.ci
        return (f"{self.value}: win {self.win_rate*100:.0f}% "
                f"[{lo*100:.0f}–{hi*100:.0f}%], avg {self.avg_r:+.2f}R, "
                f"n={self.n}, p={self.p_value:.3f} ({self.support})")


@dataclass
class Suggestion:
    """A suggested filter with its evidential strength."""

    text: str
    dimension: str
    value: str
    n: int
    win_rate: float
    baseline: float
    lift: float
    p_value: float
    support: str                      # from confidence_label()

    @property
    def supported(self) -> bool:
        return self.support == "statistically supported"

    @property
    def confidence_pct(self) -> float:
        """A rough 0–100 confidence in the suggestion (1 − p, gated by support)."""
        base = (1.0 - self.p_value) * 100.0
        return round(base if self.support != "speculative" else min(base, 50.0), 1)


@dataclass
class MiningResult:
    n_trades: int = 0
    n_decided: int = 0
    baseline_win_rate: float = 0.0
    avg_r: float = 0.0
    expectancy: float = 0.0
    best_setups: List[Finding] = field(default_factory=list)
    worst_setups: List[Finding] = field(default_factory=list)
    best_hours: List[Finding] = field(default_factory=list)
    worst_hours: List[Finding] = field(default_factory=list)
    best_conditions: List[Finding] = field(default_factory=list)
    win_reasons: List[Finding] = field(default_factory=list)
    lose_reasons: List[Finding] = field(default_factory=list)
    suggestions: List["Suggestion"] = field(default_factory=list)
    recommendations: List[str] = field(default_factory=list)
    speculative: List[str] = field(default_factory=list)


class PatternMiner:
    def __init__(self, min_samples: int = 20, min_lift: float = 0.08):
        self.min_samples = min_samples
        self.min_lift = min_lift

    def run(self, df: pd.DataFrame) -> MiningResult:
        res = MiningResult(n_trades=len(df))
        if df.empty:
            return res
        decided = df[df["result"].isin(["win", "loss"])].copy()
        if decided.empty:
            return res
        decided["win"] = (decided["result"] == "win").astype(int)
        n = len(decided)
        base_wins = int(decided["win"].sum())
        baseline = base_wins / n

        res.n_decided = n
        res.baseline_win_rate = baseline
        res.avg_r = float(decided["realized_r"].mean())
        res.expectancy = float(decided["net_pnl"].mean())

        # Category findings (group vs the rest).
        setups = self._by_category(decided, "setup", base_wins, n)
        hours = self._by_category(decided, "hour", base_wins, n)
        conditions: List[Finding] = []
        for dim in CONDITION_DIMS:
            if dim in decided.columns:
                conditions += self._by_category(decided, dim, base_wins, n)

        res.best_setups = self._top(setups, best=True)
        res.worst_setups = self._top(setups, best=False)
        res.best_hours = self._top(hours, best=True)
        res.worst_hours = self._top(hours, best=False)
        res.best_conditions = self._top(conditions, best=True)

        # Reason findings (flag true vs false).
        reasons = self._by_flags(decided)
        res.win_reasons = [f for f in reasons if f.helps]
        res.lose_reasons = [f for f in reasons if not f.helps]

        res.suggestions = self._suggestions(setups + hours + conditions, reasons)
        res.recommendations = [s.text for s in res.suggestions if s.supported]
        res.speculative = [f"{s.text} [{s.support}]"
                           for s in res.suggestions if not s.supported][:12]
        return res

    # -- category mining ----------------------------------------------------

    def _by_category(self, decided, col, base_wins, base_n) -> List[Finding]:
        findings = []
        for value, group in decided.groupby(col):
            gn = len(group)
            gw = int(group["win"].sum())
            rest_n = base_n - gn
            rest_w = base_wins - gw
            if rest_n <= 0:
                continue
            test = two_proportion_test(gw, gn, rest_w, rest_n)
            wr = gw / gn
            findings.append(Finding(
                dimension=col, value=str(value), n=gn, wins=gw, win_rate=wr,
                avg_r=float(group["realized_r"].mean()),
                baseline_win_rate=base_wins / base_n,
                lift=wr - (rest_w / rest_n),
                p_value=test.p_value, ci=wilson_interval(gw, gn),
                support=confidence_label(gn, test.significant, self.min_samples),
                helps=wr >= (rest_w / rest_n),
            ))
        return findings

    def _by_flags(self, decided) -> List[Finding]:
        findings = []
        for col in [c for c in decided.columns if c.startswith("flag_")]:
            true_g = decided[decided[col]]
            false_g = decided[~decided[col]]
            tn, fn = len(true_g), len(false_g)
            if tn == 0 or fn == 0:
                continue
            tw, fw = int(true_g["win"].sum()), int(false_g["win"].sum())
            test = two_proportion_test(tw, tn, fw, fn)
            wr_true, wr_false = tw / tn, fw / fn
            name = col[len("flag_"):]
            findings.append(Finding(
                dimension="reason", value=FLAG_PHRASES.get(name, name),
                n=tn, wins=tw, win_rate=wr_true,
                avg_r=float(true_g["realized_r"].mean()),
                baseline_win_rate=wr_false, lift=wr_true - wr_false,
                p_value=test.p_value, ci=wilson_interval(tw, tn),
                support=confidence_label(min(tn, fn), test.significant, self.min_samples),
                helps=wr_true >= wr_false,
            ))
        return findings

    # -- ranking / recommendations -----------------------------------------

    def _top(self, findings: List[Finding], best: bool, k: int = 5) -> List[Finding]:
        # Only rank groups with a minimally meaningful size.
        pool = [f for f in findings if f.n >= max(5, self.min_samples // 4)]
        pool.sort(key=lambda f: (f.win_rate, f.avg_r), reverse=best)
        return pool[:k]

    def _suggestions(self, cat_findings, reason_findings) -> List[Suggestion]:
        suggestions: List[Suggestion] = []
        for f in cat_findings + reason_findings:
            if abs(f.lift) < self.min_lift:
                continue
            verb = "Favor" if f.helps else "Avoid"
            if f.dimension == "reason":
                phrase = (f"Require setups {f.value}" if f.helps
                          else f"Filter out trades not {f.value}")
                detail = (f"win {f.win_rate*100:.0f}% vs {f.baseline_win_rate*100:.0f}% "
                          f"without, n={f.n}, p={f.p_value:.3f}")
            else:
                phrase = f"{verb} {f.dimension}={f.value}"
                detail = (f"win {f.win_rate*100:.0f}% vs {f.baseline_win_rate*100:.0f}% "
                          f"baseline, avg {f.avg_r:+.2f}R, n={f.n}, p={f.p_value:.3f}")
            suggestions.append(Suggestion(
                text=f"{phrase} — {detail}.", dimension=f.dimension, value=f.value,
                n=f.n, win_rate=f.win_rate, baseline=f.baseline_win_rate, lift=f.lift,
                p_value=f.p_value, support=f.support,
            ))
        # Supported first, then by strength of effect.
        suggestions.sort(key=lambda s: (s.supported, abs(s.lift)), reverse=True)
        return suggestions
