"""Typed configuration for the platform.

Configuration is expressed as small, self-documenting dataclasses and loaded
from YAML (see ``config.yaml``). Every field has a sensible default, so a
partial file — or no file at all — still yields a valid configuration.

The config is deliberately *layered* so each concern can be tuned in isolation
without touching Python:

    instrument       -> contract specs (point value, tick size)
    data             -> timezones, primary timeframe, extra timeframes
    storage          -> on-disk cache format + location (parquet by default)
    session          -> the tradable New-York window
    volume_profile   -> POC / value-area settings (a data feature)
    risk             -> account size + all risk guardrails + sizing model
    logging          -> log level, directory, decision-log file
    strategies       -> the plug-and-play list (name / enabled / params)
    opening_range    -> default ORB window (also usable as strategy params)
    strategy         -> legacy single-strategy ORB defaults (back-compat)
    paths            -> data + output directories

``strategies`` is the modern entry point: a list of independently enabled
strategies. When it is empty the platform falls back to a single ORB strategy
built from the legacy ``strategy`` / ``opening_range`` blocks, so older config
files keep working unchanged.
"""

from __future__ import annotations

from dataclasses import dataclass, field, fields, is_dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, get_type_hints


# --------------------------------------------------------------------------- #
# Leaf sections
# --------------------------------------------------------------------------- #


@dataclass
class InstrumentConfig:
    symbol: str = "ES"
    point_value: float = 50.0
    tick_size: float = 0.25


@dataclass
class DataConfig:
    input_timezone: str = "UTC"
    session_timezone: str = "America/New_York"
    # The timeframe the engine iterates on (should be your finest data).
    primary_timeframe: str = "1min"
    # Additional timeframes to pre-build and make available to strategies.
    timeframes: List[str] = field(default_factory=lambda: ["1min", "5min", "15min"])
    # Back-compat single-resample knob (applied on load when set).
    resample: Optional[str] = None


@dataclass
class StorageConfig:
    # "parquet" (efficient, columnar) or "csv". Parquet needs pyarrow.
    format: str = "parquet"
    cache_dir: str = "data/cache"
    enabled: bool = True


@dataclass
class SessionConfig:
    window_start: str = "08:00"
    window_end: str = "11:00"


@dataclass
class OpeningRangeConfig:
    start: str = "08:00"
    end: str = "08:15"


@dataclass
class VolumeProfileConfig:
    enabled: bool = True
    bins: int = 50
    source: str = "session"  # "session" | "opening_range"


@dataclass
class StrategyDefaultsConfig:
    """Legacy single-strategy ORB defaults (kept for backward compatibility)."""

    modes: List[str] = field(default_factory=lambda: ["breakout", "sweep_reclaim"])
    require_poc_confluence: bool = False
    breakout_buffer_ticks: float = 1.0
    sweep_min_ticks: float = 2.0
    max_trades_per_day: Optional[int] = 1


@dataclass
class RiskConfig:
    # --- account ---
    starting_equity_usd: float = 25000.0
    # --- sizing model ---
    #   "fixed_fractional" -> risk a % of *current* equity per trade (dynamic)
    #   "fixed_dollar"     -> risk a fixed dollar amount per trade
    risk_model: str = "fixed_fractional"
    risk_per_trade_pct: float = 1.0          # used by fixed_fractional (percent)
    risk_per_trade_usd: float = 250.0        # used by fixed_dollar
    reward_multiple: float = 2.0
    stop_style: str = "range"                # "range" | "sweep"
    stop_buffer_ticks: float = 2.0
    allow_fractional_contracts: bool = False
    min_contracts: int = 1
    max_contracts: Optional[int] = None      # hard cap on size (None = no cap)
    # --- guardrails ---
    max_trades_per_day: Optional[int] = 3
    max_consecutive_losses: Optional[int] = 4
    daily_max_loss_usd: Optional[float] = None
    daily_max_loss_pct: Optional[float] = 3.0   # % of day-start equity
    # --- costs ---
    commission_per_contract: float = 2.50
    slippage_ticks: float = 1.0


@dataclass
class LoggingConfig:
    level: str = "INFO"                      # DEBUG | INFO | WARNING | ERROR
    log_dir: str = "output/logs"
    console: bool = True
    decisions_file: str = "decisions.jsonl"  # machine-readable decision log
    run_log_file: str = "run.log"


@dataclass
class StrategyConfig:
    """One entry in the plug-and-play ``strategies`` list."""

    name: str                                # registry key, e.g. "orb"
    enabled: bool = True
    id: Optional[str] = None                 # unique label (defaults to name)
    params: Dict[str, Any] = field(default_factory=dict)

    @property
    def label(self) -> str:
        return self.id or self.name


@dataclass
class PathsConfig:
    data_dir: str = "data/raw"
    output_dir: str = "output"


# --------------------------------------------------------------------------- #
# Root
# --------------------------------------------------------------------------- #


@dataclass
class Config:
    instrument: InstrumentConfig = field(default_factory=InstrumentConfig)
    data: DataConfig = field(default_factory=DataConfig)
    storage: StorageConfig = field(default_factory=StorageConfig)
    session: SessionConfig = field(default_factory=SessionConfig)
    opening_range: OpeningRangeConfig = field(default_factory=OpeningRangeConfig)
    volume_profile: VolumeProfileConfig = field(default_factory=VolumeProfileConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    logging: LoggingConfig = field(default_factory=LoggingConfig)
    strategy: StrategyDefaultsConfig = field(default_factory=StrategyDefaultsConfig)
    strategies: List[StrategyConfig] = field(default_factory=list)
    paths: PathsConfig = field(default_factory=PathsConfig)

    # -- loading ------------------------------------------------------------

    @classmethod
    def from_yaml(cls, path: str | Path) -> "Config":
        """Build a :class:`Config` from a YAML file, filling gaps with defaults."""
        import yaml  # lazy import so tooling works without PyYAML installed

        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Config file not found: {path}")
        with path.open("r", encoding="utf-8") as fh:
            raw = yaml.safe_load(fh) or {}
        return cls.from_dict(raw)

    @classmethod
    def from_dict(cls, raw: Dict[str, Any]) -> "Config":
        return _build(cls, raw or {})

    # -- derived helpers ----------------------------------------------------

    def effective_strategies(self) -> List[StrategyConfig]:
        """Return the enabled strategies, falling back to a legacy ORB entry.

        This is the single source of truth for "which strategies run", so the
        engine never needs to know about the back-compat path.
        """
        if self.strategies:
            return [s for s in self.strategies if s.enabled]
        # Legacy fallback: synthesize one ORB strategy from the old blocks.
        params = {
            "modes": self.strategy.modes,
            "require_poc_confluence": self.strategy.require_poc_confluence,
            "breakout_buffer_ticks": self.strategy.breakout_buffer_ticks,
            "sweep_min_ticks": self.strategy.sweep_min_ticks,
            "opening_range_start": self.opening_range.start,
            "opening_range_end": self.opening_range.end,
        }
        return [StrategyConfig(name="orb", enabled=True, id="orb", params=params)]


# --------------------------------------------------------------------------- #
# Recursive dataclass builder
# --------------------------------------------------------------------------- #


def _build(dc_type: type, raw: Dict[str, Any]) -> Any:
    """Instantiate ``dc_type`` from ``raw``, recursing into nested dataclasses.

    Handles nested dataclasses and ``List[SomeDataclass]`` fields. Unknown keys
    are ignored so the format can grow without breaking older files.
    """
    hints = get_type_hints(dc_type)
    kwargs: Dict[str, Any] = {}
    for f in fields(dc_type):
        if f.name not in raw:
            continue
        value = raw[f.name]
        field_type = hints.get(f.name, f.type)

        if is_dataclass(field_type) and isinstance(value, dict):
            kwargs[f.name] = _build(field_type, value)
        elif _is_dataclass_list(field_type) and isinstance(value, list):
            item_type = _list_item_type(field_type)
            kwargs[f.name] = [
                _build(item_type, item) if isinstance(item, dict) else item
                for item in value
            ]
        else:
            kwargs[f.name] = value
    return dc_type(**kwargs)


def _is_dataclass_list(field_type: Any) -> bool:
    item = _list_item_type(field_type)
    return item is not None and is_dataclass(item)


def _list_item_type(field_type: Any) -> Optional[type]:
    origin = getattr(field_type, "__origin__", None)
    if origin in (list, List):
        args = getattr(field_type, "__args__", ())
        if args:
            return args[0]
    return None
