# Journey cards — gradient-card restyle (ember bloom, edge glow, halo)

- **Date:** 2026-07-24
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (on-screen 08)

## Summary
Restyled the Journey work/education cards to the owner's 21st.dev "Gradient Card" reference (`reference/journey-card-example.mp4` + still): ink-black card, taller bottom padding as an empty gradient zone, an ember bloom rising from the bottom corners (one layer, 3 radials), a brown rim that wraps the rounded corners, and a halo around the card via box-shadow on the card element itself. Retired the 2026-07-23 card chrome — the 4 full-span frame hairlines, the perimeter-orbiting dot (and its GSAP loop), and the top-left radial light (owner decision 2026-07-24). Recolored the reference's purple/cyan to ember tokens (owner decision, consistent with the earlier declined-purple pass); glass sheen, GSAP tilt, and scrub reveals kept unchanged.

**Second pass, same day (rim):** the first pass's rim was a straight paper bottom-edge bar + two 1px side ticks, which the card's own `rounded-card overflow-hidden` clipped exactly where the corner curve starts — so the bottom corners rendered bare, showing only the neutral `border-line` (the owner's "the corner borders are still gray"). Replaced all three with ONE ring that follows the radius, and dropped the card's `border-line` so the ring is the only rim (owner decisions: whole perimeter, and the bright white bottom edge becomes brown too).

## Files touched
- `src/features/home/sections/JourneySection.tsx` — card box `bg-raised`→`bg-ink` + `pb-32/md:pb-40` + shadow halo (with hover intensify); bloom added; frame lines, orbiting dot element + `useGSAP` loop, top-left glow, `CARD_FRAME_LINES`, `CSSProperties` import removed; icon badge `bg-ink`→`bg-raised` (would vanish on the ink card). Rim pass: paper edge bar + corner ticks + `EDGE_GLOW_SHADOW` removed, `border border-line` dropped from the card, `RIM_FADE` const + one border-only ring `Box` added.
- `src/features/home/utils/journey.tunables.ts` — `frame` + `dot` groups deleted; `card` extended with `bloomCornerAccent/bloomCornerDeep/bloomCenterDeep/bloomBlur`, then `edgePaper` replaced by `rimWidth`/`rimOpacity`.

## Notable decisions
- Halo = box-shadow on the `overflow-hidden` card itself (not the unclipped `.journey-reveal` aura pattern): box-shadow isn't clipped by its own overflow and tilts with the card. Spread kept modest (50–60px) so it fades before the section's load-bearing `overflow-x-clip` on side cards — owner explicitly asked for a tight, uncut glow.
- Reference's 10 decoration layers collapsed to 2 (bloom + rim); its framer-motion hover behaviors are already covered by the existing GSAP tilt — no new motion code, all layers static CSS (nothing to gate for reduced motion).
- **Rim = border-only element + a vertical `mask-image` fade.** A `border-color` can't be a gradient and `border-image` ignores `border-radius` (it renders a square frame), so a gradient border that respects rounding needs a masked ring. Because the element carries no background, the usual `mask-composite` punch-out is unnecessary — one mask over a border already reads as a gradient border, and it degrades to an even rim rather than a filled block if masks are unsupported. First mask usage in `src/`.
- Card's `border border-line` dropped so the ring is the only rim: with no border the card's padding box equals its border box, so the `inset-0 rounded-card` ring aligns exactly with the 24px clip curve (keeping the border would have left a 23-vs-24px radius mismatch and a gray arc outside the new rim).
- `rimOpacity` tuned in-browser: 85 read as a vivid orange-red outline, 55 blended into the bloom; **70** keeps a defined edge that still reads brown.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (new layers are static + `aria-hidden`; existing gates untouched)
- [ ] Lighthouse ≥ 90 (deferred to final QA per plan)
- [x] chrome-devtools smoke at 1366px + mobile: bloom/halo render, halo not clipped at section edge, dot gone, zigzag line still meets card edges; console clean (pre-existing three.js Clock warning only)
- [x] rim pass re-smoked at 640px + 390px: ring follows the 24px curve in brown at 2px, no gray on the perimeter, faint warm hairline by the top

## Follow-ups
- Bloom mix %s (`bloomCorner*`, `bloomCenterDeep`), bottom padding, and `rimWidth`/`rimOpacity` are tuned-by-eye values — adjust with the owner in-browser if the wash or rim reads too strong/weak.
