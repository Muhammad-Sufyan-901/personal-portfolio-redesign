---
name: update-memory
description: Keep .claude/agent-memory/<agent>/MEMORY.md current with durable project knowledge (patterns, decisions, locations, reusable APIs) after any change that affects them. Memory is knowledge, not a changelog.
---

# update-memory (stub — canonical in `.claude/skills/update-memory/`)

PROCESS skill: the canonical, invokable implementation is `/update-memory [agent]`
(`.claude/skills/update-memory/SKILL.md`) — non-Claude agents read that file directly;
the always-on rule is `rules/memory-context.md`. Keep MEMORY.md tight (first ~200 lines
are auto-injected); overflow lives in linked sibling files.
