# Projects revision — 12 entries, glass badges, white titles, cursor pill, tilted preview meta

- **Date:** 2026-07-20
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 04 Projects (+ common `Cursor`)

## Summary
Owner-requested revision of the Projects index: the data layer grew from 6 to 12 entries (6 new real projects pulled from github.com/Muhammad-Sufyan-901, owner-approved — the PRD only holds 6), all descriptions expanded to 2–3 sentences (Claude-drafted, owner-reviewed), tech badges became fully-rounded glass pills, row titles are always paper-bright, and the sticky preview gained a Luke-Baffa-style hover interaction: the custom cursor morphs into a white "See Project" pill over the panel, and the counter + "Preview" meta row moved inside the tilt group so it tilts with the image.

## Files touched
- `src/data/projects.data.ts` — 6 GitHub entries appended (`featured: false`), all 12 descriptions expanded, provenance header split (PRD §3.6 vs GitHub 2026-07-20)
- `src/features/home/utils/tech-icons.ts` — +11 Simple Icons mappings (Flutter, Dart, Laravel, PHP, Inertia, React Native, Expo, TypeScript, Supabase, Node JS, GSAP); Blade deliberately unmapped (no Simple Icon → text-only pill)
- `src/features/home/utils/projects.tunables.ts` — `indents` extended 6 → 12
- `src/features/home/sections/ProjectsSection.tsx` — badge classes → light-glass pill; title always `text-paper-bright` (transition narrowed to scale); preview restructured: `pointer-events-auto` sticky wrapper with `data-cursor="See Project"`, new `.projects-preview-tilt` group wrapping meta row + frame; tilt useGSAP retargeted to the group; meta label renders `project.year ?? counter` (year-ready); row links retitled `VIEW` → `View Project`
- `src/components/common/Cursor.tsx` — pill mode: labeled targets render the ring as an auto-width paper pill (`bg-paper text-ink`, no mix-blend) instead of scale-2.4 circle; separate `useGSAP` keyed on `label` re-bakes `xPercent` centering (GSAP caches element width) + back.out pop-in

## Notable decisions
- Badge glass = the MenuButton light-glass recipe (`border-paper/15 bg-paper/10 backdrop-blur-md`), not the stat card's literal `bg-ink/40` — dark glass is invisible over the ink page background. Owner may still prefer darker glass; revisit at review.
- Preview stays non-clickable (`aria-hidden` decorative; the row is the real link — a focusable link inside aria-hidden would be an a11y bug). The pill is cursor feedback only.
- Pill sizes itself via `w-auto` + conditional classes — no width measuring/tweening; GSAP only animates scale/alpha (scaling a sized pill would blur the label).
- `path.d` left untouched at 12 rows — curves span ~2 rows now, judged fine in browser.
- Year label deferred: left slot renders `year ?? pad2(counter)` so real years drop in with a data-only change.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — RM: 12 rows bright + expanded, preview hidden, cursor absent; QA greps (raw hex / bare tags) clean
- [x] Live-checked via chrome-devtools MCP: 12 rows + layers, header "(12)", pill "See Project" over preview (auto-width, paper bg, no mix-blend, centered), circle revert on plain hover, "View Project" on rows, tilt matrix on `.projects-preview-tilt`, all new badge icons render (Blade text-only)
- [ ] Lighthouse ≥ 90 (deferred to final QA — no new heavy assets)

## Follow-ups
- Owner review of the 12 drafted descriptions + 6 GitHub stack lists (content gate).
- Real `year` values + thumbnails still pending owner-supplied data/assets.
- Retune `indents`/`path.d` only if the taller list reads lanky after content review.
