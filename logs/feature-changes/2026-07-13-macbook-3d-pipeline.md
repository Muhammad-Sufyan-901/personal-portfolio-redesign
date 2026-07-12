# MacBook asset pipeline + R3F island foundation (manifesto rebuild, commit 1/3)

- **Date:** 2026-07-13
- **Author:** main (Claude Code, PROMPT #4 one-shot run)
- **Type:** chore
- **Chapter/Area:** 02 Manifesto — 3D foundation (asset pipeline, hinge rig, render island)

## Summary

Foundation for replacing the keyboard-disintegration manifesto with the MacBook scroll-story: inspected and draco-compressed the supplied `macbook.glb` (10.6 → 3.7 MB), derived the **closed lid state that does not exist in the asset** via a runtime hinge rig (Case A — named subtrees), and built the channel-driven R3F island (`frameloop="never"`, frames advanced from `gsap.ticker`, per-frame `MathUtils.damp` toward a plain `channels` object). All three spec poses verified by sandbox screenshots: closed rear-quarter (P1), mid-open logo beat (P2), front-open lit wallpaper (P3) — saved in `logs/feature-changes/assets/macbook-pose-*.png`.

## Asset inventory (scripts/inspect-macbook.mjs — rigging decisions cite this)

- 61 meshes, 121,649 verts / ~112,625 tris (within the ≤150k budget), 18 embedded PNG/JPEG textures (wallpaper 2048×1024), extensions: `KHR_materials_emissive_strength` only — no draco, no animations.
- Node tree: Sketchfab chain (`Sketchfab_model` → … , baked ±90° X **matrix** transforms, det +1, no scale) → node `XUSrUKqmCVOWkVt_64` with exactly two mesh subtrees + one empty locator:

| Subtree | Meshes / verts | World bbox (x·y·z) | Verdict |
|---|---|---|---|
| `BoBvWqDHZjAeVrp_44` | 44 / 112,231 | 35.5 × 1.3 × 24.8 | **Base** (deck, keys, ports) |
| `VCQqxpxkUlzqcJI_62` | 17 / 9,418 | 35.5 × 23.4 × 9.5 | **Lid** — hinged at base rear (z ≈ −12), authored open ≈ 112.9° |
| `yIwQWXMhgFCUjXk_63` | empty | — | ignored |

- Screen = mesh `Object_56`, material `sfCQkHOWyrsLmor`: wallpaper already an `emissiveTexture` with emissive strength 8 → no material cloning; we drive `emissiveIntensity` (0 → spill → full), `toneMapped: false`.
- Logo = mesh `Object_57`, material `CdgEAaPUlrQWQuD` (glossy black, logo-sized on the lid): given white emissive, ramped by `logoGlow`.

## Files touched

- `scripts/inspect-macbook.mjs` — glTF inventory table (nodes/materials/textures) via `@gltf-transform/core`; takes a path arg so the rigged output was re-verified with the same tool.
- `public/models/macbook.rigged.glb` — draco-compressed copy (**10.6 MB → 3.7 MB**, under the 8 MB budget). Used `gltf-transform draco` only — NOT `optimize`, whose default join/flatten would weld the lid/base subtrees the hinge rig needs. Textures left as authored PNG (wallpaper already at the 2048 floor; lossy webp on normal maps = risk for no needed gain). Verified post-compress: both subtrees + materials intact.
- `public/draco/` — self-hosted decoder (copied from `three/examples/jsm/libs/draco/gltf/`); `useGLTF(url, "/draco/")` — no CDN fetches.
- `src/features/home/components/manifesto-3d/channels.ts` — choreography channel singleton (`sceneIntro, lidProgress, yawProgress, recede, screenGlow, logoGlow, veil`) + `stageState` render-loop gate. Zero deps — safe to import from the main chunk.
- `src/features/home/components/manifesto-3d/rig.ts` — hinge rig + island constants: finds base/lid by verified node names, builds `lidPivot` at the deck-line hinge, `attach()`s the lid (idempotent for StrictMode/HMR), measures `openAngle` from bboxes, exposes `setScreenGlow/setLogoGlow`, computes fit normalization.
- `src/features/home/components/manifesto-3d/MacbookModel.tsx` — `useGLTF` + preload, per-frame damped application of channels (lid, yaw+idle sway, recede, glows), screen-spill point light.
- `src/features/home/components/manifesto-3d/StudioRig.tsx` — procedural studio (Environment + 3 Lightformers + ember directional reading `--color-accent` at mount + ContactShadows 512). Zero network.
- `src/features/home/components/manifesto-3d/ManifestoCanvas.tsx` — lazy-boundary Canvas (`frameloop="never"`, dpr 1.75 / 1.25 mobile), `FrameDriver` (gsap.ticker → `state.advance(t*1000)`, skips while hidden/inactive), `CameraRig` (sceneIntro dolly + exposure).
- `src/features/home/components/manifesto-3d/ModelErrorBoundary.tsx` — class boundary for chunk/WebGL/GLB failures → poster fallback (wired in commit 2).
- `src/assets/images/macbook-poster.webp` — 1600×1000 capture of the P3-end pose (reduced-motion / no-WebGL stand-in).
- `eslint.config.js` — scoped `react-hooks/immutability: off` to `manifesto-3d/**` (the useFrame render loop mutates three objects in place every frame — irreconcilable with that rule; pre-authorized by spec §6).
- `logs/feature-changes/assets/macbook-pose-{1,2,3}*.png` — pose verification screenshots.

## Notable decisions (durable → motion-engineer memory in commit 2)

- **Rig Case A confirmed**: two named sibling subtrees; no offline rig script needed (`scripts/rig-macbook.mjs` not written — Case C only).
- **Hinge**: world `(0, baseBox.max.y, lidBox.max.z)`. The spec's `lidBox.min.y` is the hinge-barrel *bottom* — pivoting there sinks the closed lid a full thickness through the deck (verified in sandbox). Deck-top pivot + `CLOSED_TUCK = 1.015` over-rotation closes it flush.
- **Sign (empirical, spec §5.4.4)**: `rotation.x = +openAngle` = closed (forward-down onto deck), `0` = authored open; negative folds the lid *under* the base. Locked as a constant with comment.
- **Do not judge poses with `Box3.setFromObject`** on the rotated lid — the loose raw AABB re-AABB'd inflates massively (cost two false "broken hinge" reads). Judge by renders / world quaternions.
- **advance() driven per-root** via `useThree(s => s.advance)` inside the lazy chunk — keeps `three` out of the main bundle and off the section file; timestamps in ms (`t * 1000`, same convention as Lenis raf).
- **Damping in `useFrame`** (delta already in seconds) rather than a separate ticker — gsap.ticker deltaTime is ms and would silently break `MathUtils.damp`.
- Lighting tuned dark: big soft key at 0.85 (2.4 blew the silver shell to white at the P2 lid angle), thin top strip for the aluminum edge, ember directional from `--color-accent`, screen-spill point light on the screen's facing side at intensity ≤ 2.5.

## Verification

- [x] `npx tsc -b` clean (root `tsc --noEmit` is vacuous — documented gotcha)
- [x] `npm run lint` clean
- [x] `npm run build` green; three.js stays in the lazy `ManifestoCanvas` chunk (962 kB) — main chunk unchanged (515 kB)
- [x] Pose screenshots match spec §3/§4.3 prose (closed rear-quarter w/ dim logo; rising lid presents logo; front-open lit wallpaper)
- [ ] Lighthouse — deferred to commit 2 (no section shipped yet)

## Follow-ups

- Commit 2 wires the island into `ManifestoSection` (seam, stage pin, statement, veil, fallbacks) and deletes the keyboard build.
- Framing constants (`FIT_SIZE 3.2`, camera y/lookY, `YAW_START π−0.35`) get final tune during commit-2 integration QA against the rest-strip crop.
- The prompt's "supplied MacBook renders" are not in the repo — poses were verified against the prompt's own P1/P3 descriptions + the authored GLB pose. Renders can be dropped into `reference/` anytime for tighter matching.
