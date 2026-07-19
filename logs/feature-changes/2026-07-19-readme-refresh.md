# README refresh to as-built state + hero screenshot

- **Date:** 2026-07-19
- **Author:** main
- **Type:** chore
- **Chapter/Area:** root docs (README.md) — no src/ changes

## Summary

Rewrote `README.md` to match the 2026-07-19 as-built state and added a hero screenshot
under the title (pattern borrowed from the owner's previous portfolio README). The old
README was frozen at 2026-07-16: it still described the retired three-act
Welcome/ember/curtain preloader and the two-row hero name, and omitted everything from
07-17 → 07-19 (manifesto center-born entry + seam blend, About staged reveals, odometer
glass stat cards, CV blur reveal, ember-duotone portrait glare) plus the live
Switzer + Instrument Serif hero pairing and the three/R3F/ogl stack rows.

## Files touched

- `README.md` — full rewrite: screenshot header, build status re-dated 2026-07-19,
  chapters 00–03 descriptions refreshed, stack table + three/R3F/drei + ogl rows,
  typography updated to the 5-face reality (`--font-display-lead/tail` tokens), scripts
  table + `capture:ref`, structure tree extended with `public/` + `reference/` + `docs/`,
  contact chapter corrected 06 → 08, author footer added
- `docs/screenshots/hero.jpg` — new; fresh 1440×900@2x capture of the settled hero
  (post-preloader) via chrome-devtools MCP, PNG→JPEG q90 with `sips` (1.3 MB → 376 KB)

## Notable decisions

- **Screenshot home = `docs/screenshots/`** (new committed folder) — `public/` would ship
  it in the build, `.artifacts/` is gitignored dev output.
- **JPEG over PNG** for the aurora gradient (PNG 1.3 MB vs JPEG q90 376 KB, no visible
  banding at README size).
- **No live-demo link, no badges** — no deploy config exists; content-integrity rule says
  omit unknowns, never invent.
- Dropped the stale skills-inventory counts from the Docs section (they drift); AGENTS.md
  is linked as the source instead.

## Verification

- [x] `npx tsc --noEmit` clean — n/a, docs-only change (no src/ touched)
- [x] `npm run lint` clean — n/a, docs-only change
- [ ] reduced-motion / a11y checked (if UI) — n/a
- [ ] Lighthouse ≥ 90 (if a section shipped) — n/a
- [x] image path `docs/screenshots/hero.jpg` resolves relative to repo root; markdown
  tables/fences render

## Follow-ups

- Re-capture the hero shot if the hero/aurora visual changes before launch, and add
  per-chapter shots once 04–08 ship (optional).
- CLAUDE.md's typography line still reads "display face Fraunces" without the hero
  lead/tail pairing — fine for now (Fraunces is still the display face), reconcile at the
  next docs sync.
