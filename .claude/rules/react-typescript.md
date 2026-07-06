---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# React 19 + TypeScript (strict)

- TS strict, no `any`. Prefer precise types; derive from `src/types/portfolio.ts` for content.
- React 19: no `forwardRef` needed for ref-as-prop; functional components + hooks only.
- Components small and single-purpose; lift shared UI to `components/common`.
- Data flows from typed constants (no fetching for static content).
- Contact form: react-hook-form; submit via `lib/emailjs.ts`; no page reload.
