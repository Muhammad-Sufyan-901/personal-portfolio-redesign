# logs/feature-changes/

Append-only history of feature creates/changes. One entry per unit of work, named `YYYY-MM-DD-<slug>.md`, from `TEMPLATE.md`. Written via `/log-change` (or by any agent per `.claude/rules/logging.md`) and committed alongside the change.

**Logs are history, not knowledge.** They record *what happened*. Durable *knowledge about the project* (conventions, APIs, decisions, DRY patterns) lives in `.claude/agent-memory/` and is what agents read to keep code clean and on-context.
