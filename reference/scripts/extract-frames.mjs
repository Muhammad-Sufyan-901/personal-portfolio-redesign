#!/usr/bin/env node
// Rebuild every video-derived reference set from one tunables object.
//
//   node reference/scripts/extract-frames.mjs           # dense + key + bursts + sheets
//   node reference/scripts/extract-frames.mjs --probe   # 1 frame at each burst window's
//                                                       # start/end, for boundary checks
//
// Idempotent: each pass wipes and rebuilds ONLY its own output folder. It never
// touches frames-v1/ (design_system §3.0 evidence), lukebaffait-live/ (live crawl),
// frames/ (swapped in manually after verification), or the source mp4.

import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// CONFIG — the single source of truth. No extraction numbers live anywhere else.
// Burst windows verified against reality 2026-07-16 (--probe pass, all 14 boundary
// frames eyeballed against breakdown_analysis.md §5 anchors — zero nudges needed).
// Note: the recording opens on an already-loaded hero (~0-2.5 s); a reload triggers
// the preloader at ~2.5-5.5 s, so preloader-flash covers both.
// ---------------------------------------------------------------------------
const CONFIG = {
  video: "reference/lukebaffait-scroll.mp4", // 1920×1080, 93.23 s, 120 fps
  dense: { fps: 8, out: "reference/frames", quality: 3 }, // global archive, № ≈ 8×s
  key: { fps: 8, out: "reference/frames-key", quality: 3, mpdecimate: true },
  sheets: { fps: 2, out: "reference/contact-sheets", tile: "6x8", tileWidth: 480, quality: 3 },
  bursts: {
    fps: 60,
    out: "reference/frames-bursts",
    quality: 2,
    windows: [
      { name: "preloader-flash", start: 0.0, end: 6.0 }, // color-flash frames, full-red beat ~5.0 s
      { name: "hero-seam", start: 13.0, end: 21.0 }, // media opens between the name rows
      { name: "path-entry", start: 27.0, end: 33.0 }, // red path starts drawing
      { name: "list-gallery-hand", start: 38.0, end: 44.0 }, // projects → gallery handoff
      { name: "accordion-switch", start: 58.0, end: 64.0 }, // skills category open→close→open
      { name: "invert-wipe", start: 70.0, end: 78.0 }, // semicircle wipe into the light section
      { name: "footer-bookend", start: 82.0, end: 88.0 }, // name re-enters cluster by cluster
    ],
  },
  // Full-rate extraction is expensive and opt-in: set enabled: true AND pass --yes.
  fullRate: { enabled: false, fps: 45, out: "reference/frames-full", quality: 3 },
  videoDuration: 93.23, // s — only used for fullRate projections
};
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const ffmpeg = (fargs) =>
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...fargs], {
    stdio: ["ignore", "inherit", "inherit"],
  });

const rebuildDir = (dir) => {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
};

const count = (dir) =>
  execFileSync("find", [dir, "-name", "*.jpg"]).toString().trim().split("\n").filter(Boolean)
    .length;

if (args.includes("--probe")) {
  const probeDir = join(CONFIG.bursts.out, "_probe");
  rebuildDir(probeDir);
  for (const w of CONFIG.bursts.windows) {
    for (const [edge, t] of [["start", w.start], ["end", w.end]]) {
      ffmpeg([
        "-ss", String(t), "-i", CONFIG.video, "-frames:v", "1",
        "-q:v", String(CONFIG.bursts.quality),
        join(probeDir, `${w.name}_${edge}.jpg`),
      ]);
    }
  }
  console.log(`probe: ${count(probeDir)} frames in ${probeDir}`);
  process.exit(0);
}

if (CONFIG.fullRate.enabled) {
  const frames = Math.round(CONFIG.fullRate.fps * CONFIG.videoDuration);
  const estMB = Math.round((frames * 120) / 1024); // ~120 KB/frame at 1080p jpeg
  console.log(`fullRate: projected ~${frames} frames, ~${estMB} MB in ${CONFIG.fullRate.out}`);
  if (!args.includes("--yes")) {
    console.error("fullRate is enabled but --yes was not passed. Aborting.");
    process.exit(1);
  }
  rebuildDir(CONFIG.fullRate.out);
  ffmpeg([
    "-i", CONFIG.video, "-vf", `fps=${CONFIG.fullRate.fps}`,
    "-q:v", String(CONFIG.fullRate.quality),
    join(CONFIG.fullRate.out, "frame_%05d.jpg"),
  ]);
  console.log(`fullRate: ${count(CONFIG.fullRate.out)} frames`);
}

// dense
rebuildDir(CONFIG.dense.out);
ffmpeg([
  "-i", CONFIG.video, "-vf", `fps=${CONFIG.dense.fps}`,
  "-q:v", String(CONFIG.dense.quality),
  join(CONFIG.dense.out, "frame_%04d.jpg"),
]);
console.log(`dense: ${count(CONFIG.dense.out)} frames in ${CONFIG.dense.out}`);

// key (mpdecimate drops near-duplicates)
rebuildDir(CONFIG.key.out);
ffmpeg([
  "-i", CONFIG.video,
  "-vf", `fps=${CONFIG.key.fps}${CONFIG.key.mpdecimate ? ",mpdecimate" : ""}`,
  "-fps_mode", "vfr", "-q:v", String(CONFIG.key.quality),
  join(CONFIG.key.out, "frame_%04d.jpg"),
]);
console.log(`key: ${count(CONFIG.key.out)} frames in ${CONFIG.key.out}`);

// bursts — one subfolder per window
rebuildDir(CONFIG.bursts.out);
for (const w of CONFIG.bursts.windows) {
  const dir = join(CONFIG.bursts.out, w.name);
  mkdirSync(dir, { recursive: true });
  ffmpeg([
    "-ss", String(w.start), "-to", String(w.end), "-i", CONFIG.video,
    "-vf", `fps=${CONFIG.bursts.fps}`, "-q:v", String(CONFIG.bursts.quality),
    join(dir, `${w.name}_%04d.jpg`),
  ]);
  console.log(`bursts/${w.name}: ${count(dir)} frames (${w.start}–${w.end}s)`);
}

// contact sheets
rebuildDir(CONFIG.sheets.out);
ffmpeg([
  "-i", CONFIG.video,
  "-vf", `fps=${CONFIG.sheets.fps},scale=${CONFIG.sheets.tileWidth}:-1,tile=${CONFIG.sheets.tile}`,
  "-q:v", String(CONFIG.sheets.quality),
  join(CONFIG.sheets.out, "sheet_%02d.jpg"),
]);
console.log(`sheets: ${count(CONFIG.sheets.out)} sheets in ${CONFIG.sheets.out}`);
