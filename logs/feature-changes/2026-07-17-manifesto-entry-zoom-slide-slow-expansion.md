# Manifesto entry refine — name zoom-out slide + slow expansion with lid prelude

- **Date:** 2026-07-17
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 02 Manifesto (T1 entry + 3D pacing)

## Summary

Matched the entry to `reference/manifesto-about-refine.mp4` (107 frames re-extracted and reviewed): the hero name no longer fades out during the box birth — it stays at full opacity and **zooms out around viewport center** (`scale 1 → 2.1` driven by the damped `growth` channel), so `justify-between` pushes the lead word left / tail word right off-screen exactly like the reference, and the growing stage occludes the rest. The expansion itself was slowed from ~60vh to ~140vh of scroll (`t1Span +=120% → +=200%`, beats rescaled), a **storyPrelude** cracks the lid open (`0 → 0.22`) over the growth tail so the machine is visibly animating while the box grows, and `DAMP_LAMBDA 6 → 4.5` + `damp.growth 4 → 3.2` give the model/camera and box the reference's weightier glide in both scroll directions.

## Files touched

- `src/features/home/utils/manifesto.tunables.ts` — `t1Span +=200%`, beats/chromeFade rescaled, new `exit.scaleTo` + `storyPrelude`, `damp.growth 3.2`
- `src/features/home/sections/ManifestoSection.tsx` — `RUNWAY_VH.t1 200`; applier: fade removed, scale quickSetter added (transformOrigin 50% 50%); T1 lid-prelude tween; T2 lid `fromTo` picks up from `storyPrelude.lid` with `immediateRender: false`; cleanup resets scale; grammar comments updated
- `src/features/home/utils/rig.tunables.ts` — `DAMP_LAMBDA 4.5`

## Notable decisions

- **Zoom + slide over per-word edge tracking**: a single scale on the h1 reproduces the reference (words spread by `justify-between` fly outward symmetrically) with one transform write per frame; per-word clip-rect tracking rejected as more code for the same look. Opacity stays 1 — the z-20 stage occludes, as in the reference.
- **Lid split across T1/T2** (`storyPrelude.lid = 0.22`): T2's lid `fromTo` start becomes the prelude value and MUST keep `immediateRender: false`, or the load snapshot writes the cracked pose while the machine rests closed.
- **Kept `scrub: true` on both timelines**: the damp appliers stay the single source of lag — scrub-seconds on top compounds into rubber-banding on direction changes.
- **`quickSetter("scale")` silently no-ops** (caught live): the scale shorthand can't bind to one primitive setter, so the zoom never rendered while the box occlusion masked it. Fixed with `scaleX` + `scaleY` setters; gotcha recorded in motion-engineer memory.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (reduced-motion branch untouched — static chapter unaffected)
- [x] Live chrome-devtools walkthrough at 900px viewport: rise → birth (words intact/opaque) → mid-growth (words zoom-sliding out, box occluding) → growth tail (lid visibly cracked) → T2 story (lid opens from prelude, logo glow) → reverse pass state-symmetric (box contracts, words return, rest settles to identity transform, stage self-hides). Console clean (only pre-existing THREE.Clock deprecation).

## Follow-ups

- Feel numbers (`exit.scaleTo 2.1`, `storyPrelude.lid 0.22`, lambdas) are tunables — owner may want a taste pass on real hardware.
