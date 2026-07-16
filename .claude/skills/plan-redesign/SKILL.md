---
name: plan-redesign
description: Stage 1 whole-site planning for the portfolio redesign — read the context docs + as-built state, write/revise PLAN.md, surface open decisions, then STOP for explicit approval. Use at redesign start or when re-planning the remaining scope; never for implementation code.
disable-model-invocation: false
argument-hint: (none)
---

# /plan-redesign — Stage 1 (plan, then pause)

If a raw video was provided as the visual reference instead of screenshots (e.g. `reference/*.mp4`), first extract frames per `.agents/skills/reference-capture/SKILL.md` — the repeatable extractor is `reference/scripts/extract-frames.mjs` (CONFIG-driven; `--probe` mode for boundaries) — and use those stills below; Claude's vision reads static images only. (Already done: design_system.md v2 §3.0 was evidence-sampled from the video, and the full still sets live under `reference/`.)

Read `.agents/context/product_requirements.md`, `design_system.md` (v2 — "Void & Ember", incl. §7.5 reference libraries; `reference/breakdown_analysis.md §5` is the section-timing map), `system_architecture.md`, and root `CLAUDE.md`. Also read the as-built state: the canonical build-status paragraph in `AGENTS.md` — chapters 00–03 exist in `src/features/home/sections/*` on the 10-chapter map with ember tokens live — a plan must cover what *remains* (04 Craft → 08 Contact + Footer, `lib/emailjs.ts`), not re-plan what's shipped. The current approved plan is `PLAN.md` v3.1.

Then write **PLAN.md** at the repo root containing:
1. The file/component tree to create (match `system_architecture.md §3`).
2. The chapter build order `00 → 08` + Footer (the PLAN v3.1 §0 10-chapter map) with the specific GSAP/Lenis technique per chapter (`design_system.md §7 & §11`), marking already-built chapters as revise-vs-skip.
3. The exact dependency delta to install (`system_architecture.md §7`) — most of it is already installed (gsap `^3.15.0`, lenis `^1.3.25`, split-type, @gsap/react, zustand, react-hook-form, @emailjs/browser); state the true remainder.
4. A data-mapping table: PRD content → typed constants location (existing: `src/features/home/data/*`, `src/constants/projects.data.ts`).

Then list the open decisions with a recommended default for each. The PRD §6 + v2 items are all resolved (accent → ember; dark-only; single-page; featured 5; no blog; display face → Fraunces; invert → 08 Contact) — the live ledger is `PLAN.md §6`, where decisions 9–15 carry approved defaults overridable at their chapter's gate.

**Whole-site planning, per-section execution:** the plan covers everything at once; execution then runs one section at a time with a stop-for-approval gate after every section (`.agents/workflows/section.md`).

**STOP.** Output PLAN.md + the decision questions and wait for explicit approval before any implementation. Do not write source code in this step.
