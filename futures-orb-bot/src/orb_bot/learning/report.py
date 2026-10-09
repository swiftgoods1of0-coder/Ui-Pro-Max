"""Research report generation.

Turns a :class:`~orb_bot.learning.patterns.MiningResult` into a readable Markdown
report. The report is explicit about evidence strength: recommendations are only
listed when a finding is **statistically supported** (large enough sample + a
significant difference); everything suggestive-but-underpowered goes in a
separate *speculative* section so it is never mistaken for a proven edge.
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import List

from .patterns import Finding, MiningResult


def _finding_lines(findings: List[Finding]) -> str:
    if not findings:
        return "_No qualifying groups._\n"
    return "\n".join(f"- {f.describe()}" for f in findings) + "\n"


def generate_markdown(result: MiningResult, *, symbol: str = "", min_samples: int = 20) -> str:
    r = result
    lines: List[str] = []
    add = lines.append

    add(f"# Trade Research Report{(' — ' + symbol) if symbol else ''}")
    add(f"_Generated {datetime.now():%Y-%m-%d %H:%M:%S} · research only, not advice._\n")

    # -- overall --
    add("## Overall performance\n")
    if r.n_decided == 0:
        add("_No completed (win/loss) trades to analyse._\n")
        return "\n".join(lines)
    add(f"- Trades analysed: **{r.n_trades}** ({r.n_decided} decided)")
    add(f"- Baseline win rate: **{r.baseline_win_rate*100:.1f}%**")
    add(f"- Average R multiple: **{r.avg_r:+.2f}R**")
    add(f"- Expectancy: **${r.expectancy:,.2f}/trade**\n")

    add("## Best setups\n" + _finding_lines(r.best_setups))
    add("## Worst setups\n" + _finding_lines(r.worst_setups))
    add("## Best hours (NY)\n" + _finding_lines(r.best_hours))
    add("## Worst hours (NY)\n" + _finding_lines(r.worst_hours))
    add("## Best market conditions\n" + _finding_lines(r.best_conditions))

    add("## Common reasons trades **win**\n" + _finding_lines(
        sorted(r.win_reasons, key=lambda f: f.lift, reverse=True)))
    add("## Common reasons trades **lose**\n" + _finding_lines(
        sorted(r.lose_reasons, key=lambda f: f.lift)))

    # -- recommendations --
    add("## Recommendations (statistically supported)\n")
    if r.recommendations:
        for rec in r.recommendations:
            add(f"- ✅ {rec}")
        add("")
    else:
        add(f"_No findings met the bar for a supported recommendation "
            f"(min sample {min_samples} + p < 0.05). Collect more trades._\n")

    add("## Speculative observations (insufficient sample — do not act yet)\n")
    if r.speculative:
        for s in r.speculative:
            add(f"- ⚠️ {s}")
        add("")
    else:
        add("_None._\n")

    add("---")
    add(f"_Method: two-proportion z-test vs the comparison group; a finding is "
        f"'statistically supported' only with ≥{min_samples} samples and p < 0.05. "
        f"Win-rate ranges are Wilson 95% intervals._")
    return "\n".join(lines)


def write_report(result: MiningResult, path: str | Path, *, symbol: str = "",
                 min_samples: int = 20) -> Path:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(generate_markdown(result, symbol=symbol, min_samples=min_samples),
                    encoding="utf-8")
    return path
