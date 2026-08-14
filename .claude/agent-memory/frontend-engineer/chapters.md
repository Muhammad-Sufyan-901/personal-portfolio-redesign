# Chapters — as-built detail (linked from MEMORY.md STATUS)

Per-chapter durable knowledge, moved out of the MEMORY.md index 2026-08-03 (size cap). One heading per shipped chapter; newest facts win.

## Foundation (post B0 re-bootstrap, 2026-07-08)

After the 2026-07-07 hard reset the foundation was rebuilt per PLAN v3 (`chore(setup)` commit): tokens (ember, dark-only — values live directly in `@theme`, no `.light` block), all 14 primitives (base 6 + motion 8 incl. PathDraw), providers/hooks/store, full data layer. (Fonts have since moved on from that commit's Fraunces stack — the live 3-family stack is in MEMORY.md §repo-layout.) Chrome: Header with glass "Menu" pill, fullscreen SiteMenu overlay, RootLayout inert frame, Preloader/Cursor mounted — see [site-chrome](site-chrome.md).

## 02 Manifesto (2026-07-13)

Shipped as the PROMPT #4 WebGL MacBook scroll-story — architecture in motion-engineer's `manifesto-3d.md`.

## 04 Projects (2026-07-20; renamed from Craft same day, owner revision)

`sections/ProjectsSection.tsx`, scroll-activated project index per the project-refine.mp4 dissection: eyebrow "04 — Projects" straight into the index (the former "Web & Mobile" headline, Web/Mobile pillars grid, and keyword Marquee were REMOVED — skills content waits for chapter 06), focal-band ScrollTriggers → activeIndex, airy rows (`rowPad` const, `py-10 md:py-14`) + active description + tech-stack badges (Simple Icons via `react-icons`, map in `utils/tech-icons.ts` — runtime exports `SiCss` NOT `SiCss3` despite the .d.ts), aria-hidden sticky preview with mouse-follow 3D tilt (ember-gradient placeholders until owner supplies thumbnails), PathDraw px-space thread + 90svh finale runway, tunables `utils/projects.tunables.ts` (`PROJECTS`), nav anchor `#projects`.

## 07 Gallery (2026-07-20)

`sections/GallerySection.tsx` — scrub cover orbit, left-in/right-out + perspective yaw; engine in motion-engineer's `gallery-orbit.md`; ring = data-free ember-gradient DUMMY cards (owner decision, no text) — the live-site captures in `public/assets/images/projects/` (3, wired as `thumbnail`) serve 04's preview only, 9 more pending owner; heading = PLACEHOLDER const, PRD has no gallery line.

## 06 Skills (2026-07-21)

`sections/SkillsSection.tsx` — sticky left statement + damped ember-arrow x-scrub + ALL-OPEN Radix accordion, tunables `skills.tunables.ts`; `skillGroups` presentation regroup added to `skills.data.ts` — verbatim PRD arrays untouched, owner group "Animation & 3D" DEFERRED (no PRD data); 06 logos = owner-supplied full-color SVGs in `src/assets/icons/` via `utils/skill-icons.ts` (import.meta.glob URL map + aliases; decorative gapura/ornament files EXCLUDED from the glob — ~1.2 MB dist bloat otherwise; `TECH_ICONS` stays 04-only); shadcn `accordion` added to ui/ with `--animate-accordion-*` keyframes in globals.css; details `logs/feature-changes/2026-07-21-skills.md`.

## 05/08 Journey (2026-07-22, 6 owner passes → gradient-card treatment 2026-07-24)

`sections/JourneySection.tsx` + `journey.tunables.ts`: word de-veil statement, measured `buildZigzagPath` zigzag PathDraw in `utils/path.ts`, 6 per-card-tilt cards — ink bg, ember bottom bloom, box-shadow halo — + 3 award pills (full-ember hover + Radix HoverCard panel, 2026-07-25; the near-white `invert-bg` echo is retired). `--radius-card: 24px` is the full-card-surface radius (Journey cards, `ui/hover-card` panel, the 09 Articles byline card) — never on controls, badges or hairline-bounded blocks. Full pass history, live vs. DEAD tunable names, and the reusable card/glow/tilt/line patterns: [journey-cards](journey-cards.md) — read it before touching Journey.

## 09 Articles (2026-07-26; card restyled 2026-08-01)

`sections/ArticlesSection.tsx` + `data/articles.data.ts` + `utils/articles.tunables.ts`, nav anchor `#articles`, eyebrow `09 — Writing` — pinned horizontal scrub rail of article "clippings", chosen so the chapter doesn't read as more of Journey's vertical cards above it; engine + the two novel bits (focusin scroll-into-view, degenerate-rail guard) are in motion-engineer MEMORY.

**Card RESTYLED 2026-08-01 to a full-bleed byline card** (owner ask, adapted from an Aceternity author card — details in `logs/feature-changes/2026-08-01-articles-byline-card.md`): the framed cover-on-top layout is gone. The card is one photograph with everything overlaid — `Image` as an `absolute inset-0` layer (never `style={{backgroundImage}}`: a CSS background loses `loading="lazy"` across 12 simultaneous cards, loses the `Image` error fallback, and forces the parallax onto `background-position` instead of a composited transform), a permanent `from-ink via-ink/85 via-40% to-ink/25 to-80%` legibility scrim, a `bg-ink/85 backdrop-blur-md` byline pill (avatar + name + reading time), then `publication · date` meta → title → standfirst → a "View Details" pill.

**Two former contracts are DEAD — don't restore them:** (a) "cover `flex-1` absorbs the remainder" — the cover is `absolute`, so it neither absorbs nor demands height; the row/track/card classes (`min-h-0 flex-1` + `h-full` + `max-h-[34rem]`) still stand and the static branch is now `aspect-[3/4] max-h-[34rem]` on the `li`; (b) "the cover frame renders even with no image (blank `raised` plate)" — `cover` is REQUIRED on `Article` now, along with `description`.

Reusable rules this chapter proved: contrast over arbitrary photography is bought **locally** (gradient under the text block, an ink pill around the byline) never by a global veil; `text-muted` is banned over a photo at `text-meta` — it needs 4.5:1 and misses, so use `text-paper/70`; and **a photograph that CONTAINS TEXT is a different problem from one that doesn't** — when the covers became code screenshots the card title landed on top of other legible code, which no scrim fixes (the gradient runs bottom-up and never reaches the top of the frame); damp the image itself at REST (`brightness-50`, hover `brightness-[.35]`) so it reads as texture, not content. The CTA is a styled `Box as="span"`, NOT a shadcn `Button` — the whole card is one anchor, so a nested button/link is invalid interactive content and would add a second tab stop the `focusin` handler assumes away.

**Gotcha:** computed `scale` on `.articles-cover` reads `none` even though `scale-115` is applied — GSAP absorbs Tailwind's standalone `scale` property into the transform matrix it owns; not broken, don't "fix" it.

**Content is owner-fill placeholders**: the PRD defers a blog three times and PLAN decision #7 is "no blog", so `articles.data.ts` holds 12 invented-shape entries + an `ARTICLES_STATEMENT` placeholder (Gallery-heading precedent) the owner replaces in ONE file — never invent article *facts*. Ship-guard = the `https://example.com/…` urls + hot-linked Unsplash covers (the old `TODO(owner) —` prefixes were dropped 2026-08-01). Header is a `justify-between` wrapping flex row: statement left, `MagneticButton`+`Link` "View All Articles" CTA right on the statement's last baseline (`items-end`), dropping below under ~1024 — target is the placeholder `ARTICLES_INDEX_URL` const. **Padding is deliberately lean (`pt-[6svh]` header, `pt-6 pb-6` rail row, `pb-6` meter) — pinned `h-svh` section, every gutter is subtracted from card height.** Track ceiling `max-h-[42rem]`. One `ARTICLES_AUTHOR` const carries the byline; deliberately **no `author` field** on `Article`.

## 10 Contact (2026-08-03, revised 2026-08-04)

`sections/ContactSection.tsx` + `src/lib/emailjs.ts`, eyebrow `10 — Let's Talk`, nav `#contact` — the site's single light-invert section, matched to the reference video at 1:11.

**Structure is a dark shell wrapping a light sheet** (since 2026-08-04): `Box as="section"` (unstyled but for `relative mt-[70svh]`) → the fixed wipe disc + `Box id="contact" data-invert` (the sheet, carrying `bg-invert-bg px-page-x py-section rounded-b-[50%_5rem]`). **The `id` lives on the SHEET, not the section root** — the `mt-[70svh]` runway is part of the section, so an anchor on the root drops nav visitors into a dark empty screen.

- **First (and only) consumer of `--color-invert-*`.** The `[data-invert]` attribute (on the sheet) activates the globals.css scope that re-points `--color-muted`→faint, `--color-error`→accent-deep, `--color-success`→`#34664a`, `.text-accent`→accent-deep and the focus-ring outline for the light ground (accent-deep on `#e8e8e8` = 5.2:1; raw accent only for display-scale/non-text) — reuse that scope for ANY future light surface. Section JSX writes `hover:text-accent-deep` directly (the CSS scope can't catch `hover:text-accent` class names).
- **Entry wipe** = the circle-wipe recipe in motion-engineer's [MEMORY.md](../motion-engineer/MEMORY.md); **exit** = static `rounded-b-[50%_5rem]` against the ink body (Footer slides beneath, no changes needed).
- **Statement/panel pairs**: `CONTACT_STATEMENTS` (array) renders N beats from ONE map; layout reversal is index parity (`lg:order-1/2` + `lg:ml-auto`/`mr-auto`), never duplicated JSX. Both statements stay `text-right ml-auto max-w-[30ch]`; below `lg` each pair stacks text-above-panel in DOM order. **Panels MUST stay capped (`max-w-sm`)** — uncapped, `aspect-[3/4]` in a half-width column renders ~820px tall and shoves the statement off-screen.
- **`GradientPanel`** = `bg-linear-to-br from-accent to-accent-deep` + 4 `+` crop marks INSIDE the corners (`top-3 left-3` …), `aria-hidden` whole. Owner placeholder for real artwork (2026-08-04). `bg-accent` is deliberately NOT remapped by `[data-invert]` — the wash is non-text. Note `bg-linear-*` is the Tailwind v4 name (`bg-gradient-*` is the deprecated alias).
- **Form** = RHF `register`-only on `Box as="input/textarea/button/form"` (React 19 ref-as-prop; no shadcn form parts — their compat tokens alias the dark palette). **It always mounts** (since 2026-08-04); `emailEnabled` now only disables submit and swaps the live region for a "not live yet" note. Because `emailEnabled` is a build-time constant, that branch dead-code-eliminates the moment `VITE_EMAILJS_*` land — no edit needed to go live.
- `CONTACT_STATEMENTS[0]` is owner-approved copy (availability framing, 2026-08-03 gate); `[1]` is re-voiced from PRD §2 `profile.bio` verbatim facts (2026-08-04 gate). Neither is PRD-verbatim — don't "correct" them against the PRD.
- **`ScrollProgressHUD` fixed layers carry `mix-blend-difference`** so paper-toned chrome stays legible crossing the light sheet (≈ink there, unchanged over dark).

**DEAD contracts — don't restore:** (a) the **dome cap** (`130vw` half-ellipse, `scaleY→0`, `absolute bottom-[calc(100%-1px)]`) — it's section-anchored so its centre rises with the page; the reference's centre never moves. Replaced by the fixed circle. (b) `overflow-x-clip` on the root — it existed only to contain the 130vw dome; a `fixed` disc creates no page scroll. (c) the **duotone portrait** (grayscale `Image` + `bg-accent mix-blend-multiply`) — replaced by `GradientPanel`; `about-profile.png` is no longer reused here. (d) `RevealText mode="chars"` on the heading — its own `top 80%` trigger fired while the screen was still dark. (e) `CONTACT_STATEMENT` singular.
