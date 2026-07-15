# Reference sets rebuilt via tunables-driven extract-frames.mjs

- **Date:** 2026-07-16
- **Author:** main
- **Type:** chore
- **Chapter/Area:** reference evidence tooling (no src/ changes)

## Summary

Replaced the ad-hoc ffmpeg extraction history behind the reference still sets with one
script and one CONFIG object (`reference/scripts/extract-frames.mjs`). Dense set doubled
to 8 fps (746 frames), key set regenerated (674 @ 8 fps + mpdecimate), contact sheets
regenerated, and a new 60 fps `frames-bursts/` set (2,760 frames, 7 named windows) now
covers the signature transitions frame-by-frame. Old 4 fps dense set archived to
`reference/archive/frames-4fps.zip`.

## Files touched

- `reference/scripts/extract-frames.mjs` — new; CONFIG-driven, idempotent, `--probe` mode,
  fullRate `--yes` guard
- `reference/scripts/README.md` — usage for the new script; heading nesting fixed
- `reference/REFERENCE-NOTES.md` — still-set table (counts/fps), burst-window table with
  proof frames, № ≈ 8×s arithmetic, fullRate note
- `reference/breakdown_analysis.md` — §5/§7 frame-arithmetic touch-ups (4×s → 8×s)
- (gitignored outputs regenerated: `frames/`, `frames-key/`, `frames-bursts/`,
  `contact-sheets/`, `archive/`)

## Notable decisions

- **.mjs over .sh**: matches the existing `capture-lukebaffait.mjs` convention; the nested
  burst-window CONFIG is native JS; idempotent folder wipe via `fs.rmSync`.
- Burst boundaries probe-verified before extraction (14 boundary frames read) — zero
  nudges needed. Probe discovery: the recording opens on an already-loaded hero (~0–2.5 s);
  the preloader actually runs ~2.5–5.5 s after an in-recording reload.
- Bursts kept at full 1080p (user decision) — total `reference/` weight 653 MB, disk-only
  (all frame sets gitignored).
- `rm -rf` of the old `frames/` was denied at the permission layer — swapped via rename
  instead; leftover `reference/frames-4fps-old/` (42 MB, duplicate of the zip) awaits
  manual deletion.

## Verification

- [x] `node reference/scripts/extract-frames.mjs` rebuilds all four sets in one command
- [x] every burst window's transition proven by a read frame (flash `_0300`, seam `_0240`,
      wipe `_0150`; start/end pairs for the other four)
- [x] `frames-v1/` + `lukebaffait-live/` byte-identical pre/post (md5 digest
      `3ca1f8f8…` unchanged)
- [x] ≥2 frames per regenerated set spot-read
- [ ] tsc/lint — n/a (no src/ changes)

## Follow-ups

- Delete `reference/frames-4fps-old/` manually (blocked for the agent; zip already holds it).
- `fullRate` (45 fps) stays disabled — enable in CONFIG + `--yes` only if a study needs it.
