# Agent memory (project scope, committed)

`.claude/agent-memory/<agent>/MEMORY.md` is durable **knowledge about this project** for each subagent (the first 200 lines are auto-injected into that subagent on invocation). It exists so generated code stays clean, DRY, and on-context. It is knowledge, **not** a changelog — per-change history lives in `logs/feature-changes/`.

- `project` scope → committed here (VCS-tracked). Local-only notes would go in `.claude/agent-memory-local/` (gitignored).
- Keep each MEMORY.md updated whenever a pattern, decision, file location, or reusable util changes (run `/update-memory` or edit directly).
- Known Claude Code caveat: subagent auto-write of MEMORY.md can be unreliable — that's why each subagent lists `Write, Edit` in its `tools` and treats updating memory as an explicit step.

## Index (what durable knowledge lives where)

| File | Holds |
| --- | --- |
| `frontend-engineer/MEMORY.md` | Repo layout as built, applied token set, primitive roster + import rules, `cn()`/twMerge conventions, About-section patterns, 3D-island boundaries, decisions log |
| `frontend-engineer/content-data-layer.md` | The full typed PRD data layer — `features/home/data/*.data.ts`, `src/constants/*`, `src/config/*` vs `types/portfolio.ts`; reuse, never re-transcribe |
| `frontend-engineer/site-chrome.md` | MenuButton/MenuPopout/SiteMenu/RootLayout frame, z-scale 60/80/90/100, preloader-`inert` pattern, hero structure + section conventions |
| `motion-engineer/MEMORY.md` | Single-source GSAP/Lenis architecture, all 8 primitive APIs, chapter choreography patterns, reduced-motion pattern, motion tokens, trap list (`revertOnUpdate`, `end:"max"`, `scrollTo force`) |
| `motion-engineer/manifesto-3d.md` | The R3F↔GSAP island: trigger configs, measurement rules, stacking/backdrop traps, fiber v9 `advance()` seconds gotcha |
| `qa-auditor/MEMORY.md` | Definition-of-Done grep set + recurring-issues log (off-token classes, overlay focus, `revertOnUpdate`, stale logs) |
| `qa-auditor/runtime-smoke-testing.md` | Puppeteer-core browser-check fallback (chrome-devtools MCP is absent in qa subagent threads) + runtime gotchas |
