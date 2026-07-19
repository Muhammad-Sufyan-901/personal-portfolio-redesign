# Remove About's "(3+)" left-gutter echo

- **Date:** 2026-07-20
- **Author:** main
- **Type:** refactor
- **Chapter/Area:** 03 About

## Summary

Deleted the `(3+)` left-gutter marker from AboutSection (user request). It duplicated the reference's gutter echo, but since the ScrollProgressHUD's "(22)" percentage now rides the same `left-6` rail, the two markers stacked ~5svh apart in About — the echo became redundant.

## Files touched

- `src/features/home/sections/AboutSection.tsx` — removed the `about-item` echo span (was `absolute left-6 top-[55%]`)

## Notable decisions

- None — pure deletion; the HUD percentage is the sole occupant of the left-6 rail now.

## Verification

- [x] `npm run build` (tsc -b + vite) clean
- [x] `npm run lint` clean

## Follow-ups

- None.
