# Journey card — mouse-tilt + hover-lift, glass sheen, edge light

- **Date:** 2026-07-23
- **Author:** main (via /impeccable)
- **Type:** feat
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

The user supplied a generic "shadcn component integration" instruction block for a
`GradientCard` (framer-motion, raw JSX, hardcoded purple/blue palette, hardcoded demo copy)
and asked to format the Journey card to match it exactly without changing content. Taken
literally this conflicts with several already-committed project rules — see "Declined"
below. Most of what the reference image shows (rounded card, full-width bottom bloom, halo
aura, kind-icon badge, 35vw width) was already shipped in the two passes earlier today. The
one genuinely new element — mouse-follow 3D tilt + hover-lift — was adapted into the existing
GSAP architecture, plus two user-approved decorative extras recolored/simplified into the
token system.

## Files touched

- `src/features/home/utils/journey.tunables.ts` — `card` group: added `sheenPaper` (glass
  sheen gradient %) and `edgeGlow` (corner light gradient %). New `tilt` group:
  `max`/`duration`/`perspective`/`lift`.
- `src/features/home/sections/JourneySection.tsx` — inner card box: added
  `group journey-card-tilt` classes; inserted a glass-sheen layer as its first child
  (`group-hover:opacity-80` CSS-only brighten) and two 2px ember edge-light bars as its last
  children (after the bloom). New `useGSAP` block (per-card `gsap.quickTo` on
  `rotationX`/`rotationY`/`y`, mousemove/mouseenter/mouseleave listeners per
  `.journey-card-tilt` element) adapted from `ProjectsSection.tsx`'s preview-tilt recipe.

## Notable decisions

- **Declined** (hard rule conflicts, not proceeding): installing `framer-motion` (banned —
  one GSAP source); raw JSX in `/components/ui` (banned outside common/ui primitives); the
  reference's purple/blue palette (already declined twice this session for this same
  reference image — ember only); box-shadow/inset bevel on the icon circle ("box shadows do
  not appear anywhere" — design system §4); a "Learn More" CTA (no PRD content, already
  declined in yesterday's pass); swapping the kind-specific icon for the reference's generic
  star (the kind icon is informative, not decorative).
- Tilt targets the **inner** card box, not `.journey-reveal` (the scroll-reveal scrub
  target) — verified via computed-style probe that the two effects don't interfere (scroll
  reveal's pre-reveal transform/opacity contract is byte-identical to before this change).
- Edge-corner light collapsed from the reference's 6 near-duplicate layered elements per
  corner (thin line + soft glow × 2 sides + box-shadow) to 2 simple gradient bars — same
  visual read, no box-shadow, tokens-only.
- Glass sheen brightening on hover is CSS-only (`group`/`group-hover`, reusing the pattern
  already established on the award pill) rather than wired through GSAP — no need for JS
  here, keeps the tilt effect focused on the transform work only.
- Verified the tilt/lift actually fire (not just render without erroring) by dispatching
  synthetic `MouseEvent`s and reading the resulting `matrix3d(...)` computed transform
  before/after — confirms real rotation + `-5px` Y lift on hover, and a clean reset to
  identity on `mouseleave`.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] bare-tag grep, raw-hex grep, and `framer-motion` grep all clean
- [x] Browser-verified via chrome-devtools MCP: dispatched synthetic mouse events confirmed
      the tilt/lift transform applies and resets correctly; visually confirmed the sheen and
      edge lights render in the correct DOM order/z-stack
- [x] scroll-reveal regression check: pre-reveal computed style on untouched rows is
      byte-identical to the pre-tilt-change baseline
- [x] reduced-motion path unaffected — the new tilt `useGSAP` block is behind the same
      `if (prefersReducedMotion) return;` guard as every other effect in the file; sheen/edge
      light are static CSS layers, unaffected either way

## Follow-ups

- None outstanding.
