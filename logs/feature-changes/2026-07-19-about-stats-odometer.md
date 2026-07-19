# About stats overdrive — odometer ignition cards

- **Date:** 2026-07-19
- **Author:** main (via `/impeccable overdrive`)
- **Type:** feat
- **Chapter/Area:** 03 About (finale), common/RevealText, repo-root PRODUCT.md

## Summary

Overdrove the three About-finale stat cards (owner-picked "odometer ignition" direction, AskUserQuestion this session): numerals upgraded `text-item` → `text-chapter` in Switzer with a serif-italic ember `+` tail, each digit rendered as an overflow-clipped 1em slot whose strip rolls 0→value scrubbed with scroll (reversible, `power3.out` decel; "10" = tens flip + full 0→9→0 ones cycle = crescendo). Cards ignite in staircase order inside ONE master timeline: shell blur-resolve → self-drawing SVG hairline (pathLength 100 dashoffset) → digit roll → paper glare sweep; the version line rides the tail. The old block-level `.about-final` fromTo + its trigger were replaced.

## Files touched

- `src/features/home/sections/AboutSection.tsx` — `digitStrip` + local `StatCard` (settled-state markup: inline strip transforms, clean rect, glare `opacity-0`); finale choreography replaced with the per-card master timeline; version `<p>` gained `about-version`; destructure `finale: F` → `stats: S`.
- `src/features/home/utils/about.tunables.ts` — `finale` key replaced by the `stats` block (trigger window, spans/cardStagger, beat windows, roll ease + tensFlipFrac, glare xPercent range, border strokePx, version tail) with the last-section-constraint comment carried over.
- `src/components/common/RevealText.tsx` — **pre-existing bug found during QA, root-caused + fixed**: the scrub variant's `onRefresh` rebuild left fresh splits veiled forever when refresh fired past the trigger end (forward progress clamped at 1 never moves the playhead — e.g. resize at page bottom re-blurred the About bio permanently). Fix: `tl.progress(self.progress)` after `rebuild(true)`.
- `PRODUCT.md` (new) — impeccable's strategic context file, seeded from `.agents/context` specs (register `brand`), owner-approved.
- `.claude/agent-memory/motion-engineer/MEMORY.md` — odometer pattern + gotchas.

## Notable decisions

- **Hand-rolled dashoffset in the master timeline, NOT the `PathDraw` primitive** — PathDraw owns its own ScrollTrigger and would desync from the per-card beats; one trigger for the whole finale is the section grammar.
- **Markup carries the settled state** (house pattern): reduced motion renders complete with zero JS — final digits via inline `translateY(−100·(len−1)/len %)`, dash channels exist only on the motion path, glare hidden by class.
- **Glare sweeps inside the scrub** (reversible, reads as light catching on reverse) instead of a fire-once onEnter — keeps About's everything-reversible grammar.
- **Trigger window retuned in browser QA**: `top 85%`→`top 40%` settled card 2 below the fold (the block grew ~3× with display numerals); shipped `top 85%`→`top 20%` + `cardStagger 0.85` so the crescendo rolls fully on-screen at 900px viewports. End anchor verified against max scroll on desktop (7206 ≤ 7424) and narrow (5410 ≤ 5672) viewports.
- `+` tail (serif italic, ember, superscript via `self-start text-[0.5em]`) follows the section's existing "(3+)" gutter-marker grammar; aria reads "3+ / 7+ / 10+".
- Observed ~143px stale ScrollTrigger anchors post-load (something after `fonts.ready` still shifts layout, likely the R3F island mount); drift direction is safe (beats fire with cards MORE visible) and both anchor regimes clear max scroll — no code change, noted for QA.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — settled render with zero inline styles, full borders, no glare, `aria-label` totals with `aria-hidden` strips (chrome-devtools, matchMedia stub)
- [x] Scrub mechanics probed live: exact strip landings (−75/−87.5/−50/−90.909), border draw + dash-seam `none` set, glare park at 250%, full reverse re-applies dash/veils
- [ ] Lighthouse ≥ 90 (deferred to the standing final-QA pass — no new deps, no new images)

## Follow-ups

- Optical pass candidates at owner review: glare tint swap `via-paper/20` → `via-accent/15`, `+` baseline nudge, label `mt-1` breathing room under the big numeral.
- `pathLength` on `<rect>` is evergreen-safe; if legacy-Safari support ever matters, switch to `getTotalLength()` (PathDraw's approach).
- The stale-anchor source (post-`fonts.ready` layout shift ≈143px) is worth a root-cause look in the final QA chapter.
