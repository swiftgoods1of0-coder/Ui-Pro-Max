"""Tests for the risk manager: sizing models and guardrails."""

from orb_bot.config import RiskConfig
from orb_bot.risk import RiskManager


def _mgr(**overrides) -> RiskManager:
    cfg = RiskConfig(**overrides)
    mgr = RiskManager(cfg)
    mgr.start_day(day=None)
    return mgr


def test_fixed_fractional_sizing():
    mgr = _mgr(starting_equity_usd=10_000, risk_model="fixed_fractional",
               risk_per_trade_pct=1.0, max_consecutive_losses=None,
               max_trades_per_day=None)
    # 1% of 10k = $100 risk; risk/contract = 2 pts * $50 = $100 -> 1 contract.
    d = mgr.evaluate(risk_points=2.0, point_value=50.0)
    assert d.allowed
    assert d.contracts == 1
    assert d.risk_dollars == 100.0


def test_fixed_dollar_sizing():
    mgr = _mgr(starting_equity_usd=10_000, risk_model="fixed_dollar",
               risk_per_trade_usd=250.0, max_consecutive_losses=None,
               max_trades_per_day=None)
    # $250 / (2.5 * $50 = $125) = 2 contracts.
    d = mgr.evaluate(risk_points=2.5, point_value=50.0)
    assert d.allowed
    assert d.contracts == 2


def test_dynamic_sizing_scales_with_equity():
    mgr = _mgr(starting_equity_usd=10_000, risk_model="fixed_fractional",
               risk_per_trade_pct=1.0, allow_fractional_contracts=True,
               max_consecutive_losses=None, max_trades_per_day=None)
    first = mgr.evaluate(2.0, 50.0).contracts
    mgr.register_result(+5_000)   # account grows
    mgr.start_day(day=None)       # new day keeps the higher equity
    second = mgr.evaluate(2.0, 50.0).contracts
    assert second > first


def test_max_trades_per_day():
    mgr = _mgr(max_trades_per_day=1, max_consecutive_losses=None)
    assert mgr.evaluate(2.0, 50.0).allowed
    mgr.register_fill()
    d = mgr.evaluate(2.0, 50.0)
    assert not d.allowed and d.reason == "max_trades_per_day"


def test_max_consecutive_losses():
    mgr = _mgr(max_consecutive_losses=2, max_trades_per_day=None)
    mgr.register_result(-100)
    mgr.register_result(-100)
    d = mgr.evaluate(2.0, 50.0)
    assert not d.allowed and d.reason == "max_consecutive_losses"
    # A win resets the streak.
    mgr.state.consecutive_losses = 0
    assert mgr.evaluate(2.0, 50.0).allowed


def test_daily_max_loss():
    mgr = _mgr(starting_equity_usd=10_000, daily_max_loss_usd=100.0,
               max_trades_per_day=None, max_consecutive_losses=None)
    mgr.register_result(-150)
    d = mgr.evaluate(2.0, 50.0)
    assert not d.allowed and d.reason == "daily_max_loss"


def test_max_contracts_cap():
    mgr = _mgr(starting_equity_usd=1_000_000, risk_model="fixed_fractional",
               risk_per_trade_pct=5.0, max_contracts=3,
               max_trades_per_day=None, max_consecutive_losses=None)
    d = mgr.evaluate(1.0, 50.0)
    assert d.contracts == 3  # capped
