# About — reference-exact relayout (lukebaffait.fr About beat)

- **Date:** 2026-07-13
- **Author:** main (Claude Code, user revision with reference screenshot)
- **Type:** feat
- **Chapter/Area:** 03 About (+ Profile type/data delta)

## Summary

Relaid chapter 03 to match the supplied lukebaffait.fr About screenshot: a full-viewport composition with the sans statement top-left carrying **Fraunces-italic focal phrases** ("software engineer", "precision and care" — the hero `taglineEmphasis` device generalized), an indented narrow bio, the Download CV link in the reference's small mono "INFO" spot, a `(3+)` marker in the left gutter (reference's "(23)"), and a **large portrait panel filling the right 40vw** with heavily rounded left corners, flush to the viewport's right edge and the section bottom. Per user decision the stats count-up row is gone (reference-minimal); `profile.stats` data stays — the gutter marker is its only surface now.

## Files touched

- `src/types/portfolio.ts` — `aboutStatementEmphasis?: string[]` added to `Profile` (documented as the `taglineEmphasis` device for the About statement).
- `src/features/home/data/profile.data.ts` — `aboutStatementEmphasis: ["software engineer", "precision and care"]`.
- `src/features/home/sections/AboutSection.tsx` — rewrite: pure `emphasize(text, phrases)` module-level splitter → statement segments (base `font-sans text-statement text-paper`, emphasis `font-display italic`; real inline text, so the previous `aria-label`/`aria-hidden` two-tier workaround is gone); `.about-inner` text column `relative z-10` (above the panel) with explicit svh rhythm (`pt-[14svh]`, statement `mt-[5svh] lg:max-w-[63%]`, bio `mt-[12svh] lg:ml-[20%]`, CV `mt-12`); desktop portrait = section-level `absolute top-[12svh] right-0 bottom-0 w-[40vw]` `ParallaxImage` with `rounded-l-[clamp(3rem,9vw,11rem)]`; mobile portrait = stacked `-mx-page-x h-[55svh] rounded-t-[3rem]` block; `(3+)` marker `absolute left-6 top-[55%]`, `aria-label="3+ Years of Experience"`. Deleted: stats `ul`, count-up tween, `RevealText` usage. Veil-landing entrance + `.about-item` stagger unchanged.
- `PLAN.md` — ch. 03 as-built note revised.

## Notable decisions

- Statement reveals as one `.about-item` block — `RevealText` can't wrap the nested emphasis spans (split-type plain-text limitation, documented in frontend memory).
- The desktop panel and gutter marker sit OUTSIDE `.about-inner` (section-level absolutes) so `right-0`/`left-6` measure from the true viewport edge rather than the `px-page-x` padding box; they join the reveal via the `.about-item` stagger instead of the wrapper blur.
- Count-up removal leaves no `textContent`-tween on the page; no other component depended on it.

## Verification

- [x] 1440×900 settled screenshot matches the reference composition (statement/bio/INFO positions, emphasis faces, panel bleed + left rounding, gutter marker)
- [x] 390×844: stacked order, no horizontal scroll
- [x] Reduced motion (puppeteer): About fully visible, statement real text, marker "(3+)", CV link present, stats gone, 0 canvases, 0 errors
- [x] `npx tsc -b`, `npm run lint`, `npm run build` green

## Follow-ups

- The reference look completes when the portrait photo lands at `public/assets/images/portrait.webp` (ideally dark/ember-lit, ~3:4) — the panel renders as the raised placeholder block until then.
