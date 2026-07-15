# Reference Breakdown & Analysis — lukebaffait.fr

**Purpose:** the authoritative design breakdown of the visual/motion reference for the portfolio redesign — palette, typography, section map, and per-section animation choreography.
**Audience:** the human owner + all AI agents (`.agents/`, `.claude/`).
**Intended location in repo:** `reference/breakdown_analysis.md` (sibling of `REFERENCE-NOTES.md`; this document supersedes nothing — it consolidates and extends).

---

## 1. Provenance & method

| Evidence source | What it grounds |
| --- | --- |
| `reference/lukebaffait-scroll.mp4` — 1920×1080, 93.2 s, 120 fps, MD5 `e049b5c8e19d87941bd2efe659169ec4` (identical to the previously analyzed recording; no re-grounding of palette required) | The full scroll arc, preloader included |
| `reference/frames/` (373 jpg @ 4 fps), `frames-key/` (349, mpdecimate), `contact-sheets/` (4), `frames-v1/` (47) | Per-chapter composition study |
| `reference/lukebaffait-live/{desktop,mobile}` + `live-mcp-*.jpeg` | Real settled/hover states, real depths |
| Live fetch of `https://lukebaffait.fr/` (2026-07-15) | Actual DOM copy, section content, meta (`theme-color: #0a0a0a`) |
| Fresh color-histogram pass (2026-07-15, 27 frames sampled across 9 phase windows, median-cut quantization) | Verifies the palette + section timing claims below |
| Repo-repeatable re-verification: `reference/scripts/histogram-phases.py` (2026-07-15 — 40 frames across the 8 phase windows + a 71-frame brightness scan of frames 270–340) | Confirms/corrects §2.1 (corrections noted inline under the table) |
| Font-detector screenshot supplied by the owner (2026-07-15) | **Names the four typefaces in use** — see §3 |
| In-browser measurements recorded in `REFERENCE-NOTES.md` (chrome-devtools MCP pass, 2026-07-08) | Computed styles: body bg/text, SVG path stroke, page height, Lenis |
| Computed-style + easing probe (chrome-devtools MCP, 2026-07-15 — desktop 1440×900 + emulated 390×844×2) | §3 corrections + the §8 appendix (fonts, path stroke, scrub damping) |

Evidence-status convention used below: **[measured]** = read from pixels/DOM programmatically · **[named]** = from the font-detector screenshot · **[observed]** = read visually from frames · **[inferred]** = best explanation, not directly verified.

---

## 2. Color palette

### 2.1 Verified histogram (2026-07-15 pass, dominant swatches per phase)

| Phase (≈ time) | Dominant swatches (share of frame) | Reading |
| --- | --- | --- |
| Preloader 0–5 s | `#0F110E`/`#0A0A0A` (47–85%), `#810F1A`, `#571616` | Near-black base + hard red flash frames |
| Hero 5–16 s | `#10100F` (~50%), `#7C0F1B`, `#762527` (~24–28%) | The red **aurora glow** occupies ~a third of the frame, upper-weighted |
| About 16–28 s | `#0A0A0A` (45–67%), `#850311`, grays | Dark; red-lit portrait window |
| Projects 28–40 s | `#0A0A0A` (64–70%), `#9D0213`→`#C50603` (7–11%) *(corrected 2026-07-15 — draft pass read 72–80% / 4–8%)* | The **thick red path** is the only chroma |
| Gallery 40–56 s | `#0A0A0A` (76–84%), neutral grays | Almost fully neutral |
| Skills 56–68 s | `#0A0A0A` (78%), `#3C3B3D` | Fully neutral |
| Awards→Contact 68–82 s | `#EFEFEF` (60–65%) + red + blue-violet sculpture tones | The **single light-invert window** of the site (brightness **peaks 82.6% at ~72.75 s**, then plateaus ~71–77% through ~80.75 s — *corrected 2026-07-15; the draft's "~73% at ~76 s" read the plateau as the peak*) |
| Footer 83–93 s | `#0A0A0A` (58–62%; 79% at the ~83 s entry) *(refined 2026-07-15)* | Returns to ink; ends dark |

> **Re-verified 2026-07-15** via `reference/scripts/histogram-phases.py` (repo root, no args — 5 frames per window, median-cut 8 colors, + brightness scan of frames 270–340). Confirmed as-drafted: Hero (red aurora ≈ a third of frame chroma), Gallery (72–84% ink, near-neutral), Skills (75–78% ink, fully neutral), invert-window boundaries (ramp starts ~68.5 s, full light from ~72.5 s, decayed back to ink by ~83 s). Corrections beyond the in-table notes: the **Preloader's** first ~2.5 s are red-*dominant* (top swatch `#B80D1D`–`#C20E1D` at 18–22% over red-tinted darks), with a near-full-red flash frame (`#E70602` at 74% of frame) landing at ~5.0 s on the hero handoff; the **About** window's near-black share dips to ~24% at ~18.75 s while the full-bleed B/W media seam holds the frame (grays ≈ 39%) — the draft's 45–67% floor doesn't hold at the window start.

### 2.2 Values

- **Background:** `#0A0A0A` everywhere **[measured** — body computed style + `theme-color` meta + histogram**]**. Never pure `#000`.
- **Text:** `#F0F0F0` body **[measured]**; mid-grays `#989898–#C0C0C0` for muted states **[measured]**. Fully neutral — no warm cast anywhere.
- **Accent:** one vivid red-orange. Raw samples `#F81800` (video), `#FF1E00` (SVG path stroke, computed) **[measured]**. Used as: aurora glow (hero), preloader flash, the organic path, arrow/marker details, thumbnail-preview tint. Never as a fill for content surfaces.
- **Light-invert section:** `#EFEFEF/#F0F0F0` **[measured]**, one window only (Awards → Contact).
- **Micro-accent:** cyan, hover-only on the hero surname **[observed]** — a one-off spice, not a system color.

### 2.3 Mapping to our tokens (settled — do not re-derive)

Void & Ember stays authoritative: ink `#0A0A0A` (exact match), paper `#E4E4E4` (reference: `#F0F0F0` — ours slightly dimmer by design), ember `#E8380F` (reference raw `#FF1E00/#F81800` — ours deliberately calmer for UI-size legibility), invert `#E8E8E8` (reference `#F0F0F0`). The reference's path stroke is **72 viewBox units** (viewBox `0 0 1400 1400`), so it scales with the viewport: **≈74 px rendered at 1440, ≈20 px at 390** [measured 2026-07-15 — refines the earlier "72 px at 1440" reading, which was the computed value in user units, not the rendered thickness] vs our PathDraw 3.5 px hairline discipline — a known, deliberate divergence recorded in `REFERENCE-NOTES.md`; changing it is a design-system decision, not a build-time one.

---

## 3. Typography

The font-detector screenshot named four faces (Factory Grotesk, Apparel, Inter, Zalando Sans). The 2026-07-15 in-browser probe (computed styles + `@font-face` rules + `document.fonts` — full values in §8) **corrects that roster**: the site loads four faces, but two of the detector's names don't match the declared families, one role was wrong, and one face was missed entirely.

| Face (declared `@font-face` family ← file) | Detector's name | Role on the reference | Evidence |
| --- | --- | --- | --- |
| **`Breton` ← `Breton.woff2`** | "Factory Grotesk Medium" | Display roman — the "Luke" half (249.9 px, weight 300) — **and the entire reading layer**: hero tagline, statement words, bio paragraphs, contact email | family/file/role [measured]; the detector's ID conflicts with the declared name — which glyphs the file actually contains stays [named] vs [inferred], unresolved |
| **`other` ← `Machine.otf`** | "Apparel Regular" | Display *italic serif* — the "*Baffait.*" half (249.9 px, weight 400), the focal/emphasis words inside statements | family/file/role [measured]; same declared-name-vs-detector caveat |
| **`Inter`** (variable, 400/600/700 loaded) | "Inter Regular" | **UI/meta layer only, not body** — nav + social links (16 px), "V3.0" mark (17.6 px w600), awards table cells (24 px w400) | [measured] — **corrects prior evidence**: both this draft's "body text" role and the 2026-07-08 `REFERENCE-NOTES.md` claim "body font = Inter"; the bio paragraphs are Breton (§8) |
| **`Zirena` ← `Zirena.woff2`** (w800 only) | *(missed — possibly its "Zalando Sans" read)* | Heavy uppercase display accents — the Skills positioning statement (40 px w800) and the giant "Contact" title (187.2 px w800, tracking −3%, leading 0.9) | family/file/role [measured]; that the detector's "Zalando Sans" was a misread of Zirena is [inferred] |

**Zalando Sans is not loaded anywhere** — no such family appears in any `@font-face` rule or `document.fonts` entry [measured]. This settles the draft's one [inferred] claim: the small-label layer is **Inter**.

**The typographic system in one line (corrected):** a roman grotesk that does double duty for display *and* reading (Breton), an italic serif reserved for the surname + focal words (the "emotion" voice — still the site's single most distinctive typographic move), a neutral sans for chrome/meta (Inter), and a heavy grotesk fired exactly twice for uppercase display accents (Zirena).

### 3.1 Mapping to our stack (settled)

*(Reference-side names updated 2026-07-15 to the measured families — the mapping itself is settled and unchanged.)*

| Reference | Ours | Note |
| --- | --- | --- |
| `other`/`Machine.otf` (italic serif, focal words + surname) | **Fraunces** (display, italic for focal words) | Same job: the emotion voice |
| `Breton` (display roman **+ body** — one face, both jobs) | **General Sans** (both jobs) | The reference itself collapses display-roman and body into one face — directly validating our same decision; contrast-of-voice comes from Fraunces |
| `Inter` (meta/labels) | **JetBrains Mono** | Deliberate divergence: mono is our "engineer voice" and a Signature Seam element — stronger identity than copying a quiet sans |
| `Zirena` (two uppercase display accents) | *no counterpart* | Deliberate omission: a fourth face for two moments doesn't survive our restraint rule; those beats map to General Sans weight/case shifts |

---

## 4. Global motion grammar

- **Scroll engine:** Lenis on native scroll (`html.lenis`) [measured]; page ≈ 17,200 px ≈ 19 viewports [measured].
- **Continuous, weighted scrub.** mpdecimate keeps 349 of 373 frames — the recording has almost **no static holds**; nearly everything is scroll-bound rather than time-bound. Scrubbed values visibly lag and settle (damped), never linear — now **[measured]** (2026-07-15 rAF sampling, §8.3): `scrollY` settles exponentially after wheel input stops (per-frame velocity decay ≈ 0.87–0.92 at ~60 fps ⇒ lerp ≈ 0.09–0.13, motion continuing ~1.5–2 s), and the path's `stroke-dashoffset` scrub carries a **second damping layer** — it keeps easing toward target after `scrollY` is already stationary. This matches our per-frame `MathUtils.damp` convention and our Lenis `lerp 0.09`.
- **One orchestrated moment per beat.** Each section has exactly one signature move; everything else is quiet. Restraint carries the "premium" feel more than any single effect.
- **Chroma = narrative punctuation.** Red appears (aurora → path → arrow → contact sculpture) precisely where the story peaks, and disappears in between (Gallery/Skills are fully neutral — §2.1).
- **The page is a loop.** It opens on the name (hero) and ends on the name (footer bookend).

---

## 5. Section-by-section breakdown

Frame № ≈ 4 × seconds in `reference/frames/`.

### 5.0 Preloader (0–5 s)
- **Layout:** small "Luke Baffait" wordmark centered on black.
- **Choreography:** wordmark scales up continuously; **1–2-frame hard color flashes** (full-red frame, cyan-on-red frame) punch through mid-zoom — a percussive glitch beat, not a counter; then the curtain reveals the hero already in place.
- **Feel:** fast, confident, slightly aggressive. Total ≲ 3.5 s.
- **We borrow:** the *percussive* energy. Our three-act Welcome/ember/curtain preloader is already shipped and stays — no revision implied.

### 5.1 Hero (5–16 s)
- **Layout:** viewport-filling two-word name — "Luke" (Factory Grotesk roman) / "*Baffait.*" (Apparel italic + terminal period). Chrome: social links top-left (BEHANCE·LINKEDIN·GITHUB), nav top-right (WORK·INFO·CONTACT), "v3.0" mark, French tagline low-left.
- **Choreography:** upper-weighted red **aurora blob** breathes behind the name (soft, blurred, alive — ~28% of frame chroma [measured]); name chars reveal on load; surname flashes **cyan on hover** (micro-moment); aurora fades as scroll begins.
- **We borrow:** already shipped (AuroraBackground + two-row name + char reveal). The cyan hover micro-accent remains an available, unused idea.

### 5.2 Hero → media seam (≈ 14–20 s)
- **Layout/Choreography:** on first scroll, a small B/W sculpture video **opens between the two name rows**, pushing them apart while expanding to full-bleed; the sculpture shatters into 3D fragments under the line "Basically, I make websites."
- **Feel:** the name is the door; the media walks through it. The single most-cited moment of the site.
- **We borrow:** shipped as the 02 Manifesto WebGL seam (clip-path stage expansion from the in-h1 slot + MacBook story) — our version replaces the video with a live 3D subject.

### 5.3 About (16–28 s)
- **Layout:** statement type "As a *creative developer*, I craft tailor-made web experiences, blending technical precision and *emotion*" (Apparel italics on focal words) → red-lit portrait (rounded top corners) + short bio + "→ V3.0" marker. Small, hard-aligned text blocks; generous dead space.
- **Choreography:** line reveals on enter; portrait clip-reveal; gentle parallax. No pin.
- **We borrow:** shipped (03 About with `aboutStatementEmphasis` italics + right-edge portrait panel).

### 5.4 Projects list (28–40 s)
- **Layout:** left — eight project names as a big list; right — one laptop-mockup preview swapping per active row.
- **Choreography:** rows light `muted → paper` as they become active; the **thick organic red path (72 viewBox units ≈ 74 px rendered @1440 — §2.3)** draws via stroke-dashoffset and *snakes between the rows* for the entire section, then exits into the next chapter; preview crossfades per row.
- **Feel:** the path is the site's signature — a living red thread stitching the work together.
- **We borrow (04 Craft):** titled index of all 6 projects + hover-swap preview + **PathDraw thread** (ours hairline 3.5 px — see §2.3) entering here and handing off to Journey.

### 5.5 Gallery (40–56 s)
- **Layout:** the same project covers re-presented as **loosely scattered mockups floating in 3D space**, plus the centered line "Each project is a chance to *learn*, *experiment* and push my limits."
- **Choreography:** covers drift/parallax at different depths on scroll (multi-plane, different velocities); statement scroll-fills with italic focal words.
- **We borrow (07 Gallery):** two treatments of ONE dataset (list ↔ showcase) — the exact justification for our 04/07 split. Depth-parallax on WorkCards is the optional flourish.

### 5.6 Skills (56–68 s)
- **Layout:** left — uppercase positioning statement + "CONTACT ME" + a big red arrow →; right — 7-category accordion (Frontend, Animation & 3D, Backend, Databases, DevOps & Tools, System & Security, Design).
- **Choreography:** a **scrubbed sequential accordion** — scroll opens one category, lists its tools, closes it, opens the next. Scroll-driven, not hover-driven; feels like the page reading its own résumé.
- **We borrow (06 Skills):** the pinned sequential disclosure exactly; reduced-motion/mobile = all groups open, no pin.

### 5.7 Awards & Misc (≈ 66–74 s)
- **Layout:** hairline table on dark → transitioning light: issuer / site / mention / date (5 recognitions).
- **Choreography:** rows **invert to white on hover** with a small red thumbnail preview following the cursor.
- **We borrow:** awards live inside our 05 Journey with the hover-invert as a micro-echo (settled in PLAN v3.1).

### 5.8 Contact (≈ 74–82 s)
- **Layout/Choreography:** a **white semicircle wipes up** into the full light-invert section (`#F0F0F0`): huge black "Contact", red/blue sculpture render right, availability copy, socials + email. The one hard contrast cut of the site (brightness peaks **82.6% at ~72.75 s**, plateau ~71–77% [measured — corrected 2026-07-15, see §2.1]).
- **We borrow (08 Contact):** the invert section + semicircle (or equivalent) wipe as the single contrast beat.

### 5.9 Footer (83–93 s)
- **Layout:** back to ink. The giant name **re-enters cluster-by-cluster** to fill the width — the hero's bookend — above tiny mono-ish columns (email · © · socials · nav).
- **We borrow (Footer):** name bookend + JetBrains Mono columns (our Signature Seam lives here).

---

## 6. Interaction layer (cross-section)

- Custom cursor with contextual labels near interactive media [observed].
- Hover grammar: rows brighten (list), rows invert (awards), preview-follows-cursor (awards), cyan flash (hero surname) — each hover idiom appears in exactly one place.
- Nav/social chrome stays fixed, tiny, and quiet — chrome never competes with the stage.

## 7. Reading guide

Whole arc → `contact-sheets/` (4 sheets). A specific beat → `frames/` (№ ≈ 4×s). A settled/hover state → `lukebaffait-live/` or `live-mcp-*.jpeg`. Motion numbers (easing, durations) are **not** recoverable from 4 fps stills — treat `design_system.md §7` + PLAN v3.1 §2 as authoritative for ours, and the video (played, not stills) for feel-checks only.

---

## 8. Measured computed styles (2026-07-15)

In-browser probe of the live `https://lukebaffait.fr` via chrome-devtools MCP. Desktop = 1440×900 window; mobile = device emulation 390×844 @2x touch (a plain window resize floors at Chrome's 500 px minimum — noted so the pass stays honest about method). Every row below is **[measured]**.

### 8.1 Computed text styles (desktop 1440)

| Element (selector) | Family (computed) | Size | Weight | Letter-spacing | Line-height |
| --- | --- | --- | --- | --- | --- |
| Hero "Luke" char spans (`.char`) | `Breton` | 249.887 px | 300 | −19.99 px (−0.08 em) | 299.86 px (1.2) |
| Hero "*Baffait.*" char spans | `other` (= `Machine.otf`) | 249.887 px | 400 | −19.99 px (−0.08 em) | 299.86 px (1.2) |
| Hero tagline (`.hero-tagline`) | `Breton` | 13.6 px | 400 | +0.01 em | 23.12 px (1.7) |
| About statement words (`.word`) | `Breton` | 51.84 px | 400 | −0.01 em | 75.17 px (1.45) |
| Bio paragraph (`.about-sub`) | `Breton` | 25.92 px | 400 | −0.005 em | 41.47 px (1.6) |
| Nav + social links (`.chr-hover`) | `Inter` | 16 px (footer socials 28.8 px) | 400 | normal | normal |
| "V3.0" mark (`.ch-top`/`.ch-bot`) | `Inter` | 17.6 px | 600 | normal | 21.12 px |
| Awards table cells (`.award-*`) | `Inter` | 24 px | 400 | normal | normal |
| Skills positioning statement (`.skills-text`) | `Zirena` | 40 px | 800 | normal | 44 px (1.1) |
| Contact title (`.contact-title`) | `Zirena` | 187.2 px | 800 | −5.62 px (−0.03 em) | 168.48 px (0.9) |
| Contact email (`.contact-mail`) | `Breton` | 20 px | 400 | −0.01 em | normal |

### 8.2 `@font-face` inventory

| Declared family | File | Weights loaded | Note |
| --- | --- | --- | --- |
| `Breton` | `assets/fonts/Breton.woff2` | one file, used at 300/400 | display roman **and** the whole reading layer |
| `other` | `assets/fonts/Machine.otf` | one file, 400 | the italic serif, loaded under a deliberately generic family name |
| `Zirena` | `assets/fonts/Zirena.woff2` | 800 only | two uppercase display accents |
| `Inter` | external stylesheet (cross-origin, rules unreadable) | 400 / 600 / 700 confirmed via `document.fonts` | UI/meta/awards layer |

No family named "Zalando Sans" (or anything else) is loaded — the four above are the complete set.

### 8.3 Organic path (`.fluid-line-svg path`)

| Viewport | `stroke` | `stroke-width` (computed) | Rendered thickness | Mounted/visible |
| --- | --- | --- | --- | --- |
| 1440×900 | `rgb(255, 30, 0)` | 72 (viewBox units, viewBox `0 0 1400 1400`) | ≈ 74 px | yes |
| 390×844 @2x (emulated) | `rgb(255, 30, 0)` | 72 (same) | ≈ 20 px | yes |

The stroke is constant in viewBox units, so on-screen thickness scales proportionally with viewport width. Path total length 3004.4 px (its `stroke-dasharray`); the dashoffset draw window opens at scrollY ≈ 5,150 of ≈ 17,240 (≈ 30% depth — matching the Projects window at 28–40 s of 93 s).

### 8.4 Scroll easing (rAF-sampled, two series)

Method: dispatch a burst of 10 synthetic `WheelEvent`s (~300 ms), record `{t, scrollY, stroke-dashoffset}` per animation frame for ~2.4 s.

- **`scrollY` is Lenis-damped, not linear:** after the last wheel event, scroll continues ~1.5–2 s with per-frame velocity decaying by a factor ≈ 0.87–0.92 at ~60 fps (exponential lerp settle, lerp ≈ 0.09–0.13 — bracketing our own Lenis `lerp 0.09`). Example (footer series): input stopped at t = 277 ms with scrollY 16,382; it settled at 16,822 around t ≈ 1,900 ms.
- **The dashoffset scrub adds a second damping layer:** in the projects-depth series, `stroke-dashoffset` kept easing (904 → 868) between t = 1,900–2,400 ms while `scrollY` was already effectively stationary — the scrubbed value chases the scroll position through its own smoothing, it does not map 1:1.
