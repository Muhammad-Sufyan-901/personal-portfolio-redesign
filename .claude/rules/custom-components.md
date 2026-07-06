---
paths:
  - "src/**/*.tsx"
---

# Custom component primitives (enforced everywhere, incl. subagents)

Output styles are not inherited by subagents, so this rule is the durable enforcement. In any `src/**/*.tsx` under `features/`, `pages/`, `sections/`, `layouts/`:

- Never emit a bare `div`, `p`, `span`, `h1`–`h6`, `a`, or `img`. Use `@/components/common`: `Box`/`Container` (polymorphic via `as`), `Text` (`as`, `variant`), `Heading` (`level`/`variant`), `Link` (`href`), `Image`. See `.claude/output-styles/custom-components.md` for the full mapping + example.
- Interactive controls → shadcn/ui from `@/components/ui`. Raw wrapper-less leaves (`svg`, `input`) only as a last resort.
- Honors the repo's `react/forbid-elements` convention (bare `<div>` is an error → `<Box>`).
- Exempt: `src/components/common/*` and `src/components/ui/*` (these define/own the raw elements).
