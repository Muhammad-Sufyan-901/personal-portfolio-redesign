---
name: site-chrome
description: Header/MobileMenu/RootLayout structure, z-index scale, preloader inert pattern, and per-chapter section conventions (hero, craft, full-bleed pattern, RevealText nesting limit)
metadata:
  type: project
---

# Site chrome & chapter conventions (built 2026-07-07)

**Why:** chapters 02–06 must slot into this frame without re-deciding z-order, header offset, or a11y patterns.
**How to apply:** new sections go in `features/home/sections/`, get an `id` matching [[content-data-layer]] navLinks anchors, and render inside HomePage's `<Box as="main" id="main">`.

- **z-scale (arbitrary z-[] is the house style):** Header `z-[60]` < MobileMenu `z-[80]` < Preloader `z-[90]` < Cursor `z-[100]`.
- **RootLayout** wraps `<Header /> <Outlet /> <MobileMenu />` in a Box with `inert={!preloaderDone || undefined}` (React 19 boolean inert; Box spreads native props) — F1 fix so nothing behind the preloader is focusable. Preloader sets `preloaderDone` immediately on reduced-motion/session-skip, so content is never wrongly inert. Devtools stay outside the inert wrapper.
- **Header:** fixed, `h-18` (=72px), transparent; `data-header` attribute is the motion hook for the solid-on-scroll toggle (`bg-ink border-b border-line` at scrollY > 40 — motion layer's job). Desktop nav = mono `text-index` links with `text-faint` index prefix; mobile = hamburger (shadcn Button ghost, `aria-expanded`), `md:hidden`. shadcn ghost hover must be overridden (`hover:bg-raised`) — default `hover:bg-accent` paints cobalt.
- **MobileMenu:** renders `null` when closed (motion layer may animate later). `role="dialog" aria-modal aria-label="Navigation"`; Escape closes; focus → first link on open, returns to opener via a `document.activeElement` ref on close; includes an explicit X close button (hamburger sits below the overlay's z).
- **HeroSection (`#intro`):** `min-h-screen flex-col px-page-x pt-18` (pt offsets the fixed header); content block `flex-1 justify-center`; scroll cue (`Link href="#manifesto"`, mono text-meta text-accent, ↓) in normal flow at the bottom with `pb-10` — no absolute positioning. Name = `Heading variant="display"` with each word in a `Box as="span" className="block"` (split-ready for motion). Stats row = `ul` flex-wrap, `border-l border-line pl-8` separators from item 2 on. Hero tagline microcopy (approved re-voice of PRD bio): "Building digital applications that help people — across web and mobile." No portrait (no asset in PRD).
- **Standard chapter shell (Manifesto/Craft precedent):** `<Box as="section" id=… className="px-page-x py-section">` → `ChapterEyebrow` → title → content. Chapter titles: `RevealText as="h2" mode="lines" className="font-display text-chapter text-paper"` (plain text child only).
- **RevealText limit:** split-type does NOT support nested elements — `RevealText` only wraps plain text. Structural "line" reveals (flex rows, lists) replay its recipe in a scoped `useGSAP`: `overflow-hidden` on the static parent (borders stay there), inner row `gsap.from(yPercent: 100, stagger: 0.08, scrollTrigger { start: "top 80%", once: true })`, skipped under `usePrefersReducedMotion`. See `PillarBlock`/`ManifestoSection`.
- **Full-bleed inside a padded section:** `-mx-page-x` — Tailwind v4 generates negative utilities from `--spacing-page-x` (verified in dist CSS). Same token works as pillar-grid gutter (`gap-x-page-x`). Craft marquee band: `-mx-page-x border-y border-line` + one span of `names.join(" · ")` with trailing separator for a clean loop seam.
- **PillarBlock** (`features/home/components/PillarBlock.tsx`): `{ index: string; title: string; skills: string[]; description?: string }` — editorial stack list with hairline rows; levels cross-referenced from PRD `skills` via exact name + alias map (`React→React JS`, `Tailwind→Tailwind CSS`); unmatched names (shadcn/ui, Livewire) render no level.
