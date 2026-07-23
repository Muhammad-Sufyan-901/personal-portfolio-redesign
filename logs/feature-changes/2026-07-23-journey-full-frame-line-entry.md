# Journey — full card frame (crossing guide lines) + sloped line entry

- **Date:** 2026-07-23
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

Two owner revisions on top of the same-day moving-dot-card frame pass, both driven by the
same reference still:

1. **Card frame** — the 4 short L-shaped ember corner brackets are replaced by a **solid
   border that fully surrounds the content**: 4 full-span hairlines inset from the card edge.
   They read as a complete rectangle plus short tails, which the card's existing
   `rounded-card overflow-hidden` clips at the rounded edge — the crossing-guide-line look of
   the reference image (owner picked this over a plain inset rectangle). The gap between the
   card edge and that frame ("padding outside the border") grew from 14px to 20px, and the
   card's own padding grew with it so content stays clear.
2. **Line entry** — the zigzag ember line used to enter **dead flat**, off-canvas left at
   exactly the first card's y. It now enters at the top-left and **slopes down gradually**
   into the first card: the space-mirror of the exit sweep the owner pointed at ("like the
   line at the end of the section, but in reverse").

## Files touched

- `src/features/home/utils/path.ts` — `buildZigzagPath`'s entry segment: the horizontal
  `M entryX first.y C …` run becomes `M entryX 0 C entryX midEntryY, firstX midEntryY, firstX
  first.y`, reusing the exit block's own control-point grammar (each end holds its x at the
  shared mid-y), so the stroke still arrives at the first tip travelling straight down and
  the zigzag below is untouched. `0` is the literal mirror of the exit's `exitY`, which
  `Math.max(h, …)` always resolves to `h`.
- `src/features/home/utils/journey.tunables.ts` — `frame.bracketLength` retired;
  `bracketThickness`/`bracketInset`/`bracketOpacity` → `thickness` (1.5px → **1px**) /
  `inset` (14px → **20px**) / `opacity` (55 → **45**). Full-span lines carry far more area
  than 4 fading stubs, so both weight knobs came down. Added `line.entryRunway: "40svh"`.
- `src/features/home/sections/JourneySection.tsx` — `CARD_CORNERS` → `CARD_FRAME_LINES`
  (module-scope `CSSProperties[]`, 4 entries) and the 8-`Box` bracket map collapses to one
  4-`Box` map with a flat `color-mix` background (no gradient — the per-bar fade only existed
  to soften the bracket stubs). Dot loop waypoints `frame.bracketInset` → `frame.inset`.
  Card padding `p-6 md:p-8` → `p-9 md:p-12`. New `aria-hidden` spacer `Box` at
  `line.entryRunway` **inside** the line layer's positioning parent and **before** the `<ul>`.

## Notable decisions

- **Crossing guide lines, not a bordered rectangle** (owner pick) — 4 full-span lines are
  also strictly less markup than a rectangle plus tails, and the card's existing clip does
  the corner work for free.
- **Frame stays ember** (owner pick) — a neutral hairline was offered on the grounds that a
  full rectangle spends much more accent area than 4 stubs; the owner kept ember, hence the
  opacity/thickness reduction instead.
- The dot loop needed **only a rename**: it already anchored its waypoints to the same
  tunable the static decoration uses, so it now rides *along* the guide lines and parks on
  their intersections — which is exactly what the reference image shows. That's the payoff of
  the "anchor the loop's waypoints to the SAME tunable" rule from the previous pass.
- **`entryRunway` mirrors `finaleRunway`** rather than being a new mechanism: same spacer
  shape, same layer, and because the tips are measured by the existing `ResizeObserver`, the
  card positions shift down with it automatically — no measurement code changed.
- `JOURNEY.line.start`/`end` deliberately untouched: the container's top is unchanged and the
  taller layer just lengthens the draw window.

## Verification

- [x] `npx tsc --noEmit` clean (`noUnusedLocals` confirms no retired `bracket*` key or dead
      `CARD_CORNERS` survives)
- [x] `npm run lint` clean
- [x] raw-hex grep clean on all three touched files
- [x] Browser-verified via chrome-devtools MCP at `#journey`, 1512×982: complete inset
      rectangle on every card with tails clipping at the rounded corners, content clear
      inside, dot travelling on the lines; the line crosses the left page edge high and
      slopes down into card 1 instead of running flat
- [x] 390×844 mobile: `document.scrollWidth === innerWidth` (no horizontal overflow — the
      `overflow-x-clip` guard still holds), frame + padding read correctly at `p-9`
- [x] reduced motion unchanged **by construction** — both edits are static geometry (CSS
      positions and a path `d` string) living outside every `prefersReducedMotion` branch;
      `PathDraw` still renders the new `d` fully drawn and the dot still parks at its markup
      default

## Follow-ups

- `entryRunway: "40svh"` and `frame.opacity: 45` are first-pass values — retune in-browser if
  the slope reads too fast or the frame too loud.
