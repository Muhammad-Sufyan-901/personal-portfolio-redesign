---
description: Write a feature-change log entry to logs/feature-changes/ after creating or modifying a feature/section/component.
argument-hint: <short-slug describing the change>
---

# /log-change $ARGUMENTS

Create `logs/feature-changes/<YYYY-MM-DD>-$ARGUMENTS.md` from `logs/feature-changes/TEMPLATE.md`, filled from the work just done:

- Inspect what changed: `!\`git status --short\`` and `!\`git diff --stat\``.
- Fill: date, author (agent name), summary (what + why), files touched, notable decisions, follow-ups, and how it was verified (`tsc`/lint/Lighthouse).
- Keep it factual and short. This is **history only** — not project knowledge (durable facts go in agent memory via `/update-memory`).
- Commit the log together with the change it documents.

If multiple related files changed in one unit of work, write ONE entry for that unit (not one per file).
