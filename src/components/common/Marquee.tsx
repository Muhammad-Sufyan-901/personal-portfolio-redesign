import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "./Box";

interface MarqueeProps {
  children: ReactNode;
  /** seconds per full loop */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export function Marquee({ children, speed = 30, reverse = false, pauseOnHover = true, className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      tweenRef.current = gsap.fromTo(
        ".marquee-track",
        { xPercent: reverse ? -100 : 0 },
        { xPercent: reverse ? 0 : -100, duration: speed, ease: "none", repeat: -1 },
      );
    },
    { scope: ref, dependencies: [prefersReducedMotion, speed, reverse] },
  );

  if (prefersReducedMotion) {
    // Reduced motion: single static track — no duplicate, no loop.
    return <Box className={cn("overflow-hidden", className)}>{children}</Box>;
  }

  return (
    <Box
      ref={ref}
      className={cn("flex overflow-hidden whitespace-nowrap", className)}
      onPointerEnter={pauseOnHover ? () => tweenRef.current?.pause() : undefined}
      onPointerLeave={pauseOnHover ? () => tweenRef.current?.play() : undefined}
    >
      <Box className="marquee-track flex shrink-0">{children}</Box>
      <Box
        className="marquee-track flex shrink-0"
        aria-hidden
      >
        {children}
      </Box>
    </Box>
  );
}
