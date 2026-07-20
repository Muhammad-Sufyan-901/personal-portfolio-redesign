# 07 Gallery entry revision — pop-in at slot replaces slide-from-left

- **Date:** 2026-07-20
- **Author:** main (Claude, owner revision at the chapter gate — prior logs:
  `2026-07-20-gallery-orbit.md`, `2026-07-20-gallery-orbit-revision.md`)
- **Type:** feat
- **Chapter/Area:** 07 Gallery

## Summary
Owner revision: the entry slide from off-screen left read as a stream from
the page edge; per the reference (gallery-refine.mp4 / lukebaffait.fr,
frames re-dissected f005–f017) covers now **pop in one by one in place at
their ring slots** (fade + scale from 0.85), the ring **rotates at a
constant rate throughout** (owner-confirmed via AskUserQuestion — no ramp),
edge-slot covers arrive already yawed near edge-on (the "curving" ask falls
out of the existing `rotationY ∝ x` line once the slide offset is gone),
and the statement de-veils later and slower, after the ring is populated.
Exit (fade + drift out right) intentionally unchanged.

## Files touched
- `src/features/home/utils/gallery.tunables.ts` — `entry` retuned
  `{start .02, spread .30, itemDur .08}` + new `scaleFrom: 0.85`; top-level
  `slideDist` removed, travel distance moved to `exit.dist` (exit-only now);
  `exit` retimed `{start .74, spread .16, itemDur .10}` (invariant
  start+spread+itemDur = 1.00 ≤ 1 holds); `heading.revealSpan`
  `[0.15,0.6] → [0.38,0.72]`; choreography header comment rewritten.
- `src/features/home/sections/GallerySection.tsx` — `position()`: dropped
  the `(1-enter)·-slidePx` x-term; pop applied as a scale multiplier
  `scaleFrom + (1-scaleFrom)·enter` on the depth scale; `measure()` reads
  `GALLERY.exit.dist`; doc comments updated. Engine (damp applier, pin,
  z mid-plane, RM branch, mobile/low-perf tiers) untouched.

## Notable decisions
- Rotation stays linear during entry (owner picked "rotate throughout" over
  a spin-up ramp when asked) — `TOTAL_ROTATION · p` unchanged.
- Reveal starts at 0.38, just before the entry tail lands at 0.40 — the
  reference shows the de-veil beginning while the last covers still pop.
- RM branch needed no edit: at `rmProgress` 0.5, enter = 1 / exit = 0, so
  the new scale multiplier is exactly 1 (pose identical to before).

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Beat screenshots via chrome-devtools MCP @1440×900: p≈0.05 covers
      materializing in place at slots (no left stream, heading hidden) ·
      p≈0.25 full jittered ring, heading hidden · p≈0.55 mid-de-veil
      (leading words sharp, trailing blurred) · p≈0.85 heading sharp,
      covers exiting right; up-pass p≈0.55 pixel-identical to down-pass
- [x] Mobile 390×844 fresh load: 6-cover ring popped in place at p≈0.3
- [ ] Lighthouse — deferred to the chapter QA audit at the gate

## Follow-ups
- Noticed during smoke: after a live viewport resize 1440→390 the gallery
  pin spacer went missing until reload (fresh mobile load is correct) —
  flag for the qa-auditor resize/refresh pass; likely pre-existing, not
  introduced by this change.
- Real covers + owner statement line: unchanged placeholders (prior log).
