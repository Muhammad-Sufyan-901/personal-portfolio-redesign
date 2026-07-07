---
name: log-change
description: Append a dated history entry to logs/feature-changes/ after any feature/section/component change, before reporting done. Portable mirror of the invokable .claude/skills/log-change.
---

# Log a Feature Change (portable)

**What it does:** creates `logs/feature-changes/YYYY-MM-DD-<slug>.md` from `TEMPLATE.md` — date, author, what + why, files touched, decisions, follow-ups, verification. One entry per unit of work, committed together with the change it documents.

**When to use:** every feature create/change, no matter how small — this is the always-on rule in `rules/logging.md`. Logs are **history only**; durable knowledge goes to agent memory via `update-memory` instead.

**Why it earns its keep here:** the 12 existing entries (2026-07-06 setup → 2026-07-07 journey) are the project's decision trail — e.g. the interim cobalt-accent choice lives in `2026-07-07-bootstrap-deps-fonts-tokens.md`.

(Claude Code: `/log-change <slug>`.)
