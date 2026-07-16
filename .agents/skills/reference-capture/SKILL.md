---
name: reference-capture
description: How to capture lukebaffait.fr (or any scroll-animated reference site) as visual input for Claude, since Claude's vision only reads static images — not video or animated GIFs.
---

# Capturing an Animated Reference Site

Claude's vision reads static images only (JPEG/PNG/GIF/WebP); even an animated GIF is reduced to its first frame, and there is no native video upload/playback in Claude Code. To let the agent "see" a scroll-telling site's motion, convert what you see into a sequence of stills — one of the two options below.

## Option A — Manual screenshots at each scroll-stop (simplest, no tooling)

Scroll the reference site slowly and capture one screenshot at each meaningful state: initial hero, hero mid-reveal, manifesto scroll-fill (2–3 stops), a work-card hover/reveal, the pinned/horizontal row if present, contact. 6–10 stills usually cover a site like `lukebaffait.fr`. Attach all of them to Claude Code.

## Option B — Screen-record, then extract frames (captures motion timing better)

1. Record a slow scroll-through with any screen recorder, pausing ~1s at each section and right as a reveal animation triggers.
2. Extract frames. **In this repo, use the CONFIG-driven extractor** (scripts/ pointer — the real executables live with the reference data, not duplicated here):
   ```bash
   node reference/scripts/extract-frames.mjs           # dense 8fps + key + 60fps bursts + contact sheets
   node reference/scripts/extract-frames.mjs --probe   # boundary frames when tuning burst windows
   ```
   For an arbitrary NEW video outside that pipeline, the raw recipe is `ffmpeg -i <video> -vf fps=2 frames/frame_%03d.png` (install ffmpeg first — macOS `brew install ffmpeg`); bump fps only around one specific fast animation. The related live-site crawler is `reference/scripts/capture-lukebaffait.mjs` (`npm run capture:ref`), and the palette-evidence script is `reference/scripts/histogram-phases.py`.
3. Attach the resulting frames to Claude Code instead of the raw video.

## Letting Claude Code do the extraction itself

Prefer not to run ffmpeg yourself? Place the raw recording at `reference/lukebaffait-scroll.mp4` in the repo and tell Claude Code to run the Option B, step 2 command before starting `/plan-redesign`. It has local Bash access on your machine and can run the same command; it just can't watch the .mp4 directly afterward — the extracted .png frames are what it actually reads.

## Already applied in this repo

This procedure has run for real, several times: the early passes (19 then 47 frames) grounded design_system.md v2's §3.0 evidence and the "Void & Ember" palette; the 2026-07-16 rebuild produced the current sets — `frames/` (746 @ 8fps, № ≈ 8×s), `frames-key/`, seven 60fps `frames-bursts/` windows, contact sheets — all regenerable via `reference/scripts/extract-frames.mjs` (inventory + burst-window table: `reference/REFERENCE-NOTES.md`; analysis: `reference/breakdown_analysis.md`). Re-run only if a new reference video arrives or a burst window changes.

## What visual reference is for (and isn't)

Stills — however many — show layout, spacing, and typography at a moment; they don't convey exact easing curves or durations. Use them to judge composition and rhythm, not to reverse-engineer precise motion values. Exact motion values (durations, cubic-bezier eases, stagger amounts) are already specified in `context/design_system.md §7` — that document is authoritative for the numbers; the screenshots/frames are authoritative for the mood and per-section composition.
