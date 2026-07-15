---
paths:
  - "src/**/*.ts"
  - "src/**/*.tsx"
---

# React 19 + TypeScript (strict)

> Twin: `.agents/rules/code-quality.md` (portable mirror — same rule, keep in sync).

- TS strict, no `any`. Prefer precise types; derive from `src/types/portfolio.ts` for content.
- React 19: no `forwardRef` needed for ref-as-prop; functional components + hooks only.
- Components small and single-purpose; lift shared UI to `components/common`.
- Data flows from typed constants (no fetching for static content).
- Contact form: react-hook-form; submit via `lib/emailjs.ts`; no page reload.

## Project specifics (mirrors `.agents/skills/typescript-react-strict`)

- Toolchain: TypeScript `~5.9.3` (`tsconfig.app.json`: `strict`, `noUnusedLocals`, `noUnusedParameters`, `verbatimModuleSyntax`, `moduleResolution: bundler`), React `^19.2.0`, react-hook-form `^7.81.0`, `@emailjs/browser ^4.4.1`.
- The content contract in `src/types/portfolio.ts` is already in use: `TechStack`, `Project`, `Skill`, `JourneyItem`, `Profile`, `ContactChannel` — typed against by `src/features/home/data/{profile,skills,journey,contact}.data.ts` and `src/constants/projects.data.ts`. Motion types (`RevealMode`, `ParallaxConfig`) live in `src/types/motion.ts`.
- Cross-tree UI state is the minimal zustand `^5.0.14` store `src/store/useUIStore.ts` (`preloaderDone`, `menuOpen`) — don't add slices for derivable state, and don't reintroduce a server-state layer.
- Note: `src/lib/emailjs.ts` does **not exist yet** — it lands with the Contact chapter (08 on the 10-chapter map). Don't reference it as present until then.

**Why this matters here:** `npm run build` runs `tsc -b` first, so any loose type fails the build; the PRD data layer only stays trustworthy ("bad edits fail compilation") if every constant keeps its explicit `portfolio.ts` type annotation.
