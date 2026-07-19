# Force top-of-page load on refresh

- **Date:** 2026-07-19
- **Author:** main
- **Type:** fix
- **Chapter/Area:** app entry / motion layer (scroll restoration)

## Summary
Refreshing mid-scroll restored the previous scroll position, so the preloader (which runs every load and morphs onto the hero h1) revealed the middle of the page instead of the hero. Removed the router's `scrollRestoration: true`, set `history.scrollRestoration = "manual"`, and force `window.scrollTo(0, 0)` before render — every refresh now lands at the hero.

## Files touched
- `src/lib/gsap.ts` — set `window.history.scrollRestoration = "manual"` **before** `gsap.registerPlugin(ScrollTrigger)`.
- `src/main.tsx` — removed `scrollRestoration: true` from `createRouter`; added `window.scrollTo(0, 0)` at module scope.

## Notable decisions
- The `"manual"` set lives in `lib/gsap.ts`, not `main.tsx`: ScrollTrigger snapshots `history.scrollRestoration` at init (`_scrollRestoration = history.scrollRestoration || "auto"`) and **re-applies the snapshot on every `ScrollTrigger.refresh()`** (`_clearScrollMemory`). ESM import hoisting means `lib/gsap` (via `AppProviders → SmoothScrollProvider`) initializes ScrollTrigger before `main.tsx`'s module body runs — a `main.tsx`-only set was verified reverting to `"auto"` after the first refresh. Setting it before `registerPlugin` makes the snapshot itself `"manual"`. (Also recorded in motion-engineer memory.)
- Dropped router-level scroll restoration entirely instead of configuring it: single-page site, hash navigation is click-only Lenis smooth-scroll, so it had no other job.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npx eslint src/main.tsx src/lib/gsap.ts` clean
- [x] Browser (chrome-devtools MCP): scroll to 3000 → reload → `scrollY === 0` before and after the preloader; `history.scrollRestoration === "manual"` survives the fonts-ready `ScrollTrigger.refresh()`.
- [x] Reduced-motion (matchMedia override, no Lenis): scroll to 2500 → reload → `scrollY === 0`.
- [x] Console clean (only pre-existing THREE.Clock deprecation warning).

## Follow-ups
- None.
