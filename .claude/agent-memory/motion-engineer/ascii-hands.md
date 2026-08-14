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

## Tune knobs

`CELL_PX` (9 → ~165 cols at 1440; reference measured ~180), `SPOT` (4.5rem radius), `WAVE_STRENGTH` (0.35; 1.0 reads as a flapping flag), `PLANE_FILL` (0.96), `RENDER_FPS`.

## Footer entrance timeline

In `sections/FooterSection.tsx`, one `once: true` timeline at `start: "top 80%"` — the reference's footer is a **timeline, not a scrub** (the page is stationary while it plays).

- Name: two **centre-out `clipPath` wipes** at t=0, `power4.inOut`, 1.1s. Lead `inset(0 0 0 100%) → inset(0 0 0 0%)` (mask grows leftward); tail `inset(0 100% 0 0) → inset(0 0% 0 0)` (grows rightward). **clipPath, not `xPercent` inside `overflow-hidden`** — in the reference the letters never move, only the mask grows.
- Meta lines: same L→R wipe, `ease: "none"`, 0.5s, `stagger: 0.12` in reading order — linear is what makes it read as typing.
- Hands: `autoAlpha 0 → 1`, 1.2s, with the name.
