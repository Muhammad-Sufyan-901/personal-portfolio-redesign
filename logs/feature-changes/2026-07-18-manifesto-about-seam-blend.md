# Manifesto → About seam blend — veil ends pure ink + stage-lifecycle race guard

- **Date:** 2026-07-18
- **Author:** main
- **Type:** fix
- **Chapter/Area:** 02 Manifesto / 03 About handoff

## Summary

The manifesto→About transition showed a sharp dividing line: the exit veil's bottom edge kept its ember tint (`from-accent-deep/25`) at full T2, so About's pure-ink top crossing it drew a visible seam (reference hands off scene → black, seamlessly). The veil is now a solid-ink root with the ember tint on its own child layer, and a scrubbed tween dissolves the tint over the T2 tail (`veil.tintOutAt 0.94`) — the veil ends pure ink and About crosses ink-on-ink. Verification also exposed a pre-existing race: the entry applier's damped stage writes could land after T2's lifecycle hid the stage past the runway, leaving the z-20 ember glow stuck over About on fast flicks / mid-page reloads — fixed with a `stageVisible` guard around the applier's stage writes.

## Files touched

- `src/features/home/sections/ManifestoSection.tsx` — veil JSX split into `bg-ink` root + `.manifesto-veil-tint` child; tint-out tween in the master timeline; `stageVisible` guard in `entryTick`'s stage writes
- `src/features/home/utils/manifesto.tunables.ts` — new `veil.tintOutAt: 0.94`

## Notable decisions

- **Tint on a child layer, not a color tween**: keeps the ember collapse moment (0.84→~0.94) untouched and makes the dissolve a plain opacity scrub — no CSS-var color interpolation, symmetric on reverse. Animating the child never trips the backdrop-root trap (only veil ancestors are off-limits).
- **Race fixed at the root**: the applier now defers to the T2 lifecycle's `stageVisible` (same closure) instead of adding ordering hacks; inside the runway behavior is unchanged.

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] Live: past T2 the veil is opacity 1 / tint 0 / stage hidden — seam screenshot shows pure ink-on-ink blend with About rendering normally (previously: red band + hard line, and on jump/reload the ember glow stuck over About)
- [x] Reverse into the runway: stage re-shows (opacity 1), veil 0, tint restored to 1 — symmetric
- [x] Console clean (pre-existing THREE.Clock deprecation only); reduced-motion branch untouched

## Follow-ups

- None.
