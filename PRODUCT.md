# Product

## Register

brand

## Users

Recruiters, hiring managers, and prospective clients evaluating Muhammad Sufyan — a software engineer from Indonesia working across web (React/TypeScript/Laravel) and mobile (Flutter/React Native). They arrive cold, decide in under a minute, and judge the engineering craft by how the site feels as much as by what it says.

## Product Purpose

A motion-first, scroll-telling single-page portfolio (reference feel: lukebaffait.fr — its motion and polish, not its content). The site itself is the first work sample; the 10-chapter scroll narrative carries persona, work, skills, journey, and contact. Success: a visitor scrolls the full narrative and reaches out (contact form / CV download).

## Brand Personality

Cinematic · surgical · confident. Dark, quiet surfaces (Void & Ember: near-black ink, neutral paper text) with a single ember accent used like a scalpel — marking moments, never washing surfaces. Motion is the voice: scrubbed, reversible, physical.

## Anti-references

- SaaS landing-page grammar: hero-metric stat rows, identical icon-card grids, gradient text, glassmorphism as default.
- Template developer portfolios: skill progress bars, three-column feature grids, testimonial carousels.
- Light, airy, pastel "designer resume" aesthetics — this site is dark-only by identity (PLAN v3.1 decision 2).

## Design Principles

1. The site is the work sample — every interaction must feel engineered, not assembled.
2. Scroll is the timeline — everything reveals in document order and reverses with it.
3. Ember is a scalpel — the accent marks moments, never washes surfaces.
4. Tokens or nothing — every color, size, and ease comes from the `@theme` contract in `src/styles/globals.css`.
5. Motion respects the visitor — every effect ships a `prefers-reduced-motion` fallback and never blocks reading.

## Accessibility & Inclusion

WCAG AA contrast; a mandatory `prefers-reduced-motion` branch for every effect (opacity-only reveals, Lenis disabled, custom cursor hidden); semantic landmarks with exactly one `h1`; full keyboard navigation with visible ember focus rings; Lighthouse Accessibility ≥ 90.

> Deep specs: `.agents/context/product_requirements.md` (content source of truth) and `.agents/context/design_system.md` (visual system) remain canonical — this file is the strategic summary impeccable reads.
