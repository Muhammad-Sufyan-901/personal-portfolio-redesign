# Content Integrity

> Twin: `.claude/rules/project.md` (Claude Code mirror carrying this rule's content clauses — keep in sync).

- The ONLY content source is `context/product_requirements.md`. There is no old repo in this project.
- Never invent facts (projects, employers, dates, metrics, awards). If a field is unknown → omit it, don't fabricate.
- Microcopy may be re-voiced to read narratively, but the underlying facts stay exact (names, tech, timeframes, links).
- Preserve real URLs (live/repo/social) verbatim.
- Transcribe content into typed constants checked against `src/types/portfolio.ts` — as built they live in `features/home/data/*.data.ts` + `src/constants/projects.data.ts`.

**Why this matters here:** the full dataset is already transcribed (profile, 21 skills, 9 journey items — 4 work + 2 education + 3 awards — 6 projects with real live/repo URLs, 3 contact channels). Any "improvement" that invents a metric, rounds a date, or rewrites a URL corrupts a real person's public CV; the typed contract catches shape errors but only this rule catches fabrication.
