---
name: typescript-react-strict
description: TypeScript strict + React 19 conventions for this codebase. Activate when writing components, hooks, types, or constants.
---

# TypeScript (strict) + React 19

## Rules
- `strict: true`, no `any`. Content typed against `src/types/portfolio.ts` (`Project`, `Skill`, `JourneyItem`, `Profile`).
- Functional components only; React 19 → no `forwardRef` needed (ref as prop).
- Feature isolation: `src/features/*` never imports from another feature; promote shared code to `components/common`, `lib`, `hooks`, `types`.
- Named exports preferred; path alias `@/` → `src/`.
- Derive state, don't duplicate; keep components small and single-purpose.
- Content constants are transcribed from the PRD — never fabricate facts.
