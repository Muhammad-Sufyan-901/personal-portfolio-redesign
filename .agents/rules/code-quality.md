# Code Quality

- TypeScript strict; no `any`. Functional components; React 19 idioms.
- Feature isolation: no cross-feature imports; promote shared code up.
- Design tokens only — no raw hex/magic px in components. `cn()` for classes, `cva` for variants.
- Small, single-purpose components; named exports; path alias `@/`.
- No dead code, no commented-out blocks left behind, no `console.log` in committed code.

**Why this matters here:** `npm run build` is `tsc -b && vite build` under TS `~5.9.3` strict with `noUnusedLocals`/`noUnusedParameters` — loose code doesn't just fail review, it fails the build; and with only one feature (`home`) plus shared layers, a single cross-feature import or off-token class is immediately visible in the QA greps.
