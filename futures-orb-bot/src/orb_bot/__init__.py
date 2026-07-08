"""Futures ORB Bot — a signal & backtesting framework for New-York-session
opening-range breakout / liquidity-sweep strategies on futures.

This package is intentionally structured so each concern lives in its own
module and can be swapped or extended without touching the others:

    config      -> typed configuration (loaded from config.yaml)
    data        -> OHLCV CSV loading, timezone handling, resampling
    indicators  -> opening range, volume profile (POC / value area)
    strategy    -> setup rules (breakout, sweep/reclaim) + pluggable filters
    engine      -> the backtesting event loop and trade/position modelling
    analytics   -> performance metrics (win rate, PF, drawdown, RR, ...)
    reporting   -> dashboard charts + trade-journal CSV export
    extensions  -> stubs for delta, footprint, and ML filters (add later)

Nothing here talks to a broker. This is research / backtesting only.
"""

__version__ = "0.1.0"
