# impeccable init — DESIGN.md + design.json sidecar + CLAUDE.md pointer

- **Date:** 2026-07-22
- **Author:** main
- **Type:** chore
- **Chapter/Area:** design tooling (impeccable)

## Summary

Ran `/impeccable init`. PRODUCT.md already existed (register `brand`) — untouched.
Generated the missing visual layer via the document scan flow: root `DESIGN.md`
(spec-compliant: YAML token frontmatter in project-canonical hex + the six fixed
sections) and the `.impeccable/design.json` sidecar (schemaVersion 2 — tonal
ramps, motion tokens, 6 shadow-DOM component snippets, narrative). Added a
"Design context (impeccable)" pointer section to CLAUDE.md.

## Files touched

- `DESIGN.md` — NEW: Void & Ember visual spec, North Star **"The Scroll Cinema"** (owner pick), named rules (Ember Scalpel, Tokens-or-Nothing, Statement Grammar, Fluid Token, Hairline Depth), PRODUCT.md anti-references carried verbatim into Don'ts
- `.impeccable/design.json` — NEW sidecar for the live panel
- `CLAUDE.md` — pointer section (canonical deep specs stay `.agents/context/*`)

## Notable decisions

- North Star = "The Scroll Cinema" (owner choice over "Void & Ember" /
  "The Ember Scalpel") — motion-led framing; palette + accent doctrine live as
  named rules beneath it.
- Frontmatter tokens in **hex** (the project's canonical format in
  `globals.css` `@theme`) — Stitch-lint clean; OKLCH only in sidecar ramps.
- ChapterEyebrow documented as a **deliberate named brand system** (the
  10-chapter narrative is a real sequence) so impeccable's generic
  numbered-eyebrow ban doesn't misfire on it.
- Live mode NOT configured (owner skipped) — `/impeccable live` self-configures
  on first run.
- Instrument Serif is on impeccable's reflex-reject list; identity-preservation
  wins (2026-07-20 owner font decision; detector ignoreValue already present).

## Verification

- [x] Six section headers spec-exact; no extra top-level sections
- [x] Frontmatter hex values diffed against `globals.css` `@theme`
- [x] `.impeccable/design.json` parses (JSON.parse)
- [x] `context.mjs` re-run reports both PRODUCT.md and DESIGN.md

## Follow-ups

- Re-run `/impeccable document` after 05 Journey / 08 Contact land (inputs +
  timeline components will extend the spec).
