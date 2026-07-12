import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Box, ChapterEyebrow, Link, MagneticButton, ParallaxImage, RevealText } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Portrait is a PLAN §8 externality — the path 404s into the primitive's
 *  graceful-hide until the real photo lands in public/assets/images/. */
const PORTRAIT_SRC = "/assets/images/portrait.webp";

/** `aboutStatement` verbatim, split at the clause break into the two
 *  hard-aligned tiers of the reference layout (presentation only). */
const [tierOne, tierTwo] = (() => {
  const words = profile.aboutStatement.split(" ");
  const breakAt =
    profile.aboutStatement.indexOf(",") !== -1
      ? profile.aboutStatement.split(",")[0].split(" ").length
      : Math.ceil(words.length / 2);
  return [words.slice(0, breakAt).join(" "), words.slice(breakAt).join(" ")];
})();

/** 03 — About: the factual persona block (reference beat 4) and the veil's
 *  landing target. The whole inner wrapper condenses in crisp out of the
 *  manifesto's blur (autoAlpha/y/blur clear, once), then children stagger.
 *  Sparse hard-aligned grid: two-tier statement → bio + portrait → stats
 *  count-up → CV link. */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (prefersReducedMotion || !section) return;
      const inner = section.querySelector<HTMLElement>(".about-inner");
      const items = gsap.utils.toArray<HTMLElement>(".about-item", section);
      const values = gsap.utils.toArray<HTMLElement>(".about-stat-value", section);
      if (!inner) return;

      // §4.6 — About resolves crisp out of the veil's blur. clearProps on the
      // filter: a lingering blur(0px) pins the section to its own compositor
      // layer and stacking context forever.
      gsap.fromTo(
        inner,
        { autoAlpha: 0, y: 48, filter: "blur(14px)" },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
          ease: "power4.out",
          clearProps: "filter",
          scrollTrigger: { trigger: section, start: "top 78%", once: true },
        },
      );

      gsap.from(items, {
        autoAlpha: 0,
        y: 24,
        duration: 0.9,
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 60%", once: true },
      });

      // Mono count-up, 0 → value, snapped to integers (spec §8).
      gsap.from(values, {
        textContent: 0,
        snap: { textContent: 1 },
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 55%", once: true },
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="about"
      ref={sectionRef}
      className="bg-ink relative px-page-x py-section"
    >
      <Box className="about-inner mx-auto flex max-w-7xl flex-col gap-16">
        <ChapterEyebrow
          index="03"
          label="ABOUT"
        />

        <Box className="grid grid-cols-1 gap-x-6 gap-y-16 lg:grid-cols-12">
          {/* Two-tier statement — off-axis alignment per the reference. */}
          <Box
            as="h2"
            aria-label={profile.aboutStatement}
            className="font-display text-statement text-paper grid grid-cols-1 gap-y-3 lg:col-span-12 lg:grid-cols-12"
          >
            <Box
              as="span"
              aria-hidden
              className="block lg:col-span-8 lg:col-start-1"
            >
              <RevealText
                as="span"
                mode="lines"
                className="block"
              >
                {tierOne}
              </RevealText>
            </Box>
            <Box
              as="span"
              aria-hidden
              className="block lg:col-span-9 lg:col-start-4"
            >
              <RevealText
                as="span"
                mode="lines"
                className="block"
              >
                {tierTwo}
              </RevealText>
            </Box>
          </Box>

          {/* Bio (left) beside the portrait (right, rounded-top). */}
          <Box
            as="p"
            className="about-item text-body text-muted max-w-[46ch] self-end lg:col-span-6 lg:col-start-1"
          >
            {profile.bio}
          </Box>

          <Box className="about-item lg:col-span-5 lg:col-start-8 lg:row-span-2">
            <ParallaxImage
              src={PORTRAIT_SRC}
              alt="Portrait of Muhammad Sufyan"
              aspect="aspect-[4/5]"
              withScrim
              className="rounded-t-[2rem]"
            />
          </Box>

          {/* Stats — hairline-separated mono row, count-up on enter. */}
          <Box
            as="ul"
            className="about-item border-line grid grid-cols-3 border-y lg:col-span-7 lg:col-start-1"
          >
            {profile.stats.map((stat, i) => (
              <Box
                key={stat.label}
                as="li"
                className={cn("flex flex-col gap-2 py-6", i > 0 && "border-line border-l pl-6")}
              >
                <Box
                  as="span"
                  className="about-stat-value font-mono text-chapter text-paper"
                >
                  {stat.value}
                </Box>
                <Box
                  as="span"
                  className="text-eyebrow text-muted font-mono uppercase"
                >
                  {stat.label}
                </Box>
              </Box>
            ))}
          </Box>

          <Box className="about-item lg:col-span-7 lg:col-start-1">
            <MagneticButton>
              <Link
                href={profile.cvUrl}
                className="magnetic-label text-eyebrow text-paper hover:text-accent group inline-flex items-center gap-3 font-mono uppercase transition-colors"
              >
                Download CV
                <Box
                  as="span"
                  aria-hidden
                  className="text-accent transition-transform group-hover:translate-x-1"
                >
                  →
                </Box>
              </Link>
            </MagneticButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
