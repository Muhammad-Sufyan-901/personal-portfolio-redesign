# Feature-change logging (portable rule)

> Twin: `.claude/rules/logging.md` (Claude Code mirror — same rule, keep in sync).

After any agent creates or changes a feature/section/component, before reporting done: append a log entry to `logs/feature-changes/` (`YYYY-MM-DD-<slug>.md`, from `TEMPLATE.md`) describing what changed, why, files touched, and how it was verified. Logs are **history only** — not project knowledge. Commit the log with the change. (Claude Code users: run `/log-change`.)

**Why this matters here:** the 12 entries written so far (2026-07-06 setup → 2026-07-07 journey) are the project's only decision trail outside git messages — e.g. the interim cobalt-accent choice and the `src/index.css` → `src/styles/globals.css` move both live in `2026-07-07-bootstrap-deps-fonts-tokens.md`. Skill mirror: `skills/log-change`.
