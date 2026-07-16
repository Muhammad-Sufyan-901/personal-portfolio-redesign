# Repo hygiene refactor: layouts split, constants split, tunables/channels → utils, providers casing

- **Date:** 2026-07-17
- **Author:** main
- **Type:** refactor
- **Chapter/Area:** repo hygiene / file organization (no behavior change)

## Summary
Four requested file-organization cleanups against the as-built chapters 00–03: split `components/layouts/` into the one true route layout (`RootLayout`) plus a new `components/shared/` for the nav/menu UI leaves (`MenuButton`, `MenuPopout`, `SiteMenu`); moved `projects.data.ts` out of `src/constants/` into a new top-level `src/data/` and renamed `navigation.ts` → `navigation.constant.ts`; relocated the three tunables/channels config files (`preloader.tunables.ts`, `hero.tunables.ts`, `channels.ts`) out of `components`/`sections` folders into `utils` folders (global → `src/utils/`, feature-scoped → new `src/features/home/utils/`); renamed `src/providers/theme-provider.tsx` → `ThemeProvider.tsx` for PascalCase consistency with its siblings. Pure reorganization — every consumer uses the `@/` alias, so every fix was a one-line import-path edit.

## Files touched
- `src/components/shared/{MenuButton,MenuPopout,SiteMenu}.tsx` — moved from `src/components/layouts/`; import paths updated (`MenuPopout`→`MenuButton`, `SiteMenu`→`navLinks`)
- `src/components/layouts/RootLayout.tsx` — import paths updated (`MenuPopout`, `SiteMenu` now from `shared/`)
- `src/data/projects.data.ts` — moved from `src/constants/` (zero importers, no call-site edits needed)
- `src/constants/navigation.constant.ts` — renamed from `navigation.ts`
- `src/utils/preloader.tunables.ts` — moved from `src/components/common/`
- `src/features/home/utils/{channels,hero.tunables}.ts` — moved from `manifesto-3d/` and `sections/` respectively (new folder)
- `src/providers/ThemeProvider.tsx` — renamed from `theme-provider.tsx`
- `src/providers/AppProviders.tsx`, `src/features/home/sections/HeroSection.tsx`, `src/components/common/Preloader.tsx`, `src/features/home/sections/ManifestoSection.tsx`, `src/features/home/components/manifesto-3d/{ManifestoCanvas,MacbookModel}.tsx`, `src/features/home/components/AuroraBackground.tsx` — import paths updated to match the moves above
- `CLAUDE.md`, `README.md`, `GEMINI.md`, `PLAN.md`, `.claude/agents/frontend-engineer.md`, `.claude/agent-memory/frontend-engineer/{MEMORY,content-data-layer,site-chrome}.md`, `.claude/agent-memory/motion-engineer/{MEMORY,hero-refine}.md` — stale path references updated to match (these are living docs per `memory-context.md`, not history — historical `logs/feature-changes/*.md` entries were deliberately left untouched)

## Notable decisions
- `hero.tunables.ts` lives in `sections/`, not literally inside a `components` folder, so it was outside the literal scope of "tunables/channels files in the components folder" — confirmed with the user to include it anyway for consistency with `preloader.tunables.ts`/`channels.ts` (same kind of file, same treatment).
- `channels.ts` and `hero.tunables.ts` land flat in `src/features/home/utils/` (not nested under a `manifesto-3d/` subfolder) — one `utils/` per feature, per the instruction.
- `src/data/` is a new top-level convention, distinct from the existing feature-local `src/features/home/data/` — explicit instruction, not an oversight; not applied retroactively to the feature-local files.
- PLAN.md's forward-spec for the unbuilt Footer chapter (`components/layouts/Footer.tsx`) was updated to `components/shared/Footer.tsx` so a future build doesn't recreate the clutter this refactor removes.
- Renamed `theme-provider.tsx` → `ThemeProvider.tsx` via a two-hop `git mv` (through a `.tmp` name) since the repo is on a case-insensitive filesystem (APFS, `core.ignorecase=true`) where a direct case-only rename risks a silent no-op.

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y — not applicable (no behavior/markup change, moves + import paths only)
- [x] repo-wide grep confirmed zero stale import paths or doc references remain

## Follow-ups
- `.claude/agent-memory/motion-engineer/MEMORY.md` is ~20KB, close to a hook-flagged read-size limit (~24KB) — pre-existing bloat, unrelated to this refactor, worth a dedicated compaction pass (move detail into topic files, one-line index entries) rather than folding into this change.
