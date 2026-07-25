# Journey — node rides the tilt, light-glass stack badges

- **Date:** 2026-07-25
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (on-screen 08)

## Summary

Two owner asks. (1) The connector node stayed put while the card tilted under the mouse, so it read as floating next to the card rather than attached to it. (2) The tech-stack badges were unlabelled and muted gray; they now carry a title and adopt the light-glass treatment 04 Projects already ships, giving both chapters one badge language.

## Files touched

- `src/features/home/sections/JourneySection.tsx` — card DOM re-nested so the tilt has its own wrapper; stack block gains an `h4` label and the Projects pill classes.

## Notable decisions

- **The tilt moved to a new wrapper rather than the node moving into the card.** The node has to be a child of the rotating element to ride it, but the card box is `rounded-card overflow-hidden` (load-bearing — it clips the bloom and sheen) and would cut a node sitting half outside the edge. So the card is now three boxes: `.journey-reveal` (scrub target) › `.journey-card-tilt` (tilt target, `relative`, **no overflow**) › the visual card box (`group`, bg, halo, padding, clip). Rejected: dropping `overflow-hidden` and clipping the bloom some other way — that would have rewritten two working layers to fix a positioning problem.
- **The tilt's pointer maths needed no change.** Absolutely-positioned children don't contribute to a parent's size, so the wrapper's rect equals the card's; `onMove` reads the same numbers it always did. Listeners still bind to `.journey-card-tilt`, now the wrapper.
- **The halo stays a box-shadow on the inner card box.** A shadow escapes its own element's `overflow-hidden`, and as a descendant of the wrapper it still rides the tilt — so the 2026-07-24 halo note holds unchanged after the re-nest.
- **`group` stayed on the inner card box**, not the wrapper, so the sheen's `group-hover:opacity-80` keeps its original trigger area.
- Badge pill lifted verbatim from `ProjectsSection.tsx` rather than re-derived — the two chapters already share `TECH_ICONS`, so sharing the pill closes the inconsistency rather than adding a second dialect. Owner picked light-glass over white-text-only and over solid-white-fill.
- Label reads "Tools & Stack" (owner pick) — it covers the QA card, whose `stack` is `["Jira", "Docs"]`, tools rather than a tech stack.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Node rides the tilt — driven to a corner via synthetic `mousemove`, the node moved −10.49px x / −5.51px y and foreshortened +1.87px width under the `matrix3d`. Previously it did not move at all.
- [x] Node still lands exactly on the card edge at rest, both sides: right-side card dot centre x 864 == card left 864; left-side card dot centre x 456 == card right 456; both dot centre y == card mid y.
- [x] Tilt wrapper computed `overflow: visible` — node is not clipped.
- [x] Badges: `color rgb(240,240,240)` (paper-bright), `bg` paper/0.1, `border` paper/0.15, `backdrop-filter: blur(12px)`, icons present. Labels render "Responsibilities" then "Tools & Stack".
- [ ] Lighthouse — not re-run (markup/class-only diff, no new JS).

## Follow-ups

- None. Note for future work: the tilt wrapper must never gain an `overflow` class, or the node is clipped again.
- Tooling aside: PNG screenshots timed out repeatedly on this page (WebGL aurora + looping pings) and wedged the chrome-devtools MCP browser; JPEG at quality 70 captured fine.
