# Docs expand: fuller detail across README / CLAUDE / GEMINI / AGENTS

- **Date:** 2026-07-07
- **Author:** main
- **Type:** docs
- **Chapter/Area:** documentation

## Summary
Expanded the four root docs (synced yesterday in `f7667b6`) to be more detailed and comprehensive, per request. Added exact component/config APIs, the real provider nesting, the design-system-at-a-glance, the chapter map, and the full agent workflow — while keeping `.agents/context/*` as the single source of truth (docs summarize and point, don't duplicate the deep specs).

## Files touched
- `README.md` — added identity line, installed-vs-bootstrap stack tables, scripts table, chapters table, design-language (target) section, component-primitive table + example, annotated structure, docs/workflow pointer block.
- `CLAUDE.md` — enriched repo state (current-vs-planned callout: index.css still default shadcn tokens), redesign context (palette tokens, fonts, motion tokens, 3 Golden Rules, Journey merges awards); Architecture rewritten into subsections (routing, features, providers/entry, theme, common-component API table, ui, styling, state/data, types, build/config). Kept the two agent-rules sections (lightly enriched).
- `gemini.md` — brought to near-parity with CLAUDE.md (same depth, still leaner); component API table + working rules.
- `AGENTS.md` — expanded: both-layer trees, protocols (read-first, artifact-generation), fuller roster table with ownership, Golden Rules, workflow + post-change discipline, skills/commands/MCP/rules inventory.

## Notable decisions
- Documented a strict **current-vs-planned** boundary: current `src/index.css` holds the default shadcn oklch palette (`--font-sans: Inter`); the ink/paper/brass tokens + Fraunces/General Sans and the motion stack are the redesign target, not present. Planned files (`lib/gsap.ts`, `SmoothScrollProvider`, `useUIStore`, `emailjs.ts`, `types/portfolio.ts`) are never described as existing.
- Stated that Journey (chapter 04) merges experience + education + awards, so awards aren't dropped.
- Component API tables use the real prop surface read from `src/components/common/*` (maxWidth default `7xl`, Image `quality` 75, etc.).

## Verification
- [x] `npx tsc --noEmit` clean (no code changed)
- [x] `npm run lint` clean
- [x] grep of the four docs for stale terms (axios/authMiddleware/useAuthStore/api.type/VITE_API_BASE_URL/React 18/react-query) — only the intentional historical cleanup mention and clearly-framed "planned Zustand" remain
- [x] every path referenced in the docs verified to exist on disk; no planned file described as present
- [ ] reduced-motion / a11y — n/a (docs only)
- [ ] Lighthouse — n/a (docs only)

## Follow-ups
- `package.json` `name` is still `react-ts-enterprise-boilerplate` — rename to `portfolio-redesign` when convenient.
- `RootLayout` still uses `bg-slate-50` (light) while `index.html` forces dark — leftover from the shell; resolve when the design-system foundation is bootstrapped.
