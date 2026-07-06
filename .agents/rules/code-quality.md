# Code Quality

- TypeScript strict; no `any`. Functional components; React 19 idioms.
- Feature isolation: no cross-feature imports; promote shared code up.
- Design tokens only — no raw hex/magic px in components. `cn()` for classes, `cva` for variants.
- Small, single-purpose components; named exports; path alias `@/`.
- No dead code, no commented-out blocks left behind, no `console.log` in committed code.
