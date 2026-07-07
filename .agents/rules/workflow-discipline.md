# Workflow Discipline

- **Plan → Approve → Build.** @pm produces `PLAN.md` and PAUSES; no implementation code before the user approves (see `workflows/planning.md`).
- Resolve the open decisions in `product_requirements.md §6` at approval (accent, dark-only, single/multi-page, featured projects, blog).
- Build chapters incrementally `00 → 06`; run `/qa-audit` per chapter, fix, then commit — and **stop for user approval after every section** before starting the next (`workflows/section.md`). Planning is whole-site; execution is per-section.
- Use subagents (`@motion`, `@frontend`, `@qa`) to keep the main context clean.
- When uncertain about a design/architecture choice, present 2 concise options instead of assuming.

**Why this matters here:** this rhythm is proven, not aspirational — chapters 00–04 each shipped as one approved, QA'd `feat(<chapter>):` commit with its own log entry. The §6 decisions are partially resolved (accent → ember per design_system v2 §3.2); re-confirm the rest (dark-only, single/multi-page, featured projects, blog, plus v2's serif-vs-grotesk and invert-section placement) at the next planning approval instead of re-litigating mid-build.
