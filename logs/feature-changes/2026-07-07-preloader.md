# Chapter 00 — Preloader

- **Date:** 2026-07-07
- **Author:** motion-engineer
- **Type:** feat
- **Chapter/Area:** 00 Preloader (design_system §11.0 + §7.3)

## Summary
Built the session preloader: full-screen ink overlay with a JetBrains Mono counter 0→100 and the name mask-revealed in Fraunces, then an upward curtain wipe. Signals completion via `useUIStore.preloaderDone` (Hero's start cue) and `sessionStorage["preloader-done"]` (once per session). Mounted `Preloader` + `Cursor` in `__root.tsx` above `RootLayout`.

## Files touched
- `src/components/common/Preloader.tsx` — new (counter tween on a proxy object, name `yPercent 100→0` in an overflow-hidden wrapper, `yPercent: -100` wipe at `power4.inOut`/1.2s; `lenis?.stop()/start()` scroll lock while visible)
- `src/config/site.ts` — added `name: "Muhammad Sufyan"` (common/ may not import features; config is the layering-safe source)
- `src/routes/__root.tsx` — wiring-only `RootComponent` = `<Preloader/> + <Cursor/> + <RootLayout/>`
- `src/components/common/Cursor.tsx` — z-50 → z-[100] (cursor is z-highest)
- `src/components/common/index.tsx` — barrel export

## Notable decisions
- z-scale: preloader `z-[90]` < cursor `z-[100]`; page content stays ≤ z-50.
- Wipe ease uses `power4.inOut` as the GSAP mapping of `--ease-inout` cubic-bezier(0.83,0,0.17,1) — avoids registering CustomEase for one curve.
- Reduced motion renders nothing at all (no fade): `preloaderDone` + sessionStorage set immediately in a layout effect.
- Scroll lock via `lenis?.stop()`; no html overflow toggling. Keyboard scrolling during the ~3s overlay is not blocked (decorative, aria-hidden, no focusable content — acceptable).
- Counter textContent updated imperatively in the tween's `onUpdate` (decorative, no React re-render per tick).

## Verification
- [x] `npx tsc --noEmit` clean
- [x] `npm run lint` clean
- [x] reduced-motion / a11y checked (overlay `aria-hidden`, no focusable children, reduced motion → null render + immediate done)
- [x] dev server smoke test: `/` serves, `Preloader.tsx` + `__root.tsx` transform without errors (no browser access — animation flow verified by code path, not visually)
- [ ] Lighthouse ≥ 90 (deferred to QA)

## Follow-ups
- Hero should start its timeline off `useUIStore(preloaderDone)`.
- QA: visually confirm counter pacing (1.8s) + wipe against reference feel; adjust durations if flat.
