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

Gotchas found 2026-08-14 (Footer chapter):
- **Auditing a component whose art asset doesn't exist yet:** don't add a placeholder to `public/` — generate a PNG in-page (`canvas.toDataURL` on `about:blank`) and serve it with `page.setRequestInterception(true)` + `req.respond({contentType:"image/png", body: Buffer.from(b64,"base64")})`. Zero repo mutation, and the component takes its real code path.
- **Isolating one rAF/ticker loop's cost:** don't diff scroll positions (different chapters animate). Keep the page parked, measure `page.metrics().TaskDuration` over a fixed window twice — once normally, once after `Object.defineProperty(document,"hidden",{get:()=>true})` (the loop's own guard becomes your control). Footer ASCII: 2.472 s vs 1.362 s per 5 s @4× throttle ⇒ +1.11 s attributable.
- **CPU throttling must be applied AFTER `page.goto`** — `Emulation.setCPUThrottlingRate` at rate 4 before navigation blows the 30 s `networkidle2` timeout on this app.
- **Counting a canvas loop's frames without app hooks:** in `evaluateOnNewDocument`, wrap `CanvasRenderingContext2D.prototype.getImageData` and the `Node.prototype.textContent` setter with counters + `performance.now()` accumulators. Gives per-call ms and exact frame counts (proved 14 fps against a 15 fps target, and 0 frames while offscreen/hidden).
- **`document.querySelector('a[href="#hero"]')` is ambiguous** — it matches both the skip link and the SiteMenu's "Intro" nav link. Scope skip-link probes (`#root > div > a[href="#hero"]`) or you will measure the wrong element's `inert` ancestry.
- **`vite preview` SPA-fallbacks missing assets to `index.html` with HTTP 200 `text/html`** — a `curl -I` 404 check on a missing image is misleading; the `<img>` still fires `onerror` (decode failure), so the component's failure path is exercised either way.
- `page.emulateMediaFeatures` mid-session re-mounts Lenis and resets scroll position — re-measure element offsets after every RM toggle, or a "still clipped" reading is just the footer having fallen back below its `once` trigger.

Gotchas found 2026-07-16 (hero one-line refine):
- Mixed-font "same row" checks: baseline-aligned words in different faces (Switzer vs Instrument Serif) have rect tops ~5px apart from differing ascent metrics — assert vertical OVERLAP (`a.top < b.bottom && b.top < a.bottom`) + `flexDirection`, never top equality.
- Entrance-reveal probes: the preloader (~4.5s) + 1s char reveal means a fixed 5s sleep samples mid-tween (`matrix(...,80.5)` false-fail). Poll the char transform until identity (200ms × up to 12s) instead of sleeping a guessed duration.

Gotcha found 2026-08-26 (ch.10 workflow — **the most expensive false alarm so far**):

- **chrome-devtools MCP reporting ~2 fps everywhere is a WINDOW state problem, not a perf regression.** Symptoms: `requestAnimationFrame` fires ~2×/sec at *every* scroll position (including a static section that runs no code), and `take_screenshot` times out with `Page.captureScreenshot timed out`. `document.visibilityState` still reads `"visible"` and `document.hasFocus()` still reads `true`, so those two checks do NOT rule it out.
  **The three-line triage that settles it:**
  ```js
  const t=performance.now(); let a=0; for(let i=0;i<5e6;i++) a+=Math.sqrt(i);
  const busyMs = performance.now()-t;            // main-thread health
  // then count setTimeout(…,0) callbacks vs rAF callbacks over 1s
  ```
  Main thread idle (5M sqrt in ~7 ms) + `setTimeout` ~200/sec + rAF 2/sec = **vsync starved**, i.e. the Chrome window is minimised or fully occluded and the compositor is producing no frames. A real workload would show a busy main thread AND would vary between a WebGL section and a static one — uniformity across the whole page is the tell.
  Corroborating signal from the same cause: `resize_page` errors with *"Restore window to normal state before setting content size"*.
  **Fix:** don't fight the window (`osascript` un-minimise needs assistive access, which is usually not granted). Switch to the headless puppeteer-core fallback at the top of this file — headless has no window state, so rAF, screenshots and Lighthouse all behave.
- Parking a pinned section at an exact progress from a puppeteer script: `const st = window.__ScrollTrigger.getAll().find(t => t.trigger === document.querySelector("#id")); const y = st.start + frac*(st.end - st.start);` then `window.scrollTo(0,y)` **and** `window.__lenis?.scrollTo(y,{immediate:true})`, then wait ~900 ms for an exp-damped applier to converge. Works for scrub-only chapters; `once` triggers still need the scroll-to-element dance.
- Testing a mid-session reduced-motion flip (what `useGSAP` cleanup + `clearProps` must survive): load normally, park mid-animation, snapshot `el.getAttribute("style")`, then `page.emulateMediaFeatures([{name:"prefers-reduced-motion",value:"reduce"}])` and re-read. A correct teardown leaves **empty** style strings; a leaky one strands `transform`/`opacity`/`filter`/`will-change`.
- Adjacent pinned sections: assert the seam by walking `pin.end ± 200` and checking that no two sections report `getComputedStyle(el).position === "fixed"` simultaneously, and that `nextPin.start − prevPin.end` is a sane gap (one viewport here).
- Document height settles for ~seconds after load (fonts/lazy images), so a ScrollTrigger's `start`/`end` read at t=2.5s can differ from a post-`refresh()` read by tens of px. Compare **length** (`end − start`), not absolute positions, when asserting a refresh didn't break geometry.
