---
name: content-data-layer
description: Where the PRD-transcribed content constants live, the portfolio.ts type contract, project slugs/featured set, and craft pillar groupings
metadata:
  type: project
---

# Content data layer (transcribed 2026-07-07, tsc+lint clean)

> **STATUS (2026-07-08):** re-transcribed at B0 to the same layout, with additions for the 10-chapter map: `Skill.category` ("Frontend"|"Mobile"|"Backend"|"Database" — presentation grouping, 12/3/4/2 split), `Profile.{aboutStatement,stats,favoredStacks,tagline,roles,cvUrl}`, `skills.data.ts` also exports `tools` (6, §3.2). `TechStack` is now `type TechStack = string`. Projects: featured 5 = KHASS/Phantom/Petabyte/HooBank/KNA; `personal-portfolio` featured:false.

All PRD §2–§3 content is in typed constants. **Reuse these — never re-transcribe or inline PRD facts in sections.**

**Why:** PRD is the single content source; typing constants against `src/types/portfolio.ts` makes bad edits fail compilation.
**How to apply:** chapter sections import from these files; if a section needs a new content field, extend the type first, then the data file.

## Type contract — `src/types/portfolio.ts`
`TechStack { tech, logo? }` · `Project { slug, title, tagline, description, thumbnail?, livePreviewURL?, repositoryURL?, techStack: TechStack[], year?, featured }` · `Skill { name, level: "Basic"|"Intermediate"|"Advanced" }` · `JourneyItem { kind: "work"|"education"|"award", title, org, start, end?, employmentType?, summary?, stack? }` (award date = `start`) · `Profile { name, role, location, bio, stats: {label,value}[], cvUrl }` · `ContactChannel { label, value, href }`. No barrel in `src/types` — import `@/types/portfolio` directly.

## Data files (named exports)
- `src/features/home/data/profile.data.ts` — `profile` (verbatim bio; cvUrl `/assets/pdf/Muhammad Sufyan CV.pdf` — PDF not yet in `public/`).
- `src/features/home/data/skills.data.ts` — `skills` (21) + `tools` (6) ONLY. (There are NO `webPillar`/`mobilePillar` exports — the pillar lists live on `profile.favoredStacks.{web,mobile}` in profile.data.ts; CraftSection cross-refs them against `skills` levels via its `LEVEL_ALIAS` map `{ React: "React JS", Tailwind: "Tailwind CSS" }` — shadcn/ui + Livewire have no skills entry, hence no level chip.)
- `src/features/home/data/journey.data.ts` — `journey` (9 items, most-recent-first by start date; PRD order for ties).
- `src/features/home/data/contact.data.ts` — `contactChannels` (WhatsApp/Gmail/Telegram).
- `src/data/projects.data.ts` — `projects` (**shared across features**), **12 entries since 2026-07-20**. Entries 1–6 = PRD §3.6 (`khass-e-ticketing`, `phantom-landing-page`, `petabyte-landing-page`, `hoobank-landing-page`, `kna-landing-page`, `personal-portfolio`); entries 7–12 = **owner-approved GitHub additions, NOT in the PRD** (`opto-mobile`, `point-of-sales-saas`, `pundi`, `personal-finance`, `create-my-react-boilerplate`, `balinese-cultural-portfolio` — sourced from github.com/Muhammad-Sufyan-901, stacks verified against repo languages/package.json). Featured = PRD 5 only (all GitHub entries `featured: false` — Gallery 07's "featured 5" contract intact). Descriptions are 2–3-sentence expansions (Claude-drafted, owner-reviewed). Still no thumbnails/years; `tech-icons.ts` maps all new stacks except `Blade` (no Simple Icon → text-only pill, deliberate).
- `src/constants/navigation.constant.ts` — `navLinks` (indices "01"–"06": Intro #intro, Who I Am #manifesto, What I Do #craft, The Path #journey, Selected Work #work, Let's Talk #contact).
- `src/config/site.ts` — `siteConfig` (SEO title/description + social links, inlined — config must not import from features). `url` omitted (domain unknown).
- `src/config/env.ts` — `emailjsConfig` (typed via `src/vite-env.d.ts` ImportMetaEnv augmentation for `VITE_EMAILJS_*`).
