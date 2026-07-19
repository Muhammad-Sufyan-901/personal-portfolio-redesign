# About: orange filter back on the portrait photo

- **Date:** 2026-07-19
- **Author:** main
- **Type:** style
- **Chapter/Area:** 03 About (portrait)

## Summary

Owner request after seeing the natural photo: the ember duotone filter is restored over the portrait — the `.about-tint` layer (`mix-blend-color` over `TINT_GRADIENT`, token stops `accent-deep → accent`) between the image and the glare bands. Luminance is preserved so the photo stays fully readable, hue pulled into the ember family (screenshot-verified). The v8-era opaque normal-blend wash stays deleted — it would hide the photo.

## Files touched

- `src/features/home/sections/AboutSection.tsx` — `TINT_GRADIENT` const + `.about-tint` Box restored; v10 → v11 comments.
- `src/features/home/utils/about.tunables.ts` — `portrait.tint: { stops: ["accent-deep", "accent"] }` restored alongside `glareIn`.

## Notable decisions

- Reused the documented duotone recipe (design_system D4) rather than a translucent overlay — it is the established "orange filter" for this portrait and keeps the photo legible.

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] Browser (MCP, desktop rail): tint present, `mix-blend-mode: color` computed, photo visible under the ember grade; glare durations unaffected (hover transition 2s).
- [x] reduced-motion unaffected (static layer, no motion).

## Follow-ups

- None.
