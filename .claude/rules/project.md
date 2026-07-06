# Project conventions (always on)

- Content is transcribed from `.agents/context/product_requirements.md`. Never invent facts; omit unknowns.
- Feature-based structure; a `src/features/*` module must NOT import from another feature. Promote shared code to `components/common`, `lib`, `hooks`, or `types`.
- Path alias `@/` → `src/`. Named exports preferred. Functional components only.
- Design tokens only (Tailwind v4 `@theme` vars) — no raw hex or magic px in components.
- Before implementation, the plan must be approved (see workflow in CLAUDE.md).
