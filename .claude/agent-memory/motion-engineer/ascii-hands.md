# ASCII hands (Footer, 2026-08-14)

`src/features/home/components/AsciiHands.tsx` — the owner's CodePen `ASCIIText` port (codepen.io/JuanFuentes/pen/eYEeoyE), retargeted from a text texture to an image. Built to `reference/footer-refine.mp4`. Owner picked the three.js port over a pre-baked grid at the plan gate.

## Pipeline

image → `CanvasTexture` (uploaded ONCE) → `ShaderMaterial` on a `PlaneGeometry(w, h, 36, 36)` → `WebGLRenderer` → `drawImage` down to a `cols × rows` scratch canvas → `getImageData` → luminance→charset map → one `<pre>`.

Both shaders are **verbatim from the source** and are load-bearing: the vertex wave plus the fragment's per-channel UV offsets are what make the glyph field churn. Frame-diffing the reference 150 ms apart proved the churn is real, not a still.

## Deltas from the source port — all deliberate, don't revert

| Delta | Why |
|---|---|
| `uTime` from `gsap.ticker`, no private rAF | arch RULE 3 (single ticker), same as `AuroraBackground` |
| Texture uploaded once; `render()` does NOT redraw the source canvas | the source is a static image; the shimmer is in the shader |
| ONE `<pre>`, spotlight via `background-clip: text` + radial gradient positioned by `--ascii-x/y` | two masked layers double the relayout; per-cell spans are ~10k nodes. The gradient's last stop extends forever, so its outer colour is also the field's resting ember |
| `contain: strict` + explicit px `width`/`height` set in `setSize` | each rebuild relayouts a ~7.5k-char block; containment keeps that inside the element. `strict` implies size containment, so the explicit size is **required** or the `<pre>` collapses to 0 |
| `RENDER_FPS = 15` | it's noise; 60fps is invisible and 4× the cost |
| Dropped `hue()` / `hue-rotate`, `mixBlendMode: "difference"`, the rainbow gradient + `-webkit-text-fill-color` | the reference is a fixed ember; difference-over-ink is wrong |
| Scratch `<canvas>` is `display:none` | the source leaves it visible under the `<pre>` |
| `performance.now()` / ticker delta, not `new Date().getTime()` | monotonic |
| `getContext("2d", { willReadFrequently: true })` | it's read every frame |
| `IntersectionObserver` + `document.hidden` gate the tick | verified: `<pre>` content is byte-identical across 1.2 s while scrolled to the hero |
| Mesh rotation-follow clamped tighter than the source's ±0.5 rad | the reference tilt is subtle — the frame diff shows uniform noise, not edge-concentrated shift |
| No IBM Plex Mono `@import` | uses the `--font-ascii` token (see below) |

## Gotchas

- **`--font-ascii` exists because `--font-mono` renders Inter** (2026-07-20 three-family decision). Inter is proportional; ASCII columns jitter without fixed advance. The grid measures the cell from `getComputedStyle(pre).fontFamily`, so the token stays the single source.
- **The gradient's origin is the `<pre>`'s own box**, not the container's — the pointermove handler must measure `pre.getBoundingClientRect()`, not the wrapper's.
- `gsap.quickTo(el, "--ascii-x", …)` works on CSS custom properties, but the initial inline value must carry the unit (`"-999px"`) or GSAP can't infer it.
- The component is created asynchronously (after image decode), so teardown is a mutable `teardown` handle, not a closure over locals; the effect's cleanup sets `disposed` and calls it.
- Reduced motion: `uEnableWaves = 0`, **one** draw from the ResizeObserver, no ticker, no pointer listener. Verified — the field renders static and nothing loops.
- Missing image / no WebGL → returns `null`. The Footer owns the sized box around it, so the band keeps its shape either way.
- Pointer spotlight is gated on `(hover: hover)`; on touch the field just sits at its resting ember.

## Source art prep (required — do this before blaming the renderer)

`public/assets/images/hands.png` is a DERIVED file; the owner's original is `reference/hands-source.png`. Two things had to be fixed and will need fixing again for any replacement art:

1. **Alpha.** The supplied file was a PNG with the editor's transparency checkerboard flattened into real grey pixels. `asciify` maps `alpha === 0` to a space, so without real alpha the background rasterises as a solid glyph field. The checker is neutral (`max−min ≤ 2`) and skin is not (`≈45–65`) → key on saturation with ffmpeg `geq`, multiplying RGB by the mask as well as alpha so feathered edges go dark, not bright. Exact command in `logs/feature-changes/2026-08-14-footer.md`.
2. **Crop to content.** ~30% of the height was empty padding, which shrank the hands inside the band. Final art is 1456×502 (2.90:1).

Keep derived art out of `public/` unless it is actually used — `public/` is copied wholesale into `dist/`.

## Calibration against the reference (measured, don't re-eyeball)

- **180 columns.** Autocorrelating a dense strip of the reference field gives a 20px pitch in its 3600px frame. Ours measures 183 at 1440.
- **Resting glyph colour `REST_MIX 14%` of accent-deep.** Matched-scale patch: reference meanR 12.8 / p95 34 / lit 12.1%; ours 13.9 / 31 / 18.5%. Ours is flatter (cap 37 vs reference peaks 77) — solid text colour has no antialiasing falloff and the reference is an H.264 encode. Not worth chasing further.

> **MEASUREMENT TRAP.** The reference frame is 3600px for a ~1500 CSS px viewport (2.4×); a Playwright shot at DPR 2 is 2880px for 1440. Cropping the same *pixel* rectangle from each compares different CSS areas — it made the field read 5× too bright and the grid twice as coarse as it actually was, and sent me tuning in the wrong direction twice. **Scale both to the same CSS width before comparing anything.**

## Tune knobs

`TARGET_COLS` (180, measured off the reference) with `MIN_CELL_PX` 7 / `MAX_CELL_PX` 13 — the cell is SOLVED from the width, not fixed: a fixed 13px gave 183 cols at 1440 but only 49 at 390, where the hands read as noise. `MAX_CELLS` 16k is a hard budget over both (2560×1440 would otherwise be ~27k cells rebuilt per frame). Then `REST_MIX`, `SPOT` (4.5rem), `WAVE_STRENGTH` (0.35; 1.0 reads as a flapping flag), `PLANE_FILL` (1 — edge to edge, as the reference does), `RENDER_FPS`.

## Layout coupling (in FooterSection, but the renderer depends on it)

The artwork is ~2.9:1 and the leftover band is ~3.6:1, so **`-mb-[15vw]` on the hands box is load-bearing, not decoration** — it lets the field bleed down behind the name (z-10 above it) as the reference does, which brings the box aspect near the artwork's. Without it the plane fits to height and the hands span barely half the width. 15vw tracks the name's own height (`text-hero-line` 15.5vw × 0.95 leading) so it scales.

## Footer entrance timeline

In `sections/FooterSection.tsx`, one `once: true` timeline at `start: "top 80%"` — the reference's footer is a **timeline, not a scrub** (the page is stationary while it plays).

- Name: two **centre-out `clipPath` wipes** at t=0, `power4.inOut`, 1.1s. Lead `inset(0 0 0 100%) → inset(0 0 0 0%)` (mask grows leftward); tail `inset(0 100% 0 0) → inset(0 0% 0 0)` (grows rightward). **clipPath, not `xPercent` inside `overflow-hidden`** — in the reference the letters never move, only the mask grows.
- Meta lines: same L→R wipe, `ease: "none"`, 0.5s, `stagger: 0.12` in reading order — linear is what makes it read as typing.
- Hands: `autoAlpha 0 → 1`, 1.2s, with the name.
