import { useRef, type RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "./Box";

interface PathDrawProps {
  /** SVG path data — the thick organic rail (design_system §7.2 "bold path draw") */
  d: string;
  /** ScrollTrigger trigger element; defaults to the component's own wrapper */
  trigger?: RefObject<HTMLElement | null>;
  strokeWidth?: number;
  className?: string;
  viewBox?: string;
  /** "none" stretches the path with its container; non-scaling-stroke keeps the width true */
  preserveAspectRatio?: string;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

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
  const ref = useRef<HTMLElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const path = pathRef.current;
      // Reduced motion: no dash is ever set, so the path renders fully drawn.
      if (!path || prefersReducedMotion) return;

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
    { scope: ref, dependencies: [prefersReducedMotion, d, scrub, start, end], revertOnUpdate: true },
  );

  return (
    <Box
      ref={ref}
      className={cn("text-accent", className)}
    >
      {/* decorative rail; raw svg/path is the documented wrapper-less-leaf exception */}
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        className="h-full w-full"
      >
        <path
          ref={pathRef}
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
