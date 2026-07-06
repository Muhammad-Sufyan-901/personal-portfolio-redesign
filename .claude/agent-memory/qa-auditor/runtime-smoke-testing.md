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
