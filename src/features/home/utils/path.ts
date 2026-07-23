/** Scale a tunables' normalized (0–100) `d` into pixel coordinates so the
 *  SVG renders 1:1 — Chrome tiles screen-space dashes into disconnected
 *  segments on anisotropically stretched viewBoxes (see PathDraw note).
 *  Only absolute M/C commands: coordinates alternate x,y throughout.
 *  Used by 04 Projects (thread). */
export function scalePathD(d: string, w: number, h: number) {
  let i = 0;
  return d.replace(/-?\d+(?:\.\d+)?/g, (n) => {
    const v = (parseFloat(n) / 100) * (i++ % 2 === 0 ? w : h);
    return String(Math.round(v * 10) / 10);
  });
}

export interface ZigzagTip {
  /** which card this tip touches — decides which tip column it lands in */
  side: "left" | "right";
  /** vertical center in the line layer's local pixel space */
  y: number;
}

export interface ZigzagOptions {
  /** fraction of layer width w for the "touches a left-side card" tip column */
  leftX: number;
  /** fraction of layer width w for the "touches a right-side card" tip column */
  rightX: number;
  /** fraction of layer width w for the off-canvas entry point (negative) */
  entryX: number;
  /** fraction of layer width w for the off-canvas exit point (> 1) */
  exitX: number;
}

/** Builds an absolute M/C path (pixel space, 1:1 with a matching viewBox —
 *  see the scalePathD note above) that enters off-canvas top-left, zigzags down
 *  the center column touching each tip's card side, then exits off-canvas
 *  right through the finale runway (05 Journey, owner ask 2026-07-23: the
 *  line must visibly touch each card's inner edge — a hand-authored `d`
 *  can't track real, viewport-dependent card heights, so tips are measured
 *  from actual card centers in JourneySection and passed in here). */
export function buildZigzagPath(w: number, h: number, tips: ZigzagTip[], opts: ZigzagOptions) {
  const tipX = (side: ZigzagTip["side"]) => (side === "left" ? opts.leftX : opts.rightX) * w;
  const entryX = opts.entryX * w;
  const exitX = opts.exitX * w;

  if (tips.length === 0) {
    // No cards measured yet (first paint before layout) — keep `d` valid so
    // PathDraw never renders against an empty/invalid path.
    return `M ${entryX} ${h / 2} L ${exitX} ${h / 2}`;
  }

  const first = tips[0];
  const firstX = tipX(first.side);
  // Enter at the layer's TOP-left and slope down into the first tip — the
  // space-mirror of the exit sweep below (owner ask 2026-07-23; the old entry
  // ran dead-flat at the first tip's own y). `0` mirrors the exit's `exitY`,
  // which `Math.max(h, …)` always resolves to `h`.
  const midEntryY = first.y / 2;
  let d = `M ${entryX} 0 C ${entryX} ${midEntryY}, ${firstX} ${midEntryY}, ${firstX} ${first.y}`;

  // Vertical-tangent S-curves between successive tips: each control point
  // holds its own tip's x at the shared mid-y, so the stroke arrives at and
  // leaves every tip travelling straight down — a clean touch, not a graze.
  for (let i = 1; i < tips.length; i++) {
    const prevX = tipX(tips[i - 1].side);
    const currX = tipX(tips[i].side);
    const midY = (tips[i - 1].y + tips[i].y) / 2;
    d += ` C ${prevX} ${midY}, ${currX} ${midY}, ${currX} ${tips[i].y}`;
  }

  // Exit off-canvas right through the finale runway below the last tip.
  const last = tips[tips.length - 1];
  const lastX = tipX(last.side);
  const exitY = Math.max(h, last.y + (h - last.y) * 0.6);
  const midExitY = (last.y + exitY) / 2;
  d += ` C ${lastX} ${midExitY}, ${exitX} ${midExitY}, ${exitX} ${exitY}`;

  return d;
}
