# About: real portrait photo (natural) + glare — re-applied

- **Date:** 2026-07-19
- **Author:** main
- **Type:** feat (+ fix)
- **Chapter/Area:** 03 About (portrait), 01 Hero (overflow fix)

## Summary

Re-application of the portrait task recorded in `2026-07-19-portrait-photo-glare.md` (built → reverted → owner re-requested after committing the unrelated About work at `af5c024`). Same verified recipe, re-verified end to end:

- **Natural photo**: duotone tint + opaque ember wash deleted (`TINT_GRADIENT` too); the committed `about-profile.png` now shows in real colors under the kept ember glow shadow.
- **React Bits GlareHover** (adapted, no install): hover band retuned to the example (−30°, `paper/30`, 300%, `--dur-base`); separate GSAP-owned `.about-glare-in` band sweeps once per portrait instance on first scroll-into-view (`once: true`, `clamp(top 65%)` via `portrait.glareIn`).
- **Fix**: `.about-inner` `pointer-events-none` + `[&>*]:pointer-events-auto` (desktop hover over the rail was swallowed by the text column).
- **Fix**: hero `overflow-x-clip` (zoom-exit h1 widened the document; phones zoomed out and lost the last ~370 px of scroll — mobile portrait + finale tail unreachable).

## Files touched

- `src/features/home/sections/AboutSection.tsx` — EmberPortrait v10 layers, `GLARE_BAND`, entrance sweep in `useGSAP`, pointer-events fix.
- `src/features/home/utils/about.tunables.ts` — `portrait.tint` → `portrait.glareIn`.
- `src/features/home/sections/HeroSection.tsx` — `overflow-x-clip` on the section root.

## Notable decisions

- Suggested commit split: `fix(hero)` for the overflow clip + `feat(about)` for the portrait (pointer-events fix rides it).

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] Desktop 1440×900 (MCP): no horizontal overflow; entrance band parked → `100% 100%` after About enters; `:hover` reaches `.about-clip`, hover band sweeps; photo natural, zero tint layers.
- [x] Mobile 390×844 (MCP, layout-viewport scroll math): no zoom-out (`innerHeight` 844), true max scroll reached, figure un-clips, entrance band fired, finale version opacity 1.
- [x] Reduced motion: bands `motion-reduce:hidden`; tween inside the guarded early return; markup = settled state.
- [ ] Lighthouse ≥ 90 (deferred to final QA)

## Follow-ups

- Convert the 1.6 MB PNG to WebP before final QA; unreferenced duplicate at `src/assets/images/profile/` still untracked.
