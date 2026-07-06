# Feature-change logging (portable rule)

After any agent creates or changes a feature/section/component, before reporting done: append a log entry to `logs/feature-changes/` (`YYYY-MM-DD-<slug>.md`, from `TEMPLATE.md`) describing what changed, why, files touched, and how it was verified. Logs are **history only** — not project knowledge. Commit the log with the change. (Claude Code users: run `/log-change`.)
