# Stat cards: center-align text

- **Date:** 2026-07-19
- **Author:** main
- **Type:** style
- **Chapter/Area:** 03 About (stats finale)

## Summary
Owner request: center the text inside the About stat cards. Added `justify-center` to the digit-row flex `p` and `text-center` to the label `p` in `StatCard`. No change to the odometer scrub (GSAP writes `.stat-strip`/`.stat-glare` transforms only — horizontal alignment is untouched by the timeline).

## Files touched
- `src/features/home/sections/AboutSection.tsx` — two class additions in `StatCard`.

## Notable decisions
- None — pure alignment tweak.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npx eslint src/features/home/sections/AboutSection.tsx` clean
- [x] Browser screenshot (chrome-devtools MCP): all three cards render digits + labels centered with the odometer settled.

## Follow-ups
- None.
