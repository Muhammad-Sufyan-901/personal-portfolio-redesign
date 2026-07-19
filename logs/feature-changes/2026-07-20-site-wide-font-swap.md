# Site-wide font swap — 3-family stack (Instrument Serif · Switzer · Inter)

- **Date:** 2026-07-20
- **Author:** main
- **Type:** style
- **Chapter/Area:** tokens / font infrastructure (affects every chapter)

## Summary

Owner decision: the site uses exactly three families — Fraunces → **Instrument Serif** (display), General Sans → **Switzer** (body), JetBrains Mono → **Inter** (labels). This promotes the v2.1 hero pairing (2026-07-16) to the whole site. Because all usage routes through the five `@theme` font tokens, the swap is a loader/token change plus one weight fix; no section JSX changed.

## Files touched

- `package.json` — removed `@fontsource-variable/fraunces`, `@fontsource/jetbrains-mono`; added `@fontsource/instrument-serif`, `@fontsource-variable/inter`
- `public/fonts/switzer/` — `Switzer-Variable.woff2` promoted from `_candidates/` (100–900), `Switzer-Medium.woff2` deleted
- `src/assets/fonts/` — both General Sans woff2 deleted (dir now empty)
- `src/styles/globals.css` — imports swapped; General Sans @font-face blocks deleted; Switzer @font-face now the variable file; all 5 font tokens repointed (`--font-mono` keeps its utility name but renders Inter)
- `src/components/common/Heading.tsx` — `section` variant `font-light` → `font-normal` (Instrument Serif ships 400 only)
- `index.html` — Switzer preload → variable file
- `src/features/home/utils/hero.tunables.ts` — lead `file` mirror → variable file
- Docs/memory: `CLAUDE.md`, `.claude/rules/project.md`, `.claude/rules/custom-components.md`, `.claude/output-styles/custom-components.md`, `.agents/context/design_system.md` (v2.2 amendment note), `frontend-engineer/MEMORY.md`, `motion-engineer/MEMORY.md` + `hero-refine.md`

## Notable decisions

- One Switzer file (the variable) serves both body and `--font-display-lead` 500 — the Medium static is redundant. Rejected: static 400/500/600 trio (3 requests vs 1).
- Instrument Serif roman comes from fontsource; the italic stays the self-hosted preloaded latin subset (same family name, different `font-style` — no collision). Side effect: `font-display italic` (hero tagline) is now a TRUE italic; the Fraunces faux-slant gotcha is obsolete.
- `font-mono` utility name kept while rendering Inter — renaming would touch 7 files for zero visual effect. Rename to `--font-label` later if it confuses.
- No Switzer italic file wired: zero body-italic usage in src. Add `_candidates/.../Switzer-VariableItalic.woff2` if that changes.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] Runtime (chrome-devtools): exactly 4 font files load (Switzer variable, Instrument Serif italic self-hosted + roman fontsource, Inter fontsource), no 404s, no old-family requests; computed styles confirm body=Switzer 400, hero lead=Switzer 500, tail/tagline=Instrument Serif true italic, labels=Inter; preloader morph runs and lands correctly
- [ ] Lighthouse ≥ 90 (deferred to final QA per plan)

## Follow-ups

- Visual type-scale tune pass: the fluid `--text-*` sizes/tracking were tuned for Fraunces metrics; Instrument Serif is narrower at display sizes. Spot-check SiteMenu (`text-statement`, now 400 instead of 300) and future chapter titles when 04+ build.
- If numerals jitter in `ScrollProgressHUD` (Inter is proportional where JetBrains Mono was fixed-width), add `tabular-nums` to the percentage span.
