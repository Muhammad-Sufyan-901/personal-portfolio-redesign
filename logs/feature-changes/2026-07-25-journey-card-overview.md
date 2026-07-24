# Journey — card overview line + titled description list

- **Date:** 2026-07-25
- **Author:** main
- **Type:** style
- **Chapter/Area:** 05 Journey (on-screen 08)

## Summary

Owner ask: every card should lead with a descriptive overview, and the existing bullet list should carry a title above it — on education cards too. Two content problems surfaced and were resolved with the owner before building. (1) `summary` and `highlights` said the same thing, because `highlights` had itself been authored in 2026-07-22 as a re-voicing of the verbatim PRD `summary` — rendering both would have restated each bullet. The four work overviews were rewritten one altitude up (role framing) so the two no longer overlap. (2) The PRD has **no coursework data** for either education entry — §3.4 gives institution, major, and period only — so the education lists are blocked on owner-supplied content; the rendering is wired and lights up the moment `highlights` lands on those items.

## Files touched

- `src/features/home/data/journey.data.ts` — 4 work `summary` values rewritten as overviews (see below); header comment now states the `summary` = overview / `highlights` = list contract and why they must sit at different altitudes.
- `src/features/home/sections/JourneySection.tsx` — overview is no longer a fallback (`!item.highlights && item.summary` → `item.summary`); new `Box as="h4"` label above the list, reading "Responsibilities" on work and "Focus Areas" on education; list top margin `mt-5` → `mt-3` now that the label owns the gap.
- `src/types/portfolio.ts` — `highlights` doc comment widened to cover both card kinds.

## Notable decisions

- **Reused `summary`, did not add an `overview` field.** `summary` already means "the card's prose line", and it was *already* an authored re-voice rather than PRD-verbatim on the education items (2026-07-22 precedent) — a parallel field would have been a second name for one thing. PRD traceability is unaffected: §3.3 is two files away and the data header names it.
- **Overviews carry only PRD-derivable framing** — duration from the PRD dates, employer, employment type, and the PRD's own two categories of web work. No metrics, no team size, no claims the PRD doesn't support. The specifics (app names, platforms, ownership) stay in the bullets:
  - Mobile Developer — "Eighteen months building Global Digital Verse's mobile products end-to-end." (Feb 2024 – Aug 2025)
  - Full Stack Web Developer — "Just over two years on Global Digital Verse's web side, split between product platforms and company-profile sites." (May 2023 – Aug 2025; the split is the PRD's own wording)
  - Frontend Developer — "The build half of a four-month ZettaByte internship — the earliest professional work on this timeline." (Jan – Apr 2022, the earliest dated PRD entry)
  - Quality Assurance — "The other half of that same internship — the same two platforms, approached from testing rather than building." (same employer, dates and platforms per PRD)
- **Label is `h4`, not a styled `p`** — it heads the list, and the card already runs h3 (title) under the section h2, so h4 keeps the heading order intact per `.claude/rules/accessibility.md`. Styled in the card's existing mono/uppercase eyebrow grammar but `text-paper` rather than `text-muted`, so it outranks the muted body beneath it and doesn't read as another meta row.
- **One conditional per element rather than a fragment** — the label and the list share the `item.highlights` guard; two sibling checks kept the diff flat and avoided wrapping the block in a `<>` inside an already deeply nested card.
- Education label wording "Focus Areas" and work wording "Responsibilities" chosen by the owner over "Job Description / What I Studied" and "What I Did / What I Studied".

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] In-browser at 1440px: all 6 cards lead with the overview; the 4 work cards show RESPONSIBILITIES above their bullets (3/3/2/2); the 2 education cards render overview only, no empty label.
- [x] Heading order verified h2 → h3 → h4, no level skipped.
- [ ] Lighthouse — not re-run (content/markup only, no new JS).

## Addendum — education Focus Areas drafted (same day)

Owner reaffirmed the ask and authorised drafting: "add a list of what you studied … you can draft the content first; I'll provide the actual content later." Both education items now carry a 3-item `highlights` array, so all 6 cards render the label + list. **No section/type code changed** — the previous pass had already wired the rendering, so this was a data-only edit.

The drafted arrays are **generic curricula, not PRD facts**, and are marked in `journey.data.ts` with a `PLACEHOLDER — owner to replace` comment on each entry naming exactly what to swap. Convention follows `GallerySection.tsx:9`'s `/** PLACEHOLDER — the PRD carries no gallery statement … */` const, the repo's existing precedent for unavoidable non-PRD copy.

- STIKOM Bali (Information Systems): database systems / systems analysis and design / web application development and IS management.
- TI Bali Global (Software Engineer): programming fundamentals and OOP / database design and web application development / mobile application development and software project basics.

## Follow-ups

- **Owner to replace both education `highlights` arrays** with the real subjects, ideally adding them to PRD §3.4 first so the data layer returns to transcription-only. Strings swap 1:1; no code change needed.
- The four work overviews are authored re-voicings — worth an owner read-through before they ship publicly.
