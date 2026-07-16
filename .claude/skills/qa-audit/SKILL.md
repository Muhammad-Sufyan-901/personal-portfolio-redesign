---
name: qa-audit
description: Run the Definition of Done audit (types, lint, hygiene greps, a11y, reduced-motion, performance, SEO) for a chapter or the whole site and write findings to .artifacts/qa-log.md. Use per section before its approval gate, and once globally at the end.
argument-hint: [chapter or "all"]
---

# /qa-audit $ARGUMENTS

Delegate to the `qa-auditor` subagent. Run the Definition of Done in `.agents/context/system_architecture.md §8` for **$ARGUMENTS** (default: all):

- `npx tsc --noEmit` + `npm run lint` clean; no `any`.
- No cross-feature imports; no raw hex in components; no bare HTML tags in feature TSX (`.claude/rules/custom-components.md`).
- `prefers-reduced-motion` works (`.claude/rules/accessibility.md` / `.agents/skills/accessibility-reduced-motion`); Lenis↔ScrollTrigger refresh on resize/route change.
- Keyboard nav, visible focus, alt text, landmarks; overlay `inert`/focus containment on `SiteMenu`/`Preloader`.
- Lighthouse ≥ 90 (Perf/A11y/Best/SEO); media optimized; meta/OG/theme-color present — SEO checklist in `.agents/skills/seo-meta` (theme-color `#0A0A0A` per design_system v2).
- A `logs/feature-changes/` entry exists **for the audited diff** (pre-reset logs describe deleted code and don't count).

Runtime note: chrome-devtools MCP is not exposed in qa-auditor subagent threads — browser smoke tests use the puppeteer fallback in `.claude/agent-memory/qa-auditor/runtime-smoke-testing.md`.

Write results to `.artifacts/qa-log.md` with severity + concrete fix per issue — the auditor never edits feature source. Runs per section (before each section's approval gate) and once globally at the end.
