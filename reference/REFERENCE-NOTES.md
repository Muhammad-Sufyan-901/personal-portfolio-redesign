# Reference notes — lukebaffait.fr scroll narrative

Derived from `reference/lukebaffait-scroll.mp4` (1920×1080, 93.23 s, 120 fps) via the
extracted still sets, cross-checked against the live site (chrome-devtools MCP pass,
2026-07-08). All video-derived sets are rebuilt by **one script with one CONFIG object**:
`reference/scripts/extract-frames.mjs` (see `scripts/README.md`) — rebuilt 2026-07-16.

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
| Dense archive | `frames/` (746 jpg, **8 fps**) | full 93 s arc, per-chapter study — № ≈ 8×seconds |
| Key frames | `frames-key/` (674 jpg, 8 fps + mpdecimate) | the recording scrolls continuously (almost no static holds), so only ~10% prune away |
| **Transition bursts** | `frames-bursts/<window>/` (2,760 jpg, **60 fps**, 7 named windows) | frame-by-frame study of the signature transitions — see the burst table below |
| Contact sheets | `contact-sheets/` (4 jpg, 6×8 tiles @ 2 fps) | the whole-arc overview |
| v1 evidence set | `frames-v1/` (47 png) | the design_system §3.0 sampling pass — kept as-is, never regenerated |
| Live MCP shots | `live-mcp-*.jpeg` (5) | hero / projects / skills / contact / footer at real depths |
| Live crawl | `lukebaffait-live/{desktop,mobile}/` (41+41 png + index.json) | repeatable scroll states, `npm run capture:ref` |
| Old dense set | `archive/frames-4fps.zip` (373 jpg, 4 fps) | the pre-2026-07-16 archive, zipped so two loose dense sets can't be confused |

A 45 fps whole-video set (`fullRate`) exists in the script but is **opt-in only** — enable
it in CONFIG *and* pass `--yes` (it projects ~4,200 frames / ~500 MB first).

## Burst windows (60 fps, `frames-bursts/`)

Boundaries probe-verified 2026-07-16 (start/end frames eyeballed; zero nudges needed).
Frame ↔ time inside a window: `t = start + n/60`.

| Window | Time | What it captures | Proof frame |
| --- | --- | --- | --- |
| `preloader-flash` | 0–6 s | wordmark zoom + the hard color-flash frames | `_0300` = the full-red flash (~5.0 s) |
| `hero-seam` | 13–21 s | the B/W sculpture media opening between the name rows | `_0240` = sculpture mid-expansion (~17 s) |
| `path-entry` | 27–33 s | the thick red path starting to draw | `_0001` no path → `_0360` path over the list |
| `list-gallery-hand` | 38–44 s | projects list → scattered gallery handoff | `_0001` list+path → `_0360` scatter |
| `accordion-switch` | 58–64 s | one skills category open→close→next open | `_0001` Frontend open → `_0360` System & Security open |
| `invert-wipe` | 70–78 s | the white semicircle wipe into the light section | `_0150` = semicircle mid-wipe (~72.5 s) |
| `footer-bookend` | 82–88 s | light section exits; the name re-enters cluster by cluster | `_0001` light exiting → `_0360` footer complete |

Nuance found during probing: the recording opens on an **already-loaded hero** (~0–2.5 s);
a reload triggers the actual preloader at ~2.5–5.5 s — `preloader-flash` covers both.

## Live-site facts (measured in-browser)

- Body bg `rgb(10,10,10)` = **exactly our `--ink #0A0A0A`**; body text `#F0F0F0` (ours: paper `#E4E4E4`); light section bg `#F0F0F0`/white.
- The organic project-rail path: SVG stroke `rgb(255,30,0)` (**#FF1E00**) at a computed **72 px** width at 1440 viewport — hotter and far thicker than our ember `#E8380F` / PathDraw 3.5 px. Observation only; design_system v2 stays authoritative (it deliberately chose a calmer ember + hairline discipline). If literal fidelity is ever wanted, that's a design-system decision, not a build-time one.
- Body font on the live site is **Inter**; display face is a roman grotesk + *italic serif* pairing ("Luke" grotesk / "*Baffait.*" italic serif). Our system maps this to General Sans (+ italic) — fine.
- Lenis on native scroll (`html.lenis`), page ≈ 17,200 px (~19 viewports). Console: zero errors/warnings.

## Section-by-section map

**Moved (2026-07-16):** the single authoritative section-by-section map (timings, layout,
choreography, and what we borrow per beat) is **`reference/breakdown_analysis.md §5`** —
this file no longer keeps its own copy, so the two can't diverge. Quick anchors: preloader
0–5 s (flash ~5.0 s) · hero 5–16 s · media seam ≈14–20 s · about 16–28 s · projects list
28–40 s · gallery 40–56 s · skills 56–68 s · awards ≈66–74 s · contact (light invert)
≈74–82 s · footer 83–93 s.

## Reading guide

Grasp the arc from the 4 contact sheets; study a specific chapter from `frames/`
(8 fps ⇒ frame № ≈ 8 × seconds); study a signature transition frame-by-frame from its
`frames-bursts/<window>/` (60 fps); check a real hover/settled state from
`lukebaffait-live/` or the `live-mcp-*.jpeg` shots.

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
