"""Logging and the machine-readable decision log.

Two complementary facilities:

* :func:`setup_logging` configures the standard-library ``logging`` module for
  the whole platform (console + rotating file), so every module can simply do
  ``logging.getLogger(__name__)`` and have output land in the right place.

* :class:`DecisionLog` records *why* the engine did what it did — every signal
  generated, every trade taken, and every trade **vetoed** (with the specific
  rule that blocked it). It is written as JSON-lines (one event per line) so it
  is both human-greppable and trivially loadable into a DataFrame for the
  dashboard's "why was / wasn't this trade taken" view.

Together they answer the question a serious researcher always asks: *"Explain
exactly what the system decided, and why."*
"""

from __future__ import annotations

import json
import logging
from dataclasses import asdict, dataclass, field
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Any, Dict, List, Optional

_CONFIGURED = False


def setup_logging(
    level: str = "INFO",
    log_dir: str | Path = "output/logs",
    console: bool = True,
    run_log_file: str = "run.log",
) -> logging.Logger:
    """Configure root logging once. Safe to call multiple times."""
    global _CONFIGURED
    root = logging.getLogger("orb_bot")
    if _CONFIGURED:
        return root

    root.setLevel(getattr(logging, level.upper(), logging.INFO))
    fmt = logging.Formatter(
        "%(asctime)s | %(levelname)-7s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    if console:
        ch = logging.StreamHandler()
        ch.setFormatter(fmt)
        root.addHandler(ch)

    log_dir = Path(log_dir)
    log_dir.mkdir(parents=True, exist_ok=True)
    fh = RotatingFileHandler(
        log_dir / run_log_file, maxBytes=5_000_000, backupCount=3, encoding="utf-8"
    )
    fh.setFormatter(fmt)
    root.addHandler(fh)

    root.propagate = False
    _CONFIGURED = True
    return root


class DecisionEvent(str):
    """Namespaced decision-event types (string-typed for easy serialisation)."""


# Event-type constants.
SIGNAL_GENERATED = "signal_generated"
TRADE_OPENED = "trade_opened"
TRADE_CLOSED = "trade_closed"
VETO = "veto"
SESSION_START = "session_start"
INFO = "info"


@dataclass
class Decision:
    """A single structured decision record."""

    timestamp: str
    event: str
    strategy: Optional[str] = None
    symbol: Optional[str] = None
    reason: str = ""
    details: Dict[str, Any] = field(default_factory=dict)

    def to_json(self) -> str:
        return json.dumps(asdict(self), default=str)


class DecisionLog:
    """Collects :class:`Decision` records and streams them to a JSONL file.

    Keeps an in-memory copy too, so the dashboard and tests can inspect the
    decision trail without re-reading the file.
    """

    def __init__(self, path: Optional[str | Path] = None):
        self.path = Path(path) if path else None
        self.records: List[Decision] = []
        self._fh = None
        if self.path is not None:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            self._fh = self.path.open("w", encoding="utf-8")

    # -- recording ----------------------------------------------------------

    def record(
        self,
        event: str,
        *,
        timestamp: Any = None,
        strategy: Optional[str] = None,
        symbol: Optional[str] = None,
        reason: str = "",
        **details: Any,
    ) -> Decision:
        ts = _fmt_ts(timestamp)
        rec = Decision(
            timestamp=ts,
            event=event,
            strategy=strategy,
            symbol=symbol,
            reason=reason,
            details=details,
        )
        self.records.append(rec)
        if self._fh is not None:
            self._fh.write(rec.to_json() + "\n")
            self._fh.flush()
        return rec

    # Convenience wrappers -------------------------------------------------

    def signal(self, strategy, timestamp, reason, **details):
        return self.record(
            SIGNAL_GENERATED, strategy=strategy, timestamp=timestamp,
            reason=reason, **details,
        )

    def veto(self, strategy, timestamp, reason, **details):
        return self.record(
            VETO, strategy=strategy, timestamp=timestamp, reason=reason, **details
        )

    def opened(self, strategy, timestamp, reason, **details):
        return self.record(
            TRADE_OPENED, strategy=strategy, timestamp=timestamp,
            reason=reason, **details,
        )

    def closed(self, strategy, timestamp, reason, **details):
        return self.record(
            TRADE_CLOSED, strategy=strategy, timestamp=timestamp,
            reason=reason, **details,
        )

    # -- inspection ---------------------------------------------------------

    def to_dataframe(self):
        import pandas as pd

        if not self.records:
            return pd.DataFrame(
                columns=["timestamp", "event", "strategy", "symbol", "reason", "details"]
            )
        return pd.DataFrame(asdict(r) for r in self.records)

    def counts(self) -> Dict[str, int]:
        out: Dict[str, int] = {}
        for r in self.records:
            out[r.event] = out.get(r.event, 0) + 1
        return out

    def close(self) -> None:
        if self._fh is not None:
            self._fh.close()
            self._fh = None

    def __enter__(self) -> "DecisionLog":
        return self

    def __exit__(self, *exc) -> None:
        self.close()


def _fmt_ts(timestamp: Any) -> str:
    if timestamp is None:
        return datetime.now().isoformat()
    if hasattr(timestamp, "isoformat"):
        return timestamp.isoformat()
    return str(timestamp)
