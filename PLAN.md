# PLAN v3.1 — Remaining chapters 02 → Footer (revision of the approved v3)

> v3.1 revises the approved v3 after shipping B0 + chapters 00–01: marks what shipped (with as-built deltas), locks the **established conventions** learned from the built chapters as the coherence contract, and deepens chapters 02→Footer to build-ready specs. Source of truth unchanged: `.agents/context/{product_requirements,design_system,system_architecture}.md` + the reference set (`reference/contact-sheets/*`, `REFERENCE-NOTES.md`, live captures). Whole-site planning; **per-section execution with a stop-for-approval gate after every section**. Prior-build knowledge lives in `.claude/agent-memory/*` — reused, never re-derived.

## 0. Chapter map & reconciliations (unchanged from v3)

**10 chapters:** `00 Preloader ✅ · 01 Hero ✅ · 02 Manifesto · 03 About · 04 Project/Craft · 05 Journey · 06 Skills · 07 Gallery · 08 Contact · Footer` — supersedes design_system §11's 7-chapter order; matches the reference's real 10-beat arc (REFERENCE-NOTES).

- **Project/Craft ↔ Gallery boundary** (two treatments of ONE dataset, reference beats 5/6): **04 = the approach chapter** — Web/Mobile pillar blocks + titled **index of all 6 projects** (hover-swap-preview list) + keyword marquee. **07 = the visual showcase** — the `featured` 5 as WorkCards (clip reveals, parallax, links). The list tells *what I do*; the gallery shows *what I made*. One `projects` constant, two render modes.
- **Invert section: 08 Contact** (what the reference actually does — white section, huge heading, socials); Journey's awards keep hover-invert rows as a micro-echo.
- **Manifesto (02) vs About (03):** 02 = the emotional scroll-fill statement (`profile.manifesto`); 03 = the factual persona block (statement + portrait + bio + stats 3·7·10 + CV link, reference beat 4).

## 1. Foundation + chapters 00–01 — SHIPPED ✅

Everything in v3 §1 landed and is verified healthy (2026-07-08: `npm run build` + `npm run lint` clean): ember tokens live in `globals.css` (`--color-accent: #e8380f` — the cobalt note in older docs is stale), all 14 primitives in `@/components/common` (incl. **PathDraw**, built but not yet wired into any section), motion setup (single GSAP source, single Lenis owner, hooks, `useUIStore`), full typed data layer, all deps installed (nothing left to install; `framer-motion` deliberately absent). `lib/emailjs.ts` is the only pending module (lands with 08).

As-built deltas vs v3:

- **No Header/MobileMenu.** Chrome is: hero-inline `MenuButton` → fixed `MenuPopout` (z-60, pops out past 100vh with `back.out(2)`) → fullscreen `SiteMenu` overlay (z-80, ember bg, all 8 anchors, focus-trapped, Escape-close). Two-level `inert` in `RootLayout` (preloader up / menu open).
- **Preloader is the three-act Welcome/ember/curtain** (`feat(preloader)` `4d3c399`), runs on **every** load: Welcome mask-reveal + ring counter (proxy tween 0→100, dur 2, `power2.inOut`) → ember panels slide up, "To My Portfolio" chars → split-curtain `xPercent ∓100`, dur 1.1, `power4.inOut` → `setPreloaderDone`.
- **Hero**: two-row giant name (first name `font-sans font-medium` / surname `font-display italic` + "."), `text-hero` clip spans, char reveal gated on `preloaderDone`, `AuroraBackground` (ogl) fading on scroll, ±10px pointer parallax, hairline bottom bar with role · socials · 3 anchors.
- `HomePage` still carries a ponytail-commented **150vh scroll runway** placeholder — removed when 02 lands.
- Non-blocking: production JS is one 515 kB chunk (gsap+ogl+react) — revisit at the final whole-site QA (manualChunks), not per-section.

## 2. Established conventions — the coherence contract (from built 00–01 + agent memory)

Every remaining chapter carries these forward; deviations need a reason at its gate.

- **Motion vocabulary:** clip-mask reveals `yPercent 100→0` inside `overflow-hidden` wrappers; staggers chars `0.025` / words `0.04` / lines `0.08` / items `0.06–0.08`; eases `power4.out` (default, dur 0.8 — reveals), `power4.inOut` (curtains/panels), `power2.inOut` (counters), `back.out(2)` (pop-ins), `elastic.out(1,0.4)` (magnetic spring); durations cluster 0.4 / 0.8 / 1.0 / 1.1 / 1.2; enter-reveals `start:"top 80%", once:true`; scrubs always `invalidateOnRefresh:true`. Everything in `useGSAP({ scope, dependencies, revertOnUpdate: true })`; GSAP only from `@/lib/gsap`; reduced-motion early-return in every effect (content visible via JSX — hide only via `gsap.set`, never CSS).
- **Chapter shell:** `<Box as="section" id="…" className="px-page-x py-section">` → `ChapterEyebrow index="0N" label="…"` → title (`RevealText as="h2" mode="lines"` + `font-display text-chapter text-paper`) → content. Section `id`s must match `constants/navigation.ts` anchors. Custom primitives only; tokens by NAME only.
- **Gotchas honored:** any new `--text-*` token must be registered in `lib/utils.ts` extended-twMerge font-size groups; `Heading` default-variant responsive sizes survive twMerge over fluid tokens — use `RevealText as="h2"` / `Box as="h3"` + token classes for token-sized headings; `RevealText` wraps plain text only (structural reveals replay the recipe in a scoped useGSAP); full-bleed inside the padded shell via `-mx-page-x`; cursor labels via `data-cursor="VIEW"`; z-scale: content ≤ 50 < popout 60 < SiteMenu 80 < Preloader 90 < Cursor 100; Marquee seam = single joined span + NBSP before the trailing separator; `Link` handles `#hash` via `lenis.scrollTo { force: true }` already.

## 3. Per-chapter build spec (02 → Footer, build-ready)

### 02 Manifesto — `id="manifesto"`, eyebrow `02 — WHO I AM`

**SHIPPED ✅ (2026-07-13) as the PROMPT #4 WebGL MacBook scroll-story** — supersedes both this spec's pinned scroll-fill (`c14474e`) and the 3D keyboard disintegration (`376f4c0`), and explicitly reopens open-decision 9 ("skip the hero→manifesto media reveal" — now built).

- **As built:** a live WebGL strip sits between the hero's two name rows (`--spacing-manifesto-slot` slot span in the h1); T1 pins `#hero` (`clamp(bottom bottom)`, `+=120%`) and expands the fixed stage's clip-path from the slot rect to full-bleed while the name rows ride the edges off-screen; T2 scrubs a channels-object master across a 520vh runway (`-mt-[100svh]` swallows the pin-spacer dead zone): closed MacBook (runtime hinge rig on `macbook.rigged.glb`) → lid opens facing away (Apple-logo beat) → 180° yaw onto the lit wallpaper → `profile.manifesto` statement (pre-split words, focal `bg-accent-tint` wash) → backdrop-blur ember veil handing off to 03. Reduced motion: static statement + poster figure (the hero slot carries the poster strip). WebGL/GLB failure: poster inside the still-working seam. Details: `logs/feature-changes/2026-07-13-macbook-3d-pipeline.md` + `2026-07-13-manifesto-macbook-story.md`.
- **Data:** `profile.manifesto` verbatim (one line, focal word "code").

### 03 About — `id="about"`, eyebrow `03 — ABOUT` (reference beat 4) — SHIPPED ✅ (2026-07-13, PROMPT #4 commit 3)

- **As built:** normal-flow section right after the manifesto runway — it is the veil's landing target (§4.6 grammar: whole `.about-inner` clears from `autoAlpha 0 / y 48 / blur(14px)` over 1.1s once at `top 78%`, `clearProps:"filter"`; children then stagger). Two-tier `aboutStatement` (verbatim, split at the comma; tier 1 cols 1–8, tier 2 indented cols 4–12; h2 carries the full sentence as `aria-label`, tiers `aria-hidden` in `RevealText mode="lines"`) → bio (cols 1–6, `max-w-[46ch] text-muted`) beside the portrait (`ParallaxImage` cols 8–12, rounded-top, scrim; `/assets/images/portrait.webp` 404s into the primitive's new graceful-hide until the real photo lands) → hairline stats row with mono count-up (`textContent` snap 1, 1.2s, once) → `MagneticButton` CV link (mono uppercase, accent →). Reduced motion: everything static, real values. Log: `logs/feature-changes/2026-07-13-about.md`.
- **Data:** `profile.{aboutStatement,bio,stats,cvUrl}` verbatim — no delta. Externalities still owed: portrait photo + CV PDF (`public/assets/pdf/Muhammad Sufyan CV.pdf`).

### 04 Project/Craft — `id="craft"`, eyebrow `04 — WHAT I DO` (reference beat 5)

- **Layout:** approach intro — **Web / Mobile pillar blocks** (rebuild `PillarBlock` editorial hairline-row stack per memory recipe; `profile.favoredStacks` cross-referenced against `skills` levels via the name+alias map) → full-bleed keyword `Marquee` band (`-mx-page-x border-y border-line`, NBSP seam fix) → **titled index of ALL 6 projects** (`projects`): numbered rows (`font-mono text-index` counter + title above `text-item`), row lights `text-muted → text-paper` on hover/in-view, **hover-swap preview** thumbnail column on `(hover:hover)` desktop (single `Image`, `autoAlpha` crossfade per active row), `data-cursor="VIEW"`, rows link out (live URL, else repo).
- **Motion:** rows reveal `yPercent 100→0` stagger 0.08; preview crossfade dur 0.4; **PathDraw organic thread** winding behind the index (3.5 px, `text-accent`, scrub) — the signature red thread enters the site here and hands off to Journey.
- **Data:** exists (`projects` all 6, `profile.favoredStacks`, `skills`) — no delta.

### 05 Journey — `id="journey"`, eyebrow `05 — THE PATH`

- **Layout:** ONE merged vertical timeline, the 9 `journey` items most-recent-first (4 work · 2 education · 3 awards — **awards not dropped**); each entry: title (`Box as="h3"` + `text-item` — Heading trap), org, mono period + `employmentType` chip, one-line summary, optional stack chips. Node dots: awards `bg-accent`, work/education `bg-faint` (decided pre-reset, kept).
- **Motion:** **PathDraw bold organic rail** (the planned upgrade over the old 1 px scaleY rail; scrub `start:"top 80%" end:"bottom 60%"`); entries `autoAlpha + y` reveal, stagger 0.08; awards rows get the reference's **hover-invert micro-echo** (`hover:bg-invert-bg hover:text-invert-text`).
- **Data:** exists (`journey`, 9 items) — no delta.

### 06 Skills — `id="skills"`, eyebrow `06 — TOOLKIT` (reference beat 7)

- **Layout:** two columns. Left (sticky on desktop): uppercase positioning statement — transcribed from PRD persona (reuse `profile.aboutStatement` / `profile.role`; never invent copy) — + "CONTACT ME" `MagneticButton` with accent arrow → `#contact`. Right: **category accordion** — the 4 `SkillCategory` groups (Frontend 12 / Mobile 3 / Backend 4 / Database 2, each skill with a mono level chip Adv/Int/Basic) + a 5th "Tools" group (the 6 `tools`).
- **Motion:** **scroll-driven sequential disclosure** — pinned scrub opens one category at a time (height/autoAlpha through the pin range), matching the reference's scrubbed accordion. Mobile + reduced motion: no pin, all groups open, simple reveals.
- **Data:** exists (`skills` with `category`, `tools`) — no delta.

### 07 Gallery — `id="gallery"`, eyebrow `07 — SELECTED WORK`

- **Layout:** the `featured` 5 (KHASS · Phantom · Petabyte · HooBank · KNA) as `WorkCard`s in `grid-cols-1 md:grid-cols-2` with offset columns for rhythm: `ParallaxImage` thumbnail (fallback until real shots supplied), title, mono tech chips from `techStack`, year only if known, live/repo `Link`s, `data-cursor="VIEW"`.
- **Motion:** clip reveal + parallax per card (primitive defaults); hover scale 1.03 + cursor "VIEW"; cards stagger on enter. No closing statement line — the PRD has no such copy (open decision 13 if wanted).
- **Data:** exists (`projects` featured subset) — no delta. Thumbnails remain a flagged externality (§8).

### 08 Contact — `id="contact"`, eyebrow `08 — LET'S TALK`

- **Layout:** **the one light-invert section** (full-bleed `bg-invert-bg text-invert-text`): oversized display heading ("Let's build something.", §11.6), availability/location line from `profile`, the 3 `contactChannels` (WhatsApp · Gmail · Telegram) as magnetic mono links + `socialLinks`, and the EmailJS form — react-hook-form, underlined `h-12` inputs, mono labels, ember focus underline, inline `text-success` / `text-error` states, no reload. **New module: `src/lib/emailjs.ts`** (thin `@emailjs/browser` send wrapper reading `config/env.ts`); if keys are absent the form degrades to channels-only.
- **Motion:** invert entry as a short crossfade/hard cut on ScrollTrigger enter (§7.2 "section invert"; semicircle wipe = open decision 12); heading `RevealText`; magnetic CTA. A11y gate: focus-ring + accent contrast re-checked on the light bg; form fully keyboard-navigable.
- **Data:** exists (`contactChannels`, `socialLinks`, env config) — the delta is code, not data.

### Footer — `components/layouts/Footer.tsx`, rendered by HomePage after Contact

- **Layout:** back to ink (the bookend after the invert); giant name `Marquee` — the hero's mixed-pairing device (first name `font-sans font-medium`, surname `font-display italic` + ".") at display scale, `text-muted`, slow (speed 30); mono meta columns (email · © year · socials · navLinks); back-to-top `MagneticButton`.
- **Motion:** slow marquee (duplicate track `aria-hidden`); **ornament converge** (decision 8: yes, subtle) — two sparse ember glyph clusters, `aria-hidden`, low opacity, x/opacity scrub on footer enter. Reduced: static.

## 4. Whole-arc transitions (Manifesto → Footer)

Loud open (preloader curtain → aurora hero) → **quiet typographic middle** (02 pinned fill → 03 editorial → 04 index) with the **PathDraw red thread as the connective device through 04→05** → 06's pinned disclosure as the last quiet beat → 07 visual payoff → **08 invert as the single hard contrast cut** → footer returns to ink and bookends on the name. Shared `py-section` / `px-page-x` rhythm everywhere; one orchestrated moment per chapter; restraint IS the transition. The reference's hero→manifesto "media walks through the name" signature is **not** reproduced (open decision 9). Left-aligned narrative spine; marquee band, Gallery and Footer may go full-bleed; text capped ~68ch.

## 5. Data mapping (PRD → typed constants) — all transcribed, reuse only

| PRD | Constant | Used by |
|---|---|---|
| §2 persona/bio/stats/CV | `features/home/data/profile.data.ts` | 01, 02, 03, 06 |
| §3.1 skills (21, with levels) + §3.2 tools (6) | `features/home/data/skills.data.ts` (presentation `category`) | 04 pillars, 06 accordion |
| §3.3 work (4) + §3.4 education (2) + §3.5 awards (3) | `features/home/data/journey.data.ts` (9 items) | 05 |
| §3.6 projects (6) | `src/constants/projects.data.ts` (`featured` flags) | 04 index (all 6), 07 gallery (featured 5) |
| §3.7 contact (3 channels) | `features/home/data/contact.data.ts` | 08, footer |
| §3.8 navigation | `src/constants/navigation.ts` (8 anchors, already matches the chapter map) | SiteMenu, footer |

No data deltas are expected for 02→Footer; per-chapter step 1 verifies rather than extends. Unknown fields (project years, portrait asset) stay omitted — never fabricated.

## 6. Decisions

Approved with v3 (unchanged): **1** accent ember `#E8380F` · **2** dark-only · **3** single-page, cards link out · **4** featured 5 (KHASS, Phantom, Petabyte, HooBank, KNA) · **5** Fraunces display + mixed-pairing device at hero/footer · **6** invert = 08 Contact · **7** no blog · **8** footer ornament converge, subtle.

New with v3.1 — open, each with a recommended default (approving this plan approves the defaults; override any at its chapter's gate):

9. **Hero→Manifesto inline media reveal** (reference's signature) — **default: skip** (no sculpture/media asset; aurora fade + quiet cut instead).
10. **Skills disclosure** — **default: scrubbed sequential accordion** (reference-faithful pin); alternative: click accordion (simpler, no pin).
11. **Gallery treatment** — **default: WorkCard grid** (calmer, v3); alternative: the reference's scattered 3D-drift field.
12. **Contact invert entry** — **default: hard cut / short crossfade** (§7.2); alternative: the reference's semicircle wipe (custom clip-path scrub).
13. **Gallery closing line** — **default: omit** (PRD has no such copy); if wanted, supply the line and it joins `profile`.
14. **About portrait** — **default: build now on the `Image` fallback**; swap in the real photo when supplied.
15. **PathDraw in 04's index** — **default: yes, subtle** (thread continuity into Journey); alternative: Journey-only.

## 7. Per-section cycle (house rules)

Order: `manifesto → about → craft → journey → skills → gallery → contact → footer`, one full cycle per chapter, then STOP:

1. Verify typed data (no invention; omit unknowns).
2. Accessible static layout — custom primitives + tokens only (frontend-engineer).
3. Motion via the primitives per §3 above (motion-engineer; borrowed ideas through `/animated-ui-references`; never framer-motion).
4. Polish: hover states, `data-cursor` labels, spacing rhythm.
5. `/qa-audit` — static DoD greps + runtime smoke; Lighthouse ≥ 90 via chrome-devtools MCP **from the main thread** (MCP not exposed in qa-auditor subagent threads; puppeteer fallback documented in qa memory).
6. `/log-change` + `/update-memory`; one `feat(<chapter>):` commit including the log.
7. **STOP** — present the section; wait for approval or feedback.

Deferred until after Footer: scroll-spy accent nav dot (needs all anchors live), bundle-chunk split, favicon/OG pass.

## 8. Known externalities (user-supplied; flagged, not blocking)

- Project thumbnails → `src/assets/images/` (04/07 ship with the `Image` fallback until supplied).
- Portrait photo for 03 (same fallback treatment).
- CV PDF → `public/assets/pdf/Muhammad Sufyan CV.pdf`.
- `.env` EmailJS keys (08 degrades gracefully without them).
- Real favicon / OG image (data-URI placeholder until the final audit).
