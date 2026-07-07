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

## As built
TypeScript `~5.9.3` (`verbatimModuleSyntax`, `noUnusedLocals/Parameters`), React `^19.2.0`. The content contract is live: `src/types/portfolio.ts` (`TechStack`, `Project`, `Skill`, `JourneyItem`, `Profile`, `ContactChannel`) typed against by `src/features/home/data/*.data.ts` (21 skills, 9 journey items) and `src/constants/projects.data.ts` (6 projects); `src/types/motion.ts` holds `RevealMode`/`ParallaxConfig`. Cross-tree UI state = zustand `^5.0.14` `useUIStore` (`preloaderDone`, `menuOpen`) only. Claude Code mirror: `.claude/rules/react-typescript.md`.
