# Preloader redesign — Welcome + circular loader, ember slide-up act

- **Date:** 2026-07-08
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 00 Preloader

## Summary

Restructured the Preloader's choreography into three acts, replacing the previous
"name reveal + counter → ink split-curtain" sequence. Act 1: "Welcome" mask-reveal
centered inside a circular SVG progress ring (`--color-accent` stroke, clockwise
fill 0→100%) with the percentage shown below the word. Act 2: the Welcome screen
fades as a full-screen `bg-accent` (ember) page slides up from the bottom,
revealing "To My Portfolio" via a `SplitType` char-stagger reveal (dark `text-ink`
on ember). Act 3: the ember page splits into two halves that exit left/right
(`xPercent ±100`, reusing the prior split-curtain idiom) to reveal the site, then
fires the existing `setPreloaderDone(true)` handoff to the Hero. Outer contract
unchanged: `z-90`, `aria-hidden`, Lenis scroll-lock while active, reduced-motion
renders `null` and signals done immediately.

## Files touched

- `src/components/common/Preloader.tsx` — full choreography rewrite (single file;
  no new dependencies — reuses the existing GSAP proxy-counter pattern, the
  split-curtain idiom, and `SplitType` per the `HeroSection.tsx` char-reveal
  convention).

## Notable decisions

- Ring fill and percentage text are driven by one GSAP proxy tween
  (`{value: 0→100}`), same `onUpdate` pattern the old counter used — now it also
  writes `strokeDashoffset` on the progress `<circle>`, avoiding a second tween.
- Ember halves + content are hidden via `gsap.set(..., { yPercent: 100 })` before
  the timeline builds (not `.from()`, since they animate later in the timeline
  than time 0) — mirrors the "hide via gsap.set, never CSS" rule already
  established in `HeroSection.tsx`.
- "To My Portfolio" uses `text-ink` (near-black) on `bg-accent` (ember) rather
  than `text-invert-text`, since `invert-text` is reserved for the documented
  invert-bg section pattern, not an ember background.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Runtime (chrome-devtools MCP, GSAP clock slowed via `performance.now`/
  `Date.now` override in `initScript` since CPU throttling doesn't affect
  wall-clock GSAP timing): confirmed all three acts render and sequence
  correctly — ring fills 0%→100% in sync with the counter, ember slides up
  cleanly covering the Welcome screen, "To My Portfolio" chars stagger in, halves
  split apart revealing the Hero, `preloaderDone` handoff fires (Hero name reveal
  plays). No console errors/warnings.
- [ ] Reduced-motion path not re-verified live (gating logic unchanged from the
  prior shipped Preloader — no `emulate` control for `prefers-reduced-motion` in
  the available MCP tool).
- [ ] Lighthouse — not run for this isolated change.

## Follow-ups

- None.
