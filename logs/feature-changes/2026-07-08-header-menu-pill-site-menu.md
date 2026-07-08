# Header glass "Menu" pill + fullscreen SiteMenu (all viewports)

- **Date:** 2026-07-08
- **Author:** main
- **Type:** feat
- **Chapter/Area:** site chrome (Header / menu overlay)

## Summary
Removed the desktop inline nav links from the fixed header and replaced them with a single rounded glassmorphism "Menu" pill (top-right, all viewports, wrapped in `MagneticButton`). The fullscreen overlay menu — formerly mobile-only `MobileMenu` — was renamed `SiteMenu` and now serves every viewport, gaining an animated open (curtain wipes down in preloader language, then the existing link stagger) and an animated close (links drop, curtain wipes back up, then unmount).

## Files touched
- `src/constants/navigation.ts` — deleted `headerLinks` (its only consumer was the header's inline nav).
- `src/components/layouts/Header.tsx` — removed desktop nav row; hamburger icon button → always-visible glass pill (`rounded-full border-paper/15 bg-paper/10 backdrop-blur-md`, mono eyebrow label) in `MagneticButton`.
- `src/components/layouts/MobileMenu.tsx` → `src/components/layouts/SiteMenu.tsx` — rename + animated open/close; stays mounted through the exit tween via a `rendered` state adjusted during render (not in an effect — `react-hooks/set-state-in-effect` rejects the effect version).
- `src/components/layouts/RootLayout.tsx` — import/JSX/comment updated to `SiteMenu`.

## Notable decisions
- Pill lives in the fixed header (always reachable while scrolling), not in-flow with the hero tagline — confirmed with the user against the in-hero alternative.
- Glass style uses opacity modifiers on token colors (`bg-paper/10` etc.), keeping the no-raw-hex QA grep green; `rounded-full` is a deliberate user-requested exception to the small-radius rule.
- Close animation reuses the store shape unchanged (`menuOpen`/`setMenuOpen`); reduced motion keeps instant mount/unmount with no transforms.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (focus moves to close on open, restores to pill on close; Escape closes; scroll-lock releases; dialog unmounts after exit tween — verified via chrome-devtools at 1440px and 390px, console clean)
- [ ] Lighthouse ≥ 90 (no new section shipped; run at next chapter QA)

## Follow-ups
- Chapter anchors `#about`/`#skills`/`#gallery` etc. have no targets yet (sections unbuilt) — menu links no-op scroll until those chapters ship.
