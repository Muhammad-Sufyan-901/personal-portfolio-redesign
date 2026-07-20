# Projects row title + description switched to Inter

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** 04 Projects

## Summary
Owner asked for the project row title and description to render in Inter. Both now use the `font-mono` utility — in this repo that token maps to Inter Variable (the utility kept its name through the 2026-07-20 font-stack change; it is not monospace).

## Files touched
- `src/features/home/sections/ProjectsSection.tsx` — row title: `font-sans` → `font-mono`; description `<p>`: added `font-mono`.

## Notable decisions
- Reused the existing `--font-mono` (Inter) token instead of adding a new `font-*` token — Inter already ships via `@fontsource-variable/inter`.

## Verification
- [x] className-only change — no type surface touched
- [ ] visual check in dev (owner to eyeball the face swap)

## Follow-ups
- None.
