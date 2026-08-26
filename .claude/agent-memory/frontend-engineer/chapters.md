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

## Footer (2026-08-14)

`sections/FooterSection.tsx` (**not** `components/shared/Footer.tsx` as PLAN v3.1 §3 specced — it consumes `features/home/data/*`, and shared→feature inverts Golden Rule 1). Rendered by HomePage after Contact, slides beneath 08's `rounded-b-[50%_5rem]` exit curve with no Contact changes. Built to `reference/footer-refine.mp4`, which **supersedes** PLAN's spec: no name `Marquee`, no back-to-top `MagneticButton`, and the ASCII hands replace the planned ember "ornament converge".

Three bands inside `flex min-h-svh flex-col overflow-hidden px-page-x pt-section`:

1. **Meta row** — plain `flex flex-wrap justify-between` of three stacked blocks (measured against the reference: it really is space-between, not a grid). Left = gmail `mailto:` + `© {new Date().getFullYear()}`; centre = `socialLinks`; right = a 3-anchor `navLinks` subset (`#projects`/`#about`/`#contact`, the reference's WORK/INFO/CONTACT). **Zero data-layer delta.**
2. **ASCII hands** — `components/AsciiHands.tsx`, see motion-engineer's MEMORY. Sized box lives in the SECTION (`relative my-12 -mx-page-x min-h-0 flex-1`) with the lazy component `absolute inset-0` inside it, so the band keeps its shape while the chunk loads and if the image is missing. **`flex-1`, never percentage insets** — the first build used `top-[22%] bottom-[26%]` and it collided with the wrapped link columns at 390px.
3. **Name** — `profile.heroName` at `text-hero-line`, lead `font-display-lead font-medium` / tail `font-display-tail italic`, terminal period peeled off the tail string and given `text-accent`. `justify-between` gives the reference's ~16vw centre gap (lead+tail ≈ 4.77em × 15.5vw ≈ 74vw of a 90vw content box — reusing the hero token is correct, don't invent a new `--text-*`). Descenders are **deliberately cropped** by the page edge: `-mb-[0.02em]` inside the root's `overflow-hidden`. That is the INVERSE of the hero's `pb-[0.12em] -mb-[0.12em]`, which exists to keep descenders whole — don't "fix" one to match the other. a11y = `sr-only` `profile.name` + `aria-hidden` on the visual row (an `aria-label` on a `<p>` is not reliably exposed).

**HARD CONSTRAINT — `.hero-word` must stay unique.** `Preloader.tsx:122` polls `.hero-name .hero-word` and requires **exactly two** matches document-wide for its FLIP morph. Any future giant-name treatment needs its own class names; this one uses `.footer-name` / `.footer-word`.

**Owed asset:** `public/assets/images/hands.png` (owner-supplied, wide ~3:1, light subject on transparency — `asciify` maps `alpha === 0` straight to a space). Until it lands the field renders nothing and the gap stays.

Skip-to-content link (hero audit F7, deferred to "footer polish") landed with this chapter in `RootLayout.tsx` — `sr-only focus:not-sr-only`, `focus:z-70` between the z-60 chrome and the z-80 SiteMenu.

## 09 Achievements (2026-08-25)

`sections/AchievementsSection.tsx` + `data/achievements.data.ts` + `utils/achievements.tunables.ts`. Mounted between Journey and Articles; eyebrow `09 — RECOGNITION` (Articles renumbered to 10, Contact to 11).

**Why it exists:** PRD §3.5's three awards used to be ember hover-pills inside 08 Journey behind a Radix HoverCard whose whole body was PLACEHOLDER — §3.5 is title/issuer/date only. Owner reference `reference/achievement-refine.mp4` (lukebaffait.fr's "Awards & Misc") is a flat table needing exactly three facts, so the extraction **deleted** the six placeholder strings rather than moving them.

**Type:** `Achievement { title; org; period }` in `types/portfolio.ts` — deliberately three fields. Don't add an optional description without adding it to PRD §3.5 first; that is exactly how the old hover panel filled up with placeholders. `JourneyKind` is now `"work" | "education"` (narrowing it is what surfaces any stray award consumer as a compile error).

**Heading is a STATEMENT, not the word "Achievements"** (owner asks 2026-08-25, two rounds). `font-display-lead text-statement max-w-[30ch]` — the same pair `.journey-statement` uses, so the two chapters' h2s are pixel-identical (Switzer 400). Copy lives in `ACHIEVEMENTS_STATEMENT` in `achievements.data.ts` (ARTICLES_STATEMENT precedent — chapter-owned statements live beside the data they frame; only person-level ones go in `profile.data.ts`), split at module scope into word spans with `font-display-tail italic` focals. The eyebrow carries the section name. Don't "restore" `text-item` or the bare title here.

**No blur de-veil on this statement** — Journey/Gallery/Articles all scrub `.xxx-word` blur→clear, this one deliberately doesn't: the row wipe already owns the viewport's reveal. Deliberate, not an omission.

**Row grammar:** `Box as="ul"` with `border-t`, each `li` `border-b`, `grid-cols-[2.5rem_1fr]` → `md:grid-cols-[3.5rem_1fr_1.4fr_auto]`, `px-4 py-8`. `px-4` is the reference's inset — its rows run the full page gutter but the first/last cells sit 16px inside the fill edge. Cells: `pad2` index (`font-mono text-index`), org, title (`md:text-center`), period (`md:text-right`). Row lands ~91px, reference is 94 at 1920.

**The fill is one `mix-blend-difference` layer, not a duplicated clipped row** — invert-bg over ink stays a light panel, over paper collapses to near-ink, so the text flips *mid-glyph* at the bar's moving edge (which is what the reference does). Two constraints fall out and are load-bearing:
- section root needs **`isolate`** — the blend must resolve against this section's own `bg-ink`, not the page;
- **no coloured text may sit under the bar** — `accent-deep` differences to cyan. The ember hover tick is a sibling rendered AFTER the bar, outside the blend.

**`--color-invert-bg` now has two consumers** (Contact's circle wipe + these rows). The "reserved for Contact" note in older docs is dead.

**Deleted with this chapter:** `components/ui/hover-card.tsx` (Journey's award pill was its only call site — `npx shadcn add hover-card` restores it), `--animate-hover-card` + both `hover-card-in` keyframe blocks, `JOURNEY.reveal.awardY`, and Journey's `cardOrdinal` (every row is a card now, so the ordinal IS the index).

**Repo gotcha found here:** bare `npx tsc --noEmit` is a **NO-OP** — root `tsconfig.json` is solution-style (`files: []`). Use `npx tsc --noEmit -p tsconfig.app.json` or `npm run build`. CLAUDE.md's Commands section still lists the bare form.

## 10 Workflow (2026-08-26)

`sections/WorkflowSection.tsx` + `data/workflow.data.ts` + `utils/workflow.tunables.ts`, nav anchor `#workflow`, eyebrow `10 — How I Work`. Slots between Achievements and Articles, which pushed Articles' eyebrow to `11` and Contact's to `12` (the eyebrow numbers are hand-written per section — inserting a chapter always means renumbering everything below it; `SiteMenu` numbers by array index and needs nothing).

Five process steps on a pinned horizontal rail (owner reference `reference/workflow-reference.mp4`). Engine + the layout inversion are in motion-engineer MEMORY.

- **Content is NOT PRD-transcribed and cannot be.** `grep -niE "process|workflow|discovery|maintenance"` over `product_requirements.md` returns zero across §2–§3.8. This is an owner-ask chapter on the Articles footing. The copy is *drafted against PRD facts* — the strongest anchor is §3.3.4, which is literally "Quality Assurance — Debugged and tested features"; the rest lean on §3.3.1–3 build duties and §2's "works well solo or in a team". `workflow.data.ts` carries the banner and is the owner's single edit surface. **Never add a step whose claim the PRD can't cover.**
- **`WorkflowStep.title` is capped at one or two words** — it renders at `--text-chapter` centred with room for exactly one line. "Quality Testing" is the longest that fits at 390px. This is stated in the data file; honour it.
- Step order is **process order, not most-recent-first** — the only data file in the set that reads forward.
- **`icon` is a string key (`WorkflowIconKey`), not a component.** A `LucideIcon` type in `types/portfolio.ts` would drag React and lucide into the content contract. `STEP_ICONS` maps key → component at the top of the section (six lines); a bad key fails compilation. Same shape as `utils/tech-icons.ts`.
- The active disc is **`bg-paper` + `text-ink`, never `bg-accent`** — a 128px ember disc is a wash, not a scalpel. Ember appears exactly twice: the eyebrow index and a 4px connector dot between disc and bubble. (Reuse this reasoning for any future large filled shape.)
- **Geometry is calibrated to the reference, not eyeballed**, and two tunables are *derived from* the Tailwind size classes: `liftPx: 112` = disc r64 + 24 dot clearance + bubble r24, and `discScaleFrom: 0.375` = `size-12`/`size-32`. Change `size-32` or `size-12` and BOTH must move — the doc comments say so.
- Title stays on `--text-chapter` even though the reference measures ~84px: there is no 84px token and inventing one to shave 12px would fail tokens-only. The **disc** grew (112→128) to fix the same ratio instead. Good precedent for "fix the ratio with the untokenised side".

**Enriched copy pass (2026-08-26, same day).** `WorkflowStep` gained `detail: string[]` — 3 short noun labels per step naming what it PRODUCES, rendered as a hairline chip row and hidden under `max-height:768px`. Because the chips are the first thing dropped on a short viewport, **nothing load-bearing may live in `detail`** (the type says so). `description` grew to two sentences (~150–190 chars) and its measure went 52ch → 64ch — at 52ch two sentences are four lines, which pushed the chips off a 1024×600 fold; horizontal room is what's abundant in this layout. New facts in the copy are all PRD-checkable and annotated per-step in the data file; note **"one of the roles ran over two years" is ONE role** (§3.3.2 = 27 months; §3.3.1 = 18) — don't round it up.

**Contrast rule proved here:** chip labels first used `text-faint` (`#4d4d4d` = **2.34:1** on ink) at `--text-meta` (12px, needs 4.5:1). They are announced `<li>`s, not ornament, so that was a real AA failure. `text-muted` measures **7.04:1** and is the floor for any real text on ink at meta size — `text-faint` is for genuine ornament only (the `— • —` divider), never for content.

**Read-beat pass (2026-08-26, third same-day pass).** `pin.headVh` is gone — split into `cascadeVh 0.40` / **`readVh 0.70`** / `handoffVh 0.35`, and every `introTl` position is derived as a share of their sum so they total exactly 1 by construction. **`pin.readVh` is the single dial** for how long the statement sits legible before the rail arrives; nothing else moves with it. Owner set it to **0.9vh** (≈810px @900 ≈ 1.35s at ~600px/s) on 2026-08-26. Pin length 4.15 → **5.00vh**; the Workflow→Articles gap is still exactly one viewport.
