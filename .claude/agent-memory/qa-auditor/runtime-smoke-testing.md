---
name: runtime-smoke-testing
description: How to run browser smoke tests in qa-auditor threads — chrome-devtools MCP tools are NOT exposed to this subagent; use puppeteer-core + installed Chrome
metadata:
  type: reference
---

chrome-devtools MCP is configured in root `.mcp.json` but its tools are **not exposed inside qa-auditor subagent threads** (verified 2026-07-07). Working fallback:

1. `npm run dev -- --port 5199 --strictPort` in background.
2. In the session scratchpad: `npm init -y && npm i puppeteer-core` (no browser download), launch with `executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`, `headless: "new"`.
3. Reduced motion: `page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }])` in a fresh `browser.createBrowserContext()` (fresh sessionStorage).
4. Capture `page.on("console"/"pageerror")`; assert DOM state with `page.evaluate`.
5. Dev build runs StrictMode, so double-mount behavior is exercised for free.
6. `pkill -f "vite.*--port 5199"` when done (background task reports exit 143 — expected).

Gotchas found 2026-07-07 (ch.01):
- While the site has few chapters the page can be exactly 100vh → nothing scrolls and `ScrollTrigger end:"max"` resolves to 0 at mount. To test scroll-linked UI: inject a tall spacer via `evaluate`, then do a REAL `page.setViewport` resize (fires ScrollTrigger autoRefresh), wait ~800ms (Lenis re-measures via ResizeObserver) before `page.mouse.wheel`. Wheeling immediately after DOM injection gets clamped to 0 by Lenis's stale limit — harness artifact, not an app bug.
- `lenis-stopped` class on `<html>` is the tell for a stuck `lenis.stop()` lock.
- Assert focus containment by Tab-looping and checking `dialog.contains(document.activeElement)` — note the TanStack devtools button sits outside any app wrapper and is a legit escape target in dev.
- Pinned LAST section: pin-end == document maxScroll, so it sits at `top:0` at the very bottom by definition — "stuck pin" false positive. Inject a stand-in block below + real resize before asserting unpin (ch.02).
- Scrub pacing math: with `scrub`, changing `end` alone never changes fill proportions (timeline normalizes to the range) — a read-beat needs a trailing empty tween (`tl.to({}, {duration: X})`).
- Marquee seam check (ch.03): measure junction spacing with the Range API on the span's LAST text node — the trailing `{" · "}` is its own text node whose final space collapses at end of inline context (real bug, fix = trailing NBSP). Also: instant `scrollIntoView` jumps leave below-fold `once` triggers unfired — scroll to the element itself before asserting settle.
- `useGSAP` deps containing `prefersReducedMotion` but missing `revertOnUpdate: true` is a recurring builder omission (ch.02 F2, ch.03 F2) — check every new animated component first. (Applied correctly in B2 AuroraBackground — the lesson landed.)
- Canvas effect probes (B2 aurora): sample the FULL buffer alpha (`getImageData` sum), never a corner — regional washes legitimately leave corners at 0 (false "not painting"). To prove a pause guard works: alpha-sum twice ~400ms apart while the guard should hold (sums identical = frozen), then again after un-pausing (sums differ = drifting).

Gotchas found 2026-07-18 (about refine):
- Entry-trigger sampling math: for a scrub running `top bottom → top X%`, park the section top at viewport fraction f and its progress is p = (1−f)/(1−X) — lets you assert exact beat states (veiled vs settled) at chosen p without reading tunables at runtime. Seam checks: sample `.manifesto-veil` / `.manifesto-veil-tint` computed opacity while the NEXT section resolves (ink=1, tint=0 = ink-on-ink handoff).
- Instant `window.scrollTo` is fine for scrub-only chapters (Lenis adopts native jumps); only `once` triggers need the scroll-to-element dance (ch.03 note). Numeric scrub needs a catch-up wait (~3× the scrub seconds) before asserting rest state.
- Preloader-done poll: absence of `lenis-stopped` on `<html>` + require >3s elapsed (the class doesn't exist pre-lock, so a bare absence check passes instantly at t=0).

Gotchas found 2026-07-20 (ch.04 craft):
- SVG path-draw checks MUST include a screenshot — computed-style probes (dasharray/dashoffset/pathLength) all read "correct" while the rendered stroke is fragmented into capsule chunks (non-scaling-stroke + preserveAspectRatio:none screen-space dash bug). `page.screenshot` is the only reliable assert.
- Crossfade-vs-snap probes: trigger the state change, sample BOTH the outgoing layer and the container ~120ms in — a true crossfade shows container ≈1 and old layer mid-fade; a revertOnUpdate snap shows old layer at 0 instantly and the container re-fading from 0.
- Tailwind v4 scale checks: read `getComputedStyle(el).scale` (standalone property), not `.transform` — transform reads "none" even when scale-105 is applied. Cross-check `transitionProperty` actually lists `scale`.
- Focus-start-point quirk: after `el.focus()` + `blur()`, the next Tab continues from the blurred element, not document top — fine for sequential-order checks, wrong for "first tabbable" checks.

Gotchas found 2026-07-20 (ch.07 gallery — Lighthouse in qa threads):
- Lighthouse works from the scratchpad: `npm i lighthouse chrome-launcher`, then `npx lighthouse <url> --chrome-flags="--headless=new" --chrome-path="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --output=json`. Parse `categories` from the JSON.
- Dev-server perf scores are NOT representative (35 dev vs 62 prod on the same page) — run `npm run build` + `npm run preview -- --port 5199 --strictPort` and audit that. a11y/BP/SEO are stable across both.
- Recent Lighthouse adds `agentic-browsing` / `llms-txt` audits — ignore for the DoD (not one of the four categories).
- Page-level perf ledger (as of ch.07): LCP/TTI ~24s because the every-load preloader gates the hero paint + one 500kB+ chunk (bundle split deferred to final QA) — perf 62. Don't re-attribute this to whichever chapter is being audited; it predates them.

Gotchas found 2026-08-04 (ch.10 contact revision):
- **This fallback is also needed in the MAIN thread, not just qa-auditor subagents.** chrome-devtools MCP fails with "The browser is already running for `~/.cache/chrome-devtools-mcp/chrome-profile`" whenever the user has a Chrome instance on that profile. Don't kill their browser — go straight to puppeteer-core.
- Scroll-target staleness: measure a trigger's document offset (`getBoundingClientRect().top + scrollY`) **after** parking the page deep in the document. Measured at scroll 0, before fonts/images settle and ScrollTrigger refreshes, the target lands *past* a `once` trigger, so every subsequent sample reads the settled end state — reads exactly like "the animation never runs" (cost a false bug report on the contact heading slide).
- Cover/fit assertions must compare **rendered** geometry to need (`el.getBoundingClientRect().width/2 >= Math.hypot(innerWidth/2, innerHeight)`), never re-implement the component's formula in the probe — when the fix changes the formula, a probe that mirrors the old one keeps reporting failure against correct code.
- `page.setViewport({width:390, height:844, isMobile:true})` yields `innerWidth/innerHeight` of 441×953, NOT 390×844 — so probes mixing CSS units (`vmax`, `svh`) with `innerWidth/innerHeight` disagree with the page by ~13%. Real divergence too (layout vs visual viewport), so it's a genuine signal, not just harness noise.

Gotchas found 2026-08-03 (ch.10 contact):
- Focus-ring color probes: Tailwind v4 `transition-colors` includes `outline-color`, so an element with that class transitions its focus ring from currentColor → the rule's color over ~150ms. A t=0 read after Tab returns currentColor (looked like the `[data-invert]` override failing — it wasn't). Wait ≥300ms after focusing before reading `outlineColor`.
- Horizontal-overflow asserts: `scrollbar-width: none` + Lenis wheel-hijack hide real X overflow from visual checks — always assert `document.documentElement.scrollWidth <= innerWidth` at mobile AND desktop, then prove it's live with `window.scrollTo(80,0)` → `scrollX > 0` (the ch.10 dome panned to 59px at 390w). Bonus isolation trick: if the suspect decor is conditionally not rendered under RM, the RM run's clean scrollWidth fingers it as sole culprit.
- Form-path caveat: `emailEnabled` gates the whole ContactForm on VITE_EMAILJS_* keys — a keyless dev server never mounts the form, so form aria/status probes silently no-op (`formPresent:false`). Check the gate before trusting "0 form issues".

Gotchas found 2026-07-16 (hero one-line refine):
- Mixed-font "same row" checks: baseline-aligned words in different faces (Switzer vs Instrument Serif) have rect tops ~5px apart from differing ascent metrics — assert vertical OVERLAP (`a.top < b.bottom && b.top < a.bottom`) + `flexDirection`, never top equality.
- Entrance-reveal probes: the preloader (~4.5s) + 1s char reveal means a fixed 5s sleep samples mid-tween (`matrix(...,80.5)` false-fail). Poll the char transform until identity (200ms × up to 12s) instead of sleeping a guessed duration.
