"""Tests for the OHLCV CSV loader."""

import pandas as pd

from orb_bot.data import load_ohlcv, OHLCV_COLUMNS


def _write_csv(tmp_path, rows, header):
    path = tmp_path / "data.csv"
    lines = [header] + rows
    path.write_text("\n".join(lines))
    return path


def test_load_basic_and_timezone(tmp_path):
    # UTC timestamps -> should convert to New York (EST = UTC-5 in January).
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:00,100,101,99,100.5,1000",
            "2024-01-02 13:01:00,100.5,102,100,101.5,1200",
        ],
        "timestamp,open,high,low,close,volume",
    )
    df = load_ohlcv(path, input_timezone="UTC", session_timezone="America/New_York")

    assert list(df.columns) == OHLCV_COLUMNS
    assert str(df.index.tz) == "America/New_York"
    # 13:00 UTC == 08:00 EST
    assert df.index[0].hour == 8
    assert df.index[0].minute == 0
    assert df["close"].iloc[1] == 101.5


def test_column_aliases_and_missing_volume(tmp_path):
    path = _write_csv(
        tmp_path,
        ["2024-01-02 13:00:00,100,101,99,100.5"],
        "Date,O,H,L,C",
    )
    df = load_ohlcv(path)
    assert "volume" in df.columns
    assert df["volume"].iloc[0] == 0.0


def test_missing_required_column_raises(tmp_path):
    path = _write_csv(
        tmp_path,
        ["2024-01-02 13:00:00,100,101"],
        "timestamp,open,high",  # no low/close
    )
    try:
        load_ohlcv(path)
        assert False, "expected ValueError"
    except ValueError as exc:
        assert "missing required column" in str(exc).lower()


def test_dedup_and_sort(tmp_path):
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:01:00,101,102,100,101,10",
            "2024-01-02 13:00:00,100,101,99,100,10",
            "2024-01-02 13:01:00,101,103,100,102,20",  # duplicate ts, keep last
        ],
        "timestamp,open,high,low,close,volume",
    )
    df = load_ohlcv(path)
    assert len(df) == 2
    assert df.index.is_monotonic_increasing
    assert df["close"].iloc[-1] == 102  # last duplicate kept
