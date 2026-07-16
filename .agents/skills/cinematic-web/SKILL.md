---
name: cinematic-web
description: Pointer to the vendored cinematic-web toolkit in .claude/skills/cinematic-web — battle-tested numbers and patterns for three.js hero scenes, scrollytelling with video backgrounds, GLB product showcases, shaders, and kinetic typography. Reach for it when building or polishing any 3D/cinematic/scroll-driven moment in a chapter. Implementation lives only on the .claude side; read its ADAPTATION.md first.
---

# cinematic-web (pointer — implementation in `.claude/skills/cinematic-web/`)

**What it is:** a vendored progressive-disclosure skill (router SKILL.md + `references/`
on scrollytelling, webgl-kit, motion, theming, asset pipeline + `scripts/` + working
`examples/`) extracted from real cinematic-site build sessions — exact renderer numbers,
video-scrub modes, GLB recipes, shader/particle libraries, transition easings, gotchas.

**Why it's installed here:** the portfolio is a motion-first scroll-telling site with a
live WebGL chapter (manifesto MacBook story) and more 3D/scroll beats to build (04→Footer);
this is the deepest pattern reference for that class of work.

**When to reach for it:** building or refining any scroll-driven, WebGL, video-background,
or 3D-showcase moment; asset generation/encoding questions; motion/transition numbers.

**⚠ Adaptation warning:** the vendor's core promise (single-file `index.html`, CDN
three.js, no framework) is **overridden by repo law** — read
`.claude/skills/cinematic-web/ADAPTATION.md` first: Vite+React only, three.js via the R3F
island pattern, GSAP from `@/lib/gsap`, single Lenis, primitives + tokens, reduced-motion
fallbacks. Its THEME derivation never runs here (Void & Ember is the THEME).
