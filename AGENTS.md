# AGENTS.md — Agent Setup Overview

How AI agents work in this repo. This is the committed cross-tool overview; the exhaustive specs live in `.agents/context/*`. Tool-specific context: `CLAUDE.md` (Claude Code) and `GEMINI.md` (Gemini CLI).

## The two layers

The setup is intentionally mirrored: a **portable spec** any agent can read, and a **Claude-native executable layer** that enforces it.

### `.agents/` — portable, tool-agnostic spec

```text
.agents/
├── agents.md          # team overview, protocols, roster, execution flow
├── context/           # the authoritative deep specs (read these first)
│   ├── product_requirements.md   # the ONLY content source
│   ├── design_system.md          # palette, type, tokens, motion, §11 choreography
│   └── system_architecture.md    # folder structure, golden rules, DoD
├── roles/             # job descriptions: project_manager, motion_engineer,
│                      #                    frontend_developer, quality_assurance
├── rules/             # always-on policies (see "Rules" below)
├── skills/            # agent-agnostic SKILL.md procedures (motion, tailwind-v4,
│                      # tanstack-router, ts-strict, a11y-reduced-motion, seo-meta, …)
└── workflows/         # prose process docs: planning, design-system, section, qa
```

### `.claude/` — Claude Code native, executable layer

```text
.claude/
├── settings.json      # outputStyle "custom-components", permissions, format hook
├── agents/            # subagents: frontend-engineer, motion-engineer, qa-auditor
├── agent-memory/      # <agent>/MEMORY.md — durable, committed project knowledge
├── skills/            # invocable /skills (see inventory below)
├── commands/          # /add-shadcn, /commit, /typecheck
├── rules/             # path-scoped rules mirroring .agents/rules
├── hooks/             # format.sh (PostToolUse auto-format on Edit/Write)
├── output-styles/     # custom-components.md (the house component style)
└── workflows/         # native /workflows JS scripts (home for feature-done, section-cycle)
```

## Protocols (from `.agents/agents.md`)

- **Read-First Rule** — before any task, every agent reads `product_requirements.md`, `design_system.md`, `system_architecture.md`, and root `CLAUDE.md`.
- **Artifact Generation Protocol** — agents must write **real files** to disk (source + `PLAN.md` + QA log). A chat-only answer counts as a failed task.
- **Content integrity** — all content comes only from `product_requirements.md`; nothing is invented, unknowns are omitted.

## Roster

| Agent | Role | Owns / produces |
| --- | --- | --- |
| **@pm** | Project Manager / Lead Architect — reads the context docs, writes `PLAN.md` (file tree + chapter build order + technique per chapter + data-mapping table), surfaces the open design decisions, then **pauses for explicit approval** before any code. | `PLAN.md` |
| **@frontend** | Frontend Engineer — builds chapter sections/components to the design system using tokens only, transcribes PRD content into typed constants, wires in @motion's primitives. Feature isolation, `cn()`/`cva`. | `features/home/sections/*`, `constants/*`, feature components |
| **@motion** | Motion Engineer — owns the GSAP + Lenis subsystem (`src/lib/gsap.ts`, `SmoothScrollProvider`) and the reusable motion primitives (RevealText, ParallaxImage, Marquee, MagneticButton, Cursor, Preloader); guarantees Lenis↔ScrollTrigger sync + a reduced-motion fallback per effect. No layout decisions. | motion layer + primitives |
| **@qa** | QA Auditor — runs the Definition of Done (TS strict/no `any`, no cross-feature imports, no raw hex, reduced-motion + Lenis↔ScrollTrigger refresh, a11y, Lighthouse ≥ 90, SEO/meta). Read-only on source; writes findings to a log. | QA log |

Details: `.agents/roles/*`. Claude Code equivalents: `.claude/agents/{frontend-engineer,motion-engineer,qa-auditor}.md` (all `memory: project`).

## Golden Rules (non-negotiable)

1. **Content** is transcribed from `product_requirements.md`, never invented.
2. **One GSAP source** (`src/lib/gsap.ts`) + **one Lenis owner** (`SmoothScrollProvider`); all animation runs in `useGSAP(() => {…}, { scope })`.
3. **Reduced motion** is first-class — every effect has an opacity-only fallback with Lenis/pins/parallax/cursor disabled.
4. **No cross-feature imports** — promote shared code to `components/common`, `lib`, `hooks`, `types`.
5. **TypeScript strict / no `any`**, **design tokens only** — no raw hex or magic px; `cn()` for classes, `cva` for variants.

## Workflow

1. `/plan-redesign` → `PLAN.md` → **stop for human approval** (@pm pauses here)
2. **Bootstrap** — design tokens + motion foundation (installs GSAP, Lenis, split-type, `@gsap/react`, EmailJS, fonts; adds `lib/gsap.ts` + `SmoothScrollProvider`)
3. `/build-section <chapter>` per chapter, in order: `00 Preloader · 01 Hero · 02 Manifesto · 03 Craft · 04 Journey · 05 Selected Work · 06 Contact · Footer` (Journey merges experience + education + awards)
4. `/qa-audit` per chapter and at the end

**Post-change discipline** (every feature create/change):

1. `/log-change` → `logs/feature-changes/<YYYY-MM-DD>-<slug>.md` (history only), committed with the change.
2. `/update-memory` when a pattern, decision, file location, or reusable util changed → the relevant `.claude/agent-memory/<agent>/MEMORY.md` (knowledge, not history).
3. Commit the log + memory alongside the code, Conventional Commit per `.agents/rules/commit-rules.md`.

## Skills, commands, MCP

**Skills** (`.claude/skills/`): `plan-redesign` (plan + stop for approval) · `build-section` (build one chapter, needs an approved plan) · `qa-audit` (run the Definition of Done + write a log) · `log-change` (feature-change log entry) · `update-memory` (durable project knowledge) · `discover-tooling` (web-search for skills/MCP, proposes only — never installs). Plus design skills `design-taste-frontend` and `impeccable`.

**Commands** (`.claude/commands/`): `/add-shadcn` (add + restyle a shadcn component with tokens) · `/commit` (Conventional Commit) · `/typecheck` (`tsc --noEmit` + `eslint`).

**MCP servers** (`.mcp.json`): `context7` (live library docs — GSAP/TanStack/Tailwind v4/shadcn) · `chrome-devtools` (Lighthouse/perf/screenshots for the QA gate) · `shadcn` (component registry, pairs with `/add-shadcn`).

**Rules** (`.agents/rules/` — always on): `commit-rules`, `content-integrity`, `code-quality`, `motion-safety`, `accessibility-performance`, `workflow-discipline`, `logging`, `memory-context`. Mirrored path-scoped in `.claude/rules/`.

## Where depth lives

For anything beyond this overview, read the source of truth in `.agents/context/*` — `product_requirements.md` (content), `design_system.md` (look + motion, per-chapter choreography), `system_architecture.md` (structure + Definition of Done).

> `AGENTS.md` is the committed cross-tool convention file. `AGENT_README.md` and `AGENT_NOTES.md` are gitignored, local-only scratch docs — don't rely on them being present.
