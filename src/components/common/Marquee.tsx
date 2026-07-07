import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { Box } from "@/components/common/Box";

interface MarqueeProps {
  children: ReactNode;
  /** seconds per loop */
  speed?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

/** Infinite horizontal loop with a duplicate aria-hidden track
 *  (design_system §7.2 / §8F). Reduced motion: single static track. */
export function Marquee({ children, speed = 30, reverse = false, pauseOnHover = true, className }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;
      tween.current = gsap.to(ref.current.querySelectorAll(".marquee-track"), {
        xPercent: reverse ? 100 : -100,
        duration: speed,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion, speed, reverse] },
  );

  if (prefersReducedMotion) {
    return (
      <Box className={cn("overflow-hidden", className)}>
        <Box className="flex w-max shrink-0 items-center gap-8">{children}</Box>
      </Box>
    );
  }

  return (
    <Box
      ref={ref}
      className={cn("flex overflow-hidden", className)}
      onPointerEnter={pauseOnHover ? () => tween.current?.pause() : undefined}
      onPointerLeave={pauseOnHover ? () => tween.current?.play() : undefined}
    >
      <Box className="marquee-track flex w-max shrink-0 items-center gap-8 pr-8">{children}</Box>
      <Box
        aria-hidden
        className="marquee-track flex w-max shrink-0 items-center gap-8 pr-8"
      >
        {children}
      </Box>
    </Box>
  );
}
