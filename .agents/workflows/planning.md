# Workflow: /plan-redesign (Stage 1)

Owner: @pm. **No implementation code in this stage.**

0. If a raw video was provided instead of screenshots (e.g. `reference/*.mp4`), run the frame-extraction step in `skills/reference-capture/SKILL.md` first; use the resulting stills as the visual reference for step 1.
1. Read all `context/` docs + root `CLAUDE.md`.
2. Draft `PLAN.md`: file tree, chapter order (`00→06`) with per-chapter GSAP/Lenis technique, dependency delta, PRD→constants mapping.
3. List the open decisions (`product_requirements.md §6`) with a recommended default each.
4. **STOP.** Output `PLAN.md` + the decision questions and wait for explicit approval.
