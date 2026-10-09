"""Time-string parsing helpers."""

from __future__ import annotations

from datetime import time


def parse_hhmm(value: str) -> time:
    """Parse a ``"HH:MM"`` (or ``"HH:MM:SS"``) string into a :class:`datetime.time`.

    >>> parse_hhmm("08:15")
    datetime.time(8, 15)
    """
    parts = str(value).strip().split(":")
    if len(parts) not in (2, 3):
        raise ValueError(f"Expected 'HH:MM' or 'HH:MM:SS', got {value!r}")
    try:
        nums = [int(p) for p in parts]
    except ValueError as exc:
        raise ValueError(f"Non-numeric time component in {value!r}") from exc
    hour, minute = nums[0], nums[1]
    second = nums[2] if len(nums) == 3 else 0
    if not (0 <= hour < 24 and 0 <= minute < 60 and 0 <= second < 60):
        raise ValueError(f"Time out of range: {value!r}")
    return time(hour, minute, second)
