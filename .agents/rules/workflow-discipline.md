# Workflow Discipline

> Twin: `.claude/rules/project.md` (Claude Code mirror carrying this rule's workflow clauses — keep in sync).

- **Plan → Approve → Build.** @pm produces `PLAN.md` and PAUSES; no implementation code before the user approves (see `workflows/planning.md`).
- Decisions live in the `PLAN.md §6` ledger (PRD §6 + v2 items are all resolved; PLAN decisions 9–15 carry approved defaults overridable at their chapter's gate).
- Build chapters incrementally `00 → 08` + Footer (the PLAN v3.1 §0 10-chapter map); run `/qa-audit` per chapter, fix, then commit — and **stop for user approval after every section** before starting the next (`workflows/section.md`). Planning is whole-site; execution is per-section.
- Use subagents (`@motion`, `@frontend`, `@qa`) to keep the main context clean.
- When uncertain about a design/architecture choice, present 2 concise options instead of assuming.

**Why this matters here:** this rhythm is proven, not aspirational — chapters 00–03 each shipped as one approved, QA'd `feat(<chapter>):` commit with its own log entry (twice over, counting the pre-reset pass). Every foundational decision is closed and recorded in `PLAN.md §6` (ember, dark-only, single-page, featured 5, Fraunces, invert = 08 Contact, no blog) — don't re-litigate them mid-build; per-chapter defaults (decisions 9–15) are overridable only at that chapter's gate.
