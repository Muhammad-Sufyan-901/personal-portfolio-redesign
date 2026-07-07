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
  strokeWidth?: number;
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

      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
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
    { scope: ref, dependencies: [prefersReducedMotion, d] },
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
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Box>
  );
}
