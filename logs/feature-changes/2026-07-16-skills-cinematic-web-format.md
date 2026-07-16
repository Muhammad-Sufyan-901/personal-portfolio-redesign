# Skills: adopt cinematic-web format + install cinematic-web

- **Date:** 2026-07-16
- **Author:** main
- **Type:** chore
- **Chapter/Area:** skill trees (`.agents/skills/`, `.claude/skills/`) — no src/ changes

## Summary

Installed the vendored `cinematic-web` skill (with a mandatory `ADAPTATION.md` since its
single-file/CDN archetype conflicts with repo law) and normalized both skill trees to its
format under the two-kind architecture: KNOWLEDGE canonical in `.agents/skills/`, PROCESS
canonical in `.claude/skills/`, VENDORED full-impl only in `.claude/skills/` — every skill
now resolves to exactly one canonical + one thin stub (impeccable pattern). Both trees
list the identical 19-skill set.

## Migration table

| Skill | Kind | Canonical home | Action |
| --- | --- | --- | --- |
| cinematic-web | vendored | `.claude` | **installed** (copy, `[Repo append]` description note, ADAPTATION.md, `.agents` stub) |
| impeccable | vendored | `.claude` | **untouched** (both sides — verified empty diff) |
| design-taste-frontend | vendored | `.claude` | **split** — 1206L → 120L router + 13 `references/*.md` (sed line-range extraction, 100% coverage; §13–14 inline); `.agents` stub refreshed |
| plan-redesign | process | `.claude` | merged (extractor pointer, 00→08 order) + normalized + `.agents` stubbed |
| build-section | process | `.claude` | merged (10-map argument-hint, 00–03 status, PathDraw, cinematic-web pointer) + `.agents` stubbed |
| qa-audit | process | `.claude` | merged (log-exists check, never-edits clause) + normalized + `.agents` stubbed |
| log-change | process | `.claude` | normalized (name + trigger-rich description) + `.agents` stubbed |
| update-memory | process | `.claude` | normalized + `.agents` stubbed |
| discover-tooling | process | `.claude` | normalized (+ cinematic-web in already-adopted) + `.agents` stubbed |
| animated-ui-references | knowledge | `.agents` | merged (§11.5 re-key, Gallery, cinematic-web cross-ref) + `.claude` stubbed |
| reference-capture | knowledge | `.agents` | refreshed (scripts pointer to `reference/scripts/*`, rebuilt-sets story) + `.claude` stub created |
| scrollytelling | knowledge | `.agents` | description re-keyed to the 10-map + `.claude` stub created |
| gsap-lenis-motion, tailwind-v4-shadcn, typescript-react-strict, tanstack-router, vite-setup, accessibility-reduced-motion, seo-meta | knowledge | `.agents` | stayed single-file (≤36L, split threshold not met); `.claude` stubs created |

## Files touched

New: `.claude/skills/cinematic-web/**` (10 vendor files + ADAPTATION.md),
`.claude/skills/design-taste-frontend/references/` (13), 9 `.claude` knowledge stubs,
`.agents/skills/cinematic-web/SKILL.md`. Rewritten: 7 `.agents` process/adaptation stubs,
design-taste-frontend router. Edited: skill indexes in `.agents/agents.md`, `AGENTS.md`,
`CLAUDE.md`, `GEMINI.md`; frontend-engineer MEMORY decisions log.

## Notable decisions

- Split threshold honored: only design-taste-frontend crossed ~80L; all 12–36L skills stay
  single-file — no fabricated references/ folders.
- design-taste-frontend split done by `sed` line ranges from its own headings — vendor text
  byte-preserved, zero restating (original snapshot kept in session scratchpad).
- framer-motion greps: `cinematic-web` vendor files contain **zero** mentions (the one hit
  is our own ADAPTATION.md ban line); design-taste-frontend's single vendor mention (its
  Motion-library default in `references/architecture-conventions.md`) is kept as vendor
  text and overridden by the `.agents` stub's project-overrides note.
- Root `cinematic-web/` drop: deletion was permission-denied for the agent — owner runs
  `rm -rf cinematic-web` (already copied intact).

## Verification

- [x] `diff <(ls .agents/skills) <(ls .claude/skills)` → identical, 19 each
- [x] `git diff --stat` on both impeccable dirs → empty
- [x] every SKILL.md (38) has `name:` + `description:` frontmatter
- [x] design-taste-frontend router routes all 13 references; extraction sums to the full 1207 lines
- [x] `git diff --stat -- src/` → 0

## Follow-ups

- Owner: `rm -rf cinematic-web` (root drop).
- When a chapter first uses a cinematic-web pattern, note the concrete mapping in
  motion-engineer memory.
