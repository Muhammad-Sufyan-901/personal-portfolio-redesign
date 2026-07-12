# Manifesto rebuilt as scrolly-telling 3D keyboard

- **Date:** 2026-07-12
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 02 Manifesto

## Summary

Replaced the pinned scroll-fill statement (c14474e) with a scroll-driven 3D experience: "Basically, I write code." centered over a GLTF keyboard (`public/keyboard/scene.gltf`) that zooms in on scroll, disintegrates into drifting fragments, then hands off through an ink gradient scrim while an "About Me" outro rises. Adds the R3F stack (three 0.185, @react-three/fiber 9.6, @react-three/drei 10.7, @types/three) — user-approved new dependency; the whole three graph code-splits into a lazy `ManifestoCanvas` chunk (~261 kB gz) so the main bundle is untouched.

## Files touched

- `src/features/home/sections/ManifestoSection.tsx` — full rewrite: pin + scrub 1 timeline (`end: "+=300%"`, `defaults: {ease: "none"}`), acts zoom (0–3.5) → disintegrate/copy-fade (3.5–10) → scrim/outro (7–10); model arrives async via `onReady` → `useState` → useGSAP dep.
- `src/features/home/components/KeyboardModel.tsx` — new; `useGLTF` + preload, hides Sketchfab garnish (`Plane`, `text` nodes), manual fit-to-2.6-world-units + centering from the keyboard nodes' bbox, tames the red emissive under-key layer (near-black base, intensity 1.2 → ember glow).
- `src/features/home/components/ManifestoCanvas.tsx` — new; `<Canvas dpr=[1,2]>`, plain lights (no drei `Environment` — remote HDR fetch), lazy boundary.
- `src/features/home/data/profile.data.ts` — manifesto line replaced with the short custom line (user-directed exception to the PRD-content rule).
- `src/components/common/Box.tsx`, `Container.tsx` — fix: R3F v9 augments React's JSX intrinsics (~200 three entries), collapsing the bare `ElementType` spread to `never`; internal cast to `ComponentType<Record<string, unknown>>` (external signatures unchanged).
- `package.json` / `package-lock.json` — new deps.
- `public/keyboard/` — model asset now tracked (scene.gltf + scene.bin + license).

## Notable decisions

- **Zoom = group transform, not camera** — tween `model.scale`/`model.position`; no `useThree` plumbing.
- **Scatter offsets in world units ÷ mesh world scale** (read from `matrixWorld` column length): the Sketchfab node chain bakes a ×100 scale, so raw local `+=` offsets flung fragments ~60 world units offscreen (first symptom: empty black frame mid-pin). Type-only three import keeps the section out of the lazy chunk.
- **One continuous drift tween per fragment** (3.5→10) instead of separate disintegrate + drift acts — avoids overlapping tweens on the same property under scrub.
- **Reduced motion:** canvas and scrim not rendered at all (WebGL is dead weight without animation); copy + outro visible statically; no pin. The scrim conditional matters — unset, it dimmed the static copy.
- Model has only 6 meshes (keys are one merged mesh) — disintegration reads as layers separating (body / keys / glow plate), not per-key shatter; per-key would need a pre-fractured model.
- "About Me" outro + custom copy chosen by user over PRD manifesto / Craft teaser.

## Verification

- [x] `tsc -b` clean (via `npm run build`; note `npx tsc --noEmit` alone is vacuous — solution-style tsconfig)
- [x] `npm run lint` clean
- [x] reduced-motion checked (matchMedia override: no canvas, no pin, both texts visible)
- [x] Live scroll-through in Chrome: pin engages, zoom → disintegrate → scrim/outro, reverse scrub reassembles, clean unpin
- [ ] Lighthouse — not run this pass (see follow-ups)

## Follow-ups

- `scene.bin` is 3.7 MB — run `npx @gltf-transform/cli optimize` (Draco/meshopt) if Lighthouse dips; asset loads lazily + only without reduced motion, so impact is deferred.
- "About Me" outro references a chapter that doesn't exist in the map (03 is Craft) — revisit wording when 03 ships.
- HMR gotcha (dev-only): GSAP context revert doesn't fully restore mesh mutations on the cached GLTF scene across hot updates — reload the page when tuning the timeline.
