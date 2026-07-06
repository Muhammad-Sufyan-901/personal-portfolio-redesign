---
description: Stage 1 planning for the portfolio redesign. Reads the context docs, writes PLAN.md, surfaces open decisions, and STOPS for approval. No implementation code.
disable-model-invocation: false
argument-hint: (none)
---

# /plan-redesign — Stage 1 (plan, then pause)

If a raw video was provided as the visual reference instead of screenshots (e.g. `reference/*.mp4`), first extract frames per `.agents/skills/reference-capture/SKILL.md` (`ffmpeg -i <video> -vf fps=2 reference/frames/frame_%03d.png`) and use those stills below — Claude's vision reads static images only.

Read `.agents/context/product_requirements.md`, `design_system.md`, `system_architecture.md`, and root `CLAUDE.md`.

Then write **PLAN.md** at the repo root containing:
1. The file/component tree to create (match `system_architecture.md §3`).
2. The chapter build order `00 → 06` with the specific GSAP/Lenis technique per chapter (`design_system.md §7 & §11`).
3. The exact dependency delta to install (`system_architecture.md §7`).
4. A data-mapping table: PRD content → typed constants location.

Then list the open decisions from `product_requirements.md §6` (accent, dark-only, single/multi-page, featured projects, blog) with a recommended default for each.

**STOP.** Output PLAN.md + the decision questions and wait for explicit approval before any implementation. Do not write source code in this step.
