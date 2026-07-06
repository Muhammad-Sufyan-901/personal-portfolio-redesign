# Agent memory as project knowledge (portable rule)

`.claude/agent-memory/<agent>/MEMORY.md` (project scope, committed) holds durable knowledge about this project — real folder layout, custom-component API, conventions, decisions, DRY patterns. Read it before building; update it after any change that introduces/revises a pattern, decision, location, or reusable util. It is knowledge, not a changelog (history lives in `logs/`). Reuse what memory already documents instead of duplicating it. (Claude Code users: `/update-memory`.)
