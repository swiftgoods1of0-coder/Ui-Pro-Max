"""Per-trade feature extraction.

For every completed trade we reconstruct the market context *as it was at entry*
(look-ahead-safe) by running the analyzers + Trade Confidence Engine on the bars
up to the entry timestamp, and pair that context with the trade's outcome. The
resulting :class:`TradeFeatures` is the atomic record the pattern miner learns
from.

Captured per trade:
    prices        – entry, exit, stop loss, take profit
    outcome       – result (win/loss/scratch), R multiple, exit reason, P&L
    timing        – session, hour, minute, duration
    structure     – trend (from swing highs/lows) + structure confidence
    volume profile– relation to value area, POC side, distance to POC
    delta         – delta direction/ratio, CVD direction
    VWAP          – side of VWAP, distance in ATR
    volatility    – ATR, ATR ratio, regime
    confidence    – Trade Confidence Engine quality, direction, alignment
    condition flags – boolean "was the trade with VWAP / delta / trend / …"
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

import pandas as pd

from ..analysis import AnalysisContext, Bias, ConfidenceEngine
from ..engine.trade import Trade


def _session_label(ts: pd.Timestamp) -> str:
    minutes = ts.hour * 60 + ts.minute
    if minutes < 8 * 60:
        return "premarket"
    if minutes < 9 * 60 + 30:
        return "open"
    if minutes < 12 * 60:
        return "morning"
    return "afternoon"


@dataclass
class TradeFeatures:
    # identity / timing
    strategy: str
    setup: str                       # strategy/mode
    side: str
    session: str
    date: str
    entry_time: str
    exit_time: str
    hour: int
    minute: int
    duration_min: float
    # prices
    entry_price: float
    exit_price: float
    stop_loss: float
    take_profit: float
    # outcome
    result: str                      # win | loss | scratch
    net_pnl: float
    realized_r: float
    exit_reason: str
    # market structure
    trend: str
    structure_conf: float
    # volume profile
    vp_relation: str                 # above_value | below_value | inside
    poc_side: str                    # above | below | at
    dist_to_poc: Optional[float]
    # delta
    delta_dir: str
    delta_ratio: Optional[float]
    cvd_dir: str
    # vwap
    vwap_side: str
    vwap_dist_atr: Optional[float]
    # volatility
    atr: Optional[float]
    atr_ratio: Optional[float]
    vol_regime: str
    # confidence engine
    trade_quality: float
    engine_direction: str
    reasons: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)
    conflicts: int = 0
    # boolean condition flags (relative to the trade's side)
    flags: Dict[str, bool] = field(default_factory=dict)

    def to_row(self) -> Dict[str, Any]:
        row = {k: v for k, v in asdict(self).items()
               if k not in ("reasons", "warnings", "flags")}
        row["reasons"] = " | ".join(self.reasons)
        row["warnings"] = " | ".join(self.warnings)
        for k, v in self.flags.items():
            row[f"flag_{k}"] = bool(v)
        return row


class FeatureExtractor:
    """Builds :class:`TradeFeatures` from trades + market data."""

    def __init__(self, config, engine: Optional[ConfidenceEngine] = None):
        self.config = config
        self.engine = engine or ConfidenceEngine.from_config(config)

    def extract_all(self, trades: List[Trade], market) -> List[TradeFeatures]:
        return [self.extract(t, market) for t in trades]

    def extract(self, trade: Trade, market) -> TradeFeatures:
        primary = market.primary if hasattr(market, "primary") else market
        ctx = AnalysisContext.from_history(primary, trade.entry_time,
                                           config=self.config, market=market)
        score = self.engine.score(ctx)
        by = {r.raw.get("_key"): r for r in score.results}
        side_sign = trade.side.sign

        def res(key):
            return by.get(key)

        def dir_of(key) -> str:
            r = by.get(key)
            return r.direction.value if r else "neutral"

        def agrees(key) -> bool:
            r = by.get(key)
            return bool(r and r.direction.sign == side_sign)

        # --- structure ---
        sh, sl = res("swing_high"), res("swing_low")
        trend_sign = (sh.direction.sign if sh else 0) + (sl.direction.sign if sl else 0)
        trend = Bias.from_sign(trend_sign)
        structure_conf = round(
            ((sh.confidence if sh else 0) + (sl.confidence if sl else 0)) / 2.0, 1)

        # --- volume profile ---
        vpr = res("volume_profile")
        vp_relation = ("above_value" if vpr and vpr.direction is Bias.BULLISH else
                       "below_value" if vpr and vpr.direction is Bias.BEARISH else "inside")
        pocr = res("poc")
        poc_side = ("above" if pocr and pocr.direction is Bias.BULLISH else
                    "below" if pocr and pocr.direction is Bias.BEARISH else "at")
        dist_to_poc = None
        if pocr and "poc" in pocr.raw:
            dist_to_poc = round(trade.entry_price - pocr.raw["poc"], 4)

        # --- delta / cvd ---
        deltar = res("delta")
        delta_ratio = deltar.raw.get("delta_ratio") if deltar else None

        # --- vwap ---
        vwapr = res("vwap")
        vwap_side = ("above" if vwapr and vwapr.direction is Bias.BULLISH else
                     "below" if vwapr and vwapr.direction is Bias.BEARISH else "at")
        vwap_dist_atr = None
        if vwapr and vwapr.raw.get("atr"):
            vwap_dist_atr = round(
                abs(vwapr.raw["price"] - vwapr.raw["vwap"]) / vwapr.raw["atr"], 2)

        # --- volatility ---
        atrr = res("atr")
        atr_val = atrr.raw.get("atr") if atrr else None
        atr_ratio = atrr.raw.get("ratio") if atrr else None
        vol_regime = atrr.raw.get("regime", "unknown") if atrr else "unknown"

        # --- relative volume ---
        rvolr = res("relative_volume")
        rvol = rvolr.raw.get("rvol", 1.0) if rvolr else 1.0

        result = "win" if trade.net_pnl > 0 else ("loss" if trade.net_pnl < 0 else "scratch")

        flags = {
            "with_trend": trend.sign == side_sign and trend is not Bias.NEUTRAL,
            "with_vwap": agrees("vwap"),
            "with_delta": agrees("delta"),
            "with_cvd": agrees("cvd"),
            "poc_reclaim": agrees("poc"),
            "engine_aligned": score.direction.value == trade.side.value,
            "high_confidence": score.quality >= 60,
            "strong_rvol": rvol >= 1.2,
            "expanding_vol": vol_regime == "expanding",
            "inside_value": vp_relation == "inside",
        }

        return TradeFeatures(
            strategy=trade.strategy_id,
            setup=f"{trade.strategy_id}/{trade.mode}",
            side=trade.side.value,
            session=_session_label(trade.entry_time),
            date=trade.date.date().isoformat(),
            entry_time=trade.entry_time.isoformat(),
            exit_time=trade.exit_time.isoformat(),
            hour=int(trade.entry_time.hour),
            minute=int(trade.entry_time.minute),
            duration_min=round(trade.hold_minutes, 1),
            entry_price=round(trade.entry_price, 4),
            exit_price=round(trade.exit_price, 4),
            stop_loss=round(trade.stop_price, 4),
            take_profit=round(trade.target_price, 4),
            result=result,
            net_pnl=round(trade.net_pnl, 2),
            realized_r=round(trade.realized_r, 3),
            exit_reason=trade.exit_reason.value,
            trend=trend.value,
            structure_conf=structure_conf,
            vp_relation=vp_relation,
            poc_side=poc_side,
            dist_to_poc=dist_to_poc,
            delta_dir=dir_of("delta"),
            delta_ratio=round(delta_ratio, 3) if delta_ratio is not None else None,
            cvd_dir=dir_of("cvd"),
            vwap_side=vwap_side,
            vwap_dist_atr=vwap_dist_atr,
            atr=round(atr_val, 3) if atr_val is not None else None,
            atr_ratio=round(atr_ratio, 3) if atr_ratio is not None else None,
            vol_regime=vol_regime,
            trade_quality=round(score.quality, 1),
            engine_direction=score.direction.value,
            reasons=score.reasons,
            warnings=score.warnings,
            conflicts=len(score.conflicts),
            flags=flags,
        )
