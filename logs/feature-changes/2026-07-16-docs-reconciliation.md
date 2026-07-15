# Agent docs reconciled to as-built state + reference evidence

- **Date:** 2026-07-16
- **Author:** main
- **Type:** docs
- **Chapter/Area:** all agent-facing documentation (no src/ changes)

## Summary

Every agent-facing doc except PLAN.md still told the pre-reset story ("chapters 00–04 on
interim cobalt, ember re-theme pending, Header/MobileMenu, seven primitives, 7-chapter
map"). This sweep reconciled ~30 files to verified reality (00–03 shipped on the PLAN v3.1
10-chapter map, ember live, Fraunces display, dark-only, 14 primitives incl. PathDraw,
MenuButton/MenuPopout/SiteMenu chrome), absorbed the measured typography + section-timing
evidence from `reference/breakdown_analysis.md`, and deepened the thin layers (roles,
rule-mirror twins, memory index).

## Files touched

- **Canonical status paragraph** (verbatim copies): `AGENTS.md`, `.agents/agents.md`,
  `CLAUDE.md`, `GEMINI.md`, `README.md` — plus the stale-claim sweep in each (chapter
  lists, primitives rosters, chrome names, structure trees, theme/light-mode notes).
- `.agents/context/design_system.md` — header reconciliation note; §3.0b timing corrections
  + banner naming `breakdown_analysis.md §5` the single timing map; §4 measured typography
  roster (Breton / `other`=Machine.otf / Inter / Zirena, with [measured]/[named] tags +
  mapping rationale); §11 re-keyed to the 10-chapter map with supersession banner and
  as-built deltas; internal §11.x cross-refs updated.
- `.agents/context/product_requirements.md` — §6.1 trailing note corrected (ember live).
- `.agents/context/system_architecture.md` — layouts tree line (as-built chrome names).
- `reference/REFERENCE-NOTES.md` — section map replaced by a pointer to breakdown §5.
- `.agents/roles/*.md` (4) — rewritten: authoritative inputs, DoD pointer, 2–4 real
  pitfalls each (from agent memory), stale as-built lines removed.
- `.agents/workflows/{section,planning,qa,design-system}.md` — stale status/order fixes.
- `.claude/agents/{frontend-engineer,motion-engineer,qa-auditor}.md` — as-built maps fixed.
- Rules mirrors (16 files) — every pair now carries a "Twin:" header; stale bits fixed in
  `.claude/rules/{motion,react-typescript,accessibility,tailwind-styling,custom-components,project}.md`
  and `.agents/rules/{motion-safety,workflow-discipline,commit-rules,accessibility-performance,code-quality,content-integrity,logging,memory-context}.md`.
- Skills — `.claude/skills/{plan-redesign,qa-audit}/SKILL.md`,
  `.agents/skills/{tailwind-v4-shadcn,scrollytelling,plan-redesign,accessibility-reduced-motion}/SKILL.md`.
- Memory — `frontend-engineer/MEMORY.md` (internal contradictions fixed + reconciliation
  decisions-log line), `motion-engineer/MEMORY.md` (dead chrome names, stale upgrade list),
  `agent-memory/README.md` (new index table).

## Notable decisions

- **Canonical status paragraph lives in `AGENTS.md`** and is copied verbatim (never
  paraphrased) into agents.md/CLAUDE.md/GEMINI.md/README.md — update all copies together.
- `breakdown_analysis.md §5` is the **single** reference section-timing map; design_system
  §3.0b and REFERENCE-NOTES point at it.
- "cobalt" survives only as: unchosen-alternate notes, PLAN's stale-note pointer, and
  history pointers to the decision log — zero "shipped/current/pending" claims remain.
- The typography roster uses the **measured** families (Breton/`other`/Inter/Zirena) over
  the task-prompt's detector names — Zalando Sans is loaded nowhere [measured].

## Verification

- [x] `grep "03 Craft"` (old 7-chapter map) → logs/ only
- [x] 10-chapter map with identical numbering in all core docs
- [x] cobalt grep → alternates/history-pointers only (each surviving hit audited)
- [x] every rule mirror names its twin; every role cites inputs + DoD + pitfalls
- [x] `git diff --stat -- src/` → 0 (docs only)
- [ ] tsc/lint — n/a (no source changes)

## Follow-ups

- `.agents/skills/` not re-audited line-by-line beyond grep hits — if a future pass finds
  more pre-reset narration in convention skills, fix against the canonical paragraph.
- design_system §11's per-chapter prose is now technique-only; PLAN v3.1 §3 is build truth.
