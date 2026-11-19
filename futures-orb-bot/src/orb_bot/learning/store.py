"""Persistence for the learning dataset.

:class:`TradeFeatureStore` holds the extracted :class:`TradeFeatures` and turns
them into a tidy DataFrame for mining, plus load/save so a research dataset can
grow across many backtests (append mode) and be re-analysed later.
"""

from __future__ import annotations

from pathlib import Path
from typing import List, Optional

import pandas as pd

from .features import TradeFeatures


class TradeFeatureStore:
    def __init__(self, features: Optional[List[TradeFeatures]] = None):
        self.features: List[TradeFeatures] = list(features or [])

    def add(self, feats: List[TradeFeatures]) -> None:
        self.features.extend(feats)

    def to_frame(self) -> pd.DataFrame:
        if not self.features:
            return pd.DataFrame()
        return pd.DataFrame(f.to_row() for f in self.features)

    # -- io -----------------------------------------------------------------

    def save_csv(self, path: str | Path) -> Path:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        self.to_frame().to_csv(path, index=False)
        return path

    def save_parquet(self, path: str | Path) -> Path:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        self.to_frame().to_parquet(path)
        return path

    @staticmethod
    def load_frame(path: str | Path) -> pd.DataFrame:
        path = Path(path)
        if path.suffix == ".parquet":
            return pd.read_parquet(path)
        return pd.read_csv(path)

    def __len__(self) -> int:
        return len(self.features)
