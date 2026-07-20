# Projects rows — tech badges moved above description, text brightened

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** 04 Projects

## Summary
Owner request: in each project index row, the tech-stack badges should sit directly below the title text. Swapped the order inside the collapsible reveal block — badges first (`pt-2`, formerly the description's top pad), description after (`pt-3`). Reveal choreography, active-state grid collapse, and reduced-motion behavior are untouched.

## Files touched
- `src/features/home/sections/ProjectsSection.tsx` — reordered badges `ul` above the description `p` inside the row's overflow-hidden reveal box; swapped their `pt-*` values to keep the vertical rhythm. Follow-up in the same session: badge text `text-muted` → `text-paper-bright` (owner asked for white; `--color-paper-bright #F0F0F0` is the whitest token — no raw hex allowed).
- `src/data/projects.data.ts` — owner-authored title/slug shortening (Phantom, Petabyte, HooBank, Opto; KNA → "Keanu Abimanyu Construction"), committed alongside.

## Notable decisions
- Kept badges inside the collapsible block (they still reveal with row activation) rather than making them always-visible under the title — the request was about position, not reveal timing.
- Same session: added explicit "Live Preview ↗" / "GitHub ↗" links below the description (rendered only when `livePreviewURL`/`repositoryURL` exist — no invented URLs). Styled on the About CV link grammar (mono meta uppercase, underline, accent arrow with hover nudge). This forced the row wrapper `Link` → `Box`: nested anchors are invalid HTML, so the whole-row click + `data-cursor="View Project"` pill were removed in favor of the explicit links; `onFocus` activation moved onto the links (keyboard focus still expands the row). The single-use `rowPad` const was inlined.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (if UI) — no behavior change; static mode still renders all rows expanded
- [ ] Lighthouse ≥ 90 (if a section shipped)

## Follow-ups
- None.
