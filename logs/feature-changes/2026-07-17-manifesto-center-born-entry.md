# Manifesto center-born entry: T1 rewrite + veil retune + About scrub coupling

- **Date:** 2026-07-17
- **Author:** main (Claude Code, owner-approved refine plan)
- **Type:** feat
- **Chapter/Area:** 01 Hero (markup retirement) · 02 Manifesto (T1 + veil) · 03 About (entrance) · shared chrome (MenuPopout)

## Summary

Rewrote the hero→manifesto entry (T1) from the E-refine slot grammar to the reference's measured **center-born** grammar (`reference/manifesto-about-refine.mp4.mp4`, beat table re-derived at 8 fps): the h1 **rises** to the mid-viewport landing line while the chrome fades → the h1 **fades out while the stage is born at viewport center** as a small rounded box → the box **grows monotonically to full-bleed**, handing off byte-exact to the untouched T2 MacBook story. The exit veil now collapses **fast** (28px over ~0.099 of T2, converted from the 0.08 combined-runway fraction) and About resolves **from blur while the veil tail is still clearing**, as one scrubbed reversible timeline. Statement re-typeset to the E v2 display faces. Every beat is scrub-reversible; the entry is expressed as damped channels like T2.

## Files touched

- `src/features/home/utils/manifesto.tunables.ts` — **new**: `MANIFESTO_ENTRY` (t1Span, beat windows, chromeFade, riseToY, birth box geometry incl. `minWPx`/`maxHFrac` clamps, damp lambdas, veil collapse/aboutResolve).
- `src/features/home/utils/channels.ts` — added `entry { rise, birth, growth }` singleton; **deleted the dead `veil` field** (zero consumers — the DOM veil is CSS-var-driven).
- `src/features/home/sections/ManifestoSection.tsx` — T1 rewritten as ONE breakpoint-agnostic rig (both `gsap.matchMedia` contexts, `slotClip()`, word exits, `SEAM_APPEAR`/`SEAM_BOX_SCALE` deleted): timeline tweens `entry.*` + `sceneIntro` + glow + chrome fade; a **damp applier on `gsap.ticker`** (FrameDriver precedent — no new RAF) writes h1 y/x/opacity and the stage's `inset(T R B L round r)` clip + alpha, idling once converged at either edge; stage lifecycle re-keyed to `beats.birth[0] − 0.1`. Veil: opacity window unchanged, blur retuned 24→28px over the fast span, `CSS.supports("backdrop-filter")` gate (fallback = the gradient+opacity veil on the same skeleton). Statement: roman run `font-display-lead`, focal words `font-display-tail italic` (+ kept ember wash); **fixed the swallowed inter-word spaces** (space text nodes now sit between the inline-block spans). Reduced-motion poster no longer `lg:hidden` (the hero slot that carried it ≥lg is gone).
- `src/features/home/sections/HeroSection.tsx` — `.hero-slot` span + slot poster deleted; h1 spread now `lg:justify-between`; exactly two `.hero-word` spans preserved (preloader FLIP contract intact).
- `src/features/home/utils/hero.tunables.ts` — `seam { slotWidthIdle, wordExit }` and `oneLineMinBp` deleted (orphaned).
- `src/features/home/sections/AboutSection.tsx` — both `once: true` triggers replaced by one scrubbed timeline (`top bottom → top 35%`, end derived from `aboutResolve.overlap`): inner blur-resolve (14px→0) across the first 0.7, items stagger in the tail (text-first, matching the measured de-blur order).
- `src/components/shared/MenuPopout.tsx` — motion path now uses `POPOUT_START` (was `1.0·innerHeight`, contradicting its own doc comment; chrome is gone by ~0.46·vh so 1.0 left a menu-less gap).

## Notable decisions

- **Birth box = clip-path, not scale** (D1 required stating why): exact birth geometry including `round 12px` (scale needs the pre-divided-radius hack and can't hit aspect 1.5); no shared `scale` property with T2's veil tween (two triggers never write one property); zero DOM measurement (pure viewport math — the slot-rect `accum` machinery survives only as the slim h1 `accumTop` for the rise); the buffer stays full-res either way (`resize.offsetSize` + full layout size, the shipped desktop-rig precedent). Consequence: the small box is a center **crop** of the dim sceneIntro-0 scene — reads as an ember slit, review knob at tuning.
- **One rig, no matchMedia**: rise/fade/center-birth is breakpoint-agnostic (stacked rows <lg rise and fade as one h1 unit); `minWPx 200` floors the box on phones (16vw is too small below ~1250px).
- **E-D1 supersession**: the slot rect, its measurement code, the horizontal word exits, and the slot-carried reduced-motion poster are all retired in this commit (grep-proven: `hero-slot`/`slotWidthIdle`/`wordExit`/`oneLineMinBp`/`SEAM_APPEAR`/`SEAM_BOX_SCALE`/`slotClip`/`channels.veil` = 0 hits in src/).
- **Chrome fade window starts at 0.02, not 0** — a tween at exactly 0 renders at load and would stamp the chrome visible mid-preloader.
- **Chrome fade is `.to`, not `fromTo`** (bug found in verification): a `fromTo`'s startAt snapshot collides with the preloader-era autoAlpha history on the `[data-chrome]` els — after a deep scroll + return, they restored to 0/hidden while the never-preloader-managed `.hero-bar` restored to 1. `.to` records the live post-entrance values (the shipped pattern) and restores cleanly.
- **About blur hygiene lives INSIDE the scrubbed timeline** (second bug found): `onLeave/onEnterBack` `gsap.set` callbacks stomp the scrub's value and go stale until the next progress change (up-pass read blur(0px) where down-pass read blur(4.09px)); a zero-duration `.set(inner, { filter: "none" }, 1)` re-renders symmetrically on reverse. Up/down now byte-identical.

## Verification (evidence in `.artifacts/refine-captures/`)

- [x] `npm run build` + `npm run lint` clean; retirement greps 0 hits; no new RAF; no raw hex outside the documented `manifesto-3d/` exemption.
- [x] **T2 no-change proof**: before/after captures at story 0/0.5/0.8/1 — mean |Δ| ≤ 0.24 grey levels, changed-pixels 0.02–0.2% (WebGL sampling noise) except p0.8 at 1.0% = the sanctioned D3 statement re-typeset; machine/camera identical.
- [x] Beat grid down + up (B0–B7): up/down settle to byte-identical values (stage 0.237476 / name 0.762524 / clip inset(373.2px 604.8px round 12px) at B2 both directions; About 0.7082/blur(4.0855px) both directions).
- [x] Frame-stepped proofs: chrome computed opacity **0 at p 0.38** (birth start); box stays exactly the birth rect through p 0.5; name ≈0 (0.0016) at p 0.55 with the box only 10% grown (the spec'd overlap).
- [x] Statement: computed `Switzer` roman / `"Instrument Serif"` + italic focal; text renders "Basically, I write code." with real spaces.
- [x] Reverse-scrub hammer (19 rapid alternations across every boundary ×2): no stuck alpha/clip/blur; console clean (only the known upstream THREE.Clock deprecation).
- [x] Veil fallback (CSS.supports forced false): opacity skeleton identical (0.4615 at B5), blur var untouched.
- [x] Reduced motion (matchMedia patched): 0 canvases, 0 pin-spacers, static manifesto with the poster now visible on desktop widths, About opacity 1 / filter none, gutter marker present.
- [x] Short viewport 1280×620: box 204.8×136.6 centered, h1 center lands on the 0.5 line. Mobile-width (500px window floor): `minWPx` floor engages (200px box), stacked rows rise/fade as one unit.
- [x] MenuPopout arrives at 0.45·vh (visible in the B2 capture at 0.5·vh).

## Follow-ups

- Tuning knobs live only in `MANIFESTO_ENTRY` (owner side-by-side pass): focal-word wash keep/drop, birth-crop look at sceneIntro 0, damp lambdas, About end fraction.
- Optional hygiene: rename `reference/manifesto-about-refine.mp4.mp4` → `.mp4`.
