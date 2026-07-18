import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Box, ChapterEyebrow, Link, MagneticButton, ParallaxImage, RevealText } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { siteConfig } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MANIFESTO_ENTRY } from "@/features/home/utils/manifesto.tunables";
import { ABOUT_REFINE } from "@/features/home/utils/about.tunables";
import { cn } from "@/lib/utils";

/** Portrait is a PLAN §8 externality — the path 404s into the primitive's
 *  graceful-hide until the real photo lands in public/assets/images/. */
const PORTRAIT_SRC = "/assets/images/portrait.webp";

const { headline: H, description: D, finale: F, portrait: P, damp, veiledOpacity, blurEnabled } = ABOUT_REFINE;
const { overlap } = MANIFESTO_ENTRY.veil.aboutResolve;

type StatementWord = { text: string; emphasized: boolean };

/** Per-word focal flags via char-range intersection with the emphasis phrases
 *  — word-membership would mis-flag the roman "and" ("precision AND care").
 *  ponytail: first occurrence per phrase only — current data has no repeats. */
function toWords(text: string, phrases: readonly string[]): StatementWord[] {
  const ranges = phrases.flatMap((phrase) => {
    const i = text.indexOf(phrase);
    return i === -1 ? [] : [[i, i + phrase.length] as const];
  });
  let cursor = 0;
  return text.split(" ").map((word) => {
    const start = text.indexOf(word, cursor);
    cursor = start + word.length;
    return { text: word, emphasized: ranges.some(([a, b]) => start < b && start + word.length > a) };
  });
}

const statementWords = toWords(profile.aboutStatement, profile.aboutStatementEmphasis ?? []);

/** Tint gradient resolved from tunable token NAMES (single-source, no hex). */
const TINT_GRADIENT = `linear-gradient(to top, var(--color-${P.tint.stops[0]}), var(--color-${P.tint.stops[1]}))`;

/** Bio reveal length — own-position scrub over a viewport fraction. */
const descEnd = () => `+=${D.reveal.spanVh * window.innerHeight}`;

/** D4 ember composition: entry-only glow halo behind (radial gradient — no
 *  CSS filter, softness lives in the falloff; a scrubbed BELL that is gone
 *  past ~20% traversal) + a rounded clip wrapper owning the corner radius
 *  (tint + wash + vignette clip with the image; the focus-blur tweens THIS
 *  wrapper, ParallaxImage stays untouched). Tint = orange duotone (opaque
 *  accent stops + mix-blend-color) under a normal-blend ember wash — the box
 *  reads fully orange even over the 404 placeholder. The vignette feathers
 *  the blurred portrait into the ink during entry only. */
function EmberPortrait({ className, rounding }: { className?: string; rounding: string }) {
  return (
    <Box className={cn("relative", className)}>
      {/* Entry-only glow bell — default HIDDEN (the settled state has no
          glow/blur overlay past 20% traversal). */}
      <Box
        aria-hidden
        className="about-halo pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-ember-glow-deep),transparent_70%)]"
        style={{ opacity: 0 }}
      />
      <Box className={cn("about-clip relative h-full overflow-hidden", rounding)}>
        <ParallaxImage
          src={PORTRAIT_SRC}
          alt="Portrait of Muhammad Sufyan"
          className="h-full"
        />
        <Box
          aria-hidden
          className="about-tint pointer-events-none absolute inset-0 mix-blend-color"
          style={{ backgroundImage: TINT_GRADIENT }}
        />
        <Box
          aria-hidden
          className="from-accent-deep/70 to-accent/45 pointer-events-none absolute inset-0 bg-linear-to-t"
        />
        <Box
          aria-hidden
          className="about-vignette pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,var(--color-ink)_98%)]"
          style={{ opacity: 0 }}
        />
      </Box>
    </Box>
  );
}

/** 03 — About: the factual persona block on the reference's About beat.
 *  v4 (2026-07-19): the section scrolls past 100vh with beats in document
 *  order — word-blur headline → description (+CV) → version + statistics
 *  finale — while the portrait STICKS on the right until the section ends
 *  (reference passage). Portrait keeps the orange duotone grade + focus
 *  blur; the finale beat sharpens it. Still the manifesto veil's landing
 *  target — entry trigger geometry is the G seam contract. */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (prefersReducedMotion || !section) return;
      const inner = section.querySelector<HTMLElement>(".about-inner");
      const finalEl = section.querySelector<HTMLElement>(".about-final");
      const items = gsap.utils.toArray<HTMLElement>(".about-item", section);
      const words = gsap.utils.toArray<HTMLElement>(".about-word", section);
      const halos = gsap.utils.toArray<HTMLElement>(".about-halo", section);
      const clips = gsap.utils.toArray<HTMLElement>(".about-clip", section);
      const vignettes = gsap.utils.toArray<HTMLElement>(".about-vignette", section);
      if (!inner || !finalEl) return;

      // Markup defaults are the SETTLED state (reduced motion renders
      // complete for free) — the motion path hides everything pre-paint.
      const wordVeil = {
        opacity: veiledOpacity,
        y: H.yDrift,
        ...(blurEnabled && { filter: `blur(${H.blurFromPx}px)` }),
      };
      gsap.set(items, { autoAlpha: 0, y: 24 });
      gsap.set(words, wordVeil);
      gsap.set(halos, { inset: -P.glow.blurPx * 3 });

      // §4.6 grammar: ONE scrubbed, reversible entry timeline coupled to the
      // veil tail (trigger geometry = the seam contract, scrub:true only).
      // Words stagger INDIVIDUALLY in DOM order across H.span — the
      // sharp/blur boundary travels mid-line like the reference. Timing is
      // layout-independent (word count is static) → build once.
      const spanLen = H.span[1] - H.span[0];
      const step = spanLen / (words.length - 1 + H.trail);
      const wordDur = H.trail * step;
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.fromTo(inner, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0);
      words.forEach((word, i) => {
        const at = H.span[0] + i * step;
        tl.fromTo(
          word,
          { ...wordVeil },
          { opacity: 1, y: 0, ...(blurEnabled && { filter: "blur(0px)" }), duration: wordDur },
          at,
        );
        // Blur is finite — drop the filter at each word's settle point,
        // inside the scrubbed timeline so it re-renders on reverse.
        if (blurEnabled) tl.set(word, { filter: "none" }, at + wordDur);
      });
      tl.fromTo(items, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: { amount: 0.15 } }, 0.5);

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        start: "top bottom",
        end: () => `top ${overlap * 100}%`,
        scrub: true,
      });

      // Finale beat — version + statistics resolve on their own position.
      const finaleVeil = {
        autoAlpha: 0,
        y: 24,
        ...(blurEnabled && { filter: `blur(${D.blurFromPx}px)` }),
      };
      gsap.set(finalEl, finaleVeil);
      const ftl = gsap.timeline({ defaults: { ease: "none" } });
      ftl.fromTo(
        finalEl,
        { ...finaleVeil },
        { autoAlpha: 1, y: 0, ...(blurEnabled && { filter: "blur(0px)" }), duration: 1 },
        0,
      );
      if (blurEnabled) ftl.set(finalEl, { filter: "none" }, 1);
      ScrollTrigger.create({
        animation: ftl,
        trigger: finalEl,
        start: F.start,
        end: F.end,
        scrub: 3 / damp,
      });

      if (blurEnabled) {
        // Focus beat: blur + vignette + the halo glow live ONLY in the
        // section's entry — everything clears over the first `resolveSpan`
        // fraction of the total traversal, leaving the clean fully-orange
        // box (no glow/blur overlay) through the bio + finale views. The
        // halo rides the same timeline as a bell (in over the first 40%,
        // gone by the end) — no breath, no gating, reversible by scrub.
        const portraitVeil = { filter: `blur(${P.veil.blurFromPx}px)` };
        gsap.set(clips, portraitVeil);
        gsap.set(vignettes, { opacity: 1 });
        const ptl = gsap.timeline({ defaults: { ease: "none" } });
        ptl
          .fromTo(clips, { ...portraitVeil }, { filter: "blur(0px)", duration: 1 }, 0)
          .fromTo(vignettes, { opacity: 1 }, { opacity: 0, duration: 1 }, 0)
          .fromTo(halos, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0)
          .fromTo(halos, { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.5)
          .set(clips, { filter: "none" }, 1);
        ScrollTrigger.create({
          animation: ptl,
          trigger: section,
          start: "top bottom",
          end: () => `+=${P.veil.resolveSpan * (section.offsetHeight + window.innerHeight)}`,
          scrub: 3 / damp,
          invalidateOnRefresh: true,
        });
      }
      // (!blurEnabled: nothing to do — the halo's markup default is hidden,
      // the box renders as the static fully-orange settled state.)
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="about"
      ref={sectionRef}
      // overflow-CLIP, not hidden: an overflow-hidden ancestor silently kills
      // position:sticky (it becomes the containment context and never
      // scrolls); clip crops the halo bleed without creating a scroll
      // container, so the portrait rail can stick.
      className="bg-ink px-page-x relative min-h-svh overflow-clip"
    >
      {/* Text column — above the portrait panel in z. Beat gaps are
          viewport-scale so the section scrolls past 100vh in the reference
          order: headline → description → version + statistics. */}
      <Box className="about-inner relative z-10 flex min-h-svh flex-col pt-[14svh] pb-[10svh] lg:pb-[8svh]">
        <ChapterEyebrow
          index="03"
          label="ABOUT"
        />

        {/* H1 — E v2 faces: roman inherits Switzer from the h2, focal words
            swap to the serif italic (D3). Word spans are React-owned (the
            StatementWords pattern — split-type line-groups nested spans as
            atomic units and would break wraps); spaces live BETWEEN the
            inline-block spans or they get swallowed. max-w widened so the
            text slightly overflows onto the portrait panel (inner is z-10). */}
        <Box
          as="h2"
          aria-label={profile.aboutStatement}
          className="about-statement font-display-lead text-statement text-paper mt-[5svh] lg:max-w-[72%]"
        >
          <Box
            as="span"
            aria-hidden
          >
            {statementWords.map((word, i) => (
              <Fragment key={i}>
                <Box
                  as="span"
                  className={cn("about-word inline-block", word.emphasized && "font-display-tail italic")}
                >
                  {word.text}
                </Box>
                {i < statementWords.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </Box>
        </Box>

        {/* H2 — description reveals line-by-line on its own position (the
            headline→description gate is physical layout distance now). */}
        <RevealText
          as="p"
          scrub={3 / damp}
          stagger={D.lineStagger}
          blurFrom={blurEnabled ? D.blurFromPx : 0}
          veiledOpacity={veiledOpacity}
          start={D.reveal.start}
          end={descEnd}
          className="about-item text-item text-paper mt-[12svh] max-w-[36ch] lg:mt-[14svh] lg:ml-[20%]"
        >
          {profile.bio}
        </RevealText>

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

        {/* Finale — statistics above the reference's version beat. Own
            reveal (not an .about-item). Top margin MATCHES the
            heading→description gap (owner instruction); the lg bottom margin
            gives the reveal window scroll room before the document ends
            (About is the last section) and holds the stuck portrait for a
            closing beat. */}
        <Box className="about-final mt-[12svh] lg:mt-[14svh] lg:mb-[24svh]">
          {/* Glass bubbles — MenuButton's glass-pill grammar: translucent
              paper wash + hairline + static backdrop blur. */}
          <Box className="flex flex-wrap items-stretch gap-x-5 gap-y-5">
            {profile.stats.map((stat) => (
              <Box
                key={stat.label}
                className="border-paper/10 bg-paper/5 rounded-2xl border px-7 py-5 backdrop-blur-md"
              >
                <Box
                  as="p"
                  className="font-display-lead text-item text-paper"
                >
                  {stat.value}
                </Box>
                <Box
                  as="p"
                  className="text-eyebrow text-muted mt-1 font-mono uppercase"
                >
                  {stat.label}
                </Box>
              </Box>
            ))}
          </Box>
          <Box
            as="p"
            className="font-display-lead text-chapter text-paper mt-10"
          >
            <Box
              as="span"
              aria-hidden
              className="text-muted"
            >
              →{" "}
            </Box>
            V{siteConfig.version}
          </Box>
        </Box>

        {/* Portrait — mobile: stacked full-width block at the end. */}
        <Box className="about-item -mx-page-x mt-14 lg:hidden">
          <EmberPortrait
            className="h-[55svh]"
            rounding="rounded-t-[3rem]"
          />
        </Box>
      </Box>

      {/* Portrait rail — desktop: right ~40vw for the whole section; the
          inner wrapper STICKS just below the top and releases flush at the
          section bottom (the reference's persistent portrait). */}
      <Box className="about-item absolute top-0 right-0 bottom-0 hidden w-[40vw] lg:block">
        <Box className="sticky top-[6svh] h-[88svh]">
          <EmberPortrait
            className="h-full"
            rounding="rounded-l-[clamp(3rem,9vw,11rem)]"
          />
        </Box>
      </Box>

      {/* Left-gutter marker — the reference's "(23)" echo. */}
      <Box
        as="span"
        aria-label={`${profile.stats[0].value}+ ${profile.stats[0].label}`}
        className="about-item text-meta text-muted absolute left-6 top-[55%] hidden font-mono lg:block"
      >
        ({profile.stats[0].value}+)
      </Box>
    </Box>
  );
}
