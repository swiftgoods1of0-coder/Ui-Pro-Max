"""Tests for the tick/trade CSV loader."""

import pandas as pd

from orb_bot.data import load_ticks, TICK_COLUMNS


def _write_csv(tmp_path, rows, header, name="ticks.csv"):
    path = tmp_path / name
    path.write_text("\n".join([header] + rows))
    return path


def test_explicit_side_column_text_and_numeric(tmp_path):
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:00,100.25,5,buy",
            "2024-01-02 13:00:01,100.00,3,sell",
            "2024-01-02 13:00:02,100.25,2,B",
            "2024-01-02 13:00:03,100.00,1,S",
            "2024-01-02 13:00:04,100.25,4,1",
            "2024-01-02 13:00:05,100.00,6,-1",
        ],
        "timestamp,price,size,side",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert list(df.columns) == TICK_COLUMNS
    assert df["side"].tolist() == [1, -1, 1, -1, 1, -1]
    assert df["side"].dtype == "int8"


def test_bid_ask_classifies_aggressor_side(tmp_path):
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:00,100.25,5,100.00,100.25",   # at ask -> buy
            "2024-01-02 13:00:01,100.00,3,100.00,100.25",   # at bid -> sell
            "2024-01-02 13:00:02,100.125,2,100.00,100.25",  # midpoint -> unknown
        ],
        "timestamp,price,size,bid,ask",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert df["side"].tolist() == [1, -1, 0]
    assert "bid" not in df.columns and "ask" not in df.columns


def test_no_side_or_quotes_defaults_to_unknown(tmp_path):
    path = _write_csv(
        tmp_path,
        ["2024-01-02 13:00:00,100.25,5", "2024-01-02 13:00:01,100.00,3"],
        "timestamp,price,size",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert (df["side"] == 0).all()


def test_column_aliases(tmp_path):
    path = _write_csv(
        tmp_path,
        ["2024-01-02 13:00:00,100.25,5,buy"],
        "ts,px,qty,aggressor",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert list(df.columns) == TICK_COLUMNS
    assert df["side"].iloc[0] == 1


def test_missing_required_columns_raises(tmp_path):
    path = _write_csv(tmp_path, ["2024-01-02 13:00:00,100.25"], "timestamp,price")
    try:
        load_ticks(path)
        assert False, "expected ValueError"
    except ValueError as exc:
        assert "missing required column" in str(exc).lower()


def test_zero_and_negative_size_dropped(tmp_path):
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:00,100.25,5,buy",
            "2024-01-02 13:00:01,100.00,0,sell",   # zero size -> dropped
            "2024-01-02 13:00:02,100.25,-3,buy",   # negative -> clipped to 0 -> dropped
        ],
        "timestamp,price,size,side",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert len(df) == 1


def test_mixed_fractional_second_timestamps_parse_correctly(tmp_path):
    """Regression test: pandas' whole-column timestamp format inference used
    to lock onto the first row's shape and silently fail (NaT) on any row
    with a differently-shaped — but individually perfectly valid — timestamp
    string, such as one row landing on an exact second with no fractional
    part while the rest have microseconds. Realistic for real tick feeds
    (exchange timestamps do land on exact seconds sometimes), and is exactly
    what the synthetic tick generator produced the first time it was run."""
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:01.200000,100.25,5,buy",
            "2024-01-02 13:00:02,100.30,3,sell",       # no fractional part
            "2024-01-02 13:00:03.800000,100.20,2,buy",
        ],
        "timestamp,price,size,side",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert len(df) == 3  # none silently dropped as unparseable


def test_sorted_by_timestamp(tmp_path):
    path = _write_csv(
        tmp_path,
        [
            "2024-01-02 13:00:02,100.25,5,buy",
            "2024-01-02 13:00:00,100.00,3,sell",
            "2024-01-02 13:00:01,100.10,2,buy",
        ],
        "timestamp,price,size,side",
    )
    df = load_ticks(path, input_timezone="UTC")
    assert df.index.is_monotonic_increasing
