# Manifesto rebuilt as the WebGL MacBook scroll-story (ch. 02, commit 2/3)

- **Date:** 2026-07-13
- **Author:** main (Claude Code, PROMPT #4 one-shot run)
- **Type:** feat
- **Chapter/Area:** 02 Manifesto (+ hero slot amendment, chrome retune)

## Summary

Replaced the keyboard-disintegration manifesto with the PROMPT #4 MacBook scroll-story. A live WebGL strip now sits between the hero's two name rows at rest; on scroll the hero pins and the strip's clip-path expands to full viewport while the rows ride its edges off-screen (T1 "seam"); across a 520vh runway a master scrub tweens the `channels` singleton (T2) driving: closed hold → lid opens facing away (logo beat) → 180° reveal turn onto the lit wallpaper → the manifesto statement (pre-split words, focal ember wash) over the receded machine → a backdrop-blur ember veil that will hand off to 03 About. Verified end-to-end with screenshots at every phase, fps traces, reduced-motion, and GLB-failure drills.

## Files touched

- `src/features/home/sections/ManifestoSection.tsx` — full rewrite: fixed stage (z-20: ember glow + lazy canvas in `ModelErrorBoundary`+`Suspense`), sticky inner (z-30: eyebrow + pre-split statement words + veil z-10-in-context), T1 seam timeline, T2 channels master, stage lifecycle, reduced-motion static branch.
- `src/features/home/sections/HeroSection.tsx` — the authorized slot amendment only: `hero-window-slot` span between the two name rows (`h-manifesto-slot`; carries the poster under reduced motion), SplitType now splits the two row spans individually (a revert on the h1 would destroy the slot node), pointer parallax early-returns past `scrollY > 8`, bottom bar tagged `hero-bar` so the seam fades its hairline.
- `src/lib/gsap.ts` — `ScrollTrigger.config({ ignoreMobileResize: true })` + one `document.fonts.ready → ScrollTrigger.refresh()` (the seam rect depends on display-font metrics).
- `src/styles/globals.css` — `--spacing-manifesto-slot` token; `:root { --veil-blur: 0px }` default.
- `src/components/layouts/MenuPopout.tsx` — start `innerHeight → innerHeight * 0.45` (the hero MenuButton fades ~0.42·vh into the seam; 1.0·vh left a no-menu gap).
- `src/features/home/components/manifesto-3d/MacbookModel.tsx` — viewport-width fit clamp (portrait phones: the horizontal frustum is narrower than `FIT_SIZE`; without the clamp the machine overflows at ~183% width).
- Deleted: `KeyboardModel.tsx`, old `components/ManifestoCanvas.tsx`, `public/keyboard/*` (scene.gltf + 3.7 MB bin + license).
- `PLAN.md` — ch. 02 marked shipped with the as-built summary (also supersedes open-decision 9's "skip the media reveal").

## Notable decisions (verified against installed GSAP 3.15 source during planning)

- **T1↔T2 dead zone**: `pinSpacing` + `end:"+=120%"` leaves a structural 100vh gap between hero-pin end and `#manifesto`'s `top top` — swallowed with `-mt-[100svh]` on the section (motion mode only; the reduced-motion branch has no pin spacer to compensate).
- **Sticky inner instead of `pin: stageInnerEl`** — identical result on Lenis-driven native scroll, zero double-spacer bookkeeping. Explicit `z-30` on it (a pinned/sticky wrapper is a z-auto stacking context that would otherwise paint under the z-20 fixed stage).
- **No `invalidateOnRefresh` on T2's master** — plain-object channel tweens re-record drifted starts mid-scrub on resize; every T2 value is a resolution-independent 0→1 `fromTo` (sequential same-property pairs carry `immediateRender: false`). T1 keeps `invalidateOnRefresh` for its pixel-space measurements.
- **Slot measured by accumulated `offsetTop/offsetLeft`** up the offsetParent chain to `#hero` — `getBoundingClientRect` corrupts under the pin's park position and inherits the ±10px name parallax, and a single offset hop measures against the parallax-transformed h1 (it becomes an offsetParent once quickTo stamps a transform).
- **Clip strings shape-matched** (`inset(TRBL round r)` → `inset(0px 0px 0px 0px round 0px)`); radius read from `--radius-lg` (8px token) instead of the spec's raw 12px.
- **Stage lifecycle via `autoAlpha` derived from progress on `onUpdate`+`onRefresh`** (never `display:none` — zero-sizes the GL buffer; never edge callbacks alone — scrollRestoration can load mid-document). The veil is never applied to the sticky wrapper: an `opacity<1` ancestor becomes a backdrop root and the blur stops sampling the canvas.
- **Timelines never wait for the model** — a late GLB damp-catches-up in useFrame; the GLB-failure path (drilled with a bogus URL) keeps seam + statement + veil and swaps the canvas for the P3 poster.
- **Veil perf clause resolved: keep the spec's animated backdrop-filter.** Measured 121 fps through P2–P3 and 105 fps through the veil segment at dpr 2 (threshold 50) — the freeze-canvas/filter fallback was not needed.
- Statement is the documented pre-split-words pattern (`StatementWords`, module-level split of `profile.manifesto.lines`, focal-word test strips punctuation).

## Verification

- [x] Screenshots: rest strip / seam 0.5 / seam end / p 0.2 (logo beat) / 0.5 (turn) / 0.75 (statement) / 0.91 (veil) — all match the §3/§4 grammar (rows ride the edges; logo faces camera through P2; front pose = lit wallpaper; statement legible; veil smears the composite)
- [x] Scrub reversed from the bottom back to 0 — clip returns to the exact slot rect, no lingering fixed layers
- [x] fps: 121 (P2–P3), 105 (veil) — budgets met, veil fallback not engaged
- [x] Reduced motion (puppeteer media emulation): hero slot poster strip; manifesto = static eyebrow + statement + poster; 0 canvases, 0 pin-spacers, 0 console errors
- [x] GLB failure drill: poster fills the stage, seam/statement/veil unaffected
- [x] 390×844: same choreography, fit clamp keeps the machine in frame, statement legible
- [x] Console clean (one upstream `THREE.Clock` deprecation warning from fiber)
- [x] `npm run lint` + `npm run build` green; three.js stays in the lazy chunk (main 515 kB unchanged)
- [x] Lighthouse (production preview): A11y 100 · Best Practices 100 · SEO 100

## Follow-ups

- Anchor-nav (`#manifesto`/`#about` through the pins) and the scroll-past-About stage-hide regression get their full pass once 03 exists (commit 3) — the page currently ends exactly at T2's end.
- Mobile statement sits over the deck highlight at some phases — legible but worth a recede/framing nudge if it bothers in real use (tunables: `FIT_SIZE`, `RECEDE_SCALE`, camera `lookY`).
- The prompt's "supplied MacBook renders" were never in the repo — poses were verified against the prompt's own P1/P3 prose; renders can land in `reference/` for tighter matching anytime.
