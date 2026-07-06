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
