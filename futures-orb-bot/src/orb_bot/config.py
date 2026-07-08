"""Typed configuration objects for the ORB bot.

Configuration is expressed as small, self-documenting dataclasses. A YAML file
(see ``config.yaml``) is parsed into these objects via :meth:`Config.from_yaml`.
Every field has a sensible default, so a partial YAML file — or no file at all —
still yields a fully valid configuration.
"""

from __future__ import annotations

from dataclasses import dataclass, field, fields, is_dataclass
from pathlib import Path
from typing import Any, List, Optional, get_type_hints


@dataclass
class InstrumentConfig:
    symbol: str = "ES"
    point_value: float = 50.0
    tick_size: float = 0.25


@dataclass
class DataConfig:
    input_timezone: str = "UTC"
    session_timezone: str = "America/New_York"
    resample: Optional[str] = None


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
class StrategyConfig:
    modes: List[str] = field(default_factory=lambda: ["breakout", "sweep_reclaim"])
    require_poc_confluence: bool = False
    breakout_buffer_ticks: float = 1.0
    sweep_min_ticks: float = 2.0
    max_trades_per_day: Optional[int] = 1


@dataclass
class RiskConfig:
    reward_multiple: float = 2.0
    risk_per_trade_usd: float = 250.0
    stop_style: str = "range"  # "range" | "sweep"
    stop_buffer_ticks: float = 2.0
    allow_fractional_contracts: bool = False
    min_contracts: int = 1
    starting_equity_usd: float = 25000.0
    commission_per_contract: float = 2.50
    slippage_ticks: float = 1.0


@dataclass
class PathsConfig:
    data_dir: str = "data/raw"
    output_dir: str = "output"


@dataclass
class Config:
    instrument: InstrumentConfig = field(default_factory=InstrumentConfig)
    data: DataConfig = field(default_factory=DataConfig)
    session: SessionConfig = field(default_factory=SessionConfig)
    opening_range: OpeningRangeConfig = field(default_factory=OpeningRangeConfig)
    volume_profile: VolumeProfileConfig = field(default_factory=VolumeProfileConfig)
    strategy: StrategyConfig = field(default_factory=StrategyConfig)
    risk: RiskConfig = field(default_factory=RiskConfig)
    paths: PathsConfig = field(default_factory=PathsConfig)

    # -- loading ------------------------------------------------------------

    @classmethod
    def from_yaml(cls, path: str | Path) -> "Config":
        """Build a :class:`Config` from a YAML file, filling gaps with defaults."""
        import yaml  # imported lazily so `--help` etc. work without PyYAML

        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Config file not found: {path}")
        with path.open("r", encoding="utf-8") as fh:
            raw = yaml.safe_load(fh) or {}
        return cls.from_dict(raw)

    @classmethod
    def from_dict(cls, raw: dict[str, Any]) -> "Config":
        """Recursively merge a plain dict onto the dataclass defaults."""
        return _build(cls, raw or {})


def _build(dc_type: type, raw: dict[str, Any]) -> Any:
    """Instantiate ``dc_type`` from ``raw``, recursing into nested dataclasses.

    Unknown keys are ignored (with no crash) so the config format can grow
    without breaking older files, and missing keys keep their defaults.
    """
    # Resolve string annotations (produced by ``from __future__ import
    # annotations``) back into real types so nested dataclasses are detected.
    hints = get_type_hints(dc_type)
    kwargs: dict[str, Any] = {}
    for f in fields(dc_type):
        if f.name not in raw:
            continue
        value = raw[f.name]
        field_type = hints.get(f.name, f.type)
        if is_dataclass(field_type) and isinstance(value, dict):
            kwargs[f.name] = _build(field_type, value)
        else:
            kwargs[f.name] = value
    return dc_type(**kwargs)
