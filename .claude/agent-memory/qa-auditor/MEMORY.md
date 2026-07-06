# QA Auditor — Project Memory

## Standard checks (Definition of Done — system_architecture §8)
- `npx tsc --noEmit` + `npm run lint` clean; no `any`.
- `grep -r "from '@/features/" src/features` → no cross-feature imports.
- `grep -rE "#[0-9a-fA-F]{6}" src/components src/features` → no raw hex (tokens only).
- `grep -rnE "<(div|p|span|h[1-6]|img|a)[ >]" src/features` → no bare HTML (must use `@/components/common`).
- Reduced-motion works; Lenis↔ScrollTrigger refresh on resize; keyboard/focus/alt/landmarks; Lighthouse ≥ 90; meta/OG/theme-color.
- A `logs/feature-changes/` entry exists for the audited work.

## Tooling (installed 2026-07-06)
- **chrome-devtools MCP** (root `.mcp.json`) — performance traces/insights, screenshots, console/network for the Lighthouse ≥ 90 gate; drive the local Vite dev server with it during audits.
- `/impeccable audit` and `/impeccable critique` — deterministic anti-slop design checks; usable as a pre-audit pass.

## Recurring issues (append as found)
- (none yet — record repeat offenders here so future audits check them first)
