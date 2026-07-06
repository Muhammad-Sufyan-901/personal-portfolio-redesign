---
name: seo-meta
description: SEO, meta, and Open Graph for the portfolio SPA. Activate when setting up document head or finishing a build.
---

# SEO & Meta

Config lives in `src/config/site.ts` (title, description, url, OG image, social handle).

## Checklist
- `<title>` + meta description (from `product_requirements.md §2`); `theme-color` = `#0B0B0F`.
- Open Graph + Twitter card (title, description, `og:image`, url).
- One `h1` (hero name); logical heading hierarchy per chapter.
- Canonical URL; `lang="en"`; descriptive `alt` on images.
- `robots`/`sitemap.xml` for the single route; JSON-LD `Person` schema (name, jobTitle, sameAs → socials from `§3.7`).
- Preserve indexability — this is a public portfolio; don't block crawlers.
