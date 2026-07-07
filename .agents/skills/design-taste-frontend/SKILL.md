---
name: design-taste-frontend
description: Pointer to the installed third-party anti-slop frontend design skill in .claude/skills/design-taste-frontend. Implementation lives only on the .claude side; apply with this project's stack overrides.
---

# design-taste-frontend (pointer — implementation in `.claude/skills/design-taste-frontend/`)

**What it is:** a single large (~1200-line) vendored design manual for landing pages/portfolios/redesigns — brief inference, design-variance/motion-intensity/density dials, typography and color bias-correction, hero discipline, and canonical GSAP scroll-pattern skeletons (sticky-stack, horizontal-pan, scroll-reveal).

**Why it's installed here:** adopted during agent-tooling setup (`logs/feature-changes/2026-07-06-setup-tooling.md`) as taste guardrails for exactly this kind of motion-first portfolio work.

**When to reach for it:** shaping the aesthetic direction of a new chapter, or auditing a built one for templated/"slop" patterns. Its GSAP skeletons are directly reusable.

**Project overrides (this repo wins on conflicts):** the skill's default architecture assumes Next.js + Motion (Framer) — this repo is Vite + TanStack Router + GSAP/Lenis (single motion stack, no framer-motion ever); and it bans Fraunces as a default serif — Fraunces is this project's *deliberate* display face (design_system.md §4). Treat those two directives as inapplicable here.

**Where it lives:** only in `.claude/skills/design-taste-frontend/SKILL.md` (deliberately not mirrored into `.agents/`); non-Claude agents can read it directly.
