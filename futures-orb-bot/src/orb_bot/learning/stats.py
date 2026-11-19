"""Small, dependency-free statistics for the learning system.

Just enough to decide whether a difference in win rates between two groups is
*statistically meaningful* or merely noise — so recommendations are only made
when the evidence supports them. Uses a two-proportion z-test and Wilson score
intervals, both computed from ``math.erf`` (no SciPy dependency).
"""

from __future__ import annotations

import math
from dataclasses import dataclass


def normal_cdf(x: float) -> float:
    """Standard normal CDF."""
    return 0.5 * (1.0 + math.erf(x / math.sqrt(2.0)))


@dataclass
class ProportionTest:
    p1: float          # win rate of group 1
    p2: float          # win rate of group 2 (the rest)
    n1: int
    n2: int
    z: float
    p_value: float     # two-sided

    @property
    def significant(self) -> bool:
        return self.p_value < 0.05


def two_proportion_test(wins1: int, n1: int, wins2: int, n2: int) -> ProportionTest:
    """Two-sided two-proportion z-test comparing group1 vs group2 win rates."""
    p1 = wins1 / n1 if n1 else 0.0
    p2 = wins2 / n2 if n2 else 0.0
    if n1 == 0 or n2 == 0:
        return ProportionTest(p1, p2, n1, n2, 0.0, 1.0)
    pool = (wins1 + wins2) / (n1 + n2)
    se = math.sqrt(pool * (1 - pool) * (1 / n1 + 1 / n2))
    if se == 0:
        return ProportionTest(p1, p2, n1, n2, 0.0, 1.0)
    z = (p1 - p2) / se
    p_value = 2.0 * (1.0 - normal_cdf(abs(z)))
    return ProportionTest(p1, p2, n1, n2, z, p_value)


def wilson_interval(wins: int, n: int, z: float = 1.96) -> tuple[float, float]:
    """Wilson score confidence interval for a proportion (default 95%)."""
    if n == 0:
        return (0.0, 0.0)
    phat = wins / n
    denom = 1 + z * z / n
    centre = (phat + z * z / (2 * n)) / denom
    margin = (z * math.sqrt(phat * (1 - phat) / n + z * z / (4 * n * n))) / denom
    return (max(0.0, centre - margin), min(1.0, centre + margin))


def confidence_label(n: int, significant: bool, min_samples: int) -> str:
    """Classify a finding's evidential strength for the report."""
    if n < min_samples:
        return "speculative"          # under-powered — not enough trades
    if significant:
        return "statistically supported"
    return "observed (not significant)"
