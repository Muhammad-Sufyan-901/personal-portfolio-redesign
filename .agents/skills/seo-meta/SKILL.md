---
name: seo-meta
description: SEO, meta, and Open Graph for the portfolio SPA. Activate when setting up document head or finishing a build.
---

# SEO & Meta

Config lives in `src/config/site.ts` (title, description, url, OG image, social handle — already transcribed from the PRD).

## Checklist
- `<title>` + meta description (from `product_requirements.md §2`); `theme-color` = `#0A0A0A` (`--color-ink`, design_system v2 §3.1; v1's `#0B0B0F` is superseded).
- Open Graph + Twitter card (title, description, `og:image`, url).
- One `h1` (hero name in `HeroSection.tsx`); logical heading hierarchy per chapter.
- Canonical URL; `lang="en"`; descriptive `alt` on images.
- `robots`/`sitemap.xml` for the single route; JSON-LD `Person` schema (name, jobTitle "Software Engineer · Web & Mobile", sameAs → socials from `§3.7`: WhatsApp/Gmail/Telegram).
- Preserve indexability — this is a public portfolio; don't block crawlers.

Audited as part of `/qa-audit` (`.claude/skills/qa-audit`, Lighthouse SEO ≥ 90).
