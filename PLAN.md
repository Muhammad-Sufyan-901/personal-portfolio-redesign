# PLAN v2 — Portfolio Redesign on the measured "Void & Ember" design system (approved)

> **⚠️ STATUS (2026-07-07, post hard-reset): src was hard-reset to a single blank page** — the foundation (design tokens, fonts, motion setup, primitives, data layer) and **all chapters 00→footer** are rebuilt from the `.agents/context/` specs during the redesign. The build order below assumed chapters 00–04 existed; treat it as scope/decision record, not as-built state. A fresh whole-site plan (`/plan-redesign`) precedes the rebuild.
>
> Supersedes the v1 plan (approved pre-bootstrap, executed through chapter 04 on the interim cobalt tokens). This v2 plan reconciles the remaining scope with the **measured** design system (`design_system.md` v2 — palette + techniques evidence-sampled from `reference/lukebaffait-scroll.mp4`, 47 frames + live-site cross-check). Whole-site planning; **per-section execution with an explicit user approval gate after every section**.

## Context

Finish Muhammad Sufyan's scroll-telling portfolio. ~~As-built: chapters `00 Preloader → 04 Journey` shipped~~ (**deleted in the hard reset** — `fe849ff`…`b245c1e` remain in git history), full motion foundation (`lib/gsap.ts`, `SmoothScrollProvider` lerp 0.09, 7 primitives), PRD data layer, site chrome, tokens in `src/styles/globals.css` (interim Warm Ink + Cobalt). All of it, plus the **ember re-theme + grotesk display swap**, v2 technique upgrades on Hero + Journey, and Work (05), Contact (06), Footer, is rebuilt from the specs.

## Decisions (all resolved — no open questions)

| Decision | Resolution |
|---|---|
| Accent | **Ember `#E8380F`** (deep `#B32C0B`, tint `rgba(232,56,15,0.12)`) — measured default; brass/cobalt remain documented alternates |
| Display typeface | **Grotesk** — General Sans takes over `--font-display` (§4.1 option B, literal video fidelity); Fraunces retired (imports + dep removed) |
| Section invert | **Journey/Awards** — the 3 awards form a closing inverted band (`#E8E8E8`/`#0A0A0A`), matching the reference's awards-recognition invert (§3.0b #6) |
| Hero aurora | **Canvas blob** (2D canvas gradient blobs, no WebGL lib) — upper-right-weighted ember glow, fades on scroll; DPR cap + offscreen pause; reduced-motion → static CSS gradient |
| Footer ornament converge | **Yes** — two sparse `aria-hidden` ember glyph/dot clusters, x/opacity scrub |
| Work list↔gallery toggle | **No** — single grid |
| Theme | Light toggle kept (`.light` class); light block: ink→`#F4F1EA`, paper→`#1A1A1F`, accent→`#B32C0B` |
| Routing | Multi-page — `/` narrative + `/work/$slug` detail with `PageTransition` + `ScrollTrigger.refresh()` |
| Featured (5) | KHASS E-Ticketing, Phantom, Petabyte, HooBank, KNA (already flagged in `src/constants/projects.data.ts`) |
| Blog | No |

## Build order (one approval gate after every step)

| Step | Scope | Technique (design_system §7/§11) + §7.5 borrow notes |
|---|---|---|
| **B1** Foundation re-theme | `globals.css` token values → v2 §9 (ember set, neutral grays, invert + selection tokens, light block); `--font-display` → General Sans; remove Fraunces; new shared **`PathDraw`** primitive (bold 3–4px organic SVG, `stroke-dashoffset` scrub, reduced-motion = drawn) | PathDraw sketch: Aceternity UI Timeline — visual idea only, reimplemented in `useGSAP` (never framer-motion). Smoke-test chapters 00–04 under the new theme |
| **B2** Hero (revision) | `AuroraBackground` canvas behind `HeroSection`; verify grotesk char reveal + ember cue | Aurora sketch: React Bits GSAP background variants |
| **B3** Journey (revision) | 1px `scaleY` rail → **bold path draw** (`PathDraw`, winding); awards → inverted closing band (§7.2 "Section invert") | — |
| **B4** Selected Work (05) | `WorkSection` grid (5 featured, `ParallaxImage` clip reveals, hover 1.03 + cursor "View", Mono chips); `routes/work.$slug.tsx` + `features/work/pages/WorkDetailPage.tsx` + `PageTransition`; thumbnails = `Image` fallback until user supplies `.avif/.webp` | — |
| **B5** Contact (06) | `lib/emailjs.ts` + react-hook-form underlined inputs (ember focus, success `#5BAE7C` / error `#D8735E`), `MagneticButton` CTA, socials verbatim; graceful no-op without `.env` keys | — |
| **B6** Footer | Giant name `Marquee` (display face, slow/muted), Mono copyright, magnetic back-to-top, **ornament converge** flourish | — |
| **B7** Final audit | `/qa-audit all` on `build`+`preview`: Lighthouse ≥ 90 ×4, reduced-motion sweep, a11y, meta/OG/`theme-color #0A0A0A`, hygiene greps | — |

Unchanged chapters (00 Preloader, 02 Manifesto, 03 Craft) are visually verified under the new theme at B1 — no separate cycles.

## Dependency delta

Nothing to install (gsap/lenis/split-type/@gsap/react/zustand/react-hook-form/@emailjs/browser all live). One removal at B1: `@fontsource-variable/fraunces`.

## Data mapping

Unchanged and already live: `src/types/portfolio.ts` ← `features/home/data/{profile,skills,journey,contact}.data.ts` + `src/constants/{projects.data,navigation}.ts` + `src/config/{site,env}.ts`. All facts verbatim from the PRD.

## Per-section cycle (house rules)

Accessible static → motion → polish → `/qa-audit <section>` → fix → `/log-change` → `/update-memory` → one Conventional Commit → **STOP for user approval**. Golden rules throughout: single GSAP source, single Lenis owner, `useGSAP({scope})` + reduced-motion fallback per effect, custom primitives only, tokens only, no cross-feature imports, TS strict.

## Known externalities (user-supplied; flagged, not blocking)

- Project thumbnails → `src/assets/images/` (Work ships with the `Image` placeholder until then).
- `.env` EmailJS keys (Contact degrades gracefully).
- Real favicon / OG image (currently a data-URI placeholder; simple "MS" mark can ship at B7).
