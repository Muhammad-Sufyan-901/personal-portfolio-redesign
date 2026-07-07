# Design system: measured palette adopted + video→frame reference pipeline

- **Date:** 2026-07-07
- **Author:** main
- **Type:** docs
- **Chapter/Area:** design system (Void & Ember v2), reference tooling, residual palette propagation

## Summary

Verified and closed out the adoption of the *measured* "Void & Ember" design system (v2 of `.agents/context/design_system.md`, grounded in a 47-frame color/brightness analysis of `reference/lukebaffait-scroll.mp4` plus a live-site cross-check). The v2 doc and the repo-wide palette propagation had already landed in the agents-kit enrichment commit `dcf2a21`; this pass verified that work end-to-end, set up the local video→frame pipeline (installed ffmpeg, extracted stills to `reference/frames/` — gitignored by design), and fixed the last four places that still presented the old palette as current.

## Files touched

- `.agents/context/system_architecture.md` — DoD focus-ring item: "brass ring" → accent/ember ring (token-driven).
- `PLAN.md` — supersession banner (palette decision moved to ember, design_system v2 §3.2; remaining scope re-planned at next `/plan-redesign`); three "brass" technique mentions → accent/ember wording.
- `.claude/agent-memory/frontend-engineer/MEMORY.md` — "accent = COBALT (decided)" → interim cobalt, superseded by ember.
- `.claude/agent-memory/motion-engineer/MEMORY.md` — "brass active-nav dot" → accent; cobalt framing → pre-migration, ember authoritative.
- *(local, untracked)* `reference/frames/frame_*.png` — extracted at `fps=1/2` per `.agents/skills/reference-capture`; the reference site's own upper-right section label is ground truth for chapter mapping.

## Notable decisions

- **Verification-first:** PROMPT B's Tasks 3–4 were largely already done (commit `dcf2a21` committed the v2 rewrite and propagated ember across all root docs, rules, skills, roles, and agents); this pass re-ran the classification grep and fixed only true stragglers.
- **False positive noted:** `.claude/skills/design-taste-frontend/SKILL.md`'s "brass" hits are the vendored skill's *generic* anti-beige+brass design bans — unrelated to this project's old palette; vendored internals stay untouched.
- **Left as-is (legitimate):** design_system.md's own brass/cobalt "documented alternates", supersession notes across the kit, the verbatim historical commit title quoted in `.agents/workflows/design-system.md`, and all historical logs (incl. `2026-07-07-docs-expand-detail.md`, correct for its timestamp).
- **Open decision flagged for PROMPT C planning:** typography (design_system §4.1) — the video shows a clean grotesk display face; default recommendation keeps Fraunces. Must be surfaced at planning approval.

## Verification

- [x] `npx tsc --noEmit` clean (docs + local tooling only; no `src/` changes)
- [x] `npm run lint` clean
- [x] Re-ran `grep -rln "C8A46A|ECE8E1|0B0B0F|Warm Ink|Warm-Ink|brass|Brass" --include="*.md" .` — remaining hits are only alternates/supersession notes/history/vendored generics
- [x] `.claude/skills/*` + `.agents/skills/*` frontmatter valid; skill sets reconciled (9 ↔ 18); `git diff --stat b245c1e..HEAD` shows no content shrink beyond the v1→v2 design_system rewrite
- [x] `ffmpeg -version` works; `reference/frames/` populated (~47 stills)

## Follow-ups

- PROMPT C: re-plan remaining scope (Work 05, Contact 06, ember re-theme of `src/styles/globals.css`, v2 motion upgrades — bold path draw, hero aurora, optional footer ornament), resolving the typography decision at approval.
