---
name: content-data-layer
description: Where the PRD-transcribed content constants live, the portfolio.ts type contract, project slugs/featured set, and craft pillar groupings
metadata:
  type: project
---

# Content data layer (transcribed 2026-07-07, tsc+lint clean)

All PRD §2–§3 content is now in typed constants. **Reuse these — never re-transcribe or inline PRD facts in sections.**

**Why:** PRD is the single content source; typing constants against `src/types/portfolio.ts` makes bad edits fail compilation.
**How to apply:** chapter sections import from these files; if a section needs a new content field, extend the type first, then the data file.

## Type contract — `src/types/portfolio.ts`
`TechStack { tech, logo? }` · `Project { slug, title, tagline, description, thumbnail?, livePreviewURL?, repositoryURL?, techStack: TechStack[], year?, featured }` · `Skill { name, level: "Basic"|"Intermediate"|"Advanced" }` · `JourneyItem { kind: "work"|"education"|"award", title, org, start, end?, employmentType?, summary?, stack? }` (award date = `start`) · `Profile { name, role, location, bio, stats: {label,value}[], cvUrl }` · `ContactChannel { label, value, href }`. No barrel in `src/types` — import `@/types/portfolio` directly.

## Data files (named exports)
- `src/features/home/data/profile.data.ts` — `profile` (verbatim bio; cvUrl `/assets/pdf/Muhammad Sufyan CV.pdf` — PDF not yet in `public/`).
- `src/features/home/data/skills.data.ts` — `skills` (21), `webPillar` = React, TypeScript, Tailwind, shadcn/ui, Laravel, Livewire; `mobilePillar` = Flutter, React Native; `tools` (6).
- `src/features/home/data/journey.data.ts` — `journey` (9 items, most-recent-first by start date; PRD order for ties).
- `src/features/home/data/contact.data.ts` — `contactChannels` (WhatsApp/Gmail/Telegram).
- `src/constants/projects.data.ts` — `projects` (**promoted to constants — shared across features**). Slugs: `kna-landing-page`, `khass-e-ticketing`, `personal-portfolio`, `phantom-landing-page`, `petabyte-landing-page`, `hoobank-landing-page`. Featured = all except `personal-portfolio`. No thumbnails/years yet.
- `src/constants/navigation.ts` — `navLinks` (indices "01"–"06": Intro #intro, Who I Am #manifesto, What I Do #craft, The Path #journey, Selected Work #work, Let's Talk #contact).
- `src/config/site.ts` — `siteConfig` (SEO title/description + social links, inlined — config must not import from features). `url` omitted (domain unknown).
- `src/config/env.ts` — `emailjsConfig` (typed via `src/vite-env.d.ts` ImportMetaEnv augmentation for `VITE_EMAILJS_*`).
