# Hero name: two giant stacked rows (reference scale)

- **Date:** 2026-07-08
- **Author:** main
- **Type:** style
- **Chapter/Area:** 01 Hero

## Summary
Scaled the hero name to the reference's giant proportions. A shared row physically caps at ~10vw ("Muhammad Sufyan." is 15 glyphs ≈ 8.6em; the reference's shorter "Luke Baffait." is what allows its ~15vw), so per user decision the words now stack on two rows at every breakpoint: "Muhammad" (grotesk) left, "Sufyan." (Fraunces italic) right-aligned below, at `clamp(3.5rem, 16vw, 19rem)`.

## Files touched
- `src/styles/globals.css` — `--text-hero` `clamp(3rem, 9vw, 9.5rem)` → `clamp(3.5rem, 16vw, 19rem)`; comment documents the one-row ceiling math.
- `src/features/home/sections/HeroSection.tsx` — h1 dropped `md:flex-row md:items-end md:justify-between md:gap-8` (always `flex-col`); word spans get `self-start` / `self-end` for the editorial stagger.

## Notable decisions
- User chose stacked-giant over one-line-max (~10vw ceiling, only ~9% bigger) after seeing the physics.
- First over-sized attempt (11.5vw one-row) exposed a trap: the `overflow-hidden` clip wrappers zero out flex `min-width:auto`, so oversized words silently SHRANK AND CLIPPED instead of overflowing. Any future `--text-hero` bump must re-check `scrollWidth <= width` on both word spans.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Visually verified at 1440 and 390 via chrome-devtools; `scrollWidth === width` on both spans (no clipping); char reveal + pointer parallax unaffected
- [ ] Lighthouse ≥ 90 (no new section; next chapter QA)

## Follow-ups
- None.
