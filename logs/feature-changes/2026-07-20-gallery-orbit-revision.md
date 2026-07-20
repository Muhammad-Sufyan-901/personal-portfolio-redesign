# 07 Gallery revision — dummy covers + left-in / orbit / right-out choreography

- **Date:** 2026-07-20
- **Author:** main (Claude, gate revision — v1 log: `2026-07-20-gallery-orbit.md`)
- **Type:** feat
- **Chapter/Area:** 07 Gallery

## Summary
Owner revisions at the v1 gate (chapter still uncommitted): (1) covers become
the 04-style ember radial-gradient **dummy cards — pure gradient, no text**
(owner-confirmed; images-only rule holds), removing the ring's dependency on
`projects.data` entirely; (2) the choreography now matches the reference's
full flow — covers **slide in from the left**, orbit the center while the
statement de-veils, then **fade out through the right**, **yawing in
perspective** as they traverse (the video's curved feel; frame f028 shows a
cover near edge-on at the screen edge — flat-plane rotateY, not a bowed
surface).

## Files touched
- `src/features/home/sections/GallerySection.tsx` — dummy-card markup
  (04's gradient recipe + `border-line` hairline); ORBIT_ITEMS is now
  data-free with a hash-shuffled `order` for entry/exit stagger; the damp
  applier now eases the **master progress scalar** and `position(p)` derives
  rotation, per-item entry slide (off-left), exit drift (off-right, fading)
  and `rotationY` yaw from final screen x (`transformPerspective` set once).
- `src/features/home/utils/gallery.tunables.ts` — removed `settle`; added
  `entry { start, spread, itemDur }`, `exit { … }`, `slideDist`,
  `curve { maxYaw, perspective }`, `rmProgress`; low-perf = smaller ring.
- NOT touched: `src/data/projects.data.ts`, `public/assets/images/projects/`
  (chapter 04's preview still uses the captured thumbnails).

## Notable decisions
- **Damp the progress, derive everything** — entry/exit/rotation/yaw stay
  mutually consistent and reversible by construction; the heading veil still
  maps to raw scrub progress.
- **Curve = perspective yaw** (`rotationY ∝ screen x`), transform-only —
  entering covers arrive near edge-on and unfurl, matching f028. A literal
  bowed surface would need strip-slicing/WebGL; revisit only if the owner
  wants more after seeing it.
- Exit starts at 0.66, after the reveal completes (0.6) — "rotate until the
  text is revealed, then fade out". At p=1 the section unpins on the heading
  alone (the settle beat is replaced by the exit).
- RM static pose = `rmProgress` 0.5 (ring entered, not exiting), heading
  revealed by markup default.

## Verification
- [x] `npx tsc --noEmit` + `npm run lint` + `npm run build` clean; section
      greps: no data import, no raw hex, no bare tags
- [x] Beat captures: entry p=0.08 (cards streaming from the left, yawed,
      right half empty) · mid p=0.45 (ring + partial veil) · exit p=0.78
      (left half empty, cards drifting right / edge slivers) · end p=0.98
      (heading alone, 0 covers visible, transform frozen)
- [x] Up-pass p=0.45 pixel-identical to down-pass; zero drift at rest
- [x] Reduced motion: no pin, static mid-orbit ring (10 in view), heading
      complete
- [x] Mobile 390×844: 6-card ring, yaw visible, heading legible
- [x] qa-auditor delta pass: all 7 checks PASS, 0 blockers/majors; its one
      latent low (exit stagger budget 1.02 > 1 under unlucky hash draws)
      fixed — exit.spread 0.24→0.22 with the ≤1 invariant documented in the
      tunable comment; tsc + lint re-verified clean

## Follow-ups
- Real covers: when owner supplies images, swap the dummy Box back to the
  v1 `Image` element (v1 markup in git history once committed) — engine
  unchanged.
- Heading statement still PLACEHOLDER — owner picks at the gate.
