import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import type { ParallaxConfig } from "@/types/motion";
import { cn } from "@/lib/utils";
import { Box } from "@/components/common/Box";

interface ParallaxImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** aspect-ratio className, e.g. "aspect-[4/3]" */
  aspect?: string;
  parallax?: ParallaxConfig;
  withScrim?: boolean;
  className?: string;
}

/** Clip-inset reveal (once) + scrub parallax (design_system §7.2). Renders a
 *  raw <img> deliberately — the Image skeleton wrapper fights the clip. */
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
  const [errored, setErrored] = useState(false);
  const from = parallax?.from ?? -8;
  const to = parallax?.to ?? 8;

  useGSAP(
    () => {
      if (prefersReducedMotion || !ref.current) return;

      gsap.from(ref.current, {
        clipPath: "inset(100% 0 0 0)",
        duration: 1.2,
        scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
      });

      gsap.fromTo(
        ref.current.querySelector("img"),
        { yPercent: from },
        {
          yPercent: to,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: ref, dependencies: [prefersReducedMotion] },
  );

  return (
    <Box
      as="figure"
      ref={ref}
      className={cn("bg-raised relative overflow-hidden", aspect, className)}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onError={() => setErrored(true)}
        className={cn(
          "h-full w-full object-cover",
          // scale headroom so the parallax never exposes edges
          !prefersReducedMotion && "scale-[1.2]",
          // not-yet-supplied asset: hide the broken glyph, keep the raised
          // figure block (PLAN §8 externalities ship on this fallback)
          errored && "opacity-0",
        )}
      />
      {withScrim && (
        <Box
          aria-hidden
          className="absolute inset-0 bg-linear-to-b from-transparent from-40% to-ink/65"
        />
      )}
    </Box>
  );
}
