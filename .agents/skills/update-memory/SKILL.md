---
name: update-memory
description: Keep .claude/agent-memory/<agent>/MEMORY.md current with durable project knowledge (patterns, decisions, locations, reusable APIs) after any change that affects them. Portable mirror of the invokable .claude/skills/update-memory.
---

# Update Agent Memory (portable)

**What it does:** revises the relevant memory file (`frontend-engineer`, `motion-engineer`, or `qa-auditor` under `.claude/agent-memory/`) with durable facts only — new reusable component/util APIs, confirmed decisions, changed locations, DRY patterns — and prunes anything now inaccurate. Overflow topics live in linked sibling files (existing: `content-data-layer.md`, `site-chrome.md`, `runtime-smoke-testing.md`). First ~200 lines of MEMORY.md are what gets auto-injected, so keep it tight.

**When to use:** after any codebase change that introduces or revises a pattern/decision/location/util — the always-on rule in `rules/memory-context.md`. Memory is knowledge ("how this project works"); history goes to `logs/` via `log-change` instead.

(Claude Code: `/update-memory [agent]`.)
