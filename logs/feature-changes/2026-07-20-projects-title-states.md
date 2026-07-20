# Projects row title: semibold + gray inactive state

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** 04 Projects

## Summary
Owner asked for the project row title to be semibold and to render gray when its row is not active. Title now carries `font-semibold`; color is state-driven — `text-muted` at rest, `text-paper-bright` when active — with `color` added to the existing scale transition so the swap eases instead of snapping.

## Files touched
- `src/features/home/sections/ProjectsSection.tsx` — row title: added `font-semibold`; `text-paper-bright` moved into the active branch (`active ? "text-paper-bright scale-105" : "text-muted"`); `transition-[scale]` → `transition-[scale,color]`.

## Notable decisions
- Gray = existing `text-muted` token (`#9A9A9A`), no new color token.
- `staticMode` (reduced motion) already forces every row active, so all titles stay bright there — no separate fallback needed.

## Verification
- [x] className-only change — no type surface touched
- [ ] visual check in dev (owner to eyeball active/inactive contrast)

## Follow-ups
- None.
