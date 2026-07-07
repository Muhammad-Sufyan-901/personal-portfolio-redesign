---
description: Update the relevant .claude/agent-memory/<agent>/MEMORY.md with durable project knowledge (new patterns, decisions, file locations, reusable utils) after a codebase change.
argument-hint: [agent: frontend-engineer|motion-engineer|qa-auditor]
---

# /update-memory $ARGUMENTS

Keep project knowledge current so future code stays clean, DRY, and on-context.

1. Pick the target memory file: `.claude/agent-memory/$ARGUMENTS/MEMORY.md` (default: the agent that did the work, or `frontend-engineer` for general UI). Overflow topics live in sibling files the MEMORY.md links to — existing examples: `frontend-engineer/{content-data-layer,site-chrome}.md`, `qa-auditor/runtime-smoke-testing.md`.
2. Add/revise ONLY durable facts: a new reusable component/util and its API, a confirmed design/architecture decision, a changed file location or naming convention, a DRY pattern to reuse. Remove anything now inaccurate.
3. Do NOT log per-change history here — that's `logs/feature-changes/`. Memory = "how this project works", not "what changed today".
4. Keep it tight (the first 200 lines are what gets injected). Prune stale notes; push detail into linked sibling files.

Commit the memory update with the change that motivated it. Portable mirror: `.agents/skills/update-memory` + `.agents/rules/memory-context.md`.
