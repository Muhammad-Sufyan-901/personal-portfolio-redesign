import { Fragment, useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { Briefcase, GraduationCap } from "lucide-react";
import { Box, ChapterEyebrow, PathDraw } from "@/components/common";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { journey } from "@/features/home/data/journey.data";
import { profile } from "@/features/home/data/profile.data";
import { JOURNEY } from "@/features/home/utils/journey.tunables";
import { buildZigzagPath, type ZigzagTip } from "@/features/home/utils/path";

/** Card ordinal per journey index (awards excluded) — decides which side a
 *  card's sweep arrives at. Module-scope: `journey` is a static constant. */
const cardOrdinal = journey.map((_, i) => journey.slice(0, i).filter((j) => j.kind !== "award").length);

/** The card frame: 4 FULL-SPAN hairlines at `frame.inset` (owner ask
 *  2026-07-23 — a solid border that fully surrounds the content, replacing the
 *  4 L-shaped corner brackets). They read as a complete rectangle plus short
 *  tails, which the card's `rounded-card overflow-hidden` clips at the rounded
 *  edge — exactly the reference image. */
const CARD_FRAME_LINES: CSSProperties[] = [
  { top: JOURNEY.frame.inset, left: 0, right: 0, height: JOURNEY.frame.thickness },
  { bottom: JOURNEY.frame.inset, left: 0, right: 0, height: JOURNEY.frame.thickness },
  { left: JOURNEY.frame.inset, top: 0, bottom: 0, width: JOURNEY.frame.thickness },
  { right: JOURNEY.frame.inset, top: 0, bottom: 0, width: JOURNEY.frame.thickness },
];

/** Gallery-clone statement (owner overdrive 2026-07-22): PRD-transcribed
 *  journeyStatement re-set in the reference grammar — roman lead + italic-serif
 *  focal words (presentation only, text verbatim). */
const STATEMENT = {
  text: profile.journeyStatement,
  focalWords: ["shipping", "engineering"],
};
const statementWords = STATEMENT.text.split(" ");
const isFocalWord = (word: string) => STATEMENT.focalWords.includes(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());

/** 08 Journey — intro statement, then a THICK serpentine ember line (the 04
 *  thread weight) drawing itself down the runway while work/education cards
 *  scrub-slide in on the side each sweep arrives at (zigzag conveyor, owner
 *  overdrive 2026-07-22). Awards ride between sweeps as compact
 *  hover-invert moments. Fully scrubbed: everything freezes mid-flight and
 *  retraces with scroll. */
export function JourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineLayerRef = useRef<HTMLDivElement>(null);
  const [lineBox, setLineBox] = useState<{ w: number; h: number } | null>(null);
  const [lineTips, setLineTips] = useState<ZigzagTip[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Measure the line layer (→ pixel-space d + 1:1 viewBox, 04 gotcha:
  // screen-space dashes fragment on stretched viewBoxes) AND every card's
  // measured center (→ zigzag tips the line must visibly touch, owner ask
  // 2026-07-23 — a hand-authored path can't track real, viewport-dependent
  // card heights). Card reveals only translate X for side cards, never Y,
  // so a tip's y is stable even before that card has scrub-revealed.
  useIsomorphicLayoutEffect(() => {
    const layerEl = lineLayerRef.current;
    const sectionEl = sectionRef.current;
    if (!layerEl || !sectionEl) return;

    const measure = () => {
      const layerRect = layerEl.getBoundingClientRect();
      if (!layerRect.width || !layerRect.height) return;
      setLineBox({ w: Math.round(layerRect.width), h: Math.round(layerRect.height) });
      setLineTips(
        Array.from(sectionEl.querySelectorAll<HTMLElement>("[data-side]")).map((cardEl) => {
          const cardRect = cardEl.getBoundingClientRect();
          return {
            side: cardEl.dataset.side === "left" ? "left" : "right",
            y: Math.round(cardRect.top + cardRect.height / 2 - layerRect.top),
          };
        }),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(layerEl);
    return () => observer.disconnect();
  }, []);

  // Conveyor: each row owns a damped scrub (numeric scrub = GSAP catch-up),
  // so reveals are reversible and freeze mid-flight; the undamped line
  // leads, the cards settle after. Reduced motion: no tweens — everything
  // renders settled (PathDraw ships its own drawn fallback).
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // Gallery-clone de-veil: words blur→clear on a scrubbed window over the
      // h2 (words are visible by markup default — reduced motion never hides).
      const words = gsap.utils.toArray<HTMLElement>(".journey-word");
      gsap.set(words, { autoAlpha: 0, filter: `blur(${JOURNEY.heading.blurFrom}px)` });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".journey-statement",
            start: JOURNEY.heading.start,
            end: JOURNEY.heading.end,
            scrub: true,
          },
        })
        .to(words, {
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
          stagger: JOURNEY.heading.wordStagger,
          ease: "none",
        });

      gsap.utils.toArray<HTMLElement>(".journey-row").forEach((row) => {
        const side = row.dataset.side;
        const target = row.querySelector(".journey-reveal");
        if (!target) return;
        gsap.from(target, {
          autoAlpha: 0,
          x: side ? (side === "left" ? -JOURNEY.reveal.x : JOURNEY.reveal.x) : 0,
          y: side ? 0 : JOURNEY.reveal.awardY,
          ease: "none",
          scrollTrigger: {
            trigger: row,
            start: JOURNEY.reveal.start,
            end: JOURNEY.reveal.end,
            scrub: JOURNEY.reveal.scrub,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Per-card mouse-tilt + hover lift (2026-07-23, adapted from
  // ProjectsSection's preview-tilt recipe — quickTo on rotationX/rotationY,
  // but per-card listeners since Journey has 6 independent cards rather than
  // one shared preview panel). Targets the INNER card box, never
  // `.journey-reveal` (the scroll-reveal scrub target above), so the hover
  // tween can't fight the scroll-driven x/y mid-scroll.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const cards = gsap.utils.toArray<HTMLElement>(".journey-card-tilt");
      const cleanups = cards.map((card) => {
        gsap.set(card, { transformPerspective: JOURNEY.tilt.perspective });
        const rx = gsap.quickTo(card, "rotationX", { duration: JOURNEY.tilt.duration, ease: "power3.out" });
        const ry = gsap.quickTo(card, "rotationY", { duration: JOURNEY.tilt.duration, ease: "power3.out" });
        const lift = gsap.quickTo(card, "y", { duration: JOURNEY.tilt.duration, ease: "power3.out" });

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const nx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2));
          const ny = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2));
          ry(nx * JOURNEY.tilt.max);
          rx(-ny * JOURNEY.tilt.max);
        };
        const onEnter = () => lift(JOURNEY.tilt.lift);
        const onLeave = () => {
          rx(0);
          ry(0);
          lift(0);
        };

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        return () => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        };
      });
      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Perimeter-orbiting dot (owner: animate, 2026-07-23, adapted from a
  // borrowed 21st.dev "moving dot card" idea per animated-ui-references —
  // reimplemented as a plain GSAP loop, no framer-motion/tw-animate-css). One
  // unscrubbed, ever-repeating timeline per card, visiting the same 4 points
  // the frame's guide lines are anchored to (frame.inset), so the dot rides
  // ALONG those lines and parks on their intersections — a %-based inset put
  // the dot's straight-edge legs through the card's text padding.
  // `.journey-dot`'s markup default (bottom-center) already renders; reduced
  // motion skips the loop entirely, leaving that static position.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const inset = JOURNEY.frame.inset;
      // ponytail: top/left (not transforms) — layout cost is negligible for
      // 6 tiny dots; revisit only if this ever measures as a scroll-jank hot spot.
      const corners = [
        { top: inset, left: `calc(100% - ${inset})` },
        { top: inset, left: inset },
        { top: `calc(100% - ${inset})`, left: inset },
        { top: `calc(100% - ${inset})`, left: `calc(100% - ${inset})` },
      ];
      gsap.utils.toArray<HTMLElement>(".journey-dot").forEach((dot) => {
        gsap.set(dot, corners[0]);
        const loop = gsap.timeline({ repeat: -1 });
        corners
          .slice(1)
          .concat(corners[0])
          .forEach((pos) => loop.to(dot, { ...pos, duration: JOURNEY.dot.legDuration, ease: "none" }));
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="journey"
      ref={sectionRef}
      className="bg-ink px-page-x py-section relative overflow-x-clip"
    >
      <ChapterEyebrow
        index="08"
        label="The Path"
      />
      <Box
        as="h2"
        className="journey-statement font-display-lead text-statement text-paper mx-auto mt-8 max-w-[24ch] text-center"
      >
        {statementWords.map((word, i) => (
          <Fragment key={i}>
            <Box
              as="span"
              className={cn("journey-word inline-block", isFocalWord(word) && "font-display-tail italic")}
            >
              {word}
            </Box>
            {i < statementWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Box>

      <Box className="relative mt-20">
        {/* The center-column zigzag — full-bleed layer, but the drawn path
            itself stays inside the center column, touching each card's
            inner edge (measured tips, see the ResizeObserver above). */}
        <Box
          ref={lineLayerRef}
          aria-hidden
          className="-inset-x-page-x pointer-events-none absolute inset-y-0"
        >
          {lineBox && (
            <PathDraw
              d={buildZigzagPath(lineBox.w, lineBox.h, lineTips, JOURNEY.line)}
              viewBox={`0 0 ${lineBox.w} ${lineBox.h}`}
              strokeWidth={JOURNEY.line.strokeWidth}
              start={JOURNEY.line.start}
              end={JOURNEY.line.end}
              className="h-full w-full"
            />
          )}
        </Box>

        {/* Path-only intro beat before the first card — the line's sloped
            entry from the left page edge plays out here (mirrors the finale
            runway below). Inside the layer's positioning parent, so measured
            card tips shift down with it automatically. */}
        <Box
          aria-hidden
          style={{ height: JOURNEY.line.entryRunway }}
        />

        <Box
          as="ul"
          className="relative z-10 flex flex-col"
        >
          {journey.map((item, index) => {
            if (item.kind === "award") {
              return (
                <Box
                  as="li"
                  key={`${item.title}-${item.period}`}
                  className="journey-row flex justify-center py-10"
                >
                  <Box className="journey-reveal group border-line bg-surface hover:bg-invert-bg hover:text-invert-text text-paper flex items-center gap-3 rounded-full border px-5 py-2.5 transition-colors">
                    <Box
                      aria-hidden
                      className="bg-accent size-2.5 shrink-0 rounded-full"
                    />
                    <Box
                      as="span"
                      className="text-body font-medium"
                    >
                      {item.title}
                    </Box>
                    <Box
                      as="span"
                      className="font-mono text-meta text-muted group-hover:text-invert-text/70 uppercase transition-colors"
                    >
                      {item.org} · {item.period}
                    </Box>
                  </Box>
                </Box>
              );
            }

            const side = cardOrdinal[index] % 2 === 0 ? "right" : "left";
            return (
              <Box
                as="li"
                key={`${item.title}-${item.period}`}
                data-side={side}
                className={cn(
                  "journey-row flex min-h-[60svh] items-center",
                  side === "right" ? "justify-end" : "justify-start",
                )}
              >
                <Box className="journey-reveal relative w-full md:w-[35vw]">
                  {/* p-9/md:p-12 (was p-6/md:p-8) keeps the content clear of
                      the frame lines at `frame.inset` (owner: more padding
                      outside the border, 2026-07-23). */}
                  <Box className="journey-card-tilt group border-line bg-raised rounded-card relative overflow-hidden border p-9 md:p-12">
                    {/* Top-left light source (owner reference-image match,
                        2026-07-23 — replaces the old bottom bloom/aura with
                        the "moving dot card" frame's single corner glow;
                        adapted per animated-ui-references, ember not
                        white). */}
                    <Box
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background: `radial-gradient(${JOURNEY.frame.glowSize} at 0% 0%, color-mix(in oklab, var(--color-accent) ${JOURNEY.frame.glowAccent}%, transparent), transparent 70%)`,
                      }}
                    />
                    {/* Glass sheen — faint diagonal paper wash, brightens on
                        hover (owner-approved 2026-07-23, adapted from the
                        reference's glass reflection layer; CSS-only via
                        group-hover, recolored to the paper token). */}
                    <Box
                      aria-hidden
                      className="pointer-events-none absolute inset-0 opacity-50 transition-opacity duration-(--dur-fast) ease-out group-hover:opacity-80"
                      style={{
                        background: `linear-gradient(135deg, color-mix(in oklab, var(--color-paper) ${JOURNEY.card.sheenPaper}%, transparent) 0%, transparent 45%, transparent 78%, color-mix(in oklab, var(--color-paper) ${Math.round(JOURNEY.card.sheenPaper * 0.6)}%, transparent) 100%)`,
                      }}
                    />
                    <Box className="border-line bg-ink mb-5 inline-flex size-12 items-center justify-center rounded-full border">
                      {item.kind === "education" ? (
                        <GraduationCap
                          aria-hidden
                          className="text-paper size-5"
                        />
                      ) : (
                        <Briefcase
                          aria-hidden
                          className="text-paper size-5"
                        />
                      )}
                    </Box>
                    <Box
                      as="h3"
                      className="text-item text-paper font-sans font-medium"
                    >
                      {item.title}
                    </Box>
                    <Box
                      as="p"
                      className="text-body text-muted mt-1"
                    >
                      {item.org}
                    </Box>
                    <Box className="font-mono text-eyebrow text-muted mt-3 flex flex-wrap items-center gap-3 uppercase">
                      <Box as="span">{item.period}</Box>
                      {item.employmentType && (
                        <Box
                          as="span"
                          className="border-line rounded-full border px-2.5 py-0.5 normal-case"
                        >
                          {item.employmentType}
                        </Box>
                      )}
                    </Box>
                    {!item.highlights && item.summary && (
                      <Box
                        as="p"
                        className="text-body text-muted mt-5 max-w-[52ch]"
                      >
                        {item.summary}
                      </Box>
                    )}
                    {item.highlights && (
                      <Box
                        as="ul"
                        className="text-body text-muted marker:text-faint mt-5 grid list-disc gap-2 pl-5"
                      >
                        {item.highlights.map((line) => (
                          <Box
                            as="li"
                            key={line}
                          >
                            {line}
                          </Box>
                        ))}
                      </Box>
                    )}
                    {item.stack && (
                      <Box
                        as="ul"
                        className="mt-5 flex flex-wrap gap-2"
                      >
                        {item.stack.map((tech) => (
                          <Box
                            as="li"
                            key={tech}
                            className="border-line font-mono text-meta text-muted rounded-full border px-2.5 py-0.5"
                          >
                            {tech}
                          </Box>
                        ))}
                      </Box>
                    )}
                    {/* Card frame (owner reference-image match, 2026-07-23) —
                        4 solid full-span ember hairlines that fully surround
                        the content, replacing the 4 fading corner brackets. */}
                    {CARD_FRAME_LINES.map((line, i) => (
                      <Box
                        key={i}
                        aria-hidden
                        className="pointer-events-none absolute"
                        style={{
                          ...line,
                          background: `color-mix(in oklab, var(--color-accent) ${JOURNEY.frame.opacity}%, transparent)`,
                        }}
                      />
                    ))}
                    {/* Perimeter-orbiting dot (owner: animate, 2026-07-23) —
                        GSAP loop below drives it around the 4 corner insets;
                        markup default parks it bottom-center, static — the
                        reduced-motion fallback (see the tilt hook's sibling
                        below for the loop). */}
                    <Box
                      aria-hidden
                      className="journey-dot pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                      style={{
                        top: "100%",
                        left: "50%",
                        width: JOURNEY.dot.size,
                        height: JOURNEY.dot.size,
                        background: `color-mix(in oklab, var(--color-accent) ${JOURNEY.dot.fillOpacity}%, transparent)`,
                        boxShadow: `0 0 calc(${JOURNEY.dot.size} * 1.5) color-mix(in oklab, var(--color-accent) ${JOURNEY.dot.glowOpacity}%, transparent)`,
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Path-only handoff beat after the last card — the line's exit
            sweep to the right edge plays out here (mirrors ProjectsSection's
            finaleRunway spacer). */}
        <Box
          aria-hidden
          style={{ height: JOURNEY.line.finaleRunway }}
        />
      </Box>
    </Box>
  );
}
