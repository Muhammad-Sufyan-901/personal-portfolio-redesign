# QA Auditor — Project Memory

> **⚠️ HARD RESET (2026-07-07):** `src/` was reset to a single blank page (no primitives, tokens, data layer, or motion). The checks and recurring issues below stay valid as the audit playbook for the rebuild — but don't expect the referenced files/sections to exist until their chapters are rebuilt from the `.agents/context/` specs.

## Standard checks (Definition of Done — system_architecture §8)
- `npx tsc --noEmit` + `npm run lint` clean; no `any`.
- `grep -r "from '@/features/" src/features` → no cross-feature imports.
- `grep -rE "#[0-9a-fA-F]{6}" src/components src/features` → no raw hex (tokens only).
- `grep -rnE "<(div|p|span|h[1-6]|img|a)[ >]" src/features` → no bare HTML (must use `@/components/common`).
- Reduced-motion works; Lenis↔ScrollTrigger refresh on resize; keyboard/focus/alt/landmarks; Lighthouse ≥ 90; meta/OG/theme-color.
- A `logs/feature-changes/` entry exists for the audited work.

## Tooling (installed 2026-07-06)
- **chrome-devtools MCP** (root `.mcp.json`) — NOT exposed inside qa-auditor subagent threads; see [runtime-smoke-testing](runtime-smoke-testing.md) for the puppeteer-core fallback.
- `/impeccable audit` and `/impeccable critique` — deterministic anti-slop design checks; usable as a pre-audit pass.

## Recurring issues (append as found)
- Off-token default-Tailwind palette classes (`bg-slate-50` etc.) evade the hex grep — also run `grep -rnE "(bg|text|border)-(slate|gray|zinc|neutral|stone)-" src/components src/features` (found in RootLayout.tsx, 2026-07-07 ch.00 audit).
- Overlay/modal chapters: check background is `inert`/focus-trapped, not just aria attrs — recurred twice: preloader (ch.00, fixed) and MobileMenu `aria-modal` with Tab escape (ch.01 F1). Check first on any new overlay.
- Hardcoded prose in section JSX — ch.01 hero tagline was paraphrased copy not in `profile.data`. Diff every string literal in sections against `data/*.data.ts` + PRD.
- `Link` hash scroll: FIXED ch.01 — routes via `useLenis()`, native instant fallback when lenis null. Lesson stands: JS `behavior:"smooth"` is NOT overridden by reduced-motion CSS `scroll-behavior:auto`; check any new programmatic scroll.
- Focus-containment probes: the TanStack devtools button is a legit Tab escape target in dev only (`react-router-devtools` renders null when `NODE_ENV !== "development"`) — don't count it as a containment failure.
