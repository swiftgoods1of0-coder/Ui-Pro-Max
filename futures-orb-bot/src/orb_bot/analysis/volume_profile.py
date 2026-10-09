"""Volume-profile family of analyzers.

Each concept gets its own independent analyzer, all sharing one profile
computation (built from the current session, or a recent lookback when the
session is short):

* :class:`VolumeProfileAnalyzer` – overall read: price vs the value area
* :class:`POCAnalyzer`           – price vs Point of Control
* :class:`VAHAnalyzer`           – Value Area High as resistance / breakout
* :class:`VALAnalyzer`           – Value Area Low as support / breakdown
* :class:`HVNAnalyzer`           – nearest High Volume Node (S/R magnet)
* :class:`LVNAnalyzer`           – nearest Low Volume Node (thin, fast-move zone)

They reuse :func:`orb_bot.indicators.volume_profile.build_volume_profile`, so the
profile logic lives in exactly one place.
"""

from __future__ import annotations

from typing import List, Optional, Tuple

import numpy as np
import pandas as pd

from ..indicators.volume_profile import VolumeProfile, build_volume_profile
from .base import Analyzer, AnalysisContext, AnalyzerResult, Bias, clamp, register_analyzer, scale
from .common import level_bias


def _profile(ctx: AnalysisContext, min_bars: int = 20) -> Optional[VolumeProfile]:
    """Build (and cache) a volume profile for the context's session/lookback."""
    if "volume_profile" in ctx.extras:
        return ctx.extras["volume_profile"]
    bins = 50
    if ctx.config is not None:
        bins = getattr(ctx.config.volume_profile, "bins", 50)
    src = ctx.session
    if src is None or len(src) < min_bars:
        src = ctx.recent(max(min_bars, 60))
    vp = build_volume_profile(src, bins=bins) if len(src) else None
    ctx.extras["volume_profile"] = vp
    return vp


def _va_width(vp: VolumeProfile) -> float:
    w = vp.value_area_high - vp.value_area_low
    if w > 0:
        return w
    return float(vp.bucket_edges[-1] - vp.bucket_edges[0]) or 1.0


def _nodes(vp: VolumeProfile) -> Tuple[List[float], List[float]]:
    """Return (HVN prices, LVN prices) from the profile histogram.

    HVN = local volume peaks above mean+½σ; LVN = local troughs with non-zero
    but below mean−½σ volume, within the traded range.
    """
    vol = vp.bucket_volume.astype(float)
    centers = vp.bucket_centers
    if len(vol) < 3:
        return [], []
    mean, std = vol.mean(), vol.std()
    hvn, lvn = [], []
    for i in range(1, len(vol) - 1):
        is_peak = vol[i] >= vol[i - 1] and vol[i] >= vol[i + 1]
        is_trough = vol[i] <= vol[i - 1] and vol[i] <= vol[i + 1]
        if is_peak and vol[i] > mean + 0.5 * std:
            hvn.append(float(centers[i]))
        if is_trough and 0 < vol[i] < mean - 0.5 * std:
            lvn.append(float(centers[i]))
    return hvn, lvn


@register_analyzer("volume_profile")
class VolumeProfileAnalyzer(Analyzer):
    label = "Volume Profile"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "Insufficient volume to build a profile.",
                                  timeframe=ctx.timeframe)
        price, width = ctx.price, _va_width(vp)
        levels = {"poc": vp.poc, "vah": vp.value_area_high, "val": vp.value_area_low}
        if price > vp.value_area_high:
            bias = Bias.BULLISH
            conf = 55 + 0.45 * scale(price - vp.value_area_high, 0, width)
            expl = f"Price ({price:.2f}) is accepting above the value area (VAH {vp.value_area_high:.2f})."
            inval = vp.value_area_high
        elif price < vp.value_area_low:
            bias = Bias.BEARISH
            conf = 55 + 0.45 * scale(vp.value_area_low - price, 0, width)
            expl = f"Price ({price:.2f}) is accepting below the value area (VAL {vp.value_area_low:.2f})."
            inval = vp.value_area_low
        else:
            bias, conf = Bias.NEUTRAL, 35.0
            expl = f"Price is inside the value area ({vp.value_area_low:.2f}–{vp.value_area_high:.2f}) — balance."
            inval = None
        return AnalyzerResult(self.label, bias, clamp(conf, 0, 100), expl,
                              levels=levels, invalidation=inval,
                              raw={"poc": vp.poc, "vah": vp.value_area_high,
                                   "val": vp.value_area_low, "va_width": width},
                              timeframe=ctx.timeframe)


@register_analyzer("poc")
class POCAnalyzer(Analyzer):
    label = "Point of Control"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No profile available.", timeframe=ctx.timeframe)
        width = _va_width(vp)
        bias, conf = level_bias(ctx.price, vp.poc, width)
        side = "above" if ctx.price >= vp.poc else "below"
        expl = f"Price is {side} the POC ({vp.poc:.2f}); distance {abs(ctx.price - vp.poc):.2f}."
        return AnalyzerResult(self.label, bias, conf, expl,
                              levels={"poc": vp.poc}, invalidation=vp.poc,
                              raw={"poc": vp.poc, "price": ctx.price, "va_width": width},
                              timeframe=ctx.timeframe)


@register_analyzer("vah")
class VAHAnalyzer(Analyzer):
    label = "Value Area High"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No profile available.", timeframe=ctx.timeframe)
        price, vah, val, width = ctx.price, vp.value_area_high, vp.value_area_low, _va_width(vp)
        if price >= vah:
            bias = Bias.BULLISH
            conf = 55 + 0.45 * scale(price - vah, 0, width)
            expl = f"Price broke above VAH ({vah:.2f}) — acceptance above value."
        elif price >= val:
            bias, conf = Bias.NEUTRAL, 35.0
            expl = f"Price is inside value, below VAH ({vah:.2f}) which acts as resistance."
        else:
            bias, conf = Bias.BEARISH, 45.0
            expl = f"Price is below value; VAH ({vah:.2f}) is distant resistance."
        return AnalyzerResult(self.label, bias, clamp(conf, 0, 100), expl,
                              levels={"vah": vah, "val": val}, invalidation=vah,
                              raw={"vah": vah, "price": price, "va_width": width},
                              timeframe=ctx.timeframe)


@register_analyzer("val")
class VALAnalyzer(Analyzer):
    label = "Value Area Low"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No profile available.", timeframe=ctx.timeframe)
        price, vah, val, width = ctx.price, vp.value_area_high, vp.value_area_low, _va_width(vp)
        if price <= val:
            bias = Bias.BEARISH
            conf = 55 + 0.45 * scale(val - price, 0, width)
            expl = f"Price broke below VAL ({val:.2f}) — acceptance below value."
        elif price <= vah:
            bias, conf = Bias.NEUTRAL, 35.0
            expl = f"Price is inside value, above VAL ({val:.2f}) which acts as support."
        else:
            bias, conf = Bias.BULLISH, 45.0
            expl = f"Price is above value; VAL ({val:.2f}) is distant support."
        return AnalyzerResult(self.label, bias, clamp(conf, 0, 100), expl,
                              levels={"val": val, "vah": vah}, invalidation=val,
                              raw={"val": val, "price": price, "va_width": width},
                              timeframe=ctx.timeframe)


@register_analyzer("hvn")
class HVNAnalyzer(Analyzer):
    label = "High Volume Nodes"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No profile available.", timeframe=ctx.timeframe)
        hvn, _ = _nodes(vp)
        if not hvn:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 20.0,
                                  "No distinct high-volume nodes.", timeframe=ctx.timeframe)
        price, width = ctx.price, _va_width(vp)
        nearest = min(hvn, key=lambda p: abs(p - price))
        # An HVN below price acts as support (bullish); above price as resistance.
        bias = Bias.BULLISH if price >= nearest else Bias.BEARISH
        proximity = 1.0 - clamp(abs(price - nearest) / width, 0, 1)
        conf = clamp(45 + 40 * proximity, 0, 90)
        role = "support" if bias is Bias.BULLISH else "resistance"
        expl = f"Nearest HVN {nearest:.2f} acts as {role} (price {price:.2f})."
        return AnalyzerResult(self.label, bias, conf, expl,
                              levels={"nearest_hvn": nearest}, invalidation=nearest,
                              raw={"hvn": hvn, "nearest_hvn": nearest, "price": price},
                              timeframe=ctx.timeframe)


@register_analyzer("lvn")
class LVNAnalyzer(Analyzer):
    label = "Low Volume Nodes"

    def analyze(self, ctx: AnalysisContext) -> AnalyzerResult:
        vp = _profile(ctx)
        if vp is None:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 0.0,
                                  "No profile available.", timeframe=ctx.timeframe)
        _, lvn = _nodes(vp)
        price, width = ctx.price, _va_width(vp)
        if not lvn:
            return AnalyzerResult(self.label, Bias.NEUTRAL, 20.0,
                                  "No distinct low-volume nodes.", timeframe=ctx.timeframe)
        nearest = min(lvn, key=lambda p: abs(p - price))
        near = abs(price - nearest) < 0.15 * width
        # LVNs are thin: price tends to travel fast through them in the current
        # momentum direction. Only meaningful when price is at/near the node.
        closes = ctx.df["close"]
        momentum = float(closes.iloc[-1] - closes.iloc[-min(4, len(closes))])
        if near and momentum != 0:
            bias = Bias.from_sign(momentum)
            conf = clamp(40 + 30 * (1 - abs(price - nearest) / (0.15 * width)), 0, 80)
            expl = f"Price at LVN {nearest:.2f} with {'up' if momentum>0 else 'down'} momentum — expect a fast move through."
        else:
            bias, conf = Bias.NEUTRAL, 25.0
            expl = f"Nearest LVN {nearest:.2f} is not in play (price {price:.2f})."
        return AnalyzerResult(self.label, bias, conf, expl,
                              levels={"nearest_lvn": nearest}, invalidation=nearest,
                              raw={"lvn": lvn, "nearest_lvn": nearest, "momentum": momentum},
                              timeframe=ctx.timeframe)
