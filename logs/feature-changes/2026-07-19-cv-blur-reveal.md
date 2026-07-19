# About: Download CV blur reveal (bio grammar)

- **Date:** 2026-07-19
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 03 About, motion layer

## Summary

The Download CV action now blur-resolves like the description text (owner request). It can't go through `RevealText` (split-type would atomize the nested `Link` + arrow span), so the same veil→sharp fromTo (`veiledOpacity` + `SCRUB_Y` drift + `D.blurFromPx` blur, in-timeline `filter:"none"` hygiene set) runs inline in AboutSection's `useGSAP` on the `.about-cv` wrapper, scrubbed (`3/damp`) over its own position (`D.reveal.start`, span = `spanVh/2`·vh ≈ one bio line's resolve distance).

## Files touched

- `src/components/common/RevealText.tsx` — exported `SCRUB_Y` (single source for the scrub-drift px).
- `src/features/home/sections/AboutSection.tsx` — CV wrapper `.about-item` → `.about-cv`; new scrubbed veil timeline in the existing `useGSAP`.

## Notable decisions

- Dropped `.about-item` on the CV wrapper instead of nesting a second veil element — the veil IS the pre-state, and double-tweening opacity with the entry stagger would conflict (same "own reveal" precedent as `.about-final`). During entry the CV is below the fold, so the swap is invisible.
- `SCRUB_Y` imported from the RevealText module (not re-exported from the barrel — barrel stays the 14 primitives).

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (markup is the settled state; the guarded `useGSAP` early-returns, so RM renders the CV fully visible — and the veiled link stays focusable)
- [ ] Lighthouse ≥ 90 (no section shipped — unchanged)

## Follow-ups

- None.
