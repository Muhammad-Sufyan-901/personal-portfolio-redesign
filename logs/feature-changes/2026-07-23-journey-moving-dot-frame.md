# Journey card — moving-dot-card frame (corner brackets, top-left glow, orbiting dot)

- **Date:** 2026-07-23
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

The user supplied a "shadcn component integration" instruction block for a `DotCard`
(raw `<div>`s, a `@keyframes moveDot` block, and a `tw-animate-css` import) and a reference
still image (glassy dark card, top-left light source, 4 L-shaped corner brackets, a dot
riding the border) and asked the Journey cards be reformatted to match, without changing
content. Per the mandatory `animated-ui-references` adaptation rule, the snippet was not
copy-pasted: it was rebuilt as the card's decorative frame only (content/layout untouched)
using GSAP + `@theme` tokens + `Box` primitives. Three design calls were confirmed with the
user up front: frame color (ember, on-brand), how it coexists with the existing bottom
bloom/aura (replace), and whether the dot moves (animate, with a static reduced-motion
fallback).

## Files touched

- `src/features/home/utils/journey.tunables.ts` — removed the retired `card.glowDeep` /
  `glowAccent` / `bloomHeight` / `auraDeep` / `auraAccent` / `edgeGlow` knobs (kept
  `card.sheenPaper`). Added `frame` (top-left glow size/opacity, bracket
  length/thickness/inset/opacity) and `dot` (size, fill/glow opacity, seconds per orbit leg).
- `src/features/home/sections/JourneySection.tsx` — inside each work/education card: removed
  the outer aura halo `Box`, the bottom ember bloom `Box`, and the two bottom edge-bar
  `Box`es; added a top-left radial-glow layer, 4 data-driven corner-bracket layers
  (`CARD_CORNERS` map, each an L of two fading bars), and a `.journey-dot` circle. Trimmed
  the card's `pb-28`/`md:pb-36` back to symmetric `p-6`/`md:p-8` now that the bottom bloom
  (the reason for that clearance) is gone. Added a third `useGSAP` block: one repeating,
  unscrubbed timeline per card driving `.journey-dot` around the same 4 points
  `frame.bracketInset` anchors the brackets to; reduced motion skips the loop, leaving the
  dot at its JSX default (bottom-center, static).

## Notable decisions

- **Frame color: ember**, not the reference image's neutral/white — one voice with the
  rest of the (already all-ember) card, per the user's explicit pick.
- **Replaced, not layered**: the old bottom bloom/aura/edge-bars are gone, not kept
  alongside the new frame — the user picked this over "augment" specifically because the
  reference has one light source (top-left), not two.
- Dot's orbit waypoints reuse `frame.bracketInset` (a fixed px value) rather than a
  separate percentage-based inset — a first pass at 8% put the dot's straight vertical/
  horizontal legs right through the card's text column (bullet list, tag pills); anchoring
  it to the same points as the corner brackets keeps it hugging the border and reuses one
  tunable instead of two.
- `// ponytail:` note left on using `top`/`left` percent/calc animation (not transforms) for
  the dot — negligible layout cost for 6 small dots, revisit only if it ever measures as a
  scroll-jank hot spot.
- Declined: installing `tw-animate-css` (deliberately uninstalled in this repo,
  `globals.css:151`) or any Framer/CSS-`@keyframes` port of the supplied snippet — both
  banned by the single-motion-stack rule; rebuilt as a GSAP timeline instead.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] bare-tag grep and raw-hex grep clean on both touched files
- [x] Browser-verified via chrome-devtools MCP at `#journey`: ember corner brackets on all 4
      corners, top-left ember glow, dot visibly circling the border (screenshotted mid-loop
      at 3 different points) on both a right-side and a left-side card; content/layout
      unchanged; old bottom bloom/aura confirmed gone
- [x] reduced-motion path verified by construction — the new dot `useGSAP` block uses the
      same `if (prefersReducedMotion) return;` guard as every other effect in this file, so
      the dot simply renders at its markup default (bottom-center) with no loop

## Follow-ups

- None outstanding.
