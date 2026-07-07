# Hard reset — src stripped to a single blank page

- **Date:** 2026-07-07
- **Author:** main
- **Type:** chore
- **Chapter/Area:** whole `src/` tree + deps + docs/memory

## Summary

Hard reset before the full redesign rebuild: `src/` reduced to the bare Vite + React + TanStack Router + Tailwind v4 shell rendering one blank centered-title page. Everything derived from the `.agents/context/` specs (design tokens, fonts, motion foundation, all 7+1 primitives, PRD data layer, site chrome, chapters 00–04) was deleted — it regenerates from the specs during the rebuild; prior-build knowledge is preserved in `.claude/agent-memory/*` and these logs. 15 now-unused packages uninstalled (gsap, @gsap/react, lenis, split-type, zustand, react-hook-form, @emailjs/browser, @fontsource/jetbrains-mono, cva, clsx, tailwind-merge, lucide-react, radix-ui, @tanstack/router-devtools, shadcn — 347 node_modules removed).

## Files touched

- `src/**` — deleted 10 directories (`assets`, `components`, `config`, `constants`, `features`, `hooks`, `lib`, `providers`, `store`, `types`); ~8.6k lines removed
- `src/main.tsx` — rewritten: `StrictMode → RouterProvider` only, no providers
- `src/routes/__root.tsx` — rewritten: bare `<Outlet/>`
- `src/routes/index.tsx` — rewritten: inline `BlankPage` placeholder
- `src/styles/globals.css` — rewritten: `@import "tailwindcss";` only
- `package.json` / `package-lock.json` — 13 deps + 2 devDeps uninstalled
- `CLAUDE.md` — "Repo state" section rewritten to the bare-slate reality
- `PLAN.md` — status banner: as-built claims void; all chapters rebuild from specs
- `.claude/agent-memory/{frontend-engineer,motion-engineer,qa-auditor}/MEMORY.md` + `frontend-engineer/{content-data-layer,site-chrome}.md` — hard-reset banners; content re-framed as prior-build knowledge to re-apply

## Notable decisions

- Router skeleton KEPT (routes/, `routeTree.gen.ts`, plugin) — it's the shell the rebuild builds into. `vite.config.ts` and `index.html` untouched.
- `src/assets/fonts/GeneralSans-*.woff2` deleted knowingly — the one non-regenerable asset; re-download from Fontshare at rebuild. (`@fontsource-variable/fraunces` was already gone from package.json — retired at the grotesk re-theme, `6209454`.)
- Agent memories were banner-annotated, not wiped — the primitive APIs, choreography patterns, and QA gotchas are the rebuild's head start.
- Blank page uses raw tags + raw neutral classes deliberately: the primitives and tokens it would use no longer exist.

## Verification

- [x] `src/` contains exactly 6 files (`find` verified)
- [x] `npm run build` (tsc -b + vite) clean
- [x] `npm run lint` clean
- [x] `npm run dev` + Chrome: centered title renders, zero console messages

## Follow-ups

- Fresh `/plan-redesign` → new PLAN.md before any rebuild work.
- Re-download General Sans (Fontshare) when the tokens/fonts foundation chapter is rebuilt.
- 9 npm audit vulnerabilities pre-date this change (dev-toolchain transitive) — untouched.
