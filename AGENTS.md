# AGENTS.md — Agent Setup Overview

How AI agents work in this repo. This file is the committed cross-tool overview; the deep specs live in `.agents/context/*`. Tool-specific context: `CLAUDE.md` (Claude Code) and `GEMINI.md` (Gemini CLI).

## Two layers

- **`.agents/`** — portable, tool-agnostic spec:
  - `context/` — the authoritative docs: `product_requirements.md` (the *only* content source — never invent facts), `design_system.md` (tokens, typography, motion choreography), `system_architecture.md` (structure).
  - `roles/` — the team's job descriptions; `rules/` — cross-cutting policies (a11y/perf, code quality, commits, content integrity, logging, memory, motion safety, workflow discipline); `skills/` — stack procedures; `workflows/` — prose process docs; `agents.md` — team protocol.
- **`.claude/`** — Claude Code native, executable layer: subagents (`agents/`), invocable skills and commands, path-scoped rules, a format hook, the `custom-components` output style, and committed per-agent memory (`agent-memory/<agent>/MEMORY.md`).

## Roster

| Agent | Role |
| --- | --- |
| **@pm** | Project Manager — reads the context docs, writes `PLAN.md` (build order, technique per chapter, data mapping), then **stops for approval**. |
| **@frontend** | Frontend Engineer — builds chapter sections to the design system (tokens only), transcribes PRD content into typed constants, wires in motion primitives. |
| **@motion** | Motion Engineer — owns the GSAP + Lenis subsystem (`src/lib/gsap.ts`, `SmoothScrollProvider`) and reusable motion primitives; guarantees reduced-motion fallbacks. |
| **@qa** | QA Auditor — runs the Definition of Done (types, lint, a11y, reduced-motion, Lighthouse ≥ 90); read-only on source. |

Details: `.agents/roles/*`. Claude Code equivalents: `.claude/agents/{frontend-engineer,motion-engineer,qa-auditor}.md`.

## Workflow

1. `/plan-redesign` → `PLAN.md` → **stop for human approval**
2. Bootstrap: design tokens + motion foundation (installs GSAP, Lenis, split-type, `@gsap/react`, EmailJS)
3. `/build-section <chapter>` per chapter: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer`
4. `/qa-audit` per chapter and at the end

Every feature create/change is accompanied by a `/log-change` entry in `logs/feature-changes/` (committed with the change) and, when a convention/pattern changes, an `/update-memory` pass on the relevant `MEMORY.md`. Logs are history; memory is knowledge.

## Skills, commands, MCP

**Skills** (`.claude/skills/`): `plan-redesign` (plan + stop) · `build-section` (one chapter, needs approved plan) · `qa-audit` (Definition of Done) · `log-change` (feature-change log) · `update-memory` (durable knowledge) · `discover-tooling` (propose skills/MCP, never installs).

**Commands** (`.claude/commands/`): `/add-shadcn` (add + restyle a shadcn component) · `/commit` (Conventional Commit per `.agents/rules/commit-rules.md`) · `/typecheck` (tsc + lint).

**MCP servers** (`.mcp.json`): `context7` (live library docs) · `chrome-devtools` (Lighthouse/perf for the QA gate) · `shadcn` (component registry).

> Note: `AGENT_README.md` and `AGENT_NOTES.md` are gitignored, local-only scratch docs — this file is the committed convention.
