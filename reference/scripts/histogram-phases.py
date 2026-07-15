#!/usr/bin/env python3
"""Repeatable evidence pass for reference/breakdown_analysis.md §2.1.

Run from the repo root:  python3 reference/scripts/histogram-phases.py

Two sections, no flags:
  1. Dominant-color histogram (median-cut, 8 colors) over >=3 evenly spaced
     frames per phase window of reference/frames/ (373 jpg @ 4 fps, 1-indexed).
  2. Brightness scan of frames 270-340 (mean luminance) to locate the
     light-invert window boundaries and peak.
"""

from pathlib import Path

from PIL import Image

FRAMES = Path(__file__).resolve().parents[1] / "frames"
FPS = 4
SAMPLES_PER_PHASE = 5
COLORS = 8

# Phase windows in seconds, as claimed by breakdown_analysis.md §2.1.
PHASES = [
    ("Preloader", 0, 5),
    ("Hero", 5, 16),
    ("About", 16, 28),
    ("Projects", 28, 40),
    ("Gallery", 40, 56),
    ("Skills", 56, 68),
    ("Awards→Contact", 68, 82),
    ("Footer", 83, 93),
]

BRIGHTNESS_RANGE = (270, 340)


def frame_path(n: int) -> Path:
    return FRAMES / f"frame_{n:04d}.jpg"


def dominant_colors(path: Path) -> list[tuple[str, float]]:
    """(hex, share) of the frame's median-cut palette, largest first."""
    img = Image.open(path).convert("RGB")
    img.thumbnail((320, 320))  # speed; shares are what matter, not resolution
    quant = img.quantize(colors=COLORS, method=Image.Quantize.MEDIANCUT)
    palette = quant.getpalette()
    total = quant.width * quant.height
    out = []
    for count, idx in sorted(quant.getcolors(), reverse=True):
        r, g, b = palette[idx * 3 : idx * 3 + 3]
        out.append((f"#{r:02X}{g:02X}{b:02X}", count / total))
    return out


def sample_frames(t0: int, t1: int) -> list[int]:
    first, last = FPS * t0 + 1, min(FPS * t1, 373)
    step = max(1, (last - first) // (SAMPLES_PER_PHASE - 1))
    frames = list(range(first, last + 1, step))[:SAMPLES_PER_PHASE]
    return frames


def main() -> None:
    print("== Dominant colors per phase (median-cut, top 4 swatches) ==")
    for name, t0, t1 in PHASES:
        print(f"\n-- {name} ({t0}-{t1}s) --")
        for n in sample_frames(t0, t1):
            swatches = dominant_colors(frame_path(n))[:4]
            row = "  ".join(f"{hx} {share:5.1%}" for hx, share in swatches)
            print(f"  frame {n:4d} (~{(n - 1) / FPS:5.2f}s): {row}")

    lo, hi = BRIGHTNESS_RANGE
    print(f"\n== Brightness scan frames {lo}-{hi} (mean luminance 0-100%) ==")
    for n in range(lo, hi + 1):
        img = Image.open(frame_path(n)).convert("L")
        img.thumbnail((320, 320))
        mean = sum(i * c for i, c in enumerate(img.histogram())) / (
            img.width * img.height * 255
        )
        bar = "#" * round(mean * 60)
        print(f"  frame {n:4d} (~{(n - 1) / FPS:5.2f}s): {mean:5.1%} {bar}")


if __name__ == "__main__":
    main()
