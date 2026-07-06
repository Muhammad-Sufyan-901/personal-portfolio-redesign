# QA Auditor — Project Memory

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
- Overlay chapters: check underlying content is `inert` (not just `aria-hidden` on the overlay) — preloader left ThemeToggle tabbable behind the curtain (accepted for ch.00, fix due with Hero).
