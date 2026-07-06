---
description: Stage changes and write a Conventional Commit that follows .agents/rules/commit-rules.md.
argument-hint: [optional scope hint]
---

Review the current diff:

!`git status --short && git diff --stat`

Then create ONE logical Conventional Commit following `.agents/rules/commit-rules.md`:
- Format `type(scope): summary` (imperative, ≤72 chars, no trailing period).
- Scope = the chapter/module touched (e.g. `hero`, `motion`, `setup`). Use "$ARGUMENTS" as a hint if provided.
- Ensure `npx tsc --noEmit` and `npm run lint` pass before committing.
- Do NOT stage `.env*`, `.artifacts/`, or secrets.
Stage the relevant files and commit. Show the final commit message.
