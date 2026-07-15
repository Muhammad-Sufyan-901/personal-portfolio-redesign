# Workflow: /plan-redesign (Stage 1)

Owner: @pm. **No implementation code in this stage.** Planning is **whole-site** — one `PLAN.md` covers every chapter; execution (Stage 2) then runs one section at a time with its own approval gate per section (`section.md`).

0. If a raw video was provided instead of screenshots (e.g. `reference/*.mp4`), run the frame-extraction step in `skills/reference-capture/SKILL.md` first; use the resulting stills as the visual reference for step 1. (Already done once — design_system.md v2 §3.0 was sampled from 47 frames of `reference/lukebaffait-scroll.mp4`.)
1. Read all `context/` docs (design_system.md is at v2 — "Void & Ember") + root `CLAUDE.md`, plus the as-built state: the canonical build-status paragraph in `AGENTS.md` (chapters 00–03 shipped on the 10-chapter map).
2. Draft/revise `PLAN.md` (currently v3.1, approved): file tree, chapter order (`00→08` + Footer) with per-chapter GSAP/Lenis technique, marking built chapters revise-vs-skip; true dependency delta (motion/form stack already installed); PRD→constants mapping (data layer already exists in `features/home/data/*`).
3. List the open decisions (`product_requirements.md §6` — accent is resolved → ember per design_system v2 §3.2 — plus v2's serif-vs-grotesk and invert-section placement) with a recommended default each.
4. **STOP.** Output `PLAN.md` + the decision questions and wait for explicit approval.
