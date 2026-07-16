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
- `/build-section <chapter>` ➔ @frontend + @motion build one chapter per **PLAN v3.1 §3** (the approved 10-chapter map; `design_system.md §11` stays the technique reference), then **stop for user approval before the next chapter** (one gate per section — `workflows/section.md`).
- `/qa-audit` ➔ @qa runs the Definition of Done from `system_architecture.md §8`, per section before its gate + once globally.

**Build status (2026-07-16):** foundation + chapters **00–03** are shipped on the **10-chapter map** — `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` (PLAN v3.1 §0). As built: three-act Welcome/ember/curtain preloader (runs every load), aurora hero (ogl), WebGL MacBook manifesto seam, reference-exact About. Tokens are **ember `#E8380F`** (Void & Ember v2, applied 2026-07-07 — brass/cobalt remain unchosen documented alternates), display face **Fraunces**, dark-only. All **14 primitives** live in `@/components/common` (incl. `PathDraw` — built, not yet wired). Chrome = `MenuButton` → `MenuPopout` (z-60) → `SiteMenu` (z-80); there is no Header/MobileMenu. Remaining: **04 Craft → 08 Contact + Footer** (PLAN v3.1 §7 order) + `src/lib/emailjs.ts` (lands with 08). Deferred to final QA: scroll-spy nav dot, bundle split, favicon/OG.

## Skills — two-kind architecture (both trees list the same 19; every skill = ONE canonical + one stub)

**KNOWLEDGE skills (10) — canonical here in `.agents/skills/<name>/`** (portable spec; `.claude/skills/` holds a thin stub; Claude Code enforcement mirrors live in `.claude/rules/`):

- `reference-capture` — @pm: turn a reference site/recording into stills Claude can read (executables: `reference/scripts/`).
- `gsap-lenis-motion`, `scrollytelling` — @motion & @frontend for all motion work (rule mirror: `.claude/rules/motion.md`).
- `animated-ui-references` — @motion & @frontend when borrowing from React Bits / Magic UI / Aceternity UI / 21st.dev (design_system v2 §7.5): adapt to GSAP + primitives + tokens, **never install `framer-motion`**.
- `tailwind-v4-shadcn`, `typescript-react-strict`, `tanstack-router`, `vite-setup` — @frontend for scaffolding + UI (rule mirrors: `.claude/rules/{tailwind-styling,react-typescript,project}.md`).
- `accessibility-reduced-motion`, `seo-meta` — @frontend & @qa for polish + audit (rule mirror: `.claude/rules/accessibility.md`).

**PROCESS skills (6) — canonical in `.claude/skills/<name>/`** (the invokable slash-commands with argument-hints; `.agents/skills/` holds the stub):

- `plan-redesign` — @pm: whole-site `PLAN.md`, then hard STOP for approval.
- `build-section` — @frontend + @motion: one chapter per invocation, stop-for-approval gate after every section.
- `qa-audit` — @qa: Definition of Done per chapter + globally, findings to `.artifacts/qa-log.md`.
- `log-change`, `update-memory` — all agents: post-change discipline (see below).
- `discover-tooling` — propose (never auto-install) new skills/MCP servers.

**VENDORED toolkits (3) — full implementation ONLY in `.claude/skills/`** (pointer stubs here):

- `impeccable` (v3.9.1) — design critique/polish/live-iteration toolkit + anti-slop detector hook.
- `design-taste-frontend` — anti-slop design manual (router + 13 references); apply with this repo's overrides (Vite+GSAP not Next+Motion; Fraunces is deliberate).
- `cinematic-web` — three.js/scrollytelling/GLB technique numbers and patterns; **read its `ADAPTATION.md` first** (repo Golden Rules override its single-file archetype).

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
