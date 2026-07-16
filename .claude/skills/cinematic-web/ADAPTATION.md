# ADAPTATION.md — how cinematic-web applies inside THIS repo

The vendor skill's core promise (one self-contained `index.html`, three.js from CDN via
importmap, no framework, no build step) **directly conflicts with this repo's stack and
Golden Rules**. Read this before using anything from the skill. Vendor files below this
folder are pristine except one marked `[Repo append]` in the SKILL.md description.

## What we USE it for (technique numbers + patterns, not architecture)

- `references/scrollytelling.md` — the beat system + crossfade math (overlap windows, no
  dead gaps), the THREE video modes (play-when-centered / true-scrub / hybrid) and the
  choosing rule, the canvas image-sequence scrub (frame-accurate hero — Apple/thewatch
  technique), kinetic typography, scrim rule, HUD grammar, asset filename contract, the
  degradation ladder.
- `references/webgl-kit.md` — renderer + post-processing recipe with exact numbers, the
  procedural environment kit, the generic GLB display recipe (auto-orientation via
  longest-axis detection, auto emitter detection, **proxy-capsule raycasting** — never
  raycast a 300k-triangle mesh), interaction patterns (hover proxy, hold-to-charge, rim
  glow), particle systems (incl. image→particle portraits), the proven shader library
  (incl. liquid-metal/chrome), and the full gotcha list (§Gotchas).
- `references/motion.md` — parallax systems (mouse / layered scroll / depth-map / media
  micro-parallax), the transition library (dissolve, wipe, flash, veil, camera-dolly),
  and the easing numbers. Relevant to ANY chapter build here.
- `references/asset-pipeline.md` + `scripts/make_pbr.py` + `scripts/encode-scrub.md` —
  asset generation prompt formulas, PBR-map derivation, the video re-encode recipe for
  scrub-safe keyframes, GLB optimization.
- `references/theming.md` — ONLY for the font-pairing table and palette-role reasoning as
  background knowledge; see THEME note below.
- `examples/*.html` — read as working end-to-end references for the patterns; never copy
  their document structure into this repo.

## What is OVERRIDDEN by repo law

| Vendor says | This repo does |
| --- | --- |
| One self-contained `index.html`, no framework, no build | Everything lands as **Vite + React components** under the existing feature structure |
| three.js from CDN via importmap | three.js only through the **existing R3F island path** (`features/home/components/manifesto-3d/` pattern): lazy boundary + `frameloop="never"` advanced from `gsap.ticker` — the single-RAF rule. Fiber v9 `advance()` takes SECONDS (see motion memory `manifesto-3d.md`) |
| Own rAF loops / scroll listeners | **GSAP only from `@/lib/gsap`**; scroll via ScrollTrigger on the **single Lenis owner** (`SmoothScrollProvider`) |
| Raw HTML tags | **Primitives-only markup** (`Box`/`Text`/`Heading`/… from `@/components/common`; R3F three.js JSX is the documented exemption) |
| Inline hex palettes | **Tokens only** (`@theme` in `src/styles/globals.css`) — no raw hex in components |
| Its degradation ladder (missing asset → procedural fallback) | Maps onto the repo's mandatory fallbacks: `prefers-reduced-motion` branch per effect + WebGL-failure → poster (the manifesto poster contract). Keep the vendor's "never a black screen" bar |
| — | **No Framer Motion enters the repo through any borrowed pattern** (repo Golden Rule; the vendor never asks for it — keep it that way) |

## THEME step is replaced

The vendor's "Step 0 — derive the THEME" **never runs against this repo**. Void & Ember
(design_system.md v2) IS the THEME object: palette = the `@theme` tokens (`ink/paper/
muted/line/accent #E8380F`), fonts = Fraunces / General Sans / JetBrains Mono, motif =
the mono chapter-eyebrow grammar, env = the aurora/ink void. Any vendor pattern that
takes THEME inputs gets those values, by token name.
