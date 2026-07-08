# Preloader — always run + split-curtain reveal

- **Date:** 2026-07-08
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 00 Preloader

## Summary

The preloader previously played only once per browser session (`sessionStorage["preloader-done"]` gate) and skipped on refresh/repeat visits. Per request, it now plays on every load/refresh for motion-enabled visitors, and was restyled to be more "outstanding": instead of a single wipe-up, the counter flashes ember at 100, the name/counter fade out, and two ink panels part (split-curtain) to reveal the hero underneath.

## Files touched

- `src/components/common/Preloader.tsx` — removed `SESSION_KEY`/`skipped` state and the sessionStorage read/write; `active` now depends only on `prefersReducedMotion`. Restructured markup: two absolutely-positioned `bg-ink` half-width panels (`.preloader-panel-l`/`-r`) under a `.preloader-content` layer (name + counter). Rebuilt the GSAP timeline: name mask-reveal + counter 0→100 (unchanged) → counter color flash to `var(--color-accent)` → content/counter `autoAlpha` fade → panels slide out (`xPercent` ∓100, `power4.inOut`, near-overlapping starts) instead of the old single `yPercent: -100` wipe.
- `.claude/rules/custom-components.md` — updated the `Preloader` prop-surface line (was "runs once per session (sessionStorage)").
- `.claude/agent-memory/motion-engineer/MEMORY.md` — updated the `Preloader` entry to describe the always-run gate and the new split-curtain timeline.

## Notable decisions

- Reduced-motion path is unchanged: instant skip, `setPreloaderDone(true)` fires immediately in a layout effect, page stays interactive. "Always run" only applies to motion-enabled visitors — accessibility non-negotiable per `.claude/rules/accessibility.md`.
- Ember flash uses `color: "var(--color-accent)"` (CSS var, not raw hex) to stay token-driven through the pending cobalt→ember re-theme.
- Kept the counter's existing proxy/onUpdate mechanism and mask-reveal untouched — only the finale (flash → fade → part) changed, so the first ~2.8s of the animation is visually identical to before.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion path unchanged (traced code path; layout effect + `!active` early return both still present, `sessionStorage` removal doesn't touch that branch)
- [ ] Runtime smoke test (chrome-devtools/puppeteer) — not run this pass; recommend qa-auditor pass before next chapter ships

## Follow-ups

- None — this was a targeted preloader-only change, not a new chapter.
