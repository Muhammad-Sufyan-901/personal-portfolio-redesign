# Reference notes — lukebaffait.fr scroll narrative

Derived from `reference/lukebaffait-scroll.mp4` (1920×1080, 93 s, 120 fps) via the extracted
still sets, cross-checked against the live site (chrome-devtools MCP pass, 2026-07-08).

## Provenance

- The recording is **the same one** already evidence-sampled for `design_system.md` v2 §3.0
  (MD5 `e049b5c8e19d87941bd2efe659169ec4` — identical to the previously sampled file; the
  "v2" filename in the task referred to this file). **No palette or section-map re-grounding
  is warranted.**
- Frames capture **mood + composition**, not exact easing/durations — authoritative motion
  numbers live in `design_system.md §7`.

## Still sets

| Set | Where | What |
| --- | --- | --- |
| Dense archive | `frames/` (373 jpg, 4 fps) | full 93 s arc, per-chapter study |
| Key frames | `frames-key/` (349 jpg) | 4 fps + mpdecimate; the recording scrolls continuously (almost no static holds), so few frames prune away |
| Contact sheets | `contact-sheets/` (4 jpg, 6×8 tiles @ 2 fps) | the whole-arc overview |
| v1 evidence set | `frames-v1/` (47 png) | the design_system §3.0 sampling pass — kept as-is |
| Live MCP shots | `live-mcp-*.jpeg` (5) | hero / projects / skills / contact / footer at real depths |
| Live crawl | `lukebaffait-live/{desktop,mobile}/` (41+41 png + index.json) | repeatable scroll states, `npm run capture:ref` |

## Live-site facts (measured in-browser)

- Body bg `rgb(10,10,10)` = **exactly our `--ink #0A0A0A`**; body text `#F0F0F0` (ours: paper `#E4E4E4`); light section bg `#F0F0F0`/white.
- The organic project-rail path: SVG stroke `rgb(255,30,0)` (**#FF1E00**) at a computed **72 px** width at 1440 viewport — hotter and far thicker than our ember `#E8380F` / PathDraw 3.5 px. Observation only; design_system v2 stays authoritative (it deliberately chose a calmer ember + hairline discipline). If literal fidelity is ever wanted, that's a design-system decision, not a build-time one.
- Body font on the live site is **Inter**; display face is a roman grotesk + *italic serif* pairing ("Luke" grotesk / "*Baffait.*" italic serif). Our system maps this to General Sans (+ italic) — fine.
- Lenis on native scroll (`html.lenis`), page ≈ 17,200 px (~19 viewports). Console: zero errors/warnings.

## Section-by-section map (scroll order)

1. **Preloader** — small "Luke Baffait" wordmark centered on black; scales up through
   hard **color-flash frames** (full-red frame, cyan-on-red frame — 1–2 frame stutters, a
   deliberate glitch beat) before the curtain reveals the hero. Fast and percussive, not a
   counter.
2. **Hero** — giant two-word display name filling the viewport width: "Luke" (roman
   grotesk) + "*Baffait.*" (italic serif, terminal period). Behind it an **upper-weighted
   red/ember aurora blob** (soft, blurred, alive). Chrome: top-left social links
   (BEHANCE·LINKEDIN·GITHUB), top-right nav (WORK·INFO·CONTACT), "v3.0" mark. The surname
   flashes **cyan** on hover — a second accent used only as a micro-moment.
3. **Hero → About transition (inline media reveal)** — on scroll, a small B/W sculpture
   video **opens up between the two name words**, pushing them apart while growing to
   full-bleed; the sculpture shatters into 3D fragments with the line "*Basically, I make
   websites*" over it. The name is the door; the media walks through it.
4. **About / Manifesto** — statement type: "As a *creative developer*, I craft tailor-made
   web experiences, blending technical precision and *emotion*." (italic serif for the
   emphasized words — the reference's focal-word device). Then a red-lit portrait photo
   (rounded top corners) with a short bio paragraph ("My name is Luke…") and a "→ V3.0"
   marker. Generous dead space; text blocks small and hard-left/right aligned.
5. **Projects list** — left column: project names as a big list (CyberDiag website, Anima,
   CyberDiag app, Zenith, SkymcDB, ChromaBlock, Symphony, Echo), each row lighting from
   muted→paper as it becomes active; right: a laptop-mockup thumbnail per active row.
   Through the whole section the **thick organic red path draws and winds** down the page
   (the signature move) — it snakes between rows, loops, and exits into the next chapter.
6. **Gallery** — free-floating project mockups scattered in 3D space, drifting/parallaxing
   at different depths as you scroll, with the centered line "Each project is a chance to
   *learn*, *experiment* and push my limits."
7. **Skills** — left: uppercase positioning statement ("COMPUTER SCIENCE STUDENT IN VANNES,
   SPECIALIZED IN CYBERSECURITY, PASSIONATE ABOUT WEB DEVELOPMENT AND DESIGN.") + "CONTACT
   ME" + a **big red arrow →**; right: category accordion (Frontend, Animation & 3D,
   Backend, Databases, DevOps & Tools, System & Security, Design) that **opens one category
   at a time as you scroll**, listing the tools inside, then closes it and opens the next —
   a scrubbed sequential accordion, not hover-driven.
8. **Awards & Misc** — a hairline table on dark: issuer / site / mention / date (GSAP Site
   of the Week, Awwwards Honorable Mention, Featured on Codegrid, Portfolio Honors
   nomination, landing.love Best animations). Rows **invert to white** on hover with a
   small red thumbnail preview following the cursor.
9. **Contact** — a white **semicircle wipes up** into a full light-inverted section
   (`#F0F0F0`): huge black "Contact" heading, red/blue sculpture render on the right,
   availability paragraph, GitHub/LinkedIn/Behance links + email. The one big contrast
   beat of the site (matches our §3.1b invert tokens).
10. **Footer** — back to black: the giant "Luke *Baffait.*" name re-enters letter-cluster
    by letter-cluster to fill the width (a bookend of the hero), above tiny mono columns
    (email · © 2026 · GITHUB/LINKEDIN/BEHANCE · WORK/INFO/CONTACT). Site ends on the name.

## Reading guide

Grasp the arc from the 4 contact sheets; study a specific chapter from `frames/`
(4 fps ⇒ frame № ≈ 4 × seconds); check a real hover/settled state from `lukebaffait-live/`
or the `live-mcp-*.jpeg` shots.

## Reconciliation (2026-07-15)

`breakdown_analysis.md` added — consolidates + extends this file (verified via
`reference/scripts/histogram-phases.py` + a fresh chrome-devtools MCP probe of the live
site). Discrepancies found against this file's 2026-07-08 pass:

1. **"Body font on the live site is Inter" is corrected**: the bio paragraphs, tagline,
   statements, and contact email compute to family `Breton` (`assets/fonts/Breton.woff2`);
   Inter is only the UI/meta layer (nav/social links, "V3.0", awards cells). Our
   General Sans mapping is unaffected — the reference collapsing display-roman + body
   into one face validates it further.
2. **"72 px path width at 1440" is refined**: the stroke is 72 *viewBox units*
   (viewBox `0 0 1400 1400`), rendering ≈74 px at 1440 and ≈20 px at 390 — it scales
   with the viewport rather than being a fixed pixel width.

Everything else here (palette values, section map, Lenis/page-height facts) reconfirmed.
Full computed-style tables live in `breakdown_analysis.md §8`.
