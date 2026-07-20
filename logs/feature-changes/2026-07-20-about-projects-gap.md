# More gap between About and Projects sections

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** 04 Projects (boundary with 03 About)

## Summary
Owner asked for more breathing room between the About and Projects chapters. Added `mt-section` to the Projects section root, stacking one extra `--spacing-section` (clamp 6rem–12rem) on top of its existing `py-section` top padding.

## Files touched
- `src/features/home/sections/ProjectsSection.tsx` — root `Box` className: `py-section` → `py-section mt-section`.

## Notable decisions
- Used the existing `--spacing-section` token via `mt-section` instead of bumping About's `pb-[10svh]` or introducing a new arbitrary value — one class, stays on-token.

## Verification
- [x] className-only change — no type surface touched
- [ ] visual check in dev (owner to eyeball the gap)

## Follow-ups
- If the doubled gap feels too large, swap `mt-section` for a smaller spacing token instead of adding a new one.
