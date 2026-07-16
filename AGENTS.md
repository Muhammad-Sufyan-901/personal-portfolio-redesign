# AGENTS.md — Agent Setup Overview

How AI agents work in this repo. This is the committed cross-tool overview; the exhaustive specs live in `.agents/context/*`. Tool-specific context: `CLAUDE.md` (Claude Code) and `GEMINI.md` (Gemini CLI).

## The two layers

The setup is intentionally mirrored: a **portable spec** any agent can read, and a **Claude-native executable layer** that enforces it. After the 2026-07-07 reconciliation, both skill rosters describe the same capability set (mirrors or explicit pointers).

### `.agents/` — portable, tool-agnostic spec

```text
.agents/
├── agents.md          # team overview, protocols, roster, execution flow, build status
├── context/           # the authoritative deep specs (read these first)
│   ├── product_requirements.md   # the ONLY content source (§6.1 accent → resolved: ember)
│   ├── design_system.md          # v2 "Void & Ember": palette (§3), motion (§7),
│   │                             # reference libraries (§7.5), §11 choreography
│   └── system_architecture.md    # folder structure, golden rules, DoD (+ as-built note)
├── roles/             # job descriptions: project_manager, motion_engineer,
│                      # frontend_developer, quality_assurance (as-built paths + discipline)
├── rules/             # always-on policies (see "Rules" below)
├── skills/            # 18 agent-agnostic SKILL.md procedures (see inventory below)
└── workflows/         # prose process docs: planning (whole-site), design-system (run),
                       # section (one-per-approval-gate), qa (per-section + global)
```

### `.claude/` — Claude Code native, executable layer

```text
.claude/
├── settings.json      # outputStyle "custom-components", permissions, format hook
├── agents/            # subagents: frontend-engineer, motion-engineer, qa-auditor
├── agent-memory/      # <agent>/MEMORY.md (+ topic siblings) — durable, committed knowledge
├── skills/            # 9 invocable /skills (see inventory below)
├── commands/          # /add-shadcn, /commit, /typecheck
├── rules/             # path-scoped rules mirroring .agents (incl. accessibility.md)
├── hooks/             # format.sh (PostToolUse auto-format on Edit/Write)
├── output-styles/     # custom-components.md (house style, real prop surfaces)
└── workflows/         # native /workflows home (README only; scripts not yet generated)
```

## Protocols (from `.agents/agents.md`)

- **Read-First Rule** — before any task, every agent reads `product_requirements.md`, `design_system.md`, `system_architecture.md`, and root `CLAUDE.md`.
- **Artifact Generation Protocol** — agents must write **real files** to disk (source + `PLAN.md` + QA log). A chat-only answer counts as a failed task.
- **Content integrity** — all content comes only from `product_requirements.md`; nothing is invented, unknowns are omitted.

## Roster

| Agent | Role | Owns / produces |
| --- | --- | --- |
| **@pm** | Project Manager / Lead Architect — reads the context docs + as-built state, writes `PLAN.md` (whole-site: file tree + chapter order + technique per chapter + data-mapping table), surfaces the open design decisions, then **pauses for explicit approval** before any code. | `PLAN.md` |
| **@frontend** | Frontend Engineer — builds chapter sections/components to the design system using tokens only, transcribes PRD content into typed constants, wires in @motion's primitives. Feature isolation, `cn()`/`cva`. | `features/home/sections/*`, `data/*`, feature components |
| **@motion** | Motion Engineer — owns the GSAP + Lenis subsystem (`src/lib/gsap.ts`, `SmoothScrollProvider`) and the eight motion primitives (RevealText, ParallaxImage, Marquee, MagneticButton, ChapterEyebrow, Cursor, Preloader, PathDraw); guarantees Lenis↔ScrollTrigger sync + a reduced-motion fallback per effect. No layout decisions. | motion layer + primitives |
| **@qa** | QA Auditor — runs the Definition of Done (TS strict/no `any`, no cross-feature imports, no raw hex, no bare HTML tags, reduced-motion + Lenis↔ScrollTrigger refresh, a11y incl. overlay `inert` — SiteMenu z-80 / Preloader z-90, Lighthouse ≥ 90, SEO/meta). Read-only on source; writes findings to `.artifacts/qa-log.md`. | QA log |

Details: `.agents/roles/*`. Claude Code equivalents: `.claude/agents/{frontend-engineer,motion-engineer,qa-auditor}.md` (all `memory: project`, with as-built path maps).

## Golden Rules (non-negotiable)

1. **Content** is transcribed from `product_requirements.md`, never invented.
2. **One GSAP source** (`src/lib/gsap.ts`) + **one Lenis owner** (`SmoothScrollProvider`); all animation runs in `useGSAP(() => {…}, { scope })`. Corollary: **never install `framer-motion`** — borrowed component ideas are adapted per the `animated-ui-references` skill.
3. **Reduced motion** is first-class — every effect has an opacity-only fallback with Lenis/pins/parallax/cursor disabled.
4. **No cross-feature imports** — promote shared code to `components/common`, `lib`, `hooks`, `types`.
5. **TypeScript strict / no `any`**, **design tokens only** — no raw hex or magic px; `cn()` for classes, `cva` for variants.

## Workflow

1. `/plan-redesign` → `PLAN.md` (**whole-site**) → **stop for human approval** (@pm pauses here)
2. **Bootstrap** — design tokens + motion foundation. *(Done 2026-07-07: deps, fonts, tokens, `lib/gsap.ts`, `SmoothScrollProvider`, primitives, PRD data layer.)*
3. `/build-section <chapter>` — **one section at a time, with a stop-for-approval gate after every section**, in order: `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` (PLAN v3.1 §0; Journey merges experience + education + awards)
4. `/qa-audit` per section (before its gate) and once globally at the end

**Build status (2026-07-16):** foundation + chapters **00–03** are shipped on the **10-chapter map** — `00 Preloader · 01 Hero · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` (PLAN v3.1 §0). As built: three-act Welcome/ember/curtain preloader (runs every load), aurora hero (ogl), WebGL MacBook manifesto seam, reference-exact About. Tokens are **ember `#E8380F`** (Void & Ember v2, applied 2026-07-07 — brass/cobalt remain unchosen documented alternates), display face **Fraunces**, dark-only. All **14 primitives** live in `@/components/common` (incl. `PathDraw` — built, not yet wired). Chrome = `MenuButton` → `MenuPopout` (z-60) → `SiteMenu` (z-80); there is no Header/MobileMenu. Remaining: **04 Craft → 08 Contact + Footer** (PLAN v3.1 §7 order) + `src/lib/emailjs.ts` (lands with 08). Deferred to final QA: scroll-spy nav dot, bundle split, favicon/OG.

**Post-change discipline** (every feature create/change):

1. `/log-change` → `logs/feature-changes/<YYYY-MM-DD>-<slug>.md` (history only), committed with the change.
2. `/update-memory` when a pattern, decision, file location, or reusable util changed → the relevant `.claude/agent-memory/<agent>/MEMORY.md` (knowledge, not history).
3. Commit the log + memory alongside the code, Conventional Commit per `.agents/rules/commit-rules.md`.

## Skills, commands, MCP

**Skills — two-kind architecture** (both trees list the same **19**; every skill = ONE canonical implementation + one thin stub on the other side, the impeccable pattern):

- **KNOWLEDGE (10, canonical `.agents/skills/`)**: `gsap-lenis-motion`, `scrollytelling`, `animated-ui-references` (adapt React Bits / Magic UI / Aceternity / 21st.dev to GSAP + primitives + tokens — never framer-motion), `tailwind-v4-shadcn`, `typescript-react-strict`, `tanstack-router`, `vite-setup`, `accessibility-reduced-motion`, `seo-meta`, `reference-capture` (executables in `reference/scripts/`).
- **PROCESS (6, canonical `.claude/skills/` — the invokable slash-commands)**: `plan-redesign` (whole-site plan + stop for approval) · `build-section` (one chapter per approval gate) · `qa-audit` (Definition of Done + log) · `log-change` · `update-memory` · `discover-tooling` (proposes only).
- **VENDORED (3, full implementation only in `.claude/skills/`)**: `impeccable` (v3.9.1, ~25 subcommands + detector hook) · `design-taste-frontend` (anti-slop manual, router + 13 references; apply with this repo's Vite/GSAP/Fraunces overrides) · `cinematic-web` (three.js/scrollytelling/GLB technique numbers — read its `ADAPTATION.md` first; repo Golden Rules override its single-file archetype).

**Commands** (`.claude/commands/`): `/add-shadcn` (add + restyle a shadcn component with tokens) · `/commit` (Conventional Commit) · `/typecheck` (`tsc --noEmit` + `eslint`).

**MCP servers** (`.mcp.json`): `context7` (live library docs — GSAP/TanStack/Tailwind v4/shadcn) · `chrome-devtools` (Lighthouse/perf/screenshots — note: not exposed inside qa-auditor subagent threads; it uses a documented puppeteer fallback) · `shadcn` (component registry, pairs with `/add-shadcn`).

**Rules** (`.agents/rules/` — always on): `commit-rules`, `content-integrity`, `code-quality`, `motion-safety`, `accessibility-performance`, `workflow-discipline`, `logging`, `memory-context` — each with a project-grounded "why this matters here" note. Mirrored path-scoped in `.claude/rules/` (incl. the added `accessibility.md`).

## Where depth lives

For anything beyond this overview, read the source of truth in `.agents/context/*` — `product_requirements.md` (content), `design_system.md` (v2: look + motion + reference libraries + per-chapter choreography), `system_architecture.md` (structure + Definition of Done). Live implementation knowledge (exact primitive APIs, chrome z-scale, recurring QA findings) lives in `.claude/agent-memory/`.

> `AGENTS.md` is the committed cross-tool convention file. `AGENT_README.md` and `AGENT_NOTES.md` are gitignored, local-only scratch docs — don't rely on them being present.
