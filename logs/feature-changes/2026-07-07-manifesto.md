# Chapter 02 — Manifesto (scroll-fill)

- **Date:** 2026-07-07
- **Author:** motion-engineer
- **Type:** feat
- **Chapter/Area:** 02 Manifesto (design_system §11.2 + §7.2 scroll-fill)

## Summary
Built the Manifesto chapter end-to-end: three re-voiced statement lines (facts from PRD §2 bio) as typed data, a pinned + scrubbed scroll-fill where words go opacity 0.15 → 1 sequentially across the pin range, and a surgical accent treatment on the focal word "people". Wired into HomePage after the Hero.

## Files touched
- `src/types/portfolio.ts` — `Profile.manifesto: { lines: string[]; focalWord: string }`
- `src/features/home/data/profile.data.ts` — manifesto lines + focal word (exact coordinator-approved copy)
- `src/features/home/sections/ManifestoSection.tsx` — new section (eyebrow `02 — WHO I AM`, statements in `font-display font-light text-statement`, scroll-fill motion)
- `src/features/home/pages/HomePage.tsx` — mounted after `HeroSection`

## Notable decisions
- **No split-type**: word boundaries are static data, so words are pre-split in JSX (`line.split(" ")` → spans). No DOM mutation, no revert, and the "re-split on refresh" problem disappears — React owns the markup and lines reflow natively on resize. `invalidateOnRefresh: true` still recalcs the pin distance.
- **Opacity-only fill** (`0.15 → 1` on `text-paper`) instead of a faint→paper color tween — one tweened property, visually equivalent to the §7.2 spec (0.15 paper reads as faint).
- Pin config: `trigger: section, start: "top top", end: "+=175%", pin: true, scrub: true`; single `fromTo` with `duration: 0.4, stagger: 0.2` normalized across the scrub range.
- Focal word: fills to `text-accent` with a static `bg-accent-tint` wash (`-mx-1 px-1 rounded` — negative margin cancels the pad so layout doesn't shift); the wash fades in with the word's own opacity. Punctuation attached to the token stays inside the wash (minor, accepted).
- No `anticipatePin`/manual resize listener — Lenis drives native window scroll, ScrollTrigger's default resize refresh recalcs the pin.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced motion: no pin, no scrub — lines static full-opacity paper, focal word statically accented, fully legible
- [x] dev server smoke: `/` 200, ManifestoSection + profile.data transform 200, no dev-log errors
- [ ] pin activation/page-height growth needs a browser — left to `/qa-audit` (chrome-devtools MCP)

## Follow-ups
- QA: verify pin engages cleanly after the hero, fill pacing across `+=175%`, and pin spacing on mobile heights.
- Consider `end` tuning (150–200%) after feel-testing.

## QA outcome (post-audit)
Runtime audit: pin/scrub/reversal/resize/reduced-motion/mobile all pass; pin-boundary continuity confirmed with a stand-in section below. Two minors fixed before commit: trailing 1.4s padding tween so the fill completes ~80% into the pin (read beat before unpin, F1); `revertOnUpdate: true` so an OS reduced-motion flip mid-session can't leave a stuck pin (F2). Releasable.
