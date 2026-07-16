---
name: build-section
description: Build (or revise) one scroll-telling chapter of the portfolio to the design system, wiring in the motion primitives — one chapter per invocation, stop-for-approval gate after. Use after PLAN.md is approved, whenever a chapter is ready to build or revise.
argument-hint: <chapter: preloader|hero|manifesto|about|craft|journey|skills|gallery|contact|footer>
---

# /build-section $ARGUMENTS

Precondition: `PLAN.md` exists and was approved (current: v3.1). If not, run `/plan-redesign` first.

Status check: chapters 00–03 (preloader, hero, manifesto, about) are already built and committed (`src/features/home/sections/*`) on the 10-chapter map; if "$ARGUMENTS" is one of those, this is a revision pass — read the existing section + its `logs/feature-changes/` entry first, not a fresh build.

Build the **$ARGUMENTS** chapter per **PLAN v3.1 §3** (its build-ready spec) with `design_system.md §7/§11` as the technique reference (choreography vocabulary: `.agents/skills/scrollytelling`):
1. Verify/transcribe this chapter's content from `product_requirements.md` into typed constants (`src/features/home/data/*.data.ts` against `src/types/portfolio.ts`; project data already lives in `src/constants/projects.data.ts` — the dataset is fully transcribed, so this is usually a verify step).
2. Build the accessible static + responsive layout (eyebrow → title → content), custom primitives only.
3. Attach motion using @motion's primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`, `PathDraw`), honoring `prefers-reduced-motion` and the PLAN v3.1 §2 conventions contract. For borrowed component ideas (React Bits / Magic UI / Aceternity / 21st.dev) follow `.agents/skills/animated-ui-references` — never install `framer-motion`; for 3D/cinematic beats consult `cinematic-web` (via its ADAPTATION.md).
4. Polish: hover states, cursor labels, parallax, spacing rhythm (`px-page-x py-section` shell).
5. Delegate to the `qa-auditor` subagent for this chapter, fix findings, then commit `feat($ARGUMENTS): ...` (with its `/log-change` entry + any memory update).
6. **STOP.** Present the finished section and wait for user approval before starting the next chapter — one section per approval gate (see `.agents/workflows/section.md`).

Use the `frontend-engineer` and `motion-engineer` subagents as needed. Tokens only, no raw hex; feature isolation; TS strict.
