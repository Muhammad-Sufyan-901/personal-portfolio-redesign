---
name: plan-redesign
description: Stage 1 whole-site planning — read the context docs, write PLAN.md, surface open decisions, then STOP for explicit approval. Portable mirror of the invokable .claude/skills/plan-redesign.
---

# Plan the Redesign (portable)

**What it does:** produces the single whole-site plan before any code. Read `context/{product_requirements,design_system,system_architecture}.md` + root `CLAUDE.md` (and, if a raw reference video exists, run `reference-capture` first). Write `PLAN.md` at the repo root: file/component tree (`system_architecture.md §3`), chapter order `00→06` with per-chapter GSAP/Lenis technique (`design_system.md §7/§11`), true dependency delta (most of the motion stack is already installed), and a PRD→typed-constants data map. List the `product_requirements.md §6` open decisions with recommended defaults (accent is resolved → ember, design_system v2 §3.2).

**When to use:** at the start of the redesign, or when re-planning the remaining scope (04 Craft → 08 Contact + Footer per PLAN v3.1) — chapters 00–03 are already built; plan around them, don't re-plan them.

**Hard rule:** planning is whole-site, execution is per-section (see `workflows/section.md`). **STOP after PLAN.md** and wait for explicit approval; no implementation code in this stage.

(Claude Code: `/plan-redesign`.)
