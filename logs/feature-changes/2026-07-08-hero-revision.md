# Chapter 01 revision — reference-exact hero layout + ogl aurora curtain

- **Date:** 2026-07-08
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 01 Hero (revision of `e676a37`, user-requested)

## Summary

Relaid the hero to match the reference screenshot exactly: React Bits `<Aurora/>` (WebGL/ogl shader) as a bold curtain hanging from the top, tagline top-left with an italic-serif emphasis phrase, the name spread edge-to-edge at the bottom ("Muhammad" grotesk left / "Sufyan." Fraunces italic right, one line at ≥md), and a hairline bottom bar: role · GITHUB/GMAIL/WHATSAPP · JOURNEY/GALLERY/CONTACT (mapping user-confirmed). Scroll cue removed (the bar replaces it). Entrance gating, char reveal, and pointer parallax retained.

## Files touched

- `package.json` — + `ogl`
- `src/features/home/components/AuroraBackground.tsx` — rewritten to the React Bits ogl shader, adapted per `animated-ui-references`: uTime driven by `gsap.ticker` (no own rAF, arch RULE 3), colorStops read from `--color-accent`/`--color-accent-deep` at mount, Box wrapper, perf pauses (hidden/offscreen/scroll-faded) + ScrollTrigger hero fade + ResizeObserver + full GL cleanup (`WEBGL_lose_context`); reduced-motion AND WebGL-failure fall back to the static token gradient
- `src/features/home/sections/HeroSection.tsx` — new layout (tagline top-left, spacer, bottom name row, hairline bar); socials/anchors data-driven
- `src/features/home/data/contact.data.ts` — `socialLinks` (GitHub profile derived from PRD §3.6 repo URLs + Gmail + WhatsApp)
- `src/types/portfolio.ts` + `profile.data.ts` — `taglineEmphasis` ("help many people")
- `src/styles/globals.css` + `src/lib/utils.ts` — new `--text-hero` token (clamp 3rem–9.5rem @9vw) registered in the cn() font-size groups; `text-display` at 12vw wrapped the 16-glyph name mid-word

## Notable decisions

- `ogl` installed on explicit user instruction (React Bits component source supplied) — WebGL lives only inside AuroraBackground; gsap remains the only animation runtime.
- Surname stays `text-paper` (the reference's cyan is Luke's second accent; ours is single-accent by design).
- Bottom-bar mapping per user choice A: role / socials / anchors.

## Verification

- [x] tsc + lint clean; DoD greps clean (no stray gsap imports, no cross-feature, no raw hex in diff, no bare tags)
- [x] Desktop + mobile screenshots match the reference composition; name single-line at 1200px, stacked on 390px
- [x] Aurora: WebGL canvas active, scroll-fade 1→0 past hero, restores; ticker-driven (no own rAF)
- [x] Reduced motion: static gradient, no canvas, all content visible; hrefs verified (github/mailto/wa.me + 3 anchors)
- [x] Console clean

## Follow-ups

- Chapter 02 Manifesto (unchanged next gate).
