# Final cleanup sweep before redesign build — strip boilerplate residue

- **Date:** 2026-07-07
- **Author:** main
- **Type:** chore
- **Chapter/Area:** repo hygiene (src assets, package metadata, dependencies)

## Summary

Final residue sweep so the remaining build stages start from a verified-clean baseline. The audit confirmed the big cleanup (`9be4947`) left nothing behind — zero hits for axios/react-query/js-cookie/react-table/framer-motion/auth/dashboard across `src/` and `package.json`, routes are registry-only (`__root`, `index`), and `routeTree.gen.ts` is free of removed-route references. What remained was small: Vite/React starter assets, stale package metadata, two unused dependencies, and a stray empty directory. Note: PROMPT B2's other Task 2 items were already moot — `src/index.css` was deleted at bootstrap (tokens live in `src/styles/globals.css`) and `RootLayout`'s `bg-slate-50` was token-fixed in the Hero QA round; no styling was touched here (ember re-theme stays a build-stage task).

## Files touched

- `src/features/work/` (+ empty `pages/`) — removed; stray untracked `mkdir` from earlier today, zero files. `src/features/` = `home` only.
- `src/assets/react.svg`, `src/constants/images.ts` — deleted (starter logo + its only consumer; `IMAGES.REACT_LOGO` referenced nowhere).
- `public/vite.svg` — deleted; `index.html` favicon swapped to a neutral inline data-URI "MS" placeholder (no network request → no 404). Real brand favicon ships with the redesign build.
- `package.json` — `name` → `muhammad-sufyan-portfolio`; added accurate `description` + `author`. `package-lock.json` — synced by uninstall.
- Dependencies — uninstalled `@base-ui/react` (unused; shadcn `button`/`tooltip` import the unified `radix-ui`) and `tw-animate-css` (imported nowhere, incl. `globals.css`).

## Notable decisions

- Kept `radix-ui` (used by `src/components/ui/*`) and `@tanstack/router-devtools` (imported in `RootLayout`; no-ops in production builds).
- Historical logs mentioning the old package name stay as-is (history, not knowledge).

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] `npm run build` succeeds (1.33s)
- [x] `npm run dev` → `/` renders with **zero console messages** and no 404s (checked via Chrome DevTools MCP; favicon is data-URI so no request at all)
- [x] Residue greps empty: `axios|react-query|js-cookie|react-table|framer-motion|base-ui|tw-animate` in `src/` + `package.json`
- [x] Old-palette grep in `src/` empty (`C8A46A|ECE8E1|0B0B0F|brass`)

## Follow-ups

- Real favicon / og-image assets — with the redesign build (PROMPT C).
- `npm audit` reports 16 vulnerabilities (2 low / 5 moderate / 9 high) in the tree — pre-existing, not introduced here; review separately if desired.
