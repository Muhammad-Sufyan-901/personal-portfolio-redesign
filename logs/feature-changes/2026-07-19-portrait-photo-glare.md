# About: real portrait photo (natural) + glare on hover & first appearance — BUILT, then REVERTED

- **Date:** 2026-07-19
- **Author:** main
- **Type:** feat → revert (same day, owner request; nothing committed)
- **Chapter/Area:** 03 About (portrait), 01 Hero (overflow fix)

## Summary

Built and browser-verified, then fully reverted at owner request before commit. The working tree is back to the pre-task state; only the owner's own edits remain (the photo asset `public/assets/images/profile/about-profile.png`, the `PORTRAIT_SRC` path, `w-full` on the portrait's ParallaxImage). The earlier same-day CV blur reveal was kept.

What the task had shipped (recipe preserved for a future pick-up):

- **Natural photo**: deleted the mix-blend-color duotone tint + the opaque ember wash (404-placeholder-era orange grade) so the real photo showed; kept the ember glow shadow.
- **React Bits GlareHover** (adapted per `animated-ui-references`, no install): hover band retuned to the example (−30°, `paper/30`, 300%, `--dur-base`); a second GSAP-owned `.about-glare-in` band swept `background-position` once per portrait instance on first scroll-into-view (`once: true`, `clamp(top 65%)`, separate element because GSAP writes fight the hover band's CSS transition); `portrait.glareIn` tunable.
- **Bug fix 1**: `.about-inner` (full-width, z-10) swallowed all pointer events over the portrait rail — the v9 glare hover had never fired on desktop. Fix: `pointer-events-none` on the column + `[&>*]:pointer-events-auto`.
- **Bug fix 2**: the documented hero horizontal-overflow bug (manifesto zoom-exit h1) made phones zoom out and lose the last ~370 px of scroll — mobile portrait + finale tail unreachable. Fix: `overflow-x-clip` on the hero section root; FLIP/zoom beat verified visually identical.

## Files touched (net zero after revert)

- `src/features/home/sections/AboutSection.tsx`, `src/features/home/utils/about.tunables.ts`, `src/features/home/sections/HeroSection.tsx` — all restored to pre-task state.

## Notable decisions

- Owner chose "Natural photo" treatment pre-build, then requested a full revert including both bug fixes after seeing it.
- **Both latent bugs are live again** (dead desktop glare hover; mobile page tail unreachable) and are recorded with their verified fixes in `.claude/agent-memory/motion-engineer/about-refine.md`.
- With the opaque wash restored, the real photo sits invisible under the orange box — any future "show the photo" request must re-translucent or remove that wash.

## Verification

- [x] `npx tsc --noEmit` clean after revert
- [x] `npm run lint` clean after revert
- [x] Pre-revert build was fully browser-verified (see memory for the durable findings, incl. the DevTools mobile-emulation `innerHeight` gotcha)

## Follow-ups

- If the portrait feature returns: the full recipe above + memory notes reproduce it; convert the 1.6 MB PNG to WebP when it does.
