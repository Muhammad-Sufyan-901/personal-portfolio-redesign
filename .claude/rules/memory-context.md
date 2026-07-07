# Agent memory as project knowledge (always on)

`.claude/agent-memory/<agent>/MEMORY.md` (project scope, committed) is durable **knowledge about this project** — the real folder layout, the custom-component API, naming conventions, decisions already made, and DRY patterns. Use it so generated code stays clean, DRY, and on-context.

- **Read first:** before building/refactoring, consult the relevant agent's MEMORY.md (it's auto-injected for that subagent; the main loop should open it when relevant).
- **Keep it current:** after any codebase change that introduces or revises a pattern, decision, file location, or reusable util, update the relevant MEMORY.md so it never drifts from reality. Run `/update-memory` (or edit directly). Memory is knowledge, not a changelog — record durable facts and conventions, not per-change history (that's what `logs/` is for).
- **DRY guard:** if MEMORY.md already documents a component/util/pattern for a need, reuse it instead of writing a new one. If you create a new shared primitive, add it to memory so it's reused next time.
- Because Claude Code's subagent auto-memory can be unreliable, treat updating memory as an explicit step, not an assumed side effect.

**Why this matters here:** the three memory sets are already the deepest source of truth in the repo — `frontend-engineer/` documents the full data layer and site chrome (z-scale 60/80/90/100, `inert` pattern), `motion-engineer/` the exact primitive APIs and choreography, `qa-auditor/` the puppeteer smoke-test fallback (chrome-devtools MCP isn't exposed in its subagent threads). Chapters 01–04 reused those patterns instead of reinventing them; a stale memory file re-opens every one of those solved problems.
