import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { Box } from "@/components/common/Box";

interface PathDrawProps {
  /** SVG path data */
  d: string;
  /** ScrollTrigger trigger element (defaults to own wrapper) */
  trigger?: RefObject<HTMLElement | null>;
  /** number → SVG attribute; string → CSS stroke-width, which accepts
   *  vw/clamp() for viewport-tracking widths (non-scaling-stroke keeps it) */
  strokeWidth?: number | string;
  className?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  scrub?: boolean;
  start?: string;
  end?: string;
}

/** Bold organic path draw (design_system §7.2): thick winding SVG path drawn
 *  via stroke-dashoffset on scroll scrub. stroke = currentColor, so color it
 *  with a token class on the wrapper (defaults text-accent — re-theme-safe).
 *  Reduced motion: renders fully drawn (no dash ever set). */
export function PathDraw({
  d,
  trigger,
  strokeWidth = 3.5,
  className,
  viewBox = "0 0 100 100",
  preserveAspectRatio = "none",
  scrub = true,
  start = "top 80%",
  end = "bottom 60%",
}: PathDrawProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;
      const path = ref.current.querySelector("path");
      if (!path) return;

      // pathLength={1000} normalizes dash math (getTotalLength() is user-space
      // but non-scaling-stroke dashes render in screen space). 1000 — not 1 —
      // because GSAP's CSS layer rounds stroke-dashoffset to whole px, which
      // quantizes a 0–1 range into a binary step. Chrome also tiles screen-space
      // dashes on anisotropically stretched viewBoxes — callers that scrub a
      // stretched path must pass a pixel-space `d` + matching viewBox (1:1),
      // as CraftSection does.
      gsap.set(path, { strokeDasharray: 1000, strokeDashoffset: 1000 });
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: trigger?.current ?? ref.current,
          start,
          end,
          scrub,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion, d], revertOnUpdate: true },
  );

  return (
    <Box
      ref={ref}
      className={cn("text-accent", className)}
    >
      <svg
        aria-hidden
        focusable="false"
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        className="h-full w-full"
      >
        <path
          d={d}
          pathLength={1000}
          fill="none"
          stroke="currentColor"
          strokeWidth={typeof strokeWidth === "number" ? strokeWidth : undefined}
          style={typeof strokeWidth === "string" ? { strokeWidth } : undefined}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  );
}
