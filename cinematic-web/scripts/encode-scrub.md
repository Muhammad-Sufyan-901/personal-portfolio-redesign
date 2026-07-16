# Re-encode video for smooth scroll-scrubbing

Scrubbing `video.currentTime` seeks to the nearest *keyframe*; normally-encoded video
(keyframe every 2–10s) therefore flickers/jumps when scrubbed. Re-encode with a
keyframe every few frames and seeking becomes instant (Apple-product-page smooth).

Cost: file size grows ~3–5×. Only re-encode clips that will be scrubbed.

## One file
```bash
ffmpeg -i in.mp4 -c:v libx264 -x264-params keyint=3:min-keyint=3 -crf 18 -an out.mp4
```

## Batch — Windows (cmd, run inside the video folder)
```bat
for %f in (*.mp4) do ffmpeg -i "%f" -c:v libx264 -x264-params keyint=3:min-keyint=3 -crf 18 -an "scrub_%f"
```
(In a .bat file, double the percent signs: `%%f`.)

## Batch — macOS/Linux
```bash
for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -x264-params keyint=3:min-keyint=3 -crf 18 -an "scrub_$f"; done
```

Notes
- `keyint=3` = keyframe every 3 frames — good balance. `keyint=1` (all-intra) is the
  absolute smoothest and largest.
- `-an` strips audio (background videos are muted anyway).
- `-crf 18` keeps quality visually lossless; raise to 20–22 to save size.
- After re-encoding, the site can switch that clip from play-when-centered to
  true-scrub mode.
