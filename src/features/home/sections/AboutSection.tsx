import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Box, ChapterEyebrow, Link, MagneticButton, ParallaxImage } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Portrait is a PLAN §8 externality — the path 404s into the primitive's
 *  graceful-hide until the real photo lands in public/assets/images/. */
const PORTRAIT_SRC = "/assets/images/portrait.webp";

/** Split `text` into segments, marking every occurrence of `phrases` — the
 *  hero `taglineEmphasis` device generalized to multiple focal phrases. */
function emphasize(text: string, phrases: string[] = []): { text: string; emphasized: boolean }[] {
  let segments = [{ text, emphasized: false }];
  for (const phrase of phrases) {
    segments = segments.flatMap((segment) => {
      if (segment.emphasized || !segment.text.includes(phrase)) return [segment];
      const parts = segment.text.split(phrase);
      return parts.flatMap((part, i) => [
        ...(part ? [{ text: part, emphasized: false }] : []),
        ...(i < parts.length - 1 ? [{ text: phrase, emphasized: true }] : []),
      ]);
    });
  }
  return segments;
}

const statementSegments = emphasize(profile.aboutStatement, profile.aboutStatementEmphasis);
const yearsStat = profile.stats[0];

/** 03 — About: the factual persona block, relaid to the reference's About
 *  beat (full-viewport composition): sans statement with Fraunces-italic
 *  focal phrases top-left, indented bio, the CV link in the "INFO" spot, a
 *  small "(3+)" marker in the left gutter, and a large portrait panel
 *  filling the right ~40% — rounded left corners, bleeding flush to the
 *  right and bottom edges. Still the manifesto veil's landing target: the
 *  inner wrapper condenses in crisp out of the blur, then children stagger. */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (prefersReducedMotion || !section) return;
      const inner = section.querySelector<HTMLElement>(".about-inner");
      const items = gsap.utils.toArray<HTMLElement>(".about-item", section);
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
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="about"
      ref={sectionRef}
      className="bg-ink px-page-x relative min-h-svh overflow-hidden"
    >
      {/* Text column — above the portrait panel in z. */}
      <Box className="about-inner relative z-10 flex min-h-svh flex-col pt-[14svh] pb-[10svh] lg:pb-[8svh]">
        <ChapterEyebrow
          index="03"
          label="ABOUT"
        />

        <Box
          as="h2"
          className="about-item text-statement text-paper mt-[5svh] font-sans lg:max-w-[63%]"
        >
          {statementSegments.map((segment, i) =>
            segment.emphasized ? (
              <Box
                key={i}
                as="span"
                className="font-display italic"
              >
                {segment.text}
              </Box>
            ) : (
              <Fragment key={i}>{segment.text}</Fragment>
            ),
          )}
        </Box>

        <Box
          as="p"
          className="about-item text-body text-paper mt-[12svh] max-w-[36ch] lg:ml-[20%]"
        >
          {profile.bio}
        </Box>

        {/* The reference's "INFO" spot — our info action is the CV. */}
        <Box className="about-item mt-12 lg:ml-[20%]">
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

        {/* Portrait — mobile: stacked full-width block at the end. */}
        <Box className="about-item -mx-page-x mt-14 lg:hidden">
          <ParallaxImage
            src={PORTRAIT_SRC}
            alt="Portrait of Muhammad Sufyan"
            className="h-[55svh] rounded-t-[3rem]"
          />
        </Box>
      </Box>

      {/* Portrait panel — desktop: right ~40%, rounded left corners, flush to
          the viewport's right edge and the section bottom (reference bleed). */}
      <Box className="about-item absolute top-[12svh] right-0 bottom-0 hidden w-[40vw] lg:block">
        <ParallaxImage
          src={PORTRAIT_SRC}
          alt="Portrait of Muhammad Sufyan"
          className="h-full rounded-l-[clamp(3rem,9vw,11rem)]"
        />
      </Box>

      {/* Left-gutter marker — the reference's "(23)" echo. */}
      <Box
        as="span"
        aria-label={`${yearsStat.value}+ ${yearsStat.label}`}
        className="about-item text-meta text-muted absolute left-6 top-[55%] hidden font-mono lg:block"
      >
        ({yearsStat.value}+)
      </Box>
    </Box>
  );
}
