# Journey overdrive — gallery-clone statement + reference-card restyle

- **Date:** 2026-07-22
- **Author:** main (via /impeccable overdrive)
- **Type:** feat
- **Chapter/Area:** 05 Journey (eyebrow "08 — The Path")

## Summary

Second same-day overdrive on the Journey chapter: the intro statement is now a
full clone of the gallery grammar (centered, `font-display-lead` +
italic-serif focal words "shipping"/"engineering", word-by-word blur de-veil
scrubbed on the h2), and the work/education cards are restyled to an
owner-supplied reference image — circular kind-icon badge (lucide
Briefcase/GraduationCap) above the title, 24px corners, raised bg, and a
subtle ember bottom bloom replacing the reference's purple/teal glow. The
serpentine line and the per-row scrub slide-in are mechanically unchanged.

## Files touched

- `src/styles/globals.css` — new `--radius-card: 24px` token (journey cards
  only; owner-approved departure from the 8px cap).
- `src/features/home/utils/journey.tunables.ts` — new `heading` group
  (de-veil window/stagger/blur) + `card` group (glow color-mix percentages).
- `src/features/home/sections/JourneySection.tsx` — statement rework
  (STATEMENT/isFocalWord word-span pattern from GallerySection), card badge,
  `rounded-card overflow-hidden bg-raised` wrapper, tokens-only glow layer
  (`color-mix` over `var(--color-accent[-deep])` — no raw hex).

## Notable decisions

- Owner picked (AskUserQuestion): full gallery clone centered; kind icon
  badge (no org logo assets exist — none invented); badge above title;
  reference-soft finish with **subtle** glow (vivid rejected — Ember Scalpel).
- Glow is the permitted-wash precedent (gallery/projects ember gradient),
  expressed as `color-mix(in oklab, var(--color-accent) N%, transparent)` so
  the QA hex grep stays clean and re-themes stay one-file.
- Awards pills untouched; no "Learn More" link added (no PRD content for it).

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (statement visible by markup default,
      line fully drawn, cards settled; badge icons `aria-hidden`)
- [x] Browser-iterated via chrome-devtools MCP at 1440px + 390px; scrub
      reversal spot-checked (statement re-blurs scrolling up)

## Follow-ups

- Glow intensity/height tunable via `JOURNEY.card` if the owner wants it
  livelier after seeing it in situ.
- Real org logos can replace the kind badges later via `logo?: string` on
  `JourneyItem` + files in `public/assets/images/journey/` (badge as
  fallback).
