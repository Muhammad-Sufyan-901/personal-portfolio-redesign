# Foundation re-bootstrap (Stage B0) — tokens, motion, primitives, data layer

- **Date:** 2026-07-08
- **Author:** main
- **Type:** chore
- **Chapter/Area:** foundation (everything below the sections)

## Summary

Rebuilt the entire foundation from PLAN v3 onto the bare shell: 15 deps reinstalled (+ shadcn devDep), General Sans re-downloaded from Fontshare, Void & Ember tokens applied (ember `#E8380F`, dark-only — values directly in `@theme`, no `.light` block), single-source motion setup (gsap.ts, SmoothScrollProvider, 3 hooks, useUIStore), all 14 primitives (6 base + 8 motion incl. PathDraw), shadcn button/tooltip, and the full typed PRD data layer (21 skills + 6 tools, 9 journey items, 6 projects, 3 contact channels, profile). Shell rewired: main.tsx → AppProviders(Theme→Tooltip→SmoothScroll) → Router; HomePage is a token/font smoke-check placeholder.

## Files touched

- `src/styles/globals.css` — full Void & Ember token set (§9 + §3.4 + §4.3 + §5.2), Fraunces/GS/JBM font wiring
- `src/lib/{gsap,utils}.ts` — single GSAP source; extended-twMerge `cn()` with `--text-*` font-size groups
- `src/types/{portfolio,motion}.ts` — content contract (+ `Skill.category`, `Profile.stats/favoredStacks/aboutStatement`)
- `src/providers/{SmoothScrollProvider,theme-provider,AppProviders}.tsx`, `src/hooks/*` (3), `src/store/useUIStore.ts`
- `src/components/common/*` — Box, Container, Text, Heading, Link, Image, RevealText, ParallaxImage, Marquee, MagneticButton, ChapterEyebrow, Cursor, Preloader, PathDraw + barrel
- `src/components/ui/{button,tooltip}.tsx` (shadcn), `src/components/layouts/RootLayout.tsx`
- `src/features/home/{data/*,pages/HomePage.tsx,index.ts}`, `src/constants/{projects.data,navigation}.ts`, `src/config/{site,env}.ts`
- `src/assets/fonts/GeneralSans-*.woff2` (re-sourced), `src/main.tsx`, `src/routes/{__root,index}.tsx`
- `.claude/agent-memory/*` — banners updated to post-B0 status

## Notable decisions

- Dark-only: tokens live directly in `@theme` (no `:root`/`.light` indirection) — a light block would be a globals.css-only addition later.
- Fraunces is the display face again (PLAN v3 #5 reverts the interim grotesk swap); mixed-pairing hero device lands with chapter 01.
- `Box`/`Container` use `ComponentPropsWithRef` (React 19 ref-as-prop) — motion primitives pass refs into Box.
- `Image` keeps the documented prop surface but drops fake srcset generation (single static URL); skeleton/fallback/lazy retained.
- Preloader/Cursor built now, mounted at chapter 00 (per plan).

## Verification

- [x] `npm run build` (tsc -b + vite) clean — all 4 font families bundled
- [x] `npm run lint` clean
- [x] Runtime: placeholder renders Fraunces display + mono labels on void bg, zero console messages, Lenis active
- [ ] Lighthouse — deferred to section audits (no real content yet)

## Follow-ups

- Chapter 00 (Preloader) next, behind its own approval gate.
- `lib/emailjs.ts` lands with chapter 08.
