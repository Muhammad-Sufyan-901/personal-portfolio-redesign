---
name: vite-setup
description: Vite config for this React-TS portfolio — alias, Tailwind v4, TanStack Router plugin, fonts. Activate during scaffolding.
---

# Vite Setup

## vite.config.ts
- Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`, `@tanstack/router-plugin/vite` (`{ autoCodeSplitting: true }`).
- Alias `@` → `/src` (also set `paths` in `tsconfig`).

## Fonts
- `@fontsource-variable/fraunces` + `@fontsource/jetbrains-mono` imported in `main.tsx`.
- General Sans / Satoshi self-hosted from Fontshare in `src/assets/fonts` via `@font-face` (`font-display: swap`); preload the display face.

## Env
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` in `.env` (gitignored). Read via `src/config/env.ts`.

## As built
Vite `^7.3.1`; plugin order `tanstackRouter({ autoCodeSplitting: true })` → `react()` → `tailwindcss()`; alias `@` → `/src` in both `vite.config.ts` and tsconfig. Fonts are bundled and live: `@fontsource-variable/fraunces ^5.2.9` + `@fontsource/jetbrains-mono ^5.2.8` via npm, General Sans variable woff2 self-hosted in `src/assets/fonts/` with `@font-face` in `src/styles/globals.css` (note: `src/index.css` was removed at bootstrap — globals.css is the only stylesheet). `src/config/env.ts` exists; `src/lib/emailjs.ts` does not yet (Contact chapter). Claude Code mirror: build-config section of `.claude/rules/project.md`.
