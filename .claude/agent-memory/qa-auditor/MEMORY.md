# QA Auditor — Project Memory

> **STATUS (2026-07-08, post B0 re-bootstrap):** foundation rebuilt (tokens ember/dark-only, 14 primitives, data layer, providers) — the checks below are live again. Sections 00→Footer build one gate at a time on the 10-chapter map (`00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer`); audit each as it lands.

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
- Overlay/modal chapters: check background is `inert`/focus-trapped AND focus is moved into the dialog on open + restored on close — recurred 3×: preloader (v2 ch.00), MobileMenu Tab escape (v2 ch.01), MobileMenu focus dropped to body on open (v3 ch.01 F2, 2026-07-08: making the trigger `inert` blurs it; nothing focuses the dialog). Check first on any new overlay.
- Overlays that `lenis.stop()`: any `lenis.scrollTo` issued while stopped is SILENTLY dropped — `lenis.mjs:747` `if ((this.isStopped || this.isLocked) && !force) return`. MobileMenu link clicks never scrolled (v3 ch.01 F1); fix is `{ force: true }` in the shared `Link` hash branch. Re-check whenever an overlay owns nav links or a scroll-lock pattern changes.
- Hardcoded prose in section JSX — ch.01 hero tagline was paraphrased copy not in `profile.data`. Diff every string literal in sections against `data/*.data.ts` + PRD.
- `Link` hash scroll: FIXED ch.01 — routes via `useLenis()`, native instant fallback when lenis null. Lesson stands: JS `behavior:"smooth"` is NOT overridden by reduced-motion CSS `scroll-behavior:auto`; check any new programmatic scroll.
- Focus-containment probes: the TanStack devtools button is a legit Tab escape target in dev only (`react-router-devtools` renders null when `NODE_ENV !== "development"`) — don't count it as a containment failure.
- `useGSAP` deps with `prefersReducedMotion`-derived values but no `revertOnUpdate: true` — 3rd recurrence in v3 ch.00 rebuild (Preloader/Cursor, 2026-07-08 F1). Without it the returned cleanup is deferred to unmount → never-unmounting components (Cursor) leak window listeners on a live RM toggle. Check FIRST on every animated component. (Applied correctly unprompted in the 2026-07-18 About refine — RevealText scrub variant + AboutSection both had it; lesson holding.)
- Rebuilt-chapter audits: check the `logs/feature-changes/` entry is for the CURRENT diff — v2-era logs (pre `chore(reset)` 118f5bc) describe wiped code and count as missing (ch.00 v3 F2, 2026-07-08).
- Width-conditional rigs (`gsap.matchMedia`): queries must be REM-based (`64rem`) to match Tailwind v4's `lg:` — px queries (`1024px`) diverge at non-default browser font size, pairing the wrong seam with the CSS layout (hero refine F2, 2026-07-16). Also check min/max pairs derive from ONE constant.
- Tunable/flag objects: grep every new "flip this to enable X" flag for consumers — `HERO_REFINE.FONTS.useReferenceFaces` shipped with zero readers while its comment claimed a runtime font swap (hero refine F1, 2026-07-16).
- Tailwind v4 `scale-*` sets the standalone `scale` PROPERTY, not `transform` — a `transition-[color,transform]` allowlist silently skips it (scale snaps, measured ch.04 F3, 2026-07-20). Grep custom `transition-[...]` lists against the actual properties the toggled utilities set (`scale`, `rotate`, `translate` are all standalone in v4).
- `revertOnUpdate: true` is a scalpel, not a default: on an effect whose deps include fast-changing state (`activeIndex`), each change reverts ALL prior inline styles → GSAP "crossfades" become snap-out/fade-in (ch.04 F2, 2026-07-20). Rule: revertOnUpdate on RM-dep-only effects; state-driven tween effects use `overwrite:"auto"` + CSS-class RM fallback instead. (The missing-revertOnUpdate pattern also recurred a 4th time: PathDraw, ch.04 F4.)
- SVG dash-draw on a `preserveAspectRatio="none"`-stretched viewBox + `vector-effect: non-scaling-stroke` renders as disconnected capsule fragments in Chrome — `pathLength={1}` normalization does NOT fix it (ch.04 F1 blocker, 2026-07-20). DOM probes look healthy (dasharray "1px", offset 0); only a screenshot catches it. Fix direction: pixel-space path geometry, no non-uniform stretch.
