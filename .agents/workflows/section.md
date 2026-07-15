# Workflow: /build-section <chapter> (Stage 2, step 3)

Owner: @frontend + @motion. **One chapter at a time**, per **`PLAN.md` v3.1 §3** (the approved 10-chapter map; `design_system.md §7/§11` is the technique reference), with a **stop-for-approval gate after every section** — the next chapter does not start until the user signs off on this one. (This is how chapters 00–03 shipped: one approved `feat(<chapter>):` commit each.)

0. If the chapter already exists (`src/features/home/sections/` — Hero/Manifesto/About today), this is a **revision pass** — read the section and its `logs/feature-changes/` entry first.
1. Transcribe the chapter's content from the PRD into typed constants (`features/home/data/*.data.ts` against `types/portfolio.ts`; project data in `src/constants/projects.data.ts`).
2. Build static + responsive + accessible layout (eyebrow → title → content), custom primitives only.
3. Attach motion via the primitives (respect reduced-motion). External component ideas go through `skills/animated-ui-references` — never install `framer-motion`.
4. Polish: hover states, cursor labels, parallax, spacing rhythm (`padding-block: clamp(6rem, 14vh, 12rem)`).
5. Run `/qa-audit` for this chapter; fix findings; commit `feat(<chapter>): ...` together with its `/log-change` entry (+ any memory update).
6. **STOP — present the section and wait for user approval before the next chapter.**
