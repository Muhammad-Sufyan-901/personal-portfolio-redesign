---
name: log-change
description: Append a dated history entry to logs/feature-changes/ after any feature/section/component change, before reporting done — every change gets one. Logs are history only; durable knowledge goes to agent memory instead.
---

# log-change (stub — canonical in `.claude/skills/log-change/`)

PROCESS skill: the canonical, invokable implementation is `/log-change <slug>`
(`.claude/skills/log-change/SKILL.md`) — non-Claude agents read that file directly;
the always-on rule is `rules/logging.md` (template: `logs/feature-changes/TEMPLATE.md`).
Why it earns its keep: the log folder is the project's decision trail — e.g. the interim
cobalt-accent choice lives in `2026-07-07-bootstrap-deps-fonts-tokens.md`.
