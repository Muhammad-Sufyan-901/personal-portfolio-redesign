import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Chapter 02 — WHO I AM (design_system §11.2, the scroll-fill peak).
 * Section pins; words fill from 0.15 → 1 opacity sequentially across the
 * scrub range. Words are pre-split in JSX (static data — no split-type
 * needed), so resize reflows natively and there is nothing to re-split.
 * Reduced motion: no pin/scrub — full-opacity paper, focal word accented.
 */
export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { lines, focalWord } = profile.manifesto;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return; // static final state

      gsap
        .timeline({
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=175%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(".manifesto-word", { opacity: 0.15 }, { opacity: 1, duration: 0.4, ease: "none", stagger: 0.2 })
        // trailing beat: words complete ~80% into the pin so the finished
        // statement is readable before unpin (scrub normalizes to the range)
        .to({}, { duration: 1.4 });
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="manifesto"
      ref={ref}
      className="flex min-h-screen flex-col justify-center px-page-x py-section"
    >
      <ChapterEyebrow
        index="02"
        label="WHO I AM"
      />

      <Box className="mt-12 flex flex-col gap-8">
        {lines.map((line) => (
          <Box
            as="p"
            key={line}
            className="max-w-[68ch] font-display font-light text-statement text-paper"
          >
            {line.split(" ").map((word, i) => (
              <Fragment key={`${word}-${i}`}>
                <Box
                  as="span"
                  className={cn(
                    "manifesto-word",
                    // ponytail: opacity-only fill — 0.15 on paper reads as faint,
                    // one tweened property instead of a color tween
                    word.replace(/[.,]/g, "") === focalWord && "-mx-1 rounded bg-accent-tint px-1 text-accent",
                  )}
                >
                  {word}
                </Box>{" "}
              </Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
