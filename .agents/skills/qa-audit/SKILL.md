---
name: qa-audit
description: Run the Definition of Done (types, lint, hygiene greps, a11y, reduced-motion, performance, SEO) for one chapter or the whole site and write findings to .artifacts/qa-log.md. Use per section before its approval gate, and once globally at the end.
---

# qa-audit (stub — canonical in `.claude/skills/qa-audit/`)

PROCESS skill: the canonical, invokable implementation is `/qa-audit [chapter|all]`
(`.claude/skills/qa-audit/SKILL.md`) — non-Claude agents read that file directly; the
full checklist is `system_architecture.md §8` (workflow: `workflows/qa.md`). The auditor
never edits feature source; findings land in `.artifacts/qa-log.md` with severity + fix.
