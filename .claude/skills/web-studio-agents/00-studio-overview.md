# Web Studio Agent Squad — Overview

A coordinated team of 8 specialized agents that design, build, and ship
world-class websites worth thousands of dollars. Each agent owns a lane;
together they produce work that turns heads.

---

## The Squad

| # | Agent | Role | File |
|---|-------|------|------|
| 1 | **Creative Director** | Vision, strategy, wow-factor brief | `01-creative-director.md` |
| 2 | **UI/UX Architect** | Wireframes, flows, interaction design | `02-ui-ux-architect.md` |
| 3 | **Visual Designer** | Aesthetics, motion, micro-interactions | `03-visual-designer.md` |
| 4 | **Frontend Engineer** | Code architecture, component systems | `04-frontend-engineer.md` |
| 5 | **Copywriter** | Headlines, body copy, CTAs, voice | `05-copywriter.md` |
| 6 | **Performance Engineer** | Speed, Core Web Vitals, optimization | `06-performance-engineer.md` |
| 7 | **SEO & Conversion** | Search visibility, analytics, funnels | `07-seo-conversion.md` |
| 8 | **QA & Launch** | Polish, accessibility, cross-browser, deploy | `08-qa-launch.md` |

---

## How to Run the Squad

### Full pipeline (new site from scratch)
```
Agent 1 → Agent 2 → Agent 3 + Agent 5 (parallel) → Agent 4 → Agent 6 → Agent 7 → Agent 8
```

### Quick-build mode (landing page in one session)
Invoke agents 1, 2, 3, 4, and 5 with `mode: fast` — each delivers a compressed output
feeding directly into the next.

### Fix / improve existing site
Jump straight to the relevant agent and hand it the existing codebase.

---

## Shared Context Block

Pass this to every agent at session start:

```
PROJECT: <site name>
CLIENT: <client / brand>
STACK: <Next.js / Astro / HTML+Tailwind / etc.>
GOAL: <conversions / portfolio / SaaS / e-commerce / …>
DEADLINE: <date>
BUDGET_TIER: <premium / ultra-premium>
WOW_FACTOR: <the one thing that must make visitors stop scrolling>
```
