# Workflow: /build-section <chapter> (Stage 2, step 3)

Owner: @frontend + @motion. One chapter at a time, per `design_system.md §11`.

1. Transcribe the chapter's content from the PRD into typed constants.
2. Build static + responsive + accessible layout (eyebrow → title → content).
3. Attach motion via the primitives (respect reduced-motion).
4. Polish: hover states, cursor labels, parallax, spacing rhythm.
5. Run `/qa-audit` for this chapter; fix findings; commit `feat(<chapter>): ...`.
