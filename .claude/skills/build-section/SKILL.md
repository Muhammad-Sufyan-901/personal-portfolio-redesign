---
description: Build one scroll-telling chapter of the portfolio (e.g. hero, manifesto, craft, journey, work, contact) to the design system, wiring in the motion primitives. Requires an approved PLAN.md.
argument-hint: <chapter: preloader|hero|manifesto|craft|journey|work|contact>
---

# /build-section $ARGUMENTS

Precondition: `PLAN.md` exists and was approved. If not, run `/plan-redesign` first.

Build the **$ARGUMENTS** chapter per `.agents/context/design_system.md §11`:
1. Transcribe this chapter's content from `product_requirements.md` into typed constants.
2. Build the accessible static + responsive layout (eyebrow → title → content).
3. Attach motion using @motion's primitives (`RevealText`, `ParallaxImage`, etc.), honoring `prefers-reduced-motion`.
4. Polish: hover states, cursor labels, parallax, spacing rhythm.
5. Delegate to the `qa-auditor` subagent for this chapter, fix findings, then commit `feat($ARGUMENTS): ...`.

Use the `frontend-engineer` and `motion-engineer` subagents as needed. Tokens only, no raw hex; feature isolation; TS strict.
