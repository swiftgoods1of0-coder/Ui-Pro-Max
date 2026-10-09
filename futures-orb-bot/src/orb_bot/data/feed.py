"""The data-engine entry point.

:func:`load_market_data` is the one call the rest of the platform makes to turn
config + raw files into a validated, multi-timeframe :class:`MarketData` object,
using the on-disk cache when possible.

Pipeline:

    raw CSV(s)
      -> load & timezone-normalise          (loader; cached on disk)
      -> validate + (optionally) clean       (validation; always re-run, even
                                               on a cache hit — see below)
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
from .ticks import load_tick_directory, load_ticks
from .timeframes import MarketData, build_market_data
from .validation import ValidationReport, clean_ohlcv, validate_ohlcv

logger = logging.getLogger("orb_bot.data.feed")


def load_market_data(
    config: Config,
    source: Optional[str | Path] = None,
    auto_clean: bool = True,
    ticks_source: Optional[str | Path] = None,
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
    ticks_source:
        Optional tick/trade CSV file or directory (see
        :mod:`orb_bot.data.ticks`). Defaults to ``config.paths.ticks_dir``.
        When available, real per-price-level footprint data is built and
        attached as ``MarketData.footprint`` — the order-flow analyzers use it
        in place of the OHLCV approximation. A problem loading ticks is logged
        as a warning and the run continues OHLCV-only rather than failing the
        whole backtest over optional, enhancement-only data.

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

    def _load_raw() -> pd.DataFrame:
        if target.is_dir():
            logger.info("Loading all CSVs in %s", target)
            return load_directory(target, **load_kwargs)
        logger.info("Loading data file %s", target)
        return load_ohlcv(target, **load_kwargs)

    # Storage cache (keyed on the freshness of the newest source file) only
    # covers the expensive CSV parse + timezone work. Validation always runs
    # against whatever frame we end up with — cached or freshly parsed — so a
    # cache hit can never silently report a stale/fabricated "no issues"
    # result instead of the data's real state.
    if config.storage.enabled:
        store = DataStore(config.storage.cache_dir, config.storage.format)
        freshness_src = _newest_source(target)
        primary_df = store.load_or_build(symbol, primary, freshness_src, _load_raw)
    else:
        primary_df = _load_raw()

    report = validate_ohlcv(primary_df, expected_freq=primary)
    if not report.ok and auto_clean:
        logger.warning("Cleaning data: %d error(s) found.", report.n_errors)
        primary_df = clean_ohlcv(primary_df)

    ticks = _load_ticks_if_available(config, ticks_source, load_kwargs)

    market = build_market_data(
        primary_df,
        symbol=symbol,
        primary_timeframe=primary,
        timeframes=config.data.timeframes,
        ticks=ticks,
        tick_size=config.instrument.tick_size if ticks is not None else None,
    )
    logger.info(
        "MarketData ready: %s @ %s (%d bars), timeframes=%s, footprint=%s",
        symbol, primary, len(primary_df), sorted(market.frames), market.has_footprint,
    )
    return market, report


def _load_ticks_if_available(config: Config, ticks_source, load_kwargs) -> Optional[pd.DataFrame]:
    tick_target = Path(ticks_source) if ticks_source else (
        Path(config.paths.ticks_dir) if config.paths.ticks_dir else None
    )
    if tick_target is None:
        return None
    if not tick_target.exists():
        logger.warning("Configured ticks_dir %s does not exist — running OHLCV-only.", tick_target)
        return None

    tick_kwargs = dict(input_timezone=load_kwargs["input_timezone"],
                       session_timezone=load_kwargs["session_timezone"])
    try:
        if tick_target.is_dir():
            return load_tick_directory(tick_target, **tick_kwargs)
        return load_ticks(tick_target, **tick_kwargs)
    except Exception:
        logger.exception("Failed to load tick data from %s — running OHLCV-only.", tick_target)
        return None


def _newest_source(target: Path) -> Path:
    """Return the file whose mtime represents the freshness of ``target``.

    For a directory this is the most recently modified CSV, so the cache
    invalidates whenever any source file changes.
    """
    if target.is_dir():
        files = sorted(target.glob("*.csv"), key=lambda p: p.stat().st_mtime)
        return files[-1] if files else target
    return target
