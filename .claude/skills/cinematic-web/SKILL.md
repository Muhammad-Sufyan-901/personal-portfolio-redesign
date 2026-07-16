---
name: cinematic-web
description: Build cinematic, award-style interactive websites — three.js hero scenes, scrollytelling with video backgrounds, 3D product showcases (GLB), shader effects, hover/hold interactions, kinetic typography. Use this skill whenever the user asks for a landing page, hero section, product page, portfolio site, or any website that should feel "3D", "cinematic", "interactive", "premium", or "award-winning" (like igloo.inc, Hatom, or Apple product pages), or mentions scroll animations, video backgrounds, WebGL, three.js, or showcasing a 3D model — even if they never say "three.js" explicitly. [Repo append] In this repo, read ADAPTATION.md first — repo Golden Rules override the single-file archetype.
---

# Cinematic Web

Build single-file, zero-setup cinematic websites. Everything here was extracted from
real build sessions — the numbers, decision rules, and pitfalls are battle-tested, not theoretical.

## Core promise

The output is ONE self-contained `index.html` that a user can open with a local static
server (or double-click, if it loads no local assets). three.js comes from CDN via importmap.
No build step, no framework, no npm.

## Step 0 — Derive the THEME first (never skip)

Every visual decision flows from a single THEME object declared at the top of the file.
The #1 failure mode of generated "cinematic" sites is a generic default look (purple dusk,
random serif) that ignores the user's theme. If the user says "One Piece", "cyberpunk",
"luxury watch" — the background, palette, fonts, motifs, and copy voice must all be
derived from that theme. Read `references/theming.md` for the THEME schema, the
font-pairing table, and palette-role rules before writing any code.

```js
const THEME = {
  palette:{bg:'#07060d', ink:'#f2ede4', accent:'#e8a13c', accent2:'#5c9fd8', muted:'#8b8398'},
  fonts:{display:'Zodiak', body:'Satoshi', mono:'ui-monospace'},   // pick per mood, see theming.md
  motif:{glyphs:['白ひげ','震'], markSvg:'...'},                    // theme-specific accents
  env:'night-war'                                                   // drives procedural background
};
```

## Step 1 — Pick the archetype (decision tree)

Ask: what assets exist, and what vibe is wanted?

1. **video-first** — user has (or will generate) video clips. Full-frame video backgrounds
   per scroll section, text overlaid, optional light WebGL on top. Most reliable "wow";
   quality depends on the videos. → `references/scrollytelling.md`
2. **asset-3D** — user has a GLB model (product, weapon, character) or can generate one
   (Meshy etc.). Real-time 3D scene: model + procedural environment + shader effects +
   interactions. The Hatom/Apple-product-page pattern. → `references/webgl-kit.md`
3. **vector-minimal** — no assets at all, or user wants clean/elegant. Pure procedural:
   line-art terrain, geometric shapes, kinetic type. Always crisp, zero dependencies,
   lightest. → `references/webgl-kit.md` (environment kit section)

Mix freely: the flagship pattern is asset-3D **plus** video-first backgrounds per beat,
with the procedural environment as automatic fallback when a video file is missing.
Complex ORGANIC shapes (characters, creatures, ornate objects) cannot be generated
procedurally with code — they require a GLB asset. Geometric/mathematical shapes
(rings, crystals, terrain, architecture) are fine in pure code.

## Step 2 — Build

Read the relevant reference file(s) BEFORE writing code:

- `references/scrollytelling.md` — beat system, crossfade math, the THREE video modes
  (play-when-centered / true-scrub / hybrid) and the rule for choosing between them,
  canvas image-sequence scrub (frame-accurate hero — the Apple / thewatch technique),
  kinetic typography, scrim, HUD grammar, asset filename contract, degradation ladder.
- `references/webgl-kit.md` — renderer + post-processing recipe (exact numbers),
  procedural environment kit, generic GLB display recipe (auto-orientation, auto
  emitter detection), interaction patterns (hover via proxy, hold-to-charge, rim glow),
  particles (incl. interactive image→particle portraits, lobod-style), proven shader
  library (incl. liquid-metal/chrome, Hatom-style), WebAudio synth, and the full gotcha list.
- `references/asset-pipeline.md` — when the user needs assets generated: prompt
  formulas for images/textures/video, PBR-map derivation (`scripts/make_pbr.py`),
  video re-encode recipe for scrubbing, GLB optimization.
- `references/motion.md` — parallax systems (mouse / layered scroll / depth-map /
  media micro-parallax), the transition library (dissolve, wipe, flash, veil,
  camera-dolly), and the easing numbers. Read this for ANY build — motion quality is
  what separates template from award-site.

Study `examples/` for working end-to-end reference implementations:
- `examples/kairos.html` — vector-minimal/procedural archetype (zero assets, product landing)
- `examples/relic-dossier.html` — flagship: GLB + video backgrounds + scroll beats + hover + hold

## Step 3 — Quality bar (verify before delivering)

- Film grain: ONE layer only, amplitude 1.5–2.5%. Stacked grain reads as "broken bitrate".
- Every scroll position shows something intentional — no dead black gaps between sections
  (crossfade windows must overlap).
- Text over media always has a scrim gradient behind it.
- Missing asset ⇒ graceful fallback (procedural env / poster still), never a black screen
  or console-error wall. Test by renaming an asset away.
- Autoplay: videos are muted + playsinline, and decode is primed on first user gesture.
- Tell the user how to run it: assets ⇒ needs a static server (`npx serve` /
  `python -m http.server`); no assets ⇒ double-click works.

## Top gotchas (the expensive ones)

1. `#include <colorspace_fragment>` must sit on its OWN line in GLSL strings.
2. Scrubbing `video.currentTime` on sparse-keyframe video flickers. Either re-encode
   (`scripts/encode-scrub.md`) or use play-when-centered mode.
3. Raycast a proxy capsule, not a 300k-triangle mesh.
4. Background planes need `fog:false`; parent them to the camera for full-frame.
5. Clamp `pixelRatio` to ≤1.7; clamp per-frame `dt` to ≤0.05.
6. GLB orientation is unpredictable: detect longest axis, rotate vertical, re-measure.
7. `localStorage` is unavailable in some hosts — keep state in JS variables.

Full list with explanations: `references/webgl-kit.md` §Gotchas.
