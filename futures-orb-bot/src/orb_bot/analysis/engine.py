"""The Trade Confidence Engine.

Combines every analyzer's read into a single, explainable trade-quality score
from 0–100, together with separate **long**, **short**, and **no-trade** scores,
supporting reasons, risk warnings, and conflicting-signal detection.

The scoring is fully transparent — no black box. Each analyzer contributes its
0–100 confidence, signed by its direction and scaled by a configurable weight;
the engine aggregates those into side scores and derives everything else from
them. Every number that goes into the score is preserved in ``TradeScore.raw``
and the underlying results, so any recommendation is traceable back to the data.

Model (all quantities 0–100 unless noted):

    long_score    = weighted mean of bullish analyzers' confidence
    short_score   = weighted mean of bearish analyzers' confidence
    neutral_score = weighted mean of neutral analyzers' confidence
    winner / loser = max / min of (long_score, short_score)
    agreement     = winner / (winner + loser)          # 1.0 == no opposition
    quality       = winner * agreement − 0.2 * neutral_score
    no_trade      = (100 − winner) + 0.4*loser + 0.2*neutral_score + risk penalty

A direction is only recommended when quality clears ``min_trade_confidence`` and
the winning side beats the other by at least ``min_directional_edge``.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional

from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, build_analyzers, clamp

# Default per-analyzer weights. Directional-quality reads (structure, VWAP,
# POC, delta, CVD) carry more; ATR is non-directional (0) and feeds warnings.
DEFAULT_WEIGHTS: Dict[str, float] = {
    "swing_high": 1.2, "swing_low": 1.2,
    "poc": 1.2, "vwap": 1.2, "delta": 1.1, "cvd": 1.1,
    "volume_profile": 1.0, "imbalance": 0.9, "absorption": 0.9,
    "vah": 0.8, "val": 0.8, "relative_volume": 0.8,
    "hvn": 0.6, "lvn": 0.6,
    "atr": 0.0,
}

# Short human phrases for supporting reasons, keyed by analyzer label.
# (bullish phrase, bearish phrase)
_REASON_PHRASES: Dict[str, tuple] = {
    "VWAP": ("Price is above VWAP", "Price is below VWAP"),
    "Point of Control": ("POC reclaim confirmed", "POC rejection confirmed"),
    "Volume Profile": ("Trading above value area", "Trading below value area"),
    "Value Area High": ("Broke above value-area high", "Rejected at value-area high"),
    "Value Area Low": ("Holding above value-area low", "Broke below value-area low"),
    "High Volume Nodes": ("Resting on high-volume support", "Capped by high-volume resistance"),
    "Low Volume Nodes": ("Momentum through low-volume node", "Momentum through low-volume node"),
    "Delta": ("Delta supports direction", "Delta supports direction"),
    "Cumulative Volume Delta": ("Cumulative delta confirms buying", "Cumulative delta confirms selling"),
    "Bid/Ask Imbalance": ("Aggressive buyers dominate", "Aggressive sellers dominate"),
    "Absorption": ("Absorption favors longs", "Absorption favors shorts"),
    "Relative Volume": ("Strong relative volume", "Strong relative volume"),
    "Swing Highs": ("Higher highs — clean structure", "Lower highs — bearish structure"),
    "Swing Lows": ("Higher lows — clean structure", "Lower lows — bearish structure"),
}


class TradeDirection(str, Enum):
    LONG = "long"
    SHORT = "short"
    NO_TRADE = "no_trade"


@dataclass
class TradeScore:
    """The engine's verdict for a single moment / candidate trade."""

    direction: TradeDirection
    quality: float                       # 0–100 overall trade quality
    long_score: float                    # 0–100
    short_score: float                   # 0–100
    no_trade_score: float                # 0–100
    reasons: List[str] = field(default_factory=list)       # why it's strong
    weaknesses: List[str] = field(default_factory=list)    # why it's weak
    warnings: List[str] = field(default_factory=list)      # risk warnings
    conflicts: List[str] = field(default_factory=list)     # opposing signals
    results: List[AnalyzerResult] = field(default_factory=list)
    raw: Dict = field(default_factory=dict)

    @property
    def tradeable(self) -> bool:
        return self.direction is not TradeDirection.NO_TRADE

    def to_dict(self) -> Dict:
        return {
            "direction": self.direction.value,
            "quality": round(self.quality, 1),
            "long_score": round(self.long_score, 1),
            "short_score": round(self.short_score, 1),
            "no_trade_score": round(self.no_trade_score, 1),
            "reasons": self.reasons,
            "weaknesses": self.weaknesses,
            "warnings": self.warnings,
            "conflicts": self.conflicts,
            "raw": self.raw,
            "analyzers": [r.to_dict() for r in self.results],
        }

    def report(self) -> str:
        """Human-readable summary block."""
        lines = [f"Trade Quality: {self.quality:.0f}/100   "
                 f"({self.direction.value.upper()})"]
        lines.append(f"Long {self.long_score:.0f} | Short {self.short_score:.0f} "
                     f"| No-Trade {self.no_trade_score:.0f}")
        if self.reasons:
            lines.append("\nReasons:")
            lines += [f"  • {r}" for r in self.reasons]
        if self.conflicts:
            lines.append("\nConflicting signals:")
            lines += [f"  • {c}" for c in self.conflicts]
        if self.warnings:
            lines.append("\nRisk warnings:")
            lines += [f"  ⚠ {w}" for w in self.warnings]
        return "\n".join(lines)


class ConfidenceEngine:
    """Aggregates analyzer outputs into a :class:`TradeScore`."""

    def __init__(
        self,
        analyzers: Optional[List[Analyzer]] = None,
        weights: Optional[Dict[str, float]] = None,
        min_trade_confidence: float = 60.0,
        min_directional_edge: float = 10.0,
        conflict_threshold: float = 45.0,
    ):
        self.analyzers = analyzers if analyzers is not None else build_analyzers()
        self.weights = {**DEFAULT_WEIGHTS, **(weights or {})}
        self.min_trade_confidence = min_trade_confidence
        self.min_directional_edge = min_directional_edge
        self.conflict_threshold = conflict_threshold

    # -- construction from config ------------------------------------------

    @classmethod
    def from_config(cls, config) -> "ConfidenceEngine":
        c = config.confidence
        return cls(
            analyzers=build_analyzers(c.analyzers),
            weights=c.weights,
            min_trade_confidence=c.min_trade_confidence,
            min_directional_edge=c.min_directional_edge,
            conflict_threshold=c.conflict_threshold,
        )

    # -- scoring ------------------------------------------------------------

    def score(self, ctx: AnalysisContext) -> TradeScore:
        results: List[AnalyzerResult] = []
        for a in self.analyzers:
            try:
                r = a.analyze(ctx)
                r.raw.setdefault("_key", a.key)
                r.raw.setdefault("_weight", self.weights.get(a.key, 1.0))
                results.append(r)
            except Exception as exc:  # never let one analyzer break the engine
                results.append(AnalyzerResult(getattr(a, "label", a.key),
                               Bias.NEUTRAL, 0.0, f"error: {exc}"))
        return self._aggregate(results)

    def _aggregate(self, results: List[AnalyzerResult]) -> TradeScore:
        wsum = dir_weight = bull = bear = neutral = 0.0
        for r in results:
            w = self.weights.get(r.raw.get("_key", ""), 1.0)
            if w <= 0:
                continue
            wsum += w
            if r.direction is Bias.BULLISH:
                bull += w * r.confidence
                dir_weight += w
            elif r.direction is Bias.BEARISH:
                bear += w * r.confidence
                dir_weight += w
            else:
                neutral += w * r.confidence

        # Side scores are normalised by *directional* weight so neutral (absent)
        # signals don't dilute the read; the opposing side still counts as
        # conflict. Neutrality is captured separately by neutral_score.
        long_score = (bull / dir_weight) if dir_weight else 0.0
        short_score = (bear / dir_weight) if dir_weight else 0.0
        neutral_score = (neutral / wsum) if wsum else 0.0

        winner = max(long_score, short_score)
        loser = min(long_score, short_score)
        agreement = winner / (winner + loser) if (winner + loser) > 0 else 0.0
        quality = clamp(winner * agreement - 0.2 * neutral_score, 0.0, 100.0)

        dominant = Bias.BULLISH if long_score >= short_score else Bias.BEARISH
        edge = winner - loser

        reasons, weaknesses = self._reasons(results, dominant)
        conflicts = self._conflicts(results, dominant)
        warnings, risk_penalty = self._warnings(results, dominant, loser)

        no_trade_score = clamp(
            (100.0 - winner) + 0.4 * loser + 0.2 * neutral_score + risk_penalty,
            0.0, 100.0,
        )

        # Decision: enough quality AND a clear enough edge to pick a side.
        if quality >= self.min_trade_confidence and edge >= self.min_directional_edge:
            direction = (TradeDirection.LONG if dominant is Bias.BULLISH
                         else TradeDirection.SHORT)
        else:
            direction = TradeDirection.NO_TRADE
            if quality < self.min_trade_confidence:
                weaknesses.insert(0, f"Quality {quality:.0f} below "
                                     f"threshold {self.min_trade_confidence:.0f}")
            if edge < self.min_directional_edge:
                weaknesses.insert(0, f"Weak directional edge ({edge:.0f})")

        return TradeScore(
            direction=direction, quality=quality,
            long_score=long_score, short_score=short_score,
            no_trade_score=no_trade_score,
            reasons=reasons, weaknesses=weaknesses,
            warnings=warnings, conflicts=conflicts, results=results,
            raw={
                "weighted_bull": bull, "weighted_bear": bear,
                "weighted_neutral": neutral, "weight_sum": wsum,
                "agreement": round(agreement, 3), "edge": round(edge, 1),
                "dominant": dominant.value,
            },
        )

    # -- explanation helpers -----------------------------------------------

    def _reasons(self, results, dominant) -> tuple:
        reasons, weaknesses = [], []
        supporting = [r for r in results
                      if r.direction is dominant and self._w(r) > 0 and r.confidence >= 40]
        supporting.sort(key=lambda r: self._w(r) * r.confidence, reverse=True)
        for r in supporting:
            reasons.append(self._phrase(r, dominant))

        opposing = Bias.BEARISH if dominant is Bias.BULLISH else Bias.BULLISH
        detractors = [r for r in results
                      if r.direction is opposing and self._w(r) > 0 and r.confidence >= 40]
        detractors.sort(key=lambda r: self._w(r) * r.confidence, reverse=True)
        for r in detractors:
            weaknesses.append(f"{r.name} disagrees ({r.confidence:.0f}%): {r.explanation}")
        return reasons, weaknesses

    def _conflicts(self, results, dominant) -> List[str]:
        opposing = Bias.BEARISH if dominant is Bias.BULLISH else Bias.BULLISH
        conflicts = []
        for r in results:
            if (r.direction is opposing and self._w(r) > 0
                    and r.confidence >= self.conflict_threshold):
                conflicts.append(f"{r.name} reads {r.direction.value} "
                                 f"({r.confidence:.0f}%) against a {dominant.value} bias")
        return conflicts

    def _warnings(self, results, dominant, loser) -> tuple:
        warnings: List[str] = []
        penalty = 0.0
        by_key = {r.raw.get("_key"): r for r in results}

        atr = by_key.get("atr")
        if atr and atr.raw.get("regime") == "expanding":
            warnings.append(f"Elevated volatility (ATR {atr.raw.get('ratio', 0):.2f}× "
                            f"baseline) — size down / widen stops")
            penalty += 5
        rvol = by_key.get("relative_volume")
        if rvol and rvol.raw.get("rvol", 1.0) < 1.0:
            warnings.append(f"Below-average volume (RVOL {rvol.raw.get('rvol', 0):.2f}×) "
                            f"— chop / low-conviction risk")
            penalty += 8
        cvd = by_key.get("cvd")
        if cvd and cvd.raw.get("divergence"):
            warnings.append("CVD diverging from price — momentum may be fading")
            penalty += 6
        absorp = by_key.get("absorption")
        if absorp and absorp.raw.get("absorbing") and absorp.direction is not dominant \
                and absorp.direction is not Bias.NEUTRAL:
            warnings.append(f"Absorption against the {dominant.value} bias detected")
            penalty += 8
        if loser >= self.conflict_threshold:
            warnings.append(f"Conflicting signals present (opposing score {loser:.0f})")
            penalty += 6
        return warnings, penalty

    def _phrase(self, r: AnalyzerResult, dominant: Bias) -> str:
        phrases = _REASON_PHRASES.get(r.name)
        if phrases:
            return phrases[0] if dominant is Bias.BULLISH else phrases[1]
        return f"{r.name} confirms {dominant.value} ({r.confidence:.0f}%)"

    def _w(self, r: AnalyzerResult) -> float:
        return self.weights.get(r.raw.get("_key", ""), 1.0)
