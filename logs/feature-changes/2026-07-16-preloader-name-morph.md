# Preloader — name-as-shared-element morph (P0–P5), replaces the three-act intro

- **Date:** 2026-07-16
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 00 Preloader + 01 Hero handoff

## Summary

Replaced the three-act Welcome/ember/curtain preloader with the reference's
name-morph choreography (spec: PROMPT F; measured phase table in
`reference/preloader-refine-notes.md`): the preloader renders its own wordmark
(`Muh. Sufyan.`, same display faces/tokens as the h1) centered on ink, breathing
through a REAL loading gate (fonts + aurora first frame + hero route chunk,
bounded `hold.min 0.7`–`hold.max 4.0`); it then FLIP-morphs each word onto the
hero h1's measured word rects and an ember burst radiating from the landing zone
covers a frame-atomic wordmark→h1 visibility swap. The burst decays into the
live aurora; hero chrome staggers in as `[data-chrome]` groups
(tagline → socials → nav → meta) off the `preloaderDone` flip (which now fires
at the flash peak, not overlay end); scroll unlocks exactly when the last group
starts. The hero's SplitType char entrance is retired — the name never animates
in the hero.

## Files touched

- `src/components/common/preloader.tunables.ts` — NEW: `PRELOADER_REFINE`
  single source (hold/center/travel/burst/chrome/reducedMotion).
- `src/components/common/Preloader.tsx` — full choreography rewrite; keeps the
  overlay shell, Lenis stop/start scroll lock, `finished` unmount, reduced-motion
  layout-effect path; new required `name` prop.
- `src/features/home/sections/HeroSection.tsx` — char entrance deleted; words
  wait invisible-but-measurable (`autoAlpha:0`) until the swap; P4 chrome
  timeline from `PRELOADER_REFINE.chrome` (delay = `peakHold + decayDur`);
  `[data-chrome]` tags added (`.hero-item` classes untouched — the seam's
  selector still matches); bar hairline reveals via `borderTopColor` tween.
- `src/store/useUIStore.ts` — new `auroraReady` flag (gate signal).
- `src/features/home/components/AuroraBackground.tsx` — sets `auroraReady` on
  first rendered frame AND in both no-shader terminal paths (WebGL fail,
  reduced motion) so the gate can never hang.
- `src/routes/__root.tsx` — passes `profile.heroName` to `Preloader` (keeps
  common/ free of feature imports).
- Docs: `CLAUDE.md`, `PLAN.md`, `.claude/rules/custom-components.md`,
  `.claude/output-styles/custom-components.md` — Preloader rows/descriptions.

## Notable decisions

- **Swap is preloader-driven, not React-driven:** the same timeline `call()`
  that hides the wordmark `gsap.set`s the h1 words visible and flips
  `preloaderDone` — zero-latency, frame-atomic (store→React re-render would risk
  a blank frame under the flash). The hero's `revertOnUpdate` re-run then leaves
  the words naturally visible.
- **`gsap.utils.toArray` is context-scoped in callbacks** (root-caused live):
  called from `onRepeat` inside the Preloader's `useGSAP`, it silently scoped
  `.hero-name .hero-word` to the overlay ref and returned `[]` — hero queries
  from the preloader must use `document.querySelectorAll`.
- Per-word FLIP (translate+scale from gBCR, `transformOrigin: "0 0"`) — works
  identically for the ≥lg one-line and <lg stacked-rows layouts; wordmark spans
  reuse `text-hero-line` classes with only font-size overridden inline, so
  em-based tracking/leading keep the morph glyph-exact.
- Gate timers/subscriptions are all cleanup-registered (StrictMode remount must
  not let a stale closure fire the swap); `hold.max` is a hard cap that force-
  opens the door mid-breath (≤8% scale snap accepted on that degenerate path).
- Timing tuned against the reference capture by tunables only: `breathDur`
  1.3→1.55 (the breath boundary quantizes door-open), `fadeDelay` 0.35 — all
  phase boundaries land within ±0.3 s of the measured table.
- No cyan name-flip at the peak (reference has one; spec D3 keeps the flash
  ember-only — out of scope).
- Mid-page refresh (scrollRestoration): morph lands on the words' *visually
  transformed* rects (gBCR includes seam transforms), so the end state stays
  coherent wherever the reload happens — verified live, accepted as-is.

## Verification

- [x] `npm run build` (tsc -b + vite) clean; `npm run lint` clean
- [x] Retired-act grep (`pre-welcome|pre-ember|pre-portfolio|pre-ring|pre-counter|RING_|SplitType` in Preloader/Hero) → no hits; no new RAF loops; no raw hex
- [x] Runtime (chrome-devtools MCP, 1440×900): 907 rAF-frame probe — **0 frames with two names**, swap flips in a single frame at burst opacity 0.99; wordmark lands **pixel-exact** on the h1 rects (identical left/top/width)
- [x] Timing vs reference (t₀=nav): P0 end 0.53 vs 0.54 · P1 0.53→0.73 vs 0.54→0.91 · hold end 1.74 vs 1.76 · land/peak 2.09 vs 2.24 · decay end 2.84 vs 2.81 · chrome start 3.00 vs 2.81 — all within ±0.3 s
- [x] Scroll lock: synthetic wheel every 150 ms — `scrollY` stays 0 through P0–P3; first scroll lands right after unlock (~3.24 s)
- [x] Gate: `.glb` + draco + display woff2 requests in flight during P1; fonts-blocked run → door force-opens at 4.21 s (`hold.max` path)
- [x] Reduced motion (matchMedia override): single cut at ~0.2 s, zero transform frames, chrome statically visible, native scroll
- [x] WebGL fail (getContext stub): burst + morph unaffected, CSS-gradient aurora, gate releases on time (no 4 s stall)
- [x] P1 legibility screenshots at 1440×900 and 390×844 (`reference/qa-preloader/`)
- [ ] Lighthouse — deferred to the site-wide final QA (unchanged scope)

## Follow-ups

- In dev, the hero's P4 chrome starts ~0.2 s later than the preloader's unlock
  point (React re-render latency after the store flip); expected to shrink in
  prod — re-check at final QA.
- `--color-flash #66EACC` vs the reference's measured flash cyan ≈`#0AC3CB` —
  only relevant if the cyan beat is ever adopted (D5 hover flash ships OFF).
