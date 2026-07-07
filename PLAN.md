# PLAN v3 — Whole-site rebuild from the specs (approved)

> Supersedes v2 (voided by the hard reset `118f5bc` — `src/` is a bare 6-file shell). Source of truth: `.agents/context/{product_requirements,design_system,system_architecture}.md` + the visual reference set (`reference/contact-sheets/*`, `frames*/`, `lukebaffait-live/`, `REFERENCE-NOTES.md`). Whole-site planning; **per-section execution with a stop-for-approval gate after every section**. Prior-build knowledge (primitive APIs, choreography, gotchas) lives in `.claude/agent-memory/*` and is reused, not re-derived.

## 0. Chapter map & reconciliations

**10 chapters:** `00 Preloader · 01 Hero · 02 Manifesto · 03 About (NEW) · 04 Project/Craft · 05 Journey · 06 Skills (NEW) · 07 Gallery · 08 Contact · Footer` — supersedes design_system §11's 7-chapter order; §11 techniques are re-mapped below. Matches the reference's real 10-beat arc (REFERENCE-NOTES).

- **Project/Craft ↔ Gallery boundary** (two treatments of one dataset, reference §3.0b #3/#4): **04 = the approach chapter** — Web/Mobile pillar blocks (favored stacks, PRD §3.1 note) + titled **index of all 6 projects** (hover-swap-preview list) + keyword marquee. **07 = the visual showcase** — the `featured` subset as WorkCards (clip reveals, parallax, links). The list tells *what I do*; the gallery shows *what I made*.
- **Invert section:** the denser frame pass + live capture show the reference's light-invert is **Contact** (white `#F0F0F0`, semicircle wipe) — §3.0b's attribution to Awards is off by one beat. Our invert goes to **08 Contact**; Journey's awards keep hover-invert rows as a micro-echo.
- **Manifesto (02) vs About (03) boundary:** 02 = the emotional scroll-fill statement (re-voiced bio essence, §11.2); 03 = the factual persona block (statement + portrait + bio paragraph + stats 3·7·10 + CV link, reference beat 4).

## 1. Foundation (Stage B0 — one commit, then STOP)

- **Deps:** `npm i gsap @gsap/react lenis split-type zustand react-hook-form @emailjs/browser @fontsource-variable/fraunces @fontsource/jetbrains-mono clsx tailwind-merge class-variance-authority radix-ui lucide-react` + `npm i -D shadcn` (Tooltip/Button now; Dialog never unless lightbox is chosen). General Sans woff2 from Fontshare → `src/assets/fonts/` (`@font-face`, swap, preload display face).
- **Tokens** (`src/styles/globals.css` = design_system §9 + §3.4 + §4.3 + §5.2): Void & Ember palette (ink `#0A0A0A`, surface `#141414`, raised `#1C1C1C`, paper `#E4E4E4`, muted `#9A9A9A`, faint `#4D4D4D`, line `#242424`, **ember accent `#E8380F`** / deep `#B32C0B` / tint, invert `#E8E8E8`/`#0A0A0A`, success/error), fluid `--text-display…--text-meta` scale (with line-height/tracking), `--spacing-page-x`/`--spacing-section`, radius 4/8, motion tokens (`--ease-out cubic-bezier(0.16,1,0.3,1)`, `--ease-inout`, durs .4/.8/1.2), selection/scrim/focus/scrollbar rules, shadcn compat mapping. Gotcha honored: every `--text-*` token registered in extended-`cn()` font-size class groups (`lib/utils.ts`).
- **Motion setup** (golden rules, arch §2): `lib/gsap.ts` single GSAP source (ScrollTrigger + defaults `power4.out`/0.8s) · `providers/SmoothScrollProvider.tsx` single Lenis (lerp .09, arrow-wrapped `ScrollTrigger.update`, `gsap.ticker` sync, `lagSmoothing(0)`, not created under reduced motion, LenisContext) · hooks `useLenis` / `usePrefersReducedMotion` / `useIsomorphicLayoutEffect` · `store/useUIStore.ts` (`preloaderDone`, `menuOpen`). Exact prior APIs in motion-engineer memory.
- **Primitives** (`components/common/`, barrel): base `Box, Container, Text, Heading, Link, Image`; motion `RevealText, ParallaxImage, Marquee, MagneticButton, ChapterEyebrow, Cursor, Preloader,` **`PathDraw`**. Rebuild to the prop surfaces documented in agent memory (incl. reduced-motion branches).
- **Data layer** (PRD §3 verbatim, omit unknowns): `types/portfolio.ts` (`TechStack, Project, Skill, JourneyItem, Profile, ContactChannel`) · `features/home/data/{profile,skills,journey,contact}.data.ts` · `constants/{projects.data,navigation}.ts` · `config/{site,env}.ts`. New: `Skill.category` (presentation grouping — Frontend/Mobile/Backend/Database; names/levels verbatim); `profile` carries manifesto lines, about statement, stats, CV path; navigation = 8 chapter anchors.
- **Shell:** `main.tsx` → `AppProviders` (Theme(dark) → Tooltip → SmoothScroll) → Router; `__root.tsx` mounts AppProviders + RootLayout. Preloader/Cursor mount at ch. 00; Header/MobileMenu at ch. 01.
- Verify `npm run build` + `lint`; commit `chore(setup): re-establish design tokens, motion foundation, primitives, data layer`. **STOP.**

## 2. File/component tree

Per system_architecture §3, with deltas: sections `features/home/sections/{Hero,Manifesto,About,Craft,Journey,Skills,Gallery,Contact}Section.tsx` + `components/layouts/Footer.tsx`; section-local `PillarBlock, ProjectIndexList, JourneyEntry, SkillCategory, WorkCard, AuroraBackground` in `features/home/components/`; data in `features/home/data/` (established convention over §3's `constants/`); `lib/emailjs.ts` lands with chapter 08.

## 3. Per-chapter build spec

| Ch | Section | Layout | Signature technique (§7.2/§11 + reference beat) | Primitives |
|---|---|---|---|---|
| 00 | Preloader | full-screen ink overlay, z-90 | Mono counter 0→100 + name mask-reveal → curtain wipe up (`ease-inout`, dur-slow); once per session; sets `preloaderDone` (§11.0) | Preloader (+Cursor mounts) |
| 01 | Hero | full viewport; name at display scale; tagline + role mono ("Software Engineer · Web & Mobile"); ember scroll cue | char reveal gated on `preloaderDone`; **canvas aurora** upper-right ember glow, drifting, fades on scroll (§11.1, beat 2); ±10px mouse parallax; cue bob | RevealText(chars), AuroraBackground, MagneticButton |
| 02 | Manifesto | 2–3 statement lines, pinned | **scroll-fill scrub**: words `opacity .15→1`, one focal word ember-tint wash (§11.2); pin `+=175%` | pre-split words, ChapterEyebrow |
| 03 | About | two-tier statement + portrait + bio paragraph + stats 3·7·10 + CV link (beat 4; PRD §2) | statement line reveal; portrait **clip reveal + parallax**; stats mono count-up (reduced: static) | RevealText, ParallaxImage, ChapterEyebrow |
| 04 | Project/Craft | Web/Mobile pillar blocks + **titled index of all 6 projects** + keyword marquee (§11.3 + beat 5) | index rows light `muted→paper` on hover/enter with **hover-swap preview**; marquee separates pillars | Marquee, Image, RevealText, ChapterEyebrow |
| 05 | Journey | Experience + Education + Awards merged, most recent first (§11.4) | **PathDraw bold organic rail** (3–4px winding SVG, `stroke-dashoffset` scrub); entries reveal; awards close with hover-invert rows (beat 8 echo) | PathDraw, RevealText, ChapterEyebrow |
| 06 | Skills | left: uppercase positioning statement + CONTACT ME + accent arrow; right: categorized accordion (21 skills + 6 tools) (beat 7) | **scroll-driven sequential disclosure** — one category opens at a time on scrub; reduced motion = all open | RevealText, ChapterEyebrow, MagneticButton |
| 07 | Gallery | featured WorkCards `grid-cols-1 md:2`, mono tech chips, year, live/repo links (§11.5, beat 6) | **clip reveal + parallax** per card; hover scale 1.03 + cursor "View"; closing statement; optional PathDraw spine | WorkCard(ParallaxImage), PathDraw, ChapterEyebrow |
| 08 | Contact | oversized "Let's build something." + EmailJS form (underlined inputs, mono labels) + 3 socials (§11.6) | **section invert**: wipe to `invert-bg`, text flips (beat 9); magnetic CTA; success `#5BAE7C` / error `#D8735E` inline | MagneticButton, RevealText, react-hook-form + `lib/emailjs.ts` |
| Ftr | Footer | giant name marquee (display face), mono meta, back-to-top | slow Marquee; **ornament converge** (two sparse ember glyph clusters, x/opacity scrub, `aria-hidden`) (beat 10) | Marquee, MagneticButton |

## 4. Cross-section coherence (decided up front)

- **Motion language:** every reveal via the shared primitives; **one orchestrated moment per chapter**, page mostly still (§2). Numbers from §7.1 tokens only; *feel* from the frames.
- **Narrative arc:** loud open (aurora + char reveal) → quiet typographic middle (02–06) → visual payoff (07) → the one contrast beat (08 invert) → bookend (footer giant name echoes the hero).
- **Transitions:** shared `py-section` + `px-page-x` rhythm; every chapter opens eyebrow → title → content (§11.7); the red thread = Journey's PathDraw + Gallery's spine; Contact's invert is the only hard cut; restraint elsewhere IS the transition.
- **Spacing:** left-aligned narrative spine; Gallery + Footer may go full-bleed; text capped ~68ch.

## 5. Data mapping (PRD → typed constants)

| PRD | Constant | Used by |
|---|---|---|
| §2 persona/bio/stats/CV | `features/home/data/profile.data.ts` | 01, 02, 03, 06 |
| §3.1 skills (21, with levels) + §3.2 tools (6) | `features/home/data/skills.data.ts` (+ presentation `category`) | 04 pillars, 06 accordion |
| §3.3 work (4) + §3.4 education (2) + §3.5 awards (3) | `features/home/data/journey.data.ts` (9 items) | 05 |
| §3.6 projects (6) | `src/constants/projects.data.ts` (`featured` flags) | 04 index (all 6), 07 gallery (featured) |
| §3.7 contact (3 channels) | `features/home/data/contact.data.ts` | 08, footer |
| §3.8 navigation | `src/constants/navigation.ts` | header, footer |

## 6. Decisions (approved with this plan)

1. **Accent:** ember `#E8380F` (resolved, design_system v2 §3.2).
2. **Dark-only identity** — ThemeProvider stays (default dark), no visible toggle; light block deferred.
3. **Single-page** — gallery cards link out (live/repo); no `/work/$slug`, no Dialog lightbox in v1.
4. **Featured (07): 5 projects** — KHASS E-Ticketing, Phantom, Petabyte, HooBank, KNA (all 6 still in 04's index).
5. **Display face: Fraunces (A)** + the reference's mixed-pairing device at hero/footer only (first name General Sans, surname Fraunces italic + period).
6. **Invert placement: 08 Contact** (what the reference actually does).
7. **Blog: no.**
8. **Footer ornament converge: yes, subtle** (`aria-hidden`, low-opacity).

## 7. Per-section cycle (house rules)

Verify/extend typed data → accessible static layout (custom primitives + tokens ONLY) → motion via primitives (`useGSAP({scope})`, imports only from `@/lib/gsap`, reduced-motion fallback; borrowed ideas through `/animated-ui-references`, never framer-motion) → polish (hover, cursor labels, spacing rhythm) → `/qa-audit` (DoD, Lighthouse ≥ 90 via chrome-devtools MCP) → `/log-change` + `/update-memory` → one `feat(<chapter>):` commit → **STOP for approval**.

## 8. Known externalities (user-supplied; flagged, not blocking)

- Project thumbnails → `src/assets/images/` (04/07 ship with the `Image` fallback until supplied).
- CV PDF → `public/assets/pdf/`.
- `.env` EmailJS keys (08 degrades gracefully without them).
- Real favicon / OG image (data-URI placeholder until the final audit).
