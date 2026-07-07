# 🤖 Autonomous Redesign Team — Muhammad Sufyan Portfolio

This workspace redesigns the portfolio into an **"elegant & animated" scroll-telling** site (reference: `lukebaffait.fr`), on React 19 + Vite + TanStack Router + Tailwind v4 + shadcn/ui + **GSAP + Lenis**, following the Feature-Based Architecture and design standards in `context/`.

> This `.agents/` folder is the **portable, agent-agnostic spec** (works with Claude Code, or any agent). Claude Code also reads the native `.claude/` folder and the root `CLAUDE.md`, which point back here.

## Artifact Generation Protocol (STRICT)

- Agents MUST create/write real files on disk (source code + `PLAN.md` + a QA log). Chat-only output = task FAILED.
- Content comes ONLY from `context/product_requirements.md`. Do not read or assume an old repo exists; there is none in this project.

## Read-First Rule (CRITICAL)

Before any task, every agent MUST read: `context/product_requirements.md` (content), `context/design_system.md` (look + motion), `context/system_architecture.md` (structure), and the root `CLAUDE.md`.

## Team Roster & Execution Flow

### 1. @pm — Project Manager / Lead Architect

- Analyzes the brief, writes `PLAN.md` (file tree + chapter build order + technique per chapter + data-mapping table), and surfaces the open decisions in `product_requirements.md §6`.
- **MUST PAUSE and await explicit user approval** before handing off to engineers.

### 2. @motion — Motion Engineer

- Owns the GSAP + Lenis layer: `lib/gsap.ts`, `SmoothScrollProvider`, and the motion primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `Cursor`, `Preloader`).
- Guarantees Lenis ↔ ScrollTrigger sync + a `prefers-reduced-motion` path for every effect. NO business layout decisions.

### 3. @frontend — Frontend Engineer

- Builds chapter sections and components from the design system, wiring in the motion primitives from @motion. Transcribes content constants from the PRD.
- MUST use design tokens (no raw hex), `cn()` + `cva`, feature isolation.

### 4. @qa — Quality Assurance / Auditor

- Audits type-safety, accessibility, reduced-motion, performance (Lighthouse ≥ 90), and cross-feature import hygiene. Writes a physical log at `.artifacts/qa-log.md`.
- Zero tolerance for TS errors, raw hex, or cross-feature imports.

## System Commands (map to `.claude/skills/`)

- `/plan-redesign` ➔ @pm planning stage → produces `PLAN.md` (whole-site), then PAUSES for approval.
- `/build-section <chapter>` ➔ @frontend + @motion build one chapter per `design_system.md §11`, then **stop for user approval before the next chapter** (one gate per section — `workflows/section.md`).
- `/qa-audit` ➔ @qa runs the Definition of Done from `system_architecture.md §8`, per section before its gate + once globally.

**Build status:** chapters 00–04 (preloader → journey) are shipped (`feat(preloader)` `fe849ff` → `feat(journey)` `b245c1e`) on the interim cobalt tokens; remaining: Work (05), Contact (06), `lib/emailjs.ts`, the ember re-theme (design_system v2 §9), and the v2 motion upgrades (bold path draw, hero aurora, optional footer ornament).

## Skills (`.agents/skills/`) — activate by task

Convention knowledge (portable spec; each has a Claude Code enforcement mirror in `.claude/rules/` or an as-built note):

- `reference-capture` — @pm, before Stage 1, to turn `lukebaffait.fr` screenshots or a screen-recording into usable stills (Claude's vision reads images only, not video). Already run once — it produced design_system v2's §3.0 evidence.
- `gsap-lenis-motion`, `scrollytelling` — @motion & @frontend for all motion work (mirror: `.claude/rules/motion.md`).
- `animated-ui-references` — @motion & @frontend when borrowing from React Bits / Magic UI / Aceternity UI / 21st.dev (design_system v2 §7.5): adapt to GSAP + primitives + tokens, **never install `framer-motion`**.
- `tailwind-v4-shadcn`, `typescript-react-strict`, `tanstack-router`, `vite-setup` — @frontend for scaffolding + UI (mirrors: `.claude/rules/{tailwind-styling,react-typescript,project}.md`).
- `accessibility-reduced-motion`, `seo-meta` — @frontend & @qa for final polish + audit (mirror: `.claude/rules/accessibility.md`).

Process skills (portable mirrors of the invokable `.claude/skills/` slash-commands):

- `plan-redesign` — @pm: whole-site `PLAN.md`, then hard STOP for approval.
- `build-section` — @frontend + @motion: one chapter per invocation, stop-for-approval gate after every section.
- `qa-audit` — @qa: Definition of Done per chapter + globally, findings to `.artifacts/qa-log.md`.
- `log-change`, `update-memory` — all agents: post-change discipline (see below).
- `discover-tooling` — propose (never auto-install) new skills/MCP servers.

Installed third-party design toolkits (pointer stubs here; **implementation lives only in `.claude/skills/`**):

- `impeccable` (v3.9.1) — design critique/polish/live-iteration toolkit + anti-slop detector hook.
- `design-taste-frontend` — anti-slop design manual; apply with this repo's overrides (we're Vite+GSAP not Next+Motion; Fraunces is deliberate).

## Rules (`.agents/rules/`) — always in effect

`commit-rules`, `content-integrity`, `code-quality`, `motion-safety`, `accessibility-performance`, `workflow-discipline`, plus the post-change pair `logging` + `memory-context` (detailed below). All agents obey these. Each carries a project-grounded "why this matters here" note.

## Native enforcement (`.claude/`)

Claude Code also auto-loads path-scoped `.claude/rules/*`, subagents `.claude/agents/*`, slash-commands `.claude/skills/*` + `.claude/commands/*`, and `.claude/settings.json` (permissions + format hook).

## Golden Rules (non-negotiable)

1. Content is transcribed from the PRD, never invented.
2. One GSAP source (`lib/gsap.ts`) + one Lenis owner (`SmoothScrollProvider`); all animation in `useGSAP({ scope })`.
3. `prefers-reduced-motion` is a first-class path for every effect.
4. No cross-feature imports; promote shared code up.
5. TypeScript strict, no `any`; design tokens only, no raw hex in components.

## Post-change discipline (added — all agents)

Every time an agent creates or changes a feature/section/component:

1. **Log it** → append `logs/feature-changes/<YYYY-MM-DD>-<slug>.md` (history only). Claude Code: `/log-change`.
2. **Update knowledge** → revise the relevant `.claude/agent-memory/<agent>/MEMORY.md` with any new durable pattern/decision/location/util (knowledge, not history). Claude Code: `/update-memory`.
3. Commit the log + memory update together with the change.

Agent memory (`.claude/agent-memory/`, project scope, committed) is the shared **alternative knowledge base** that keeps generated code clean, DRY, and on-context — read it before building, reuse what it documents.

## Component house style (added — @frontend & @motion)

Feature/page/section JSX uses the custom primitives from `@/components/common` (`Box`, `Container`, `Text`, `Heading`, `Link`, `Image`) — never bare `div`/`p`/`span`/`h*`/`a`/`img` (repo enforces `react/forbid-elements`). Interactive controls → shadcn/ui. Enforced by `.claude/output-styles/custom-components.md` (main loop) + `.claude/rules/custom-components.md` + subagent instructions (subagents don't inherit output styles).

## Tooling discovery (added)

`/discover-tooling` — web-search for relevant Claude Code skills + MCP servers for this stack; propose the best (propose only, never auto-install). Skills → `.claude/skills/`, MCP → `.mcp.json`.
