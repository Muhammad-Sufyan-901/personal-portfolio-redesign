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
