# Chapter 00 — Preloader (v3 rebuild)

- **Date:** 2026-07-08
- **Author:** main (+ qa-auditor audit)
- **Type:** feat
- **Chapter/Area:** 00 Preloader (+ Cursor mount)

## Summary

First chapter of the v3 rebuild. Mounted the B0-built Preloader and Cursor in `__root.tsx`, re-laid the preloader to spec §11.0 (name mask-reveal centered, Mono counter bottom-right, curtain wipe up), and wired the overlay-containment pattern: page content is `inert` while the curtain is up. Choreography: name `yPercent 100→0` (1s) + counter proxy 0→100 (1.8s, simultaneous) → wipe `yPercent -100` (1.2s, `power4.inOut`); once per session (`sessionStorage["preloader-done"]`); sets `useUIStore.preloaderDone` (the hero start cue); Lenis stop/start scroll-lock.

## Files touched

- `src/routes/__root.tsx` — mounts `<Preloader/> <Cursor/> <RootLayout/>` (wiring-only local component)
- `src/components/layouts/RootLayout.tsx` — `inert={!preloaderDone}` on page content
- `src/components/common/Preloader.tsx` — §11.0 layout (centered name, corner counter); `revertOnUpdate: true` (audit F1)
- `src/components/common/Cursor.tsx` — hidden until first pointermove (no 0,0 first paint); fades out on viewport `pointerleave` (audit F4); `revertOnUpdate: true` (audit F1)

## Notable decisions

- Reduced-motion / repeat-session path renders null and signals `preloaderDone` in a layout effect — sessionStorage is only written when the animation actually completes.
- SR users see nothing during the ~3.1s decorative overlay (aria-hidden + inert) — accepted per audit advisory for a short intro.

## Verification

- [x] `npx tsc --noEmit` + `npm run lint` clean
- [x] qa-auditor static DoD: all greps PASS (no stray gsap imports, no cross-feature, no raw hex, no off-token classes, no bare tags); F1/F4 fixed, F2 is this log
- [x] Runtime (chrome-devtools MCP, mutation-log instrumented): mounts ~135ms, counter 0→100, unmounts ~3.1s, session flag set; repeat reload skips instantly
- [x] Reduced-motion (matchMedia stub): no preloader, no Lenis, no cursor, content immediately visible and not inert
- [x] Console: no errors/warnings
- [ ] Lighthouse — deferred to a content chapter (placeholder page)

## Follow-ups

- Chapter 01 Hero next (behind its gate): hero section, aurora, Header/MobileMenu chrome, mixed-pairing name device.
