"""The data-engine entry point.

:func:`load_market_data` is the one call the rest of the platform makes to turn
config + raw files into a validated, multi-timeframe :class:`MarketData` object,
using the on-disk cache when possible.

Pipeline:

    raw CSV(s)
      -> load & timezone-normalise          (loader)
      -> validate + (optionally) clean       (validation)
      -> cache the clean primary frame       (store)
      -> build every configured timeframe    (timeframes)
"""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Optional, Tuple

import pandas as pd

from ..config import Config
from .loader import load_directory, load_ohlcv
from .store import DataStore
from .timeframes import MarketData, build_market_data
from .validation import ValidationReport, clean_ohlcv, validate_ohlcv

logger = logging.getLogger("orb_bot.data.feed")


def load_market_data(
    config: Config,
    source: Optional[str | Path] = None,
    auto_clean: bool = True,
) -> Tuple[MarketData, ValidationReport]:
    """Load, validate and package market data according to ``config``.

    Parameters
    ----------
    source:
        A CSV file or a directory of CSVs. Defaults to ``config.paths.data_dir``.
    auto_clean:
        If validation finds repairable issues, drop the offending rows and
        continue (the report still records what happened). If ``False`` the
        raw frame is used as-is.

    Returns
    -------
    (MarketData, ValidationReport)
    """
    target = Path(source) if source else Path(config.paths.data_dir)
    symbol = config.instrument.symbol
    primary = config.data.primary_timeframe

    load_kwargs = dict(
        input_timezone=config.data.input_timezone,
        session_timezone=config.data.session_timezone,
        resample=config.data.resample,
    )

    def _build_primary() -> pd.DataFrame:
        if target.is_dir():
            logger.info("Loading all CSVs in %s", target)
            raw = load_directory(target, **load_kwargs)
        else:
            logger.info("Loading data file %s", target)
            raw = load_ohlcv(target, **load_kwargs)

        report = validate_ohlcv(raw, expected_freq=primary)
        if not report.ok and auto_clean:
            logger.warning("Cleaning data: %d error(s) found.", report.n_errors)
            raw = clean_ohlcv(raw)
        _build_primary.report = report  # type: ignore[attr-defined]
        return raw

    # Storage cache (keyed on the freshness of the newest source file).
    if config.storage.enabled:
        store = DataStore(config.storage.cache_dir, config.storage.format)
        freshness_src = _newest_source(target)
        primary_df = store.load_or_build(symbol, primary, freshness_src, _build_primary)
        report = getattr(_build_primary, "report", ValidationReport(rows=len(primary_df)))
    else:
        primary_df = _build_primary()
        report = getattr(_build_primary, "report", ValidationReport(rows=len(primary_df)))

    market = build_market_data(
        primary_df,
        symbol=symbol,
        primary_timeframe=primary,
        timeframes=config.data.timeframes,
    )
    logger.info(
        "MarketData ready: %s @ %s (%d bars), timeframes=%s",
        symbol, primary, len(primary_df), sorted(market.frames),
    )
    return market, report


def _newest_source(target: Path) -> Path:
    """Return the file whose mtime represents the freshness of ``target``.

    For a directory this is the most recently modified CSV, so the cache
    invalidates whenever any source file changes.
    """
    if target.is_dir():
        files = sorted(target.glob("*.csv"), key=lambda p: p.stat().st_mtime)
        return files[-1] if files else target
    return target
