# Root docs re-sync: as-built state + reconciled skill inventory

- **Date:** 2026-07-07
- **Author:** main
- **Type:** docs
- **Chapter/Area:** README.md, CLAUDE.md, gemini.md, AGENTS.md

## Summary

Re-synced the four root docs to the enriched `.claude`/`.agents` kit (commit `dcf2a21`) and to reality: the previous docs pass (`4cf5324`) predated the bootstrap and chapter builds, so all four still claimed the motion stack was uninstalled, `src/types/` empty, tokens unapplied, and `src/index.css` present — all false since the same-day bootstrap→journey commits. Docs now state: chapters 00–04 built, full stack installed (with versions), tokens applied in `src/styles/globals.css`, palette = "Void & Ember" v2 authoritative (ember `#E8380F`) with shipped cobalt as pre-migration state, and the post-reconciliation skill inventory (9 `.claude` + 18 `.agents`, incl. `animated-ui-references`).

## Files touched

- `README.md` — status → built-through-04; stack table merged (no more "not present yet" tier); chapters table gains status column; design language → Void & Ember target + cobalt shipped; real project tree (styles/, store/, config/, sections/, motion primitives); docs section names the skill counts.
- `CLAUDE.md` — "Repo state" rewritten to as-built + true pending list (05/06, emailjs.ts, ember re-theme, v2 motion upgrades); versions added; component table gains the 7 motion primitives + Heading/twMerge gotcha; Styling/State/Types sections updated (globals.css, useUIStore, live portfolio.ts); agent-rules section gains animated-ui-references + accessibility.md; skill inventory updated.
- `gemini.md` — same corrections as CLAUDE.md, plus a new "Skills & knowledge (portable)" roster section (it previously had none).
- `AGENTS.md` — two-layer trees updated (18/9 skills, accessibility rule, memory siblings); workflow marks bootstrap done + per-section approval gates + build status; skills section split invokable vs portable; MCP note on qa-auditor's chrome-devtools limitation.

## Notable decisions

- Kept the summarize-and-point convention — root docs cite counts/values and link to `.agents/context/*` + `.claude/rules/*` for depth.
- Current-vs-planned honesty preserved but with the *new* boundary: built 00–04 on cobalt / spec target ember / 05–06 + re-theme pending.

## Verification

- [x] `npx tsc --noEmit` clean (docs only)
- [x] `npm run lint` clean
- [ ] reduced-motion / a11y checked (n/a)
- [ ] Lighthouse ≥ 90 (n/a)
- [x] Four docs mutually consistent (same status, palette framing, skill counts)

## Follow-ups

- `src/` items still open (noted, not fixed): `package.json` name `react-ts-enterprise-boilerplate`; ember re-theme of `globals.css`; `src/lib/emailjs.ts`; `ThemeToggle` barrel export.
