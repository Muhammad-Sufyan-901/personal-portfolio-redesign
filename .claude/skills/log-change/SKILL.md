---
name: log-change
description: Append a dated history entry to logs/feature-changes/ after creating or modifying any feature/section/component, before reporting done — every change gets one, no matter how small. Logs are history only; durable knowledge goes to agent memory instead.
argument-hint: <short-slug describing the change>
---

# /log-change $ARGUMENTS

Create `logs/feature-changes/<YYYY-MM-DD>-$ARGUMENTS.md` from `logs/feature-changes/TEMPLATE.md`, filled from the work just done:

- Inspect what changed: `!\`git status --short\`` and `!\`git diff --stat\``.
- Fill: date, author (agent name), summary (what + why), files touched, notable decisions, follow-ups, and how it was verified (`tsc`/lint/Lighthouse).
- Keep it factual and short. This is **history only** — not project knowledge (durable facts go in agent memory via `/update-memory`).
- Commit the log together with the change it documents.

If multiple related files changed in one unit of work, write ONE entry for that unit (not one per file).

Existing entries (2026-07-06 → 2026-07-07, setup through the journey chapter) are the reference for tone and granularity — one entry per shipped unit, decisions captured inline (e.g. the cobalt-accent choice in `2026-07-07-bootstrap-deps-fonts-tokens.md`). Portable mirror: `.agents/skills/log-change` + `.agents/rules/logging.md`.
