---
name: cursor
description: Cursor primitive full mechanics — dot/ring quickTo follow, data-cursor pill mode, xPercent re-bake gotcha, coarse-pointer/RM bailout
metadata:
  type: reference
---

`Cursor` — no props. 8px dot (`h-2 w-2 bg-paper`) + 40px ring; centered via `gsap.set({ xPercent:-50, yPercent:-50 })` (don't use Tailwind translate — gsap x/y would stack oddly). quickTo follow (dot 0.12s, ring 0.45s); `pointerover` → `closest("a, button, [data-cursor]")` → ring scale 1.6 for unlabeled targets.

**Pill mode (2026-07-20):** a `data-cursor` label morphs the ring via conditional `cn()` classes into an auto-width paper pill (`h-10 w-auto bg-paper px-5 whitespace-nowrap`, label `text-ink font-bold uppercase`, NO `mix-blend-difference` — pill must stay white on any bg) at scale 1 (scaling a sized pill blurs text; `w-auto` sizes it, GSAP never tweens width). A SEPARATE small useGSAP keyed on `[label, active]` (never add `label` to the main block — its `revertOnUpdate` would tear down pointer listeners per hover) re-runs `gsap.set(ring, { xPercent:-50, yPercent:-50 })` — **load-bearing: GSAP caches element width for xPercent, so without the re-bake the pill sits off-center until the next pointermove** — plus a `back.out(2)` scale pop-in. Unlabeled circle: `h-10 w-10 border-paper/50 mix-blend-difference`, unchanged.

Toggles `cursor-none` on `<html>` while mounted+enabled. Returns null on coarse pointer / reduced motion. Mounted in `__root.tsx`. Labels in use: rows `View Project`, preview panel `See Project` (04).
