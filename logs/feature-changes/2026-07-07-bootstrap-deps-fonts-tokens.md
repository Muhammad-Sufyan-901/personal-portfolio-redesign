# Bootstrap — dependencies, fonts, design tokens

- **Date:** 2026-07-07
- **Author:** main
- **Type:** chore
- **Chapter/Area:** tokens / foundation

## Summary
Stage B bootstrap after PLAN.md approval. Installed the motion/form/font dependency delta, self-hosted the three type families, and replaced the default shadcn oklch palette with the Warm Ink design system tokens (cobalt accent per the approved decision). CSS moved from `src/index.css` to `src/styles/globals.css` per `system_architecture.md §3`.

## Files touched
- `PLAN.md` — approved Stage A plan written to repo root
- `package.json` / `package-lock.json` — added gsap, @gsap/react, lenis, split-type, zustand, react-hook-form, @emailjs/browser, @fontsource-variable/fraunces, @fontsource/jetbrains-mono
- `src/assets/fonts/GeneralSans-Variable{,Italic}.woff2` — General Sans from Fontshare (variable only; static cuts dropped)
- `src/styles/globals.css` — new token file: warm-ink palette + cobalt accent, `.light` overrides, fluid type scale (`--text-display`…`--text-meta`), layout/radius/motion tokens, shadcn compat mapping, base styles (selection, focus ring, hidden scrollbar, reduced-motion)
- `src/index.css` — deleted (replaced by globals.css)
- `src/main.tsx` — import path updated
- `components.json` — shadcn css path updated

## Notable decisions
- Accent = **Cobalt `#3B5BFF`** (deep `#2E48D6`), light toggle kept, multi-page `/work/$slug`, 5 featured projects — all resolved at planning approval (see PLAN.md §5).
- Light-mode neutrals beyond the three documented values (surface/raised/muted/faint/line) were derived from the warm-paper ramp; keyed off the existing `.light` class, not `[data-theme]`.
- shadcn tokens (`--color-primary`, `--color-border`, …) mapped onto our palette so `button`/`tooltip` inherit the theme without edits.
- Kept only the variable General Sans files (weights 200–700 in one woff2) instead of 14 static cuts.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run build` clean (fonts + css bundled)
- [ ] reduced-motion / a11y checked (no UI yet)
- [ ] Lighthouse (no section shipped yet)

## Follow-ups
- `ffmpeg` not installed — reference frames from `reference/lukebaffait-scroll.mp4` not extracted; optional calibration later.
- Fraunces preload (`design_system.md §10.7`) to be added when the hero ships.
- `.env` EmailJS keys needed before chapter 06.
