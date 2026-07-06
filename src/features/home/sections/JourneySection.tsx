import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow, RevealText } from "@/components/common";
import { JourneyEntry } from "@/features/home/components/JourneyEntry";
import { journey } from "@/features/home/data/journey.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";

/**
 * Chapter 04 — THE PATH (design_system §11.4). Work + education + awards as
 * one vertical timeline: 1px rail draws with the scroll (scaleY scrub, no
 * pin), entries fade/rise in once on enter. Reduced motion: everything
 * renders in its final state.
 */
export function JourneySection() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return; // static final state

      gsap.from(".journey-rail", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: ".journey-timeline",
          start: "top 80%",
          end: "bottom 60%",
          scrub: true,
        },
      });

      gsap.utils.toArray<HTMLElement>(".journey-entry").forEach((entry) => {
        gsap.from(entry, {
          autoAlpha: 0,
          y: 24,
          scrollTrigger: { trigger: entry, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="journey"
      ref={ref}
      className="px-page-x py-section"
    >
      <ChapterEyebrow
        index="04"
        label="THE PATH"
      />

      <RevealText
        as="h2"
        mode="lines"
        className="mt-12 font-display text-chapter text-paper"
      >
        The Path
      </RevealText>

      <Box className="journey-timeline relative mt-16">
        <Box
          aria-hidden
          className="journey-rail absolute inset-y-0 left-0 w-px bg-line"
        />
        <Box
          as="ul"
          className="flex flex-col gap-16"
        >
          {journey.map((item) => (
            <JourneyEntry
              key={`${item.title}-${item.start}`}
              item={item}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
