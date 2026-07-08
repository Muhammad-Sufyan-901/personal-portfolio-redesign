import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Box, ChapterEyebrow } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const { lines, focalWord } = profile.manifesto;

/** Case-insensitive, punctuation-stripped match against the focal word. */
function isFocalWord(word: string): boolean {
  return word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase() === focalWord.toLowerCase();
}

/** Chapter 02 — pinned scroll-fill statement (design_system §7.2/§11.2).
 *  Words are pre-split in JSX (static data — no split-type, no revert cost);
 *  one scrubbed opacity tween fills them faint→full through the pin. */
export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      // Reduced motion: words render at full opacity via JSX — no pin, no scrub.
      if (prefersReducedMotion) return;

      gsap.fromTo(
        ".manifesto-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=175%",
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="manifesto"
      ref={sectionRef}
      className="flex min-h-svh flex-col justify-center px-page-x py-section"
    >
      <ChapterEyebrow
        index="02"
        label="WHO I AM"
      />
      <Box
        as="h2"
        className="font-display text-statement text-paper mt-12 max-w-4xl"
      >
        {lines.map((line) => (
          <Box
            as="span"
            key={line}
            className="block"
          >
            {line.split(" ").map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                {wordIndex > 0 && " "}
                <Box
                  as="span"
                  className={cn(
                    "manifesto-word inline-block",
                    isFocalWord(word) && "text-accent bg-accent-tint -mx-1 rounded px-1",
                  )}
                >
                  {word}
                </Box>
              </Fragment>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
