# 09 Achievements — awards extracted from Journey into a reference-matched wipe table

- **Date:** 2026-08-25
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 09 Achievements (new) · 08 Journey (awards removed)

## Summary

The three PRD §3.5 awards lived inside 08 Journey as ember hover-pills backed by a Radix HoverCard
whose entire body was `PLACEHOLDER —` text — §3.5 carries title/issuer/date and nothing else, so the
form was asking for content the PRD does not have. The owner supplied `reference/achievement-refine.mp4`
(lukebaffait.fr's standalone "Awards & Misc" section) and asked for a new **Achievements** section under
Experience with that UI, with the awards moved out of Journey.

The reference form is a flat table needing exactly three facts per row, so the extraction deletes six
placeholder strings rather than relocating them. Journey drops to 6 items (4 work + 2 education).

## Files touched

**New**
- `src/features/home/data/achievements.data.ts` — 3 entries from PRD §3.5, most-recent-first (index reads 01→03 top-down)
- `src/features/home/utils/achievements.tunables.ts` — `ACHIEVEMENTS.reveal` (start/end/duration/ease/idleOpacity)
- `src/features/home/sections/AchievementsSection.tsx` — the section

**Edited**
- `src/types/portfolio.ts` — added `Achievement`; narrowed `JourneyKind` to `"work" | "education"`
- `src/features/home/data/journey.data.ts` — removed the 3 `kind: "award"` entries (9 → 6)
- `src/features/home/sections/JourneySection.tsx` — removed the award branch (112 lines), the `Award`
  + `HoverCard*` imports, and `cardOrdinal` (now the identity map → `index % 2`); the reveal tween's
  `side ?` ternaries collapsed since every row carries `data-side`
- `src/features/home/utils/journey.tunables.ts` — removed `reveal.awardY`
- `src/features/home/pages/HomePage.tsx` — mounted between Journey and Articles
- `src/constants/navigation.constant.ts` — `#achievements` anchor (ScrollProgressHUD picks it up automatically)
- `src/features/home/sections/ArticlesSection.tsx` / `ContactSection.tsx` — eyebrows renumbered 09→10, 10→11
- `src/components/ui/hover-card.tsx` — **deleted** (Journey's award pill was its only call site)
- `src/styles/globals.css` — removed `--animate-hover-card` + both `hover-card-in` keyframe blocks
- Docs corrected (each asserted awards live in Journey): `CLAUDE.md`, `GEMINI.md`, `README.md`, `PLAN.md`,
  `.agents/rules/content-integrity.md`, `.agents/context/design_system.md`,
  `.agents/context/product_requirements.md`, `.agents/roles/project_manager.md`,
  `.agents/skills/typescript-react-strict/SKILL.md`

## Notable decisions

- **`mix-blend-difference`, not a duplicated clipped row.** The reference inverts the row text *mid-glyph*
  at the bar's moving edge (frame `burst/b_06`: "17 05" ink while "2026" is still dim). One blend layer
  does it in a class + a `scaleX` tween; the alternative duplicates the whole row and syncs a clip.
  Rejected the duplicate as ~3× the markup for the same pixels. Fallback if compositing ever misbehaves:
  `clip-path: inset(0 100% 0 0)` on an `aria-hidden` ink copy.
- **Two constraints fall out of that and are load-bearing:** the section root needs `isolate` (the blend
  must resolve against this section's own `bg-ink`, not the page), and **no coloured text may sit under
  the bar** — `accent-deep` differences to cyan. The ember hover tick is therefore a sibling rendered
  *after* the bar.
- **`toggleActions: "play reverse play reverse"` per row**, not a staggered timeline. The reference empties
  a row once its top passes ~22% of the viewport and refills it on the way back; that one string is the
  whole behaviour. The top-down wave is emergent — rows are ~91px apart, so each crosses its own trigger
  line in sequence. Owner picked this over fill-once.
- **Settled state is the FILLED row**, so the markup renders filled and the motion branch sets the idle
  state. Reduced motion therefore falls through to a readable static light table (verified).
- **4 columns = index + 3 facts.** The reference's 4th column is the awarded site; we have no equivalent
  and inventing one violates content-integrity. A zero-padded ordinal is house style (Gallery/Articles
  `pad2`) and adds no content. Owner picked this over a 3-column layout.
- **Heading is a statement, not a section name** (two owner asks, same day). It carries Journey's h2 weight
  and size (`font-display-lead text-statement` — Switzer 400, 52px at 1440, verified pixel-identical to
  `.journey-statement`) and the house StatementWords grammar: `ACHIEVEMENTS_STATEMENT` in the data file
  (ARTICLES_STATEMENT precedent), split at module scope into React-owned word spans with `font-display-tail
  italic` focal words. The eyebrow already says RECOGNITION, so the h2 does the telling. Copy is re-voiced
  from §3.5 facts only — two completed bootcamps, one competition placing; the closing clause is framing in
  Gallery's register, anchored on the PRD §2 bio's own "keep learning something new". Renders 3 lines at
  `max-w-[30ch]`, left-aligned (Journey centres its own because it sits over a centred timeline).
- **No blur de-veil on the statement**, unlike Journey/Gallery/Articles. The rows already own this
  viewport's reveal; two staggered entrances competing in one screen reads as noise. Deliberate, not missed.
- No cursor-following thumbnail — the reference floats a screenshot per row and we have no award imagery.

## Verification

- [x] `npx tsc --noEmit -p tsconfig.app.json` clean — **note:** bare `npx tsc --noEmit` is a NO-OP in this
      repo (root `tsconfig.json` is solution-style with `files: []`). Use `-p tsconfig.app.json` or `npm run build`.
- [x] `npm run lint` clean
- [x] `npm run build` clean
- [x] no raw hex / no bare tags in the new files
- [x] reduced motion — forced via a `matchMedia` init script: all rows render filled at opacity 1, no tweens
- [x] all five scroll states measured in-browser: idle (0 / .6) → mid-sweep (staggered partial) →
      settled (1 / 1) → exited past `end` (retracted to 0) → refilled on scroll-back
- [x] mid-sweep screenshot `.artifacts/ach-midsweep.png` — "Bootcam|p" splits ink/paper on the bar edge
- [x] mobile 390×844: no horizontal overflow, rows stack to `[index | org / title / date]`
- [x] Journey: 6 rows, all `data-side`, no award text
- [x] Lighthouse (desktop, snapshot): A11y 96 · Best Practices 100 · SEO 100. The 4 failures are all
      pre-existing (About stat `aria-label`s, Articles link name-mismatch, llms.txt) — none in this section
- [x] console clean apart from the pre-existing `THREE.Clock` deprecation warning

## Follow-ups

- If the owner supplies award/certificate imagery, the cursor-following preview from the reference drops in
  without touching the reveal.
- `--color-invert-bg` now has two consumers (10 Contact's circle wipe + these rows); it is no longer
  "reserved for Contact".
