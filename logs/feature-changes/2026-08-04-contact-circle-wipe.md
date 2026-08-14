# 10 Contact — circle wipe entrance, paired panels, always-on form

- **Date:** 2026-08-04
- **Author:** main
- **Type:** feat
- **Chapter/Area:** 10 Contact

## Summary

Six owner-requested revisions to the 2026-08-03 contact build, all re-derived from
`reference/video/lukebaffait-scroll.mp4` at 1:11 (burst set `reference/frames-bursts/invert-wipe/`,
60 fps). The entrance is now the reference's **circle expanding from the viewport's bottom-centre**
rather than the dome (semicircle) that shipped yesterday; "Contact" slides in from the right once
the sheet fills; the statement/panel block is horizontal and gains a **second, order-reversed pair**
(the beat the 2026-08-03 build deliberately dropped); photography is a placeholder ember gradient;
a tall dark runway separates the pinned Articles chapter from the wipe; and the contact form now
renders on every load instead of being hidden behind absent EmailJS keys.

Frame evidence for the entrance rewrite (why the dome was wrong):

| frame | t | state |
| --- | --- | --- |
| `_0060`–`_0090` | 71.0–71.5 s | dark, Awards list scrolling up — ~0.75 viewport of empty runway |
| `_0105` / `_0120` / `_0150` | 71.75–72.5 s | circle centre fixed at (960, ~1080) = viewport bottom-centre; radius 78 → 375 → 810 px while the page scrolls behind it |
| `_0180` | 73.0 s | circle covers the viewport, still no content |
| `_0195` → `_0225` | 73.25–73.75 s | "Contact" enters offset right (x≈255) and settles left (x≈120) in ~0.5 s |
| `_0225` / `_0290` | 73.75 / 74.8 s | beat 1 = statement **left of** panel; beat 2 = panel **left of** statement |

## Files touched

- `src/features/home/data/contact.data.ts` — `CONTACT_STATEMENT` (single object) → `CONTACT_STATEMENTS`
  (2-entry `as const` array) so both pairs render from one map and the reversal is index parity, not
  duplicated JSX. Second entry re-voiced from PRD §2 `profile.bio` verbatim facts ("I can work
  independently or in a team", "I hope to always keep learning something new"), owner-picked at the
  2026-08-04 gate. Also restored the `socialLinks` docblock, which the 2026-08-03 insert had stranded
  above the statement it doesn't document.
- `src/features/home/sections/ContactSection.tsx` — the bulk (below).

## Notable decisions

- **Dome → circle, and why the shape had to change.** The dome was a `130vw` half-ellipse pinned above
  the section's top edge, scrubbing `scaleY → 0`. It's anchored to the *section*, so its centre rises
  with the page; the reference's circle is anchored to the *viewport* and its centre does not move at
  all (measured stable at (720, 900) across the whole scrub). Kept the 2026-08-03 "transform-only, no
  per-frame repaint" decision — the disc is a fixed `50vmax` element scaled by one scrub, rejecting
  `clip-path: circle()` which would repaint a full-viewport element every frame.
- **The cover scale is measured, not derived.** First implementation computed the base radius as
  `0.25 × max(innerWidth, innerHeight)` to mirror the `50vmax` box. That is wrong on mobile: CSS `vmax`
  resolves against the **layout** viewport while `innerHeight` tracks the **visual** one, and at 390×844
  the two read 844 vs 953 — the disc landed 95px short of the corners (caught in QA, not theory). Now
  `disc.offsetWidth / 2` (a layout-box read, so the live transform can't feed back into it), which is
  correct under every unit discrepancy. Verified: desktop 1176 ≥ 1153 needed, mobile 998 ≥ 978.
- **Handoff instead of a bigger element.** Past the trigger's `end` the sheet fills the viewport by
  itself, so `onLeave` hides the disc (`onEnterBack` restores it) — same token colour on both, so the
  swap is invisible. `onToggle` releases `will-change` off-window; a permanently promoted `50vmax`
  layer is not worth paying for.
- **`id="contact"` moved off the section root onto the light sheet.** The new `mt-[70svh]` runway is
  part of the section, so leaving the anchor on the root would drop nav visitors into a dark empty
  screen. Verified: jump lands with `sheetTop: 0` and the sheet painting at viewport centre.
- **Runway is a margin, not a spacer element.** `<main>` is transparent over the ink page background,
  so `mt-[70svh]` reads dark for free, and it can't collapse through the Articles pin-spacer
  (ScrollTrigger gives that `padding-bottom`, not margin). Dropped `overflow-x-clip` — it existed only
  to contain the 130vw dome, and a `fixed` disc creates no page scroll.
- **Heading is a plain `Box as="h2"`, not `RevealText`.** `RevealText mode="chars"` fires on its own
  `top 80%` trigger — far too early, while the screen is still dark — and the reference moves the word
  as one unit, not per-character. Now driven by a `once` timeline anchored to `start: "top top"`, i.e.
  the exact frame the wipe completes, so the requested order (circle → heading → content) is structural
  rather than a timing coincidence.
- **Panels capped at `max-w-sm`.** Uncapped, `aspect-[3/4]` in a half-width column renders ~820px tall
  and shoves the statement off-screen (caught in screenshot review). `max-w-sm` restores the
  reference's panel-to-statement ratio; `lg:ml-auto` / `lg:mr-auto` pushes each panel to its own outer
  edge so the pair mirrors.
- **Form always mounts.** `emailEnabled` is a build-time constant, so the keyless branch (disabled
  submit + a mono note pointing at the channels) is dead code the moment `VITE_EMAILJS_*` land — no
  follow-up edit needed. Owner's pick over "render fully live and let it error".
- Crop marks moved **inside** the panel corners (`top-3 left-3` …), matching the reference's ~15px
  inset; they were outside (`-top-5 -left-4`) on the duotone figure.

## Verification

- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked — disc not rendered, heading `transform: none` / opacity 1, all
      words, panels, socials and the form band visible by markup default; both pairs present
- [x] Browser QA via puppeteer-core (chrome-devtools MCP could not attach — a browser already owned
      its profile; used the documented `qa-auditor/runtime-smoke-testing.md` fallback). Asserted:
      circle centre stable at viewport bottom-centre across the scrub; radius 78 → 1176 with cover at
      the end; handoff opacity 0 / visibility hidden / `will-change` released; pair orders
      `text|panel` then `panel|text`, both side-by-side at `lg` and stacked text-above-panel at 390w;
      nav anchor lands on the sheet; no horizontal overflow at 1440 or 390 (`scrollWidth == innerWidth`,
      `scrollX` 0 after `scrollTo(80,0)`); zero console/page errors on all three runs.
- [ ] Lighthouse ≥ 90 — **not re-run this pass.** Last measured 2026-08-03 (a11y 98 / BP 100 / SEO 100);
      the only new a11y surface is the always-mounted form, which already carries labels,
      `aria-invalid`/`aria-describedby` and a `role="status"` live region.

## Follow-ups

- Swap `GradientPanel` for real artwork — it is an explicit owner placeholder ("orange gradient box
  for now"). Everything else about the pair layout holds when an `Image`/`ParallaxImage` replaces it.
- Exercise the form once with real `VITE_EMAILJS_*` keys before final QA — still never sent a message.
  Adding the keys flips the disabled/note branch automatically.
- `mt-[70svh]` is unconditional, including under reduced motion where there is no wipe to make room
  for. Left as-is deliberately (it reads as chapter separation), but it is the one tunable if the
  non-animated path feels empty.
- Pre-existing carries, untouched: ProjectsSection `as="h3"` heading-order; Articles card
  label/content name mismatch; cold-reload skeleton pulse churn; bundle split + favicon/OG at final QA.
