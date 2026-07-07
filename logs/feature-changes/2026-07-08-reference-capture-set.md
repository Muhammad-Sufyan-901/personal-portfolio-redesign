# Visual-reference set — video frames + live-site capture tooling

- **Date:** 2026-07-08
- **Author:** main
- **Type:** chore
- **Chapter/Area:** reference/ (capture tooling + notes), no src changes

## Summary

Built the studyable still-image reference set for the rebuild. Extracted the reference recording (`reference/lukebaffait-scroll.mp4`) into a dense archive (373 jpg @4fps), a pruned key set (349 — the footage scrolls continuously, so mpdecimate finds few true holds; raw mpdecimate on the 120fps stream kept 4.5k frames and was re-run chained after fps=4), and 4 contact-sheet overviews. Captured the live site twice: an interactive chrome-devtools MCP pass (5 depth screenshots + measured colors + console check) and the repeatable Playwright crawl (41 desktop + 41 mobile frames + index.json). Wrote `reference/REFERENCE-NOTES.md` (section-by-section map of the 10-beat scroll narrative + live-measured facts + provenance).

## Files touched

- `reference/scripts/README.md` — new: setup/usage/output/wheel-scroll rationale/known limits
- `reference/REFERENCE-NOTES.md` — new: the narrative map + provenance note
- `package.json` — `capture:ref` script; `playwright` devDependency
- `.gitignore` — `reference/` → `reference/*` + negations so scripts/ and REFERENCE-NOTES.md commit while all frames/video/captures stay ignored
- (gitignored outputs: `reference/{frames,frames-key,contact-sheets,frames-v1,lukebaffait-live,live-mcp-*.jpeg}`)

## Notable decisions

- **The "v2" recording is the already-sampled one**: `~/Downloads/Screen Recording 2026-07-05 at 19.41.48.mp4` is MD5-identical to the repo's `lukebaffait-scroll.mp4` (`e049b5c8…`) — so no design_system §3.0 re-grounding is warranted (noted in REFERENCE-NOTES). Commands ran against the existing file; no `-v2` copy created.
- Old 47-frame design-system evidence set preserved at `reference/frames-v1/`.
- Live-measured deltas recorded as observations only (path stroke `#FF1E00` @72px vs our ember `#E8380F`; body text `#F0F0F0` vs paper `#E4E4E4`) — design_system v2 stays authoritative.
- Mobile crawl reaches ~58% depth (Lenis damps wheel in touch context) — documented as a known limitation with the workaround (raise step count), not patched.

## Verification

- [x] Frame counts: 373 dense / 349 key / 4 sheets / 41+41 live + index.json
- [x] `git check-ignore` passes for every heavy path; `git status` shows only tooling/notes/config
- [x] Live console: zero messages
- [ ] tsc/lint — n/a (no src changes)

## Follow-ups

- None blocking. Optional fps=8 detail pass (`reference/frames-detail/`) if the preloader flash beats need closer study during the Preloader chapter build.
