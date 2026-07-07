---
description: Stage changes and write a Conventional Commit that follows .agents/rules/commit-rules.md.
argument-hint: [optional scope hint]
---

Review the current diff:

!`git status --short && git diff --stat`

Then create ONE logical Conventional Commit following `.agents/rules/commit-rules.md`:
- Format `type(scope): summary` (imperative, ≤72 chars, no trailing period). Types include `a11y` alongside the standard set.
- Scope = the chapter/module touched (e.g. `hero`, `motion`, `setup`). Use "$ARGUMENTS" as a hint if provided. Follow the shape already in history: `feat(journey): merged work/education/awards timeline with rail draw`, `feat(motion): gsap source, Lenis provider, motion primitives`, `chore(setup): motion deps, self-hosted fonts, warm-ink @theme tokens`.
- Ensure `npx tsc --noEmit` and `npm run lint` pass before committing.
- Do NOT stage `.env*`, `.artifacts/`, or secrets. Include the matching `logs/feature-changes/` entry (and any memory update) in the same commit as the change it documents, per `.claude/rules/logging.md`.
Stage the relevant files and commit. Show the final commit message.
