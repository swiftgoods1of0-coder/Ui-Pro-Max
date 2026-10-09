"""Machine-learning signal filter (stub).

The idea: train a classifier on historical signals (features = context at entry:
OR height, distance to POC, time of day, recent volatility, delta, ...; label =
whether the trade hit target). At backtest / live time, the model scores each
candidate signal and this filter vetoes low-probability ones.

Recommended workflow:

1. Run a baseline backtest to produce a labelled trade journal.
2. Engineer features from ``Signal.meta`` + ``DayContext`` (see
   :meth:`features_from` below for a starting point).
3. Train a model (scikit-learn, XGBoost, ...) offline and save it.
4. Load it here and gate signals on ``predict_proba`` in :meth:`accept`.

Ships disabled / pass-through so it can be wired in immediately. Loading a model
is optional and lazy, so scikit-learn is *not* a hard dependency.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from ..strategy.base import DayContext, Signal


class MLSignalFilter:
    name = "ml"

    def __init__(
        self,
        model: Optional[Any] = None,
        min_proba: float = 0.5,
        enabled: bool = False,
    ):
        self.model = model
        self.min_proba = min_proba
        self.enabled = enabled

    # -- feature engineering ------------------------------------------------

    @staticmethod
    def features_from(signal: Signal, context: DayContext) -> Dict[str, float]:
        """A starter feature vector. Extend with delta/footprint/vol features."""
        orh = signal.meta.get("orh")
        orl = signal.meta.get("orl")
        or_height = (orh - orl) if (orh is not None and orl is not None) else 0.0
        poc_dist = signal.meta.get("poc_distance") or 0.0
        return {
            "side": float(signal.side.sign),
            "or_height": float(or_height),
            "planned_rr": float(signal.planned_rr),
            "poc_distance": float(poc_dist),
            "entry_hour": float(signal.timestamp.hour),
            "entry_minute": float(signal.timestamp.minute),
            "is_breakout": 1.0 if signal.mode == "breakout" else 0.0,
        }

    # -- filter -------------------------------------------------------------

    def accept(self, signal: Signal, context: DayContext) -> bool:
        if not self.enabled or self.model is None:
            return True

        features = self.features_from(signal, context)
        try:
            import numpy as np

            x = np.array([[features[k] for k in sorted(features)]])
            proba = float(self.model.predict_proba(x)[0, 1])
        except Exception:
            # Never let a model error silently drop every trade.
            return True

        signal.meta["ml_proba"] = proba
        return proba >= self.min_proba
