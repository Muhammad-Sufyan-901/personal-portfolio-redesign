# Motion foundation: GSAP/Lenis wiring + motion primitives

- **Date:** 2026-07-07
- **Author:** motion-engineer
- **Type:** feat
- **Chapter/Area:** motion layer (foundation, pre-chapter)

## Summary
Bootstrapped the entire motion layer per design_system §7/§9.1 and system_architecture §2/§4.3: single GSAP source, single Lenis owner synced to `gsap.ticker`, reduced-motion + isomorphic-layout hooks, minimal Zustand UI store, motion types, and six common primitives (RevealText, ParallaxImage, Marquee, MagneticButton, ChapterEyebrow, Cursor). `main.tsx` now composes providers through a new `AppProviders`.

## Files touched
- `src/lib/gsap.ts` — single GSAP source; registers ScrollTrigger, defaults `power4.out` / `0.8s`
- `src/providers/SmoothScrollProvider.tsx` — single Lenis owner (lerp 0.09) + `LenisContext`; skipped entirely under reduced motion
- `src/providers/AppProviders.tsx` — ThemeProvider(dark) → TooltipProvider → SmoothScrollProvider
- `src/hooks/useLenis.ts`, `src/hooks/usePrefersReducedMotion.ts`, `src/hooks/useIsomorphicLayoutEffect.ts` — new hooks
- `src/store/useUIStore.ts` — zustand: `preloaderDone`, `menuOpen` only
- `src/types/motion.ts` — `RevealMode`, `ParallaxConfig`
- `src/components/common/{RevealText,ParallaxImage,Marquee,MagneticButton,ChapterEyebrow,Cursor}.tsx` — motion primitives
- `src/components/common/index.tsx` — barrel exports for the new primitives
- `src/main.tsx` — uses `AppProviders`; theme default now `dark` (was `system`)

## Notable decisions
- `usePrefersReducedMotion` via `useSyncExternalStore` (no state/effect pair).
- No manual resize→`ScrollTrigger.refresh()` listener: ScrollTrigger already refreshes on resize; route-change refresh deferred (single-page site).
- RevealText line mode wraps each split line in a DIY `overflow-hidden` parent; `split.revert()` restores original innerHTML so wrappers vanish with it. Once-reveals don't re-split on resize (deliberate).
- Cursor toggles `cursor-none` on `<html>` only while active; hides itself (returns null) on `(hover: none)`/coarse pointers and reduced motion.
- ParallaxImage uses raw `<img>` (common/ is exempt) so the clip/parallax transforms don't fight the `Image` skeleton wrapper.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (every primitive has a static/opacity-only branch; Lenis not created; cursor null; marquee duplicate is `aria-hidden`)
- [ ] Lighthouse ≥ 90 (no section shipped yet)

## Follow-ups
- `Preloader` + `PageTransition` ship with their sections (per task scope).
- Native `cursor: pointer` still shows over links/buttons while custom cursor is active; add `* { cursor: none }` scoped rule if it bothers in QA.
- Interactive-control cursor detection is `a, button, [data-cursor]` — extend selector if role-based controls appear.
