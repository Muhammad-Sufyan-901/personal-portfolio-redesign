# Manifesto: hidden zoom-in window + shake root-cause fix + centered MacBook

- **Date:** 2026-07-13
- **Author:** main (Claude Code, user revision request after PROMPT #4)
- **Type:** feat (+ fix)
- **Chapter/Area:** 02 Manifesto (seam + 3D island), 01 Hero (slot removal)

## Summary

Two user-requested changes. (1) The manifesto window is now **hidden at page load** and appears only once the user has scrolled half a viewport: it materializes as a small centered box and zooms to full-bleed across the rest of the hero pin (replaces the always-visible strip between the name rows; the hero slot is gone and the name block is back to two adjacent rows). (2) The MacBook's violent nonstop shake is fixed at the root — `advance()` was being fed **milliseconds** while fiber v9's timestamp feeds `state.clock` in **seconds**, so `clock.elapsedTime` became ms-as-seconds (~70,000) and the idle sway/float sinusoids thrashed at ~2,750 rad/s. The idle sway/float is also removed outright (user wants stillness), and the camera now tracks the machine's visual center (closed slab → open lid) so the MacBook sits centered on screen through the whole arc.

## Diagnosis (probe-verified)

- Before: pose sampling at rest showed `clock.elapsedTime = 70,674` advancing ~5.5/frame, and the float traversing its **entire ±0.019 range in single frames** (maxFrameDelta 0.037) — random sinusoid phase per frame = the shake.
- After (`advance(time)` in seconds + idle removed): `elapsedTime` 25.1→26.6 over 1.5s of sampling, **max frame delta 0 on yaw and position** — perfectly still at holds; all motion is damped channel transitions.
- The damp path had survived the unit bug only because `Math.min(delta, 1/30)` clamped the bogus ms deltas — which is why scroll transitions looked fine while the clock-driven idle thrashed.

## Files touched

- `manifesto-3d/ManifestoCanvas.tsx` — `FrameDriver` passes gsap ticker time straight through (`advance(time)`, SECONDS — the ms note in the earlier log/memory was wrong and is corrected in memory); `CameraRig` now damps its own copy of `lidProgress` and moves `camera.position`/`lookAt` along the machine's visual center (`CAM.centerClosed 0.1 → centerOpen 1.05`, `rise 0.6` keeps the product pitch), plus the existing sceneIntro dolly/exposure.
- `manifesto-3d/MacbookModel.tsx` — idle sway/float deleted (object holds perfectly still between beats); probe removed.
- `manifesto-3d/rig.ts` — `CAM` reshaped to `{fov, z, rise, centerClosed, centerOpen}`.
- `ManifestoSection.tsx` — seam rewritten: stage starts `autoAlpha 0, scale 0.14` (`SEAM_BOX_SCALE`), appears at `SEAM_APPEAR 0.42` (≈ half a viewport of scroll into the 120% pin) and zooms to 1 by pin end; border radius pre-divided by the scale so the small box's visual rounding equals `--radius-lg`, relaxing to square at full-bleed; rows exit 0.5–0.95, chrome fades 0.4–0.65. All slot/clip-path measurement machinery deleted. Render loop now runs **only** while the stage can be seen (`stageState.active = seamStarted && !pastEnd`, pre-warmed 0.1 before the box appears) — the canvas no longer renders behind the hero at rest. Stage lifecycle callbacks declared before both triggers (their `onRefresh` can fire during creation).
- `HeroSection.tsx` — window slot removed (name block back to two adjacent rows; poster import gone; per-span split kept, comment updated).
- `globals.css` — `--spacing-manifesto-slot` removed (dead).

## Verification

- [x] Pose probe: still (0 frame-delta) at holds; clock in real seconds
- [x] Rest: no window, adjacent name rows, chrome intact
- [x] scroll ≈ 0.5·vh: small rounded box zooms in dead-center, punching through the name; rows exit as it grows; full-bleed at pin end with no jump
- [x] Closed hold and open front pose both vertically+horizontally centered (51% / 55% screen height)
- [x] Veil (opacity 0.9 / blur 17.7px deep in P5), About handoff, bottom stage-hide, and full reverse-to-rest (back to hidden `scale 0.14`) all intact
- [x] Reduced motion: 2 hero rows, no slot, static manifesto statement + poster, 0 canvases, 0 errors
- [x] `npx tsc -b`, `npm run lint`, `npm run build` green

## Follow-ups

- None. Tunables if taste changes: `SEAM_APPEAR`, `SEAM_BOX_SCALE`, `CAM.rise`, `CAM.centerClosed/Open`.
