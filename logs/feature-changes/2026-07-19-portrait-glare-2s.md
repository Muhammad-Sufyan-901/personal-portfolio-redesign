# About: portrait glare duration → 2 s

- **Date:** 2026-07-19
- **Author:** main
- **Type:** style
- **Chapter/Area:** 03 About (portrait glare)

## Summary

Owner request: the portrait glare sweep now runs 2 s (was 800 ms/`--dur-base`). Both sweeps changed together so they stay matched: the CSS hover band (`duration-(--dur-base)` → `duration-2000`) and the GSAP entrance sweep (`portrait.glareIn.dur` 0.8 → 2).

## Files touched

- `src/features/home/sections/AboutSection.tsx` — hover band `duration-2000`.
- `src/features/home/utils/about.tunables.ts` — `glareIn.dur: 2` (+ sync note).

## Notable decisions

- 2 s has no motion token (`--dur-fast/base/slow` top out at slow); the bespoke numeric utility `duration-2000` is used with a keep-in-sync note on the tunable.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion unaffected (duration-only change; bands stay `motion-reduce:hidden` + guarded)

## Follow-ups

- None.
