# B1: Void & Ember re-theme + grotesk display + PathDraw primitive

- **Date:** 2026-07-07
- **Author:** main + motion-engineer
- **Type:** feat
- **Chapter/Area:** design tokens (globals.css), Heading display variant, motion foundation (PathDraw)

## Summary

Stage B step 1 of PLAN v2: migrated the token *values* in `src/styles/globals.css` from the interim Warm Ink + Cobalt set to the measured **Void & Ember** palette (design_system v2 §9) and executed the approved typography decision — **General Sans is now `--font-display`** (grotesk, §4.1 option B); Fraunces removed entirely. Added the shared **`PathDraw`** motion primitive for the upcoming Journey/Selected-Work bold-path upgrades. Components style by token name, so chapters 00–04 re-themed with zero section-code changes.

## Files touched

- `src/styles/globals.css` — dark palette → `#0A0A0A/#141414/#1C1C1C/#E4E4E4/#9A9A9A/#4D4D4D/#242424`, accent → ember `#E8380F`/deep `#B32C0B`/tint `rgba(232,56,15,.12)`; NEW `--invert-bg #E8E8E8`/`--invert-text #0A0A0A` (flip dark in `.light` so the contrast beat survives) + `--selection-bg rgba(232,56,15,.25)` (§3.4); light block accent → `#B32C0B` (deep `#8F2309`); `--font-display` → General Sans; Fraunces `@import` removed.
- `src/components/common/Heading.tsx` — display variant `font-normal` → `font-medium` (grotesk needs the weight at display sizes to read like the reference); comment updated.
- `src/components/common/PathDraw.tsx` (NEW, by motion-engineer) + barrel export — bold 3–4px organic SVG path draw, `getTotalLength()` → dashoffset scrub in `useGSAP`, `stroke="currentColor"` on a `text-accent` wrapper (token-driven), `vectorEffect="non-scaling-stroke"`, `aria-hidden`; reduced-motion/JS-dead renders fully drawn. Not wired into any section yet (B3/B4).
- `package.json`/`package-lock.json` — `@fontsource-variable/fraunces` uninstalled.
- `.claude/agent-memory/motion-engineer/MEMORY.md` — PathDraw API added.

## Notable decisions

- Grotesk swap = token-level only; the display *weight* bump (400→500) is the one component-level change, made in the `Heading` variant so all display type inherits it.
- Invert tokens flip dark-on-light in `.light` mode rather than becoming a no-op.
- PathDraw defaults: `strokeWidth 3.5`, `viewBox "0 0 100 100"` + `preserveAspectRatio "none"` (stretches with container; non-scaling stroke keeps width), scrub `true`, `start "top 80%"` / `end "bottom 60%"`.

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] Smoke (dev server + Chrome DevTools MCP): preloader → hero (grotesk medium name on void bg, ember scroll cue), manifesto pinned scroll-fill (ember eyebrow index + ember-tinted focal word), craft, journey (ember award dots) all render; **zero console errors/warnings**
- [x] No Fraunces references left in `src/` (comment in Heading updated)

## Follow-ups

- B2: Hero aurora canvas. B3: Journey PathDraw rail + awards invert band. B4–B6: Work, Contact, Footer.
