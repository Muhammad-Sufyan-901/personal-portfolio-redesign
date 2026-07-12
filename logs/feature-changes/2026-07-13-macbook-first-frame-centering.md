# MacBook first-frame centering — initialization hardening

- **Date:** 2026-07-13
- **Author:** main (Claude Code, user bug report)
- **Type:** fix
- **Chapter/Area:** 02 Manifesto — 3D island initialization

## Summary

User report: on load, scrolling down to the manifesto sometimes rendered the MacBook off-center (upper-right) until a few scroll reversals "snapped" it to center. The off-center render could not be reproduced on fresh loads in QA (a dozen attempts, cold cache + Fast-4G throttle + scroll-during-preloader all rendered dead-center), but code review found three real initialization weaknesses that can each misplace the *first rendered frame* when the canvas/model arrives mid-scroll — all fixed so the first frame is correct **by construction**, entering from either direction. (A likely contributor to the original sighting: the user's long-lived dev tab hot-reloaded across the `CAM` constant reshape — mixed stale HMR modules can aim the camera with undefined values until a hard refresh.)

## Fixes (all in `manifesto-3d/`)

1. **`ManifestoCanvas` — never render an un-aimed camera**: extracted `aimCamera()` and call it in the Canvas `onCreated` (synchronously at creation, from the *current* channel state) and at `CameraRig` effect mount, so no frame can exist with the default camera orientation regardless of when the lazy chunk lands.
2. **`MacbookModel` — primed damped values**: `rendered` now initializes from the live `channels` instead of zeros. A model that finishes loading mid-scroll (slow network, deep link, upward entry from About) appears already in the correct pose instead of damp-animating from the closed/rear P1 pose to wherever the scroll is.
3. **`MacbookModel` — deterministic fit clamp**: portrait clamp now derives from `useThree(s => s.size)` + camera constants instead of `state.viewport.width`, whose value depends on when R3F last recomputed it.

## Verification

- [x] Cold-cache + Fast-4G, scroll sprint into the stage during load: centered
- [x] Upward entry (park at About → scroll up into the statement phase): model appears already open/front-on/receded, centered — no catch-up drift
- [x] Scroll-during-preloader sprint: centered
- [x] `npx tsc -b`, `npm run lint`, `npm run build` green

## Follow-ups

- If the user ever sees the corner render again after a **hard refresh** of the dev tab, capture `document.querySelector(".manifesto-stage canvas").width/height` + the stage's computed transform at that moment — those two values will identify the culprit immediately.
