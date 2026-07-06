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
2. Extract frames with ffmpeg (install first if missing — macOS: `brew install ffmpeg`; Ubuntu/Debian: `sudo apt install ffmpeg`; Windows: `winget install ffmpeg` or download from ffmpeg.org):
   ```bash
   ffmpeg -i reference/lukebaffait-scroll.mp4 -vf fps=2 reference/frames/frame_%03d.png
   ```
   `fps=2` (2 frames/sec) is enough for most reveals; bump to `fps=4` only around one specific fast animation you want studied closely. Delete near-duplicate frames before attaching if the set is large.
3. Attach the resulting `reference/frames/*.png` files to Claude Code instead of the raw video.

## Letting Claude Code do the extraction itself

Prefer not to run ffmpeg yourself? Place the raw recording at `reference/lukebaffait-scroll.mp4` in the repo and tell Claude Code to run the Option B, step 2 command before starting `/plan-redesign`. It has local Bash access on your machine and can run the same command; it just can't watch the .mp4 directly afterward — the extracted .png frames are what it actually reads.

## What visual reference is for (and isn't)

Stills — however many — show layout, spacing, and typography at a moment; they don't convey exact easing curves or durations. Use them to judge composition and rhythm, not to reverse-engineer precise motion values. Exact motion values (durations, cubic-bezier eases, stagger amounts) are already specified in `context/design_system.md §7` — that document is authoritative for the numbers; the screenshots/frames are authoritative for the mood and per-section composition.
