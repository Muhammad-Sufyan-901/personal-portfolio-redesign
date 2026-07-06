# Motion Engineer — Project Memory

## Motion architecture (single sources) — BUILT 2026-07-07
- GSAP registered ONLY in `src/lib/gsap.ts` (registers ScrollTrigger, defaults `ease: "power4.out", duration: 0.8`; exports `gsap`, `ScrollTrigger`). No other file imports `gsap` or `gsap/ScrollTrigger`.
- Lenis instantiated ONLY in `src/providers/SmoothScrollProvider.tsx` (lerp 0.09, wheelMultiplier 1, smoothWheel, syncTouch false): `instance.on("scroll", () => ScrollTrigger.update())` (arrow wrapper — direct handoff fails strict TS), `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`; exports `LenisContext`; destroys + removes ticker on cleanup. Under reduced motion Lenis is NEVER created → `useLenis()` (in `src/hooks/useLenis.ts`) returns null.
- No manual resize-refresh listener — ScrollTrigger auto-refreshes on resize. Route-change refresh not wired (single-page site); add only if multi-page ships.
- Provider composition: `src/providers/AppProviders.tsx` = ThemeProvider(defaultTheme="dark") → TooltipProvider → SmoothScrollProvider. `main.tsx` = StrictMode → AppProviders → RouterProvider.
- Every animation in `useGSAP(() => {…}, { scope: ref, dependencies: [...] })`. Returning a function from the useGSAP callback registers a context cleanup (used for `split.revert()`). `invalidateOnRefresh: true` on scrubs.

## Reduced motion (mandatory pattern)
- `src/hooks/usePrefersReducedMotion.ts` — `useSyncExternalStore` on `(prefers-reduced-motion: reduce)`, live-updates on change.
- Pattern: early-return inside the useGSAP callback (content renders in final static state) + conditional classes via `cn()` (e.g. ParallaxImage drops `scale-[1.2]` headroom). Cursor/Marquee return alternate JSX (null / single static track).
- Touch detection: `matchMedia("(hover: hover)")` inside useGSAP (MagneticButton) or once via lazy `useState` (Cursor: `(hover: hover) and (pointer: fine)`).
- `src/hooks/useIsomorphicLayoutEffect.ts` exists for effect-time DOM work.

## Primitive APIs (src/components/common/, all exported from barrel index.tsx)
- `RevealText` — `{ children, mode?: RevealMode = "lines", as?: "div"|"p"|"span"|"h1"–"h6" = "div", className?, delay?, stagger? }`. split-type per mode: lines→"lines", words→"lines,words", chars→"lines,words,chars". Lines mode wraps each line in a created `overflow-hidden` div (`split.revert()` restores innerHTML, removing wrappers); words/chars add `overflow-hidden` to line els. `gsap.from(targets, { yPercent:100, stagger 0.08/0.04/0.025, scrollTrigger: { start: "top 80%", once: true } })`. No re-split on resize (once-reveals).
- `ParallaxImage` — `{ src, alt, width?, height?, aspect? (className), parallax?: ParallaxConfig, withScrim?, className? }`. Figure clip `inset(100% 0 0 0)→inset(0)` (1.2s, once) + img `yPercent from→to` scrub. Raw `<img>` with `scale-[1.2]` headroom (common/ exempt; existing `Image` skeleton wrapper fights the clip). Scrim = `bg-linear-to-b from-transparent from-40% to-ink/65`.
- `Marquee` — `{ children, speed? = 30 (s/loop), reverse?, pauseOnHover? = true, className? }`. Two `.marquee-track` flex tracks (2nd `aria-hidden`), `xPercent 0→-100` repeat -1; tween in a ref, paused/played by React pointer handlers.
- `MagneticButton` — `{ children, className?, strength? = 12 }`. `gsap.quickTo` x/y on wrapper; `.magnetic-label` span counter-moves ×-0.35; spring back `elastic.out(1, 0.4)`.
- `ChapterEyebrow` — `{ index, label, className? }`, NOT animated. `font-mono text-eyebrow`, `text-accent` index, muted em-dash + uppercase label.
- `Cursor` — no props. 8px dot (`h-2 w-2 bg-paper`) + 40px ring (`h-10 w-10 border-paper/50 mix-blend-difference`); centered via `gsap.set({ xPercent:-50, yPercent:-50 })` (don't use Tailwind translate — gsap x/y would stack oddly). quickTo follow (dot 0.12s, ring 0.45s); `pointerover` → `closest("a, button, [data-cursor]")` → ring scale 1.6 (2.4 + label when `data-cursor` set). Toggles `cursor-none` on `<html>` while mounted+enabled. Returns null on coarse pointer / reduced motion. NOT yet mounted in `__root.tsx` — mounts with Preloader/Hero work.

## Motion tokens (design_system §7; live in src/styles/globals.css @theme)
- `--ease-out` ≈ `power4.out` (the gsap default), `--ease-inout cubic-bezier(0.83,0,0.17,1)`; durations 0.4/0.8/1.2s; Lenis lerp 0.09.
- Type-scale utilities carry size+leading+tracking: `text-display/chapter/statement/item/body/eyebrow/index/meta`. Accent is currently COBALT (documented alternate to brass) — token still named `accent`, primitives don't care.
- Avoid the `Text` component for token type styles: its variant baseline (`text-base leading-relaxed text-foreground`) collides with custom `text-*` tokens in twMerge (unknown token classes get misclassified). Use `Box` + explicit classes.

## State & types
- `src/store/useUIStore.ts` — zustand `{ preloaderDone, menuOpen, setPreloaderDone, setMenuOpen }` only.
- `src/types/motion.ts` — `RevealMode = "lines"|"chars"|"words"`, `ParallaxConfig { from? = -8, to? = 8 }`.
- Still to build (with their sections): `Preloader`, `PageTransition`, mounting Cursor/Preloader in `__root.tsx`.

## Tooling (installed 2026-07-06)
- **context7 MCP** (root `.mcp.json`) — current GSAP/ScrollTrigger/Lenis docs; prefer over memory for API details. No GSAP-specific MCP exists (only obscure community ones — skipped).
- **design-taste-frontend** skill (`.claude/skills/design-taste-frontend/`) — MOTION_INTENSITY/VARIANCE/DENSITY dials + GSAP patterns; **impeccable** has `/impeccable animate` for motion passes.

## Decisions log (durable facts only)
- 2026-07-07: theme default flipped `system`→`dark` in AppProviders (dark-first identity; storageKey unchanged `vite-ui-theme`).
- 2026-07-07: `LenisContext` export in SmoothScrollProvider carries an eslint-disable for `react-refresh/only-export-components` (context must live with its owner).
- Known gap (deliberate): native `cursor: pointer` still shows over links while custom cursor is active; add a scoped `* { cursor: none }` in QA if it bothers.
