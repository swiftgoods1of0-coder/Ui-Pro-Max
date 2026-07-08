"""Efficient on-disk data storage.

Raw CSVs are slow to re-parse every run. :class:`DataStore` caches cleaned,
timezone-normalised frames in a columnar format (Parquet by default, via
pyarrow) keyed by symbol + timeframe, and loads from cache when the source
file hasn't changed.

Parquet is preferred because it is compact and preserves dtypes and the
timezone-aware index. If pyarrow isn't installed the store transparently falls
back to compressed pickle, so the platform still works with a stdlib-only
environment — you just don't get the cross-tool portability of Parquet.
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional

import pandas as pd

logger = logging.getLogger("orb_bot.data.store")


def _parquet_available() -> bool:
    try:
        import pyarrow  # noqa: F401

        return True
    except Exception:  # pragma: no cover - depends on environment
        return False


class DataStore:
    """A tiny content-cache for OHLCV frames."""

    def __init__(self, cache_dir: str | Path = "data/cache", fmt: str = "parquet"):
        self.cache_dir = Path(cache_dir)
        self.cache_dir.mkdir(parents=True, exist_ok=True)
        # Fall back if the requested format's engine isn't installed.
        if fmt == "parquet" and not _parquet_available():
            logger.warning("pyarrow not available — DataStore falling back to pickle.")
            fmt = "pickle"
        self.fmt = fmt

    # -- paths --------------------------------------------------------------

    def _path(self, key: str) -> Path:
        ext = "parquet" if self.fmt == "parquet" else "pkl.gz"
        safe = key.replace("/", "_").replace(" ", "_")
        return self.cache_dir / f"{safe}.{ext}"

    def cache_key(self, symbol: str, timeframe: str) -> str:
        return f"{symbol}__{timeframe}"

    # -- io -----------------------------------------------------------------

    def save(self, df: pd.DataFrame, symbol: str, timeframe: str) -> Path:
        path = self._path(self.cache_key(symbol, timeframe))
        if self.fmt == "parquet":
            df.to_parquet(path)
        else:
            df.to_pickle(path, compression="gzip")
        logger.info("Cached %s bars -> %s", len(df), path)
        return path

    def load(self, symbol: str, timeframe: str) -> Optional[pd.DataFrame]:
        path = self._path(self.cache_key(symbol, timeframe))
        if not path.exists():
            return None
        if self.fmt == "parquet":
            return pd.read_parquet(path)
        return pd.read_pickle(path, compression="gzip")

    def is_fresh(self, symbol: str, timeframe: str, source: str | Path) -> bool:
        """True if a cache exists and is newer than the ``source`` file."""
        cache_path = self._path(self.cache_key(symbol, timeframe))
        source = Path(source)
        if not cache_path.exists() or not source.exists():
            return False
        return cache_path.stat().st_mtime >= source.stat().st_mtime

    def load_or_build(self, symbol, timeframe, source, builder):
        """Return the cached frame if fresh, else build, cache, and return it.

        ``builder`` is a zero-arg callable that produces the frame when the
        cache is missing or stale.
        """
        if self.is_fresh(symbol, timeframe, source):
            cached = self.load(symbol, timeframe)
            if cached is not None:
                logger.info("Loaded %s/%s from cache.", symbol, timeframe)
                return cached
        df = builder()
        self.save(df, symbol, timeframe)
        return df
