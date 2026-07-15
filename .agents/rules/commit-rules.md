# Commit Rules

> Twin: no `.claude/rules/` mirror — the Claude Code counterpart is the `/commit` skill (`.claude/commands/commit.md`), which follows this file.

- **Conventional Commits:** `type(scope): summary` — types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `perf`, `test`, `a11y`.
- **One logical unit per commit.** Commit per chapter/section, per primitive, or per config step — never one giant "build everything" commit.
- **Scope = the chapter or module**, e.g. `feat(hero): char reveal + mouse parallax`, `feat(motion): SmoothScrollProvider + gsap ticker sync`, `chore(setup): tailwind v4 @theme tokens`.
- **Summary:** imperative, ≤ 72 chars, no trailing period.
- **Body (optional):** why + notable decisions (e.g. "reduced-motion fallback: opacity-only").
- **Never commit:** `.env*`, `node_modules`, `.artifacts/`, secrets, or generated `routeTree.gen.ts` conflicts left unresolved.
- **Green before commit:** `tsc --noEmit` + `eslint` must pass; don't commit broken builds.

**Why this matters here:** the real history already follows this shape — `feat(preloader)` `4d3c399` → `feat(manifesto)` `304b08c` → `feat(about)` `3c04a94`/`db6731f`, one commit per chapter (plus scoped `fix(<chapter>):` follow-ups), each carrying its `logs/feature-changes/` entry; the pre-reset pass followed the same shape. Per-chapter commits are also what makes the one-section-per-approval-gate workflow (`workflows/section.md`) reviewable.
