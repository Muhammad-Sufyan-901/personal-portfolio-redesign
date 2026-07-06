import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ParallaxConfig } from "@/types/motion";
import { Box } from "./Box";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** aspect-ratio className passthrough, e.g. "aspect-[4/3]" */
  aspect?: string;
  parallax?: ParallaxConfig;
  withScrim?: boolean;
  className?: string;
}

export function ParallaxImage({
  src,
  alt,
  width,
  height,
  aspect,
  parallax,
  withScrim = false,
  className,
}: ParallaxImageProps) {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const from = parallax?.from ?? -8;
  const to = parallax?.to ?? 8;

  useGSAP(
    () => {
      const figure = ref.current;
      // Reduced motion: static image — no clip reveal, no parallax scrub.
      if (!figure || prefersReducedMotion) return;

      gsap.fromTo(
        figure,
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          scrollTrigger: { trigger: figure, start: "top 80%", once: true },
        },
      );

      gsap.fromTo(
        "img",
        { yPercent: from },
        {
          yPercent: to,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [prefersReducedMotion, from, to] },
  );

  return (
    <Box
      as="figure"
      ref={ref}
      className={cn("relative overflow-hidden", aspect, className)}
    >
      {/* scale gives the ±8 yPercent scrub headroom so edges never show */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", !prefersReducedMotion && "scale-[1.2]")}
      />
      {withScrim ? (
        <Box
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-40% to-ink/65"
        />
      ) : null}
    </Box>
  );
}
