---
description: Run the Definition of Done audit (types, lint, a11y, reduced-motion, performance, SEO) for a chapter or the whole site, and write a log.
argument-hint: [chapter or "all"]
---

# /qa-audit $ARGUMENTS

Delegate to the `qa-auditor` subagent. Run the Definition of Done in `.agents/context/system_architecture.md §8` for **$ARGUMENTS** (default: all):

- `npx tsc --noEmit` + `npm run lint` clean; no `any`.
- No cross-feature imports; no raw hex in components.
- `prefers-reduced-motion` works; Lenis↔ScrollTrigger refresh on resize/route change.
- Keyboard nav, visible focus, alt text, landmarks.
- Lighthouse ≥ 90 (Perf/A11y/Best/SEO); media optimized; meta/OG/theme-color present.

Write results to `.artifacts/qa-log.md` with severity + concrete fix per issue.
