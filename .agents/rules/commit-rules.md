# Commit Rules

- **Conventional Commits:** `type(scope): summary` — types: `feat`, `fix`, `refactor`, `style`, `chore`, `docs`, `perf`, `test`, `a11y`.
- **One logical unit per commit.** Commit per chapter/section, per primitive, or per config step — never one giant "build everything" commit.
- **Scope = the chapter or module**, e.g. `feat(hero): char reveal + mouse parallax`, `feat(motion): SmoothScrollProvider + gsap ticker sync`, `chore(setup): tailwind v4 @theme tokens`.
- **Summary:** imperative, ≤ 72 chars, no trailing period.
- **Body (optional):** why + notable decisions (e.g. "reduced-motion fallback: opacity-only").
- **Never commit:** `.env*`, `node_modules`, `.artifacts/`, secrets, or generated `routeTree.gen.ts` conflicts left unresolved.
- **Green before commit:** `tsc --noEmit` + `eslint` must pass; don't commit broken builds.
