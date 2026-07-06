# Workflow Discipline

- **Plan → Approve → Build.** @pm produces `PLAN.md` and PAUSES; no implementation code before the user approves (see `workflows/planning.md`).
- Resolve the open decisions in `product_requirements.md §6` at approval (accent, dark-only, single/multi-page, featured projects, blog).
- Build chapters incrementally `00 → 06`; run `/qa-audit` per chapter, fix, then commit.
- Use subagents (`@motion`, `@frontend`, `@qa`) to keep the main context clean.
- When uncertain about a design/architecture choice, present 2 concise options instead of assuming.
