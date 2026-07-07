# Agents-kit enrichment: deepen skills/rules/workflows, reconcile skill sets

- **Date:** 2026-07-07
- **Author:** main
- **Type:** docs
- **Chapter/Area:** `.claude/` + `.agents/` agent kit (docs/config only — no `src/` changes)

## Summary

Enriched every skill, rule, role, workflow, and agent file in `.claude/` and `.agents/` with project-grounded specifics (real prop surfaces from `src/components/common/*`, real versions from `package.json`, as-built chapter status, log references), and reconciled the two skill sets so both sides describe the same capability set. Adopted design_system.md v2 ("Void & Ember", ember accent `#E8380F`) as authoritative throughout — the shipped cobalt tokens are documented as pre-migration state — and corrected the "not yet bootstrapped" boundary that the same-day bootstrap→journey logs had superseded. Added the new `animated-ui-references` skill (both sides) from design_system v2 §7.5.

## Files touched

- `.claude/rules/{project,react-typescript,tailwind-styling,motion,custom-components,logging,memory-context}.md` — expanded with real versions/paths/prop surfaces + "Why this matters here" grounding; **new** `accessibility.md` (mirrors `.agents` a11y knowledge).
- `.claude/output-styles/custom-components.md` — real prop tables, 7 motion primitives added, token-clean example (was `bg-slate-*`), Heading/twMerge + ThemeToggle-barrel gotchas.
- `.claude/agents/{frontend-engineer,motion-engineer,qa-auditor}.md` — concrete as-built paths, current-vs-planned boundary, `animated-ui-references` references, qa puppeteer-fallback note.
- `.claude/commands/{add-shadcn,commit,typecheck}.md` — ember focus note, real commit-history examples, toolchain context.
- `.claude/workflows/README.md` — per-section approval-gate rhythm documented.
- `.claude/skills/{build-section,plan-redesign,qa-audit,log-change,update-memory,discover-tooling}/SKILL.md` — as-built status, gates, cross-references; **new** `.claude/skills/animated-ui-references/SKILL.md`.
- `.agents/skills/*` — 10 existing skills enriched (stale brass/`#0B0B0F` values corrected to ember/`#0A0A0A` with supersession notes; as-built sections added); **new**: portable mirrors `{plan-redesign,build-section,qa-audit,log-change,update-memory}`, pointer stubs `{impeccable,design-taste-frontend}`, and `animated-ui-references`.
- `.agents/roles/*.md` (4) — brought to `.claude/agents` depth: memory/logging discipline, as-built paths, remaining scope.
- `.agents/rules/*.md` (8) — "Why this matters here" lines; brass focus ring → ember (supersession noted).
- `.agents/workflows/{planning,design-system,section,qa}.md` — whole-site planning vs per-section execution with stop-for-approval gate after every section; design-system workflow marked already-run.
- `.agents/agents.md` — full 18-skill roster (convention / process / third-party-pointer tiers), build status, per-section gate.
- `.agents/context/design_system.md` — committing the v2 "Void & Ember" rewrite (evidence-sampled palette, §3.0/§3.0b/§3.1b/§7.5) that this pass depends on.
- `.agents/context/product_requirements.md` — §6.1 accent decision annotated resolved → ember.
- `.agents/context/system_architecture.md` — as-built status note (spec unchanged).

## Notable decisions

- **Ember `#E8380F` is authoritative** (user decision): all kit docs cite the v2 palette; shipped cobalt = pre-migration state; brass/cobalt remain documented alternates. Re-theme itself is deferred (src untouched).
- **Skill-set reconciliation shape:** convention skills stay `.agents`-only with enriched `.claude/rules` mirrors; process skills get concise `.agents` prose mirrors; vendored toolkits get `.agents` pointer stubs (never copied). Skill counts: `.claude/skills` 8→9, `.agents/skills` 10→18.
- **Execution rhythm codified:** planning whole-site, execution one section at a time with an approval gate after *every* section.
- Additive-only: no file lost content; stale values corrected with the superseded value noted.

## Verification

- [x] `npx tsc --noEmit` clean (docs-only pass; no `src/` changes)
- [x] `npm run lint` clean
- [ ] reduced-motion / a11y checked (n/a — no UI change)
- [ ] Lighthouse ≥ 90 (n/a — no section shipped)
- [x] `git diff --stat` reviewed: only `.claude/`, `.agents/`, `logs/feature-changes/` in commit 1

## Follow-ups

- Root docs (README/CLAUDE.md/gemini.md/AGENTS.md) re-sync — next commit in this pass.
- `src/` items noticed, not fixed here: `package.json` name still `react-ts-enterprise-boilerplate`; ember re-theme of `src/styles/globals.css` pending; `src/lib/emailjs.ts` absent (Contact chapter); `ThemeToggle` not re-exported from the common barrel.
