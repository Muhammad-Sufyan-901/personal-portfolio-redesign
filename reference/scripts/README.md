# Reference capture scripts

Repeatable capture of the reference (https://lukebaffait.fr) as still frames.
Claude's vision reads static images only — these stills are what the agents actually study
(see `.agents/skills/reference-capture/SKILL.md`).

Two tools: `extract-frames.mjs` derives every still set from the scroll recording;
`capture-lukebaffait.mjs` crawls the live site.

## extract-frames.mjs (video → still sets)

```bash
node reference/scripts/extract-frames.mjs           # rebuild dense + key + bursts + sheets
node reference/scripts/extract-frames.mjs --probe   # 1 frame at each burst window's
                                                    # start/end → frames-bursts/_probe/
```

- **All tunables live in the `CONFIG` object at the top of the script** — fps, quality,
  output folders, and the 7 named burst windows (60 fps captures of the signature
  transitions). No extraction numbers exist anywhere else.
- Idempotent: each pass wipes and rebuilds only its own output folder. It never touches
  `frames-v1/`, `lukebaffait-live/`, or the source mp4.
- `fullRate` (45 fps whole-video) is **opt-in**: set `enabled: true` in CONFIG **and**
  pass `--yes` — the script prints the projected frame count + size first and aborts
  without the flag.
- Changing a burst window? Run `--probe` first and eyeball the start/end frames before
  the full extraction.

## capture-lukebaffait.mjs (live crawl)

### Setup (one-time)

```bash
npm i -D playwright          # already in devDependencies
npx playwright install chromium
```

### Usage

```bash
npm run capture:ref                                    # default: lukebaffait.fr, 40 scroll steps
node reference/scripts/capture-lukebaffait.mjs <url> <steps>   # custom target
```

### Output

```
reference/lukebaffait-live/
  desktop/step_00..40.png   1440×900
  mobile/step_00..40.png    390×844 @2x
  index.json                step → scrollY map per viewport
```

### How it scrolls (and why)

The script scrolls with **mouse-wheel events**, not `window.scrollTo` — smooth-scroll
libraries (Lenis / Locomotive) listen for wheel input and would ignore programmatic jumps,
so wheel is what makes reveals fire at the right depths. It pauses 750 ms per step so
scroll-triggered animations settle before the screenshot.

### Known limitations

- Captures **post-load scroll states** only. The preloader animation is covered by the
  video frame set (`reference/frames*/`, extracted from `reference/lukebaffait-scroll.mp4`).
- **Mobile coverage is partial** (~58% depth on lukebaffait.fr): in the touch-emulated
  context Lenis damps wheel deltas, so 40 steps under-shoot the full document. Desktop
  reaches the bottom. If full mobile depth matters, raise the step count
  (`node … <url> 100`) or switch the mobile viewport to touch-swipe gestures.
- Everything under `reference/` except this folder, `REFERENCE-NOTES.md`, and
  `breakdown_analysis.md` is gitignored (heavy, re-derivable).
