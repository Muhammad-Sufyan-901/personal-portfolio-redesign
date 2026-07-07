---
description: Stage 1 planning for the portfolio redesign. Reads the context docs, writes PLAN.md, surfaces open decisions, and STOPS for approval. No implementation code.
disable-model-invocation: false
argument-hint: (none)
---

# /plan-redesign — Stage 1 (plan, then pause)

If a raw video was provided as the visual reference instead of screenshots (e.g. `reference/*.mp4`), first extract frames per `.agents/skills/reference-capture/SKILL.md` (`ffmpeg -i <video> -vf fps=2 reference/frames/frame_%03d.png`) and use those stills below — Claude's vision reads static images only. (This has already been done once: design_system.md v2 §3.0 was evidence-sampled from 47 extracted frames of `reference/lukebaffait-scroll.mp4`.)

Read `.agents/context/product_requirements.md`, `design_system.md` (v2 — "Void & Ember", incl. §3.0b section map and §7.5 reference libraries), `system_architecture.md`, and root `CLAUDE.md`. Also read the as-built state: chapters 00–04 exist in `src/features/home/sections/*` with the pre-migration cobalt tokens — a plan must cover what *remains* (Work 05, Contact 06, `lib/emailjs.ts`, ember re-theme, v2 motion upgrades), not re-plan what's shipped.

Then write **PLAN.md** at the repo root containing:
1. The file/component tree to create (match `system_architecture.md §3`).
2. The chapter build order `00 → 06` with the specific GSAP/Lenis technique per chapter (`design_system.md §7 & §11`), marking already-built chapters as revise-vs-skip.
3. The exact dependency delta to install (`system_architecture.md §7`) — most of it is already installed (gsap `^3.15.0`, lenis `^1.3.25`, split-type, @gsap/react, zustand, react-hook-form, @emailjs/browser); state the true remainder.
4. A data-mapping table: PRD content → typed constants location (existing: `src/features/home/data/*`, `src/constants/projects.data.ts`).

Then list the open decisions from `product_requirements.md §6` (accent — resolved to ember `#E8380F` per design_system v2 §3.2, brass/cobalt remain documented alternates; dark-only; single/multi-page; featured projects; blog) with a recommended default for each, plus the v2-introduced ones (display face serif-vs-grotesk §4, invert-section placement §11.3/11.4).

**Whole-site planning, per-section execution:** the plan covers everything at once; execution then runs one section at a time with a stop-for-approval gate after every section (`.agents/workflows/section.md`).

**STOP.** Output PLAN.md + the decision questions and wait for explicit approval before any implementation. Do not write source code in this step.
