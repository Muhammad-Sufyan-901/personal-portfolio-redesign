---
description: Build one scroll-telling chapter of the portfolio (e.g. hero, manifesto, craft, journey, work, contact) to the design system, wiring in the motion primitives. Requires an approved PLAN.md.
argument-hint: <chapter: preloader|hero|manifesto|craft|journey|work|contact>
---

# /build-section $ARGUMENTS

Precondition: `PLAN.md` exists and was approved. If not, run `/plan-redesign` first.

Status check: chapters 00–04 (preloader, hero, manifesto, craft, journey) are already built and committed (`src/features/home/sections/*`); if "$ARGUMENTS" is one of those, this is a revision pass (e.g. the design_system-v2 upgrades: ember re-theme, thick organic journey rail, hero aurora), not a fresh build — read the existing section + its `logs/feature-changes/` entry first.

Build the **$ARGUMENTS** chapter per `.agents/context/design_system.md §11` (choreography vocabulary: `.agents/skills/scrollytelling`):
1. Transcribe this chapter's content from `product_requirements.md` into typed constants (`src/features/home/data/*.data.ts` against `src/types/portfolio.ts`; project data already lives in `src/constants/projects.data.ts`).
2. Build the accessible static + responsive layout (eyebrow → title → content), custom primitives only.
3. Attach motion using @motion's primitives (`RevealText`, `ParallaxImage`, `Marquee`, `MagneticButton`, `ChapterEyebrow`), honoring `prefers-reduced-motion`. For borrowed component ideas (React Bits / Magic UI / Aceternity / 21st.dev) follow `.agents/skills/animated-ui-references` — never install `framer-motion`.
4. Polish: hover states, cursor labels, parallax, spacing rhythm (`padding-block: clamp(6rem, 14vh, 12rem)`).
5. Delegate to the `qa-auditor` subagent for this chapter, fix findings, then commit `feat($ARGUMENTS): ...` (with its `/log-change` entry).
6. **STOP.** Present the finished section and wait for user approval before starting the next chapter — one section per approval gate (see `.agents/workflows/section.md`).

Use the `frontend-engineer` and `motion-engineer` subagents as needed. Tokens only, no raw hex; feature isolation; TS strict.
