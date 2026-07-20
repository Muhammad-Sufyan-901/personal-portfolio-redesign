# Projects chapter revision — rename from Craft, index-only layout, preview tilt, tech badges

- **Date:** 2026-07-20
- **Author:** main
- **Type:** refactor + feat
- **Chapter/Area:** 04 Projects (formerly Craft)

## Summary

Owner-requested revision of chapter 04: the chapter is now purely the project index. Renamed "Craft" → "Projects" everywhere (nav label, `#projects` anchor, eyebrow, file/component/tunables/CSS-selector names via `git mv`); removed the skills-derived content above the index (the "Web & Mobile" RevealText headline, the Web/Mobile approach-pillars grid, and the keyword Marquee band — a dedicated Skills chapter 06 comes later); widened row rhythm `py-6` → `py-10 md:py-14`; added a mouse-follow 3D tilt to the sticky preview frame (GSAP `quickTo` rotationX/Y, listener on the section since the panel is `pointer-events-none`); added tech-stack badges with Simple Icons brand logos (new `react-icons` dependency) inside the active row's expanding description container.

## Files touched

- `src/features/home/sections/CraftSection.tsx` → `ProjectsSection.tsx` — rename, content removal, `rowPad` const, badges, tilt `useGSAP` block
- `src/features/home/utils/craft.tunables.ts` → `projects.tunables.ts` — `CRAFT` → `PROJECTS`, new `tilt` tunables (`max: 7`°, `duration: 0.6`s, `perspective: 500`px)
- `src/features/home/utils/tech-icons.ts` — new; techStack label → Simple Icons component map (10 entries, all PRD strings covered)
- `src/constants/navigation.constant.ts` — `{ label: "Projects", href: "#projects" }`
- `src/features/home/pages/HomePage.tsx` — import/JSX swap
- `src/components/common/PathDraw.tsx` — comment rename only
- `package.json` / `package-lock.json` — `react-icons ^5.7.0`

## Notable decisions

- Full mechanical rename (files, component, tunables const, `.projects-*` selectors) over a label-only rename — the blast radius was one file + three one-line satellites, and a half-renamed chapter creates two dialects. `logs/` history left untouched.
- Tilt is a third `useGSAP` block, separate from the crossfade block, so it never re-runs on `activeIndex`; it only tweens the frame's rotation so it cannot fight the `autoAlpha` crossfade (whose no-`revertOnUpdate` invariant stands). `transformPerspective` set on the frame itself — zero extra markup.
- Badges ride the existing `grid-rows-[0fr→1fr]` reveal (no own animation) and render statically expanded under reduced motion for free. Icons are monochrome `currentColor` (tokens-only), `aria-hidden`.
- **Gotcha for the record:** react-icons 5.7.0's *type declarations* still export `SiCss3` but the *runtime* module only has `SiCss` (Simple Icons v14 rename) — `tsc --noEmit` passed while the browser threw. Caught in the dev-server smoke; use `SiCss`.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] DoD greps clean (no bare tags in section, no new raw hex, zero `craft` references left in `src/`)
- [x] Live smoke (chrome-devtools MCP): `#projects` anchors, eyebrow "04 — Projects", 6 rows at new rhythm, 20/20 badges with icons, focal-band activation + preview crossfade intact, tilt matrix responds to mousemove and settles back, path thread clear of titles, ScrollProgressHUD label picked up "Projects" from `navLinks` automatically
- [x] Reduced-motion (matchMedia override): all rows bright + expanded with badges, preview (and tilt) hidden

## Follow-ups

- Project thumbnails still pending owner assets — preview shows ember-gradient placeholders.
- If the tilt reads flat on wide screens, tune `PROJECTS.tilt` (raise `max`, lower `perspective`); add subtle `x`/`y` drift only if wanted.
- `tech-icons.ts` is feature-local; promote to `src/lib/` if Skills (06) reuses it.
