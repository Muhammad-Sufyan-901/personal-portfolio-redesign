# 07 Gallery revision — conveyor entry (v3): one-by-one left entry, full-lap orbit, right fade-out

- **Date:** 2026-07-20
- **Author:** main (Claude, gate revision — v1 log: `2026-07-20-gallery-orbit.md`, v2: `2026-07-20-gallery-pop-in-entry.md`)
- **Type:** feat
- **Chapter/Area:** 07 Gallery

## Summary
Owner revision at the still-uncommitted chapter gate: the v2 "pop in at ring
slots + global ring rotation" choreography is replaced by the reference's true
flow (`reference/gallery-refine.mp4`, re-dissected frame by frame at 4fps):
covers enter **one by one through the left screen edge**, ride the ellipse
**per item** (conveyor into orbit) — bottom/near arc left→right, edge-on at
the right edge, one full back-arc lap — then **fade out at the right
extreme**, exiting in entry order. Entry order now IS path order; the v1
rejection ("a stream from the page edge") was about *simultaneous* entry,
not left entry itself.

## Files touched
- `src/features/home/utils/gallery.tunables.ts` — new `path` block in TURNS
  (`travelTurns 1.5`, `spacingTurns 0.14`, `spacingJitter`, entry/exit fade
  spans, `tailTurns`); replaces `rotation.totalTurns` + `entry` + `exit`;
  `damp` promoted to top level; `orbit.radiusX 0.34→0.5` (extremes at the
  screen edges — reference f056 shows covers clipped at both); dropped slot
  jitter `a`; `pinRunway 2.6→3.4`; `revealSpan → [0.30, 0.52]`, stretched
  at the gate to `[0.30, 0.80]` (owner: "much slower" de-veil — the words
  now scrub in across half the pin, finishing as the ring thins, instead
  of completing before the first exit).
- `src/features/home/sections/GallerySection.tsx` — `ORBIT_ITEMS` gets a
  sequential jittered `startAngle` (dropped `baseAngle`/`order`);
  `position(p)` now computes per-item clamped travel `t` along
  `angle = π − t` with entry/exit fades at the travel ends and a
  write-once hide for not-yet-started / fully-exited covers; `measure()`
  derives `totalMaster` from the last *visible* cover per breakpoint (mobile
  hides the train tail via CSS). Damp ticker, pin, heading timeline, RM
  branch, quickSetters untouched.

## Notable decisions
- **Per-item angular progress replaces global rotation** — entry can't be
  decoupled from ring position when covers must visibly travel in from the
  left; each item owns `t = clamp(master − start_i, 0, TRAVEL)`.
- **travelTurns 1.5** = 0.5 turn to reach the right edge + one full lap,
  ending back at the right extreme where the exit fade lands — the owner's
  "circle once, then fade out through the right". The video never shows the
  forward exit (both recorded passes scrub back), so this beat follows the
  owner's words.
- **totalMaster per breakpoint** (in `measure()`): ends when the last
  visible cover exits + `tailTurns` heading-alone beat — mobile (6-cover
  train) keeps the same pacing instead of inheriting a dead desktop tail.
  At p=1 all covers are exited by construction (kills the v2 exit-budget
  invariant).
- Start jitter is per-index (±0.25 slot, clamped ≥ 0) so entry order can
  never reorder and nothing is visible at p=0.

## Verification
- [x] `npx tsc --noEmit`, `npm run lint`, `npm run build` clean
- [x] chrome-devtools smoke @1440×900: p=0.05 (first cover clipped at left
      edge, second trickling, right half empty) · p=0.18 (leaders wrapping
      edge-on at right edge, 4 in) · p=0.5 (full train clipped at both
      edges + statement complete) · p=0.8 (thinning: far cover crossing
      left, near pair at bottom, exit fade at right) · p=1.0
      (0 visible covers — unpins on the heading alone)
- [x] Up-pass p=0.5 pixel-identical to down-pass; zero drift at rest
- [x] Mobile 390×844: exactly 6 covers visible, statement legible
- [x] Reduced-motion branch code-path unchanged (static `position(0.5)`
      pose verified live as the p=0.5 beat); full RM emulation deferred to
      the chapter qa-audit pass (MCP emulate lacks the media feature)

## Follow-ups
- Gate tuning knobs: `spacingTurns` (trickle rate), `travelTurns`,
  `pinRunway` (scroll pace), `revealSpan`.
- Real covers + heading statement placeholder — unchanged from v2 log.
