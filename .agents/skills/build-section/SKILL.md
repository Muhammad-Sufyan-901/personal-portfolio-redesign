---
name: build-section
description: Build (or revise) one scroll-telling chapter at a time — transcribe content, static accessible layout, motion, polish, QA, commit, then stop for approval. Portable mirror of the invokable .claude/skills/build-section.
---

# Build One Section (portable)

**What it does:** executes exactly one chapter (preloader | hero | manifesto | craft | journey | work | contact) per `design_system.md §11`: (1) transcribe the chapter's PRD content into typed constants (`src/features/home/data/*.data.ts` against `src/types/portfolio.ts`); (2) build the accessible static layout with the custom primitives; (3) attach motion via the shipped motion primitives (reduced-motion honored; borrowed ideas go through `animated-ui-references`); (4) polish (hover, cursor labels, rhythm); (5) run the QA audit for the chapter, fix, commit `feat(<chapter>): …` with its change log.

**When to use:** after `PLAN.md` is approved, one chapter per invocation. Chapters 00–04 already exist in `src/features/home/sections/` — for those it's a revision pass (read the section + its `logs/feature-changes/` entry first), not a fresh build.

**Hard rule:** after the commit, **stop and present the section for user approval** before starting the next chapter — every section has its own gate (`workflows/section.md`).

(Claude Code: `/build-section <chapter>`, which delegates to the `frontend-engineer` + `motion-engineer` subagents.)
