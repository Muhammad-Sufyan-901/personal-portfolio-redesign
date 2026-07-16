# Preloader — two-sheet exit + char-cascade entrance (owner revision)

- **Date:** 2026-07-16
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 00 Preloader + 01 Hero handoff

## Summary

Owner-requested revision of the (uncommitted) name-morph preloader, matched
frame-by-frame against `reference/preloader-refine.mov`: (1) the exit is now
two bottom→top sheet wipes — EMBER first (fully covering exactly as the name
lands), a full-cover hold, then INK immediately after — replacing the radial
burst + opacity decay; the wordmark→h1 swap happens in one atomic cut at ink
full-cover (invisible: the ink sheet matches the page bg), and the name rides
ABOVE both sheets throughout (white on red, then white on ink — no cyan beat,
owner decision, D3 stands). (2) The wordmark now enters letter-by-letter: chars
rise UNCLIPPED from below with a settling rotation, staggered from the center
of the combined name outward (the reference's fill: lead word right→left, tail
left→right), replacing the wrapper fade. `preloaderDone` now fires at the
reveal; hero chrome and a new aurora glow ramp start there (reference 6.5→6.7 s
beat), replacing the burst-decay delay.

## Files touched

- `src/components/common/preloader.tunables.ts` — `burst`/fade keys removed;
  new `chars` (delay/dur/rise/rotation/staggerEach), `sheets`
  (emberIn 0.28 / hold 0.3 / inkIn 0.25 / power4.inOut — measured from the
  reference), `auroraIn` 0.25.
- `src/components/common/Preloader.tsx` — `.pre-burst` → `.pre-sheet-ember` +
  `.pre-sheet-ink` (parked `yPercent:100`); SplitType char cascade in P1
  (`stagger: { from: "center" }` over the combined chars); timeline: ember wipe
  ends at the landing → hold → ink wipe → atomic swap-cut (also hides both
  sheets); resize snap and degenerate maxHold path go through the same cut.
- `src/features/home/sections/HeroSection.tsx` — P4 timeline delay removed
  (chrome starts at the reveal); `<AuroraBackground/>` wrapped in a
  `.hero-aurora` Box that is hidden pre-flip and ramps in over `auroraIn` at P4
  start — the wrapper, never AuroraBackground's own root (its scroll scrub-fade
  records that element's start alpha on refresh).
- Docs: `CLAUDE.md`, `PLAN.md`, `.claude/rules/custom-components.md` Preloader
  descriptions.

## Notable decisions

- Two sheets + invisible ink-on-ink cut instead of "ember slides in then out":
  matches the owner's read of the reference exactly, gives a generous swap
  window (the whole ink cover), and needs no boundary math for the swap moment.
- Chars deliberately NOT clipped (no overflow-hidden) — reference frames show
  glyphs below the baseline while rising; rotation settles to 0 on landing.
- Aurora ramp targets a new wrapper because the scrub-fade ScrollTrigger on the
  aurora's own container records start-alpha on refresh (hiding the inner
  element would freeze the aurora invisible).

## Verification

- [x] `npm run build` + `npm run lint` clean; `pre-burst|burstCfg|coveragePeak|fadeInDur|fadeDelay` grep across src/ → no hits
- [x] Runtime (chrome-devtools MCP, 1440×900): 662 rAF frames — 0 double-name
  frames; swap flips in a single frame exactly at `inkY = 0`; cascade counts
  3→5→7→9→11 chars; ember cover ends at the landing (wordmark x = h1 x = 72 px
  same sample); chrome + aurora (0→1 over ~0.25 s) start at the reveal;
  overlay unmounts at reveal + 0.27 s (last-chrome-start unlock)
- [x] Timing vs reference (t₀=nav, cold-load offset 0.32 s): cascade 0.66→~1.1
  (ref 0.54→0.91) · door/morph 1.87→2.17 (ref 1.76→2.24) · ember cover end 2.17
  (ref 2.24) · hold →2.51 (ref →2.56) · ink cover →2.72 (ref →2.81) · reveal +
  chrome + aurora 2.73 (ref 2.81) — all boundaries within ±0.12 s
- [x] Mid-cascade capture (`reference/qa-preloader/cascade-mid.jpeg`): center-
  outward fill confirmed (lead `.` + `Sufy` first, `y` settling)
- [x] Reduced motion: single cut at 0.24 s, sheets never render, aurora wrapper
  never hidden
- [x] WebGL fail: both sheets play, swap + unmount on time, CSS-gradient aurora
- [x] Aurora scroll scrub-fade intact post-wrapper (inner 1→0→1 across a scroll
  round-trip)

## Follow-ups

- None new; the dev-mode ~0.2 s React-latency note from the morph log still
  applies to the chrome start.
