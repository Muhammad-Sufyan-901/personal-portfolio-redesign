# Navbar removal — hero-aligned Menu button + scroll pop-out

- **Date:** 2026-07-08
- **Author:** main
- **Type:** refactor
- **Chapter/Area:** 01 Hero, site chrome

## Summary
Removed the fixed full-width `Header` navbar. The glass "Menu" pill now sits in-flow on the hero's top row (same level as the top-left tagline) and scrolls away with the hero. Once the user scrolls past 100vh, a separate fixed `MenuPopout` button pops into the top-right corner with a scale-overshoot reveal (retracts on scroll back up). The "MS" back-to-top logo was dropped — no fixed chrome remains over the hero.

## Files touched
- `src/components/layouts/MenuButton.tsx` (new) — extracted the glass pill (`MagneticButton` + shadcn `Button`, opens `SiteMenu` via `useUIStore.setMenuOpen`) out of `Header.tsx` so it can be reused in two places.
- `src/components/layouts/MenuPopout.tsx` (new) — fixed `top-6 right-page-x z-[60]` trigger. `useGSAP` + `ScrollTrigger.create({ start: () => window.innerHeight, end: POPOUT_END, onToggle })` drives the pop/retract (`back.out(2)` in, `power2.in` out); reduced-motion branch is a plain `autoAlpha` show/hide, no scale.
- `src/features/home/sections/HeroSection.tsx` — tagline block replaced with a `flex items-start justify-between` top row (tagline left, `MenuButton` right); dropped the `mt-28` header-clearance offset now that there's no bar.
- `src/components/layouts/RootLayout.tsx` — swapped `<Header />` for `<MenuPopout />`, still inside the `inert={menuOpen}` wrapper.
- `src/components/layouts/Header.tsx` — deleted (only consumer was `RootLayout`).

## Notable decisions
- **`end: 100_000` instead of `end: "max"`** — verified via chrome-devtools MCP (wheel-driven scroll to the exact document bottom) that GSAP's `end: "max"` flips `isActive` back to `false` right when `progress` hits `1` at the literal end of the scrollable document — the pop-out button would vanish for a user scrolled all the way to the footer. A large fixed `end` no real page scroll reaches sidesteps the boundary quirk entirely. Left a `ponytail:` comment naming the ceiling.
- Kept `MenuButton` prop-less and unstyled-by-position — callers (`HeroSection`, `MenuPopout`) own placement, the button owns only its own look/behavior. Avoids a `className`-passthrough prop for two call sites.
- Removed the "MS" logo rather than relocating it — cleanest read of "remove the navbar"; back-to-top is still reachable via `SiteMenu → Intro`.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — reduced-motion branch confirmed by reading the code path (opacity-only, no scale); overlay `inert`/focus handling untouched (owned by `RootLayout`/`SiteMenu`, not touched here)
- [ ] Lighthouse ≥ 90 — not run (no full section shipped, chrome-only change)

Runtime-verified via chrome-devtools MCP: preloader → hero Menu button on the tagline row (screenshot); wheel-scroll past 100vh → `MenuPopout` pops in top-right (screenshot); scroll back to 0 → retracts (screenshot); wheel-scroll to the exact document bottom → stays visible after the `end` fix (screenshot); clicked the pop-out button → `SiteMenu` overlay opens correctly (screenshot). No console errors.

## Follow-ups
- None. `SiteMenu`'s close-button row alignment (`h-18`) was left as-is per plan (optional polish, skipped — reads fine without the old header height to match).
