# Skills: dark-bg icon swaps + 10 owner-added items + "Animation & 3D" group

- **Date:** 2026-07-26
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 06 Skills (data + accordion rows)

## Summary
The owner dropped 12 new brand SVGs into `src/assets/icons/`. Two are dark-bg
replacements for marks that read poorly on ink (`nextdotjs.svg` → Next JS,
`github-dark.svg` → GitHub); the other 10 had no skill item behind them. All 10
are now wired as accordion items, and the previously-deferred **"Animation & 3D"**
group ships as the 2nd group (after Frontend) holding GSAP · Three.js · WebGL ·
Framer Motion. The PRD arrays are untouched — the additions live in a separate
`ownerItems` object so provenance stays visible.

## Files touched
- `src/features/home/data/skills.data.ts` — added `ownerItems` (owner-approved,
  non-PRD); `skillGroups` gained "Animation & 3D" and appends the extras to
  Backend/Databases/DevOps & Tools/Mobile/Design; `SkillGroupItem` gained
  `invert?: boolean`; header comment rewritten (Animation & 3D no longer deferred).
- `src/features/home/utils/skill-icons.ts` — 6 new `ALIASES` entries
  (`Next JS`→nextdotjs, `GitHub`→github-dark, `Three.js`→threedotjs,
  `Inertia.js`→inertiajs-wordmark, `Claude Code`→claude-code,
  `Framer Motion`→framer). The rest resolve by lowercase.
- `src/features/home/sections/SkillsSection.tsx` — `cn()` import; the logo
  `Image` applies `invert` when `item.invert`.
- `src/assets/icons/` — 12 new SVGs committed.

## Notable decisions
- **PRD integrity kept by separation, not by exception.** `skills` (§3.1, 21) and
  `tools` (§3.2, 6) stay verbatim; the 10 extras sit in `ownerItems` with a comment
  naming the owner decision — same precedent as `src/data/projects.data.ts`
  (owner-approved additions, 2026-07-20). Rejected: widening `SkillCategory` and
  pushing the extras into `skills`, which would have blurred what is PRD-backed.
- **No `level` on the new items.** `SkillsSection` renders names only (`level` is
  never read), so inventing levels would have been fabricating facts.
- **`expo.svg` is `#000020`** — invisible on `#0A0A0A`. Owner chose a CSS `invert`
  on that one icon over commissioning a light variant; carried by the new
  `SkillGroupItem.invert` flag rather than a name-keyed set in the section.
- **`framer.svg` supersedes `framer motion.svg`** — the older file is a mislabeled
  SVG-Repo "fluent-design" icon, not the Framer mark.
- **Wordmarks stay at 16px square** (owner call). `webgl.svg` (1200×500) and
  `inertiajs-wordmark.svg` render small in the fixed
  `SKILLS_SECTION.logos.sizePx` slot; no aspect-aware sizing was added.
- **Inertia.js → Backend** (ships as Laravel's front-end adapter; pairs with
  Laravel in `projects.data.ts`).

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] All 37 accordion items resolve to an existing icon file (scripted check of
      alias + lowercase stems against `src/assets/icons`), and the live page
      renders 7 groups in the intended order.
- [ ] reduced-motion / a11y — unchanged surface (icons are `alt="" aria-hidden`,
      data-only change), not re-audited.
- [ ] Lighthouse ≥ 90 — deferred to the global QA pass.

## Follow-ups
- Superseded assets still eagerly globbed into the bundle: `next js.svg`,
  `github.svg`, `framer motion.svg` (~5 KB). Delete when convenient.
- `webgl.svg` / `inertiajs-wordmark.svg` read small at 16px — revisit if the owner
  wants square marks for those two.
