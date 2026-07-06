# PRD content transcription → typed constants

- **Date:** 2026-07-07
- **Author:** frontend-engineer
- **Type:** feat
- **Chapter/Area:** content layer (all chapters), types, config

## Summary

Transcribed all portfolio content from `.agents/context/product_requirements.md` §2–§3 into typed constants, establishing the global content contract (`src/types/portfolio.ts`) that all chapter builds will consume. Facts are verbatim from the PRD; unknown fields (project years, thumbnails, missing links, site URL) are omitted, not fabricated. Also added typed EmailJS env access and the chapter anchor list for the new nav.

## Files touched

- `src/types/portfolio.ts` — new: `TechStack`, `Project`, `Skill`, `JourneyItem`, `Profile`, `ContactChannel` content contract.
- `src/features/home/data/profile.data.ts` — new: `profile` (PRD §2 — name, role, location, verbatim bio, 3 stats, cvUrl).
- `src/features/home/data/skills.data.ts` — new: `skills` (21 skills §3.1), `webPillar`/`mobilePillar` (§3.1 favored-stack note), `tools` (§3.2).
- `src/features/home/data/journey.data.ts` — new: `journey` — 9 items (4 work + 2 education + 3 awards) merged most-recent-first, dates as written.
- `src/features/home/data/contact.data.ts` — new: `contactChannels` (§3.7 WhatsApp/Gmail/Telegram).
- `src/constants/projects.data.ts` — new: `projects` — all 6 projects (§3.6), 5 featured, kebab-case slugs.
- `src/constants/navigation.ts` — new: `navLinks` (§4 chapter anchors, indices 01–06).
- `src/config/site.ts` — new: `siteConfig` (SEO title/description + social links).
- `src/config/env.ts` — new: `emailjsConfig` typed EmailJS env access.
- `src/vite-env.d.ts` — new: `ImportMetaEnv` augmentation for the three `VITE_EMAILJS_*` keys.
- `src/features/home/data/.gitkeep` — deleted (directory now populated).

## Notable decisions

- **Journey ordering:** merged timeline sorted by start date descending (Mobile Dev Feb 2024 → award Sep 2023 → Full Stack May 2023 → STIKOM 2023 → award Apr 2022 → the two ZettaByte internships → award Jan 2022 → SMK 2020–2023); PRD listing order kept for same-date ties (FE Dev before QA).
- **Project descriptions:** PRD table gives a short descriptor + parenthetical; tagline = descriptor verbatim, description = parenthetical lightly re-voiced into a sentence (PRD allows microcopy rewrite, facts fixed). Phantom/HooBank have no parenthetical → description re-voices the descriptor.
- **`site.ts` links inlined** (not imported from `features/home/data/contact.data.ts`) — config importing a feature would invert layering; three URLs of duplication is cheaper.
- `projects.data.ts` promoted to `src/constants/` (shared beyond the home feature); the rest of the PRD data is home-only → `features/home/data/*.data.ts`.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [ ] reduced-motion / a11y checked (n/a — data only, no UI)
- [ ] Lighthouse ≥ 90 (n/a — no section shipped)

## Follow-ups

- Re-host the CV PDF at `public/assets/pdf/Muhammad Sufyan CV.pdf`.
- Export project thumbnails (`.avif`/`.webp`) into `src/assets/images/` and wire `thumbnail` fields.
- `siteConfig.url` omitted — add when the production domain is decided.
- `TechStack.logo` unused until logo assets exist.
