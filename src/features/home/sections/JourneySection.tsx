import { Fragment, useRef, useState } from "react";
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
import { TECH_ICONS } from "@/features/home/utils/tech-icons";
import { buildZigzagPath, type ZigzagTip } from "@/features/home/utils/path";

/** Card ordinal per journey index (awards excluded) — decides which side a
 *  card's sweep arrives at. Module-scope: `journey` is a static constant. */
const cardOrdinal = journey.map((_, i) => journey.slice(0, i).filter((j) => j.kind !== "award").length);

/** Rim fade (owner ask 2026-07-24): solid brown across the bottom + both
 *  corners, easing to a faint warm hairline that carries the rest of the
 *  perimeter (it replaces the card's neutral `border-line`). Alpha mask —
 *  `black` = fully painted; keyword/`rgb()` only, so the QA hex grep stays
 *  clean. */
const RIM_FADE = "linear-gradient(to top, black 0%, black 18%, rgb(0 0 0 / 0.12) 62%, rgb(0 0 0 / 0.12) 100%)";

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
                  {/* Connector node (owner ask 2026-07-25) — marks where the
                      drawn line meets the card. Sibling of the tilt box (that
                      box is overflow-hidden) and inside `.journey-reveal`, so
                      it rides the scrub slide-in and arrives ON the line with
                      the card. Its y needs no measurement: the row is
                      `items-center`, so `top-1/2` here IS the measured tip y.
                      Desktop-only — below md the card is w-full while the tips
                      stay at 0.4w/0.6w, so the card edge isn't near the line. */}
                  <Box
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute top-1/2 z-10 hidden size-4 -translate-y-1/2 md:block",
                      side === "right" ? "left-0 -translate-x-1/2" : "right-0 translate-x-1/2",
                    )}
                  >
                    {/* `ring-ink` is load-bearing: dot and stroke are both
                        ember, so without an ink gap the node dissolves into
                        the line it is meant to mark. */}
                    <Box className="bg-accent ring-ink absolute inset-0 rounded-full ring-[3px]" />
                    <Box className="border-accent motion-safe:animate-ping absolute inset-0 rounded-full border-2" />
                  </Box>
                  {/* Gradient-card restyle (owner reference match 2026-07-24):
                      ink card, deep bottom padding = the empty lower zone the
                      ember bloom rises through. The halo is a box-shadow on
                      THIS element — never clipped by its own overflow-hidden,
                      and it tilts with the card; keep its spread inside
                      px-page-x or the section's load-bearing overflow-x-clip
                      hard-crops it on side cards. */}
                  <Box className="journey-card-tilt group bg-ink rounded-card shadow-[0_-8px_50px_6px_var(--color-ember-glow-soft),0_0_16px_2px_var(--color-ember-glow-deep),0_0_10px_0_var(--color-overlay-scrim)] hover:shadow-[0_-8px_60px_10px_var(--color-ember-glow-soft),0_0_20px_3px_var(--color-ember-glow-deep),0_0_10px_0_var(--color-overlay-scrim)] duration-(--dur-fast) relative overflow-hidden p-9 pb-32 transition-shadow ease-out md:p-12 md:pb-40">
                    {/* Bottom bloom — the reference's two blurred glow layers
                        collapsed into one (3 radials, ember not purple),
                        under the content in DOM so text stays on top. */}
                    <Box
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3"
                      style={{
                        background: [
                          `radial-gradient(ellipse at bottom right, color-mix(in oklab, var(--color-accent) ${JOURNEY.card.bloomCornerAccent}%, transparent) -10%, transparent 70%)`,
                          `radial-gradient(ellipse at bottom left, color-mix(in oklab, var(--color-accent-deep) ${JOURNEY.card.bloomCornerDeep}%, transparent) -10%, transparent 70%)`,
                          `radial-gradient(circle at bottom center, color-mix(in oklab, var(--color-accent-deep) ${JOURNEY.card.bloomCenterDeep}%, transparent) -20%, transparent 60%)`,
                        ].join(", "),
                        filter: `blur(${JOURNEY.card.bloomBlur})`,
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
                    <Box className="border-line bg-raised mb-5 inline-flex size-12 items-center justify-center rounded-full border">
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
                      className="text-[length:calc(var(--text-body)*1.5)] text-paper font-sans font-semibold leading-tight"
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
                    {/* Overview, then the titled list (owner ask 2026-07-25).
                        The overview is no longer a fallback for a missing
                        list — every card leads with it, and the two no longer
                        restate each other (see the data file's header note). */}
                    {item.summary && (
                      <Box
                        as="p"
                        className="text-body text-muted mt-5 max-w-[52ch]"
                      >
                        {item.summary}
                      </Box>
                    )}
                    {item.highlights && (
                      <Box
                        as="h4"
                        className="font-mono text-eyebrow text-paper mt-6 uppercase"
                      >
                        {item.kind === "education" ? "Focus Areas" : "Responsibilities"}
                      </Box>
                    )}
                    {item.highlights && (
                      <Box
                        as="ul"
                        className="text-body text-muted marker:text-accent mt-3 grid list-disc gap-2 pl-5"
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
                        {item.stack.map((tech) => {
                          const TechIcon = TECH_ICONS[tech];
                          return (
                            <Box
                              as="li"
                              key={tech}
                              className="border-line font-mono text-meta text-muted flex items-center gap-1.5 rounded-full border px-2.5 py-0.5"
                            >
                              {TechIcon && (
                                <TechIcon
                                  aria-hidden
                                  className="size-3"
                                />
                              )}
                              {tech}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                    {/* The rim (owner ask 2026-07-24) — ONE ring, because a
                        rounded corner needs one: the straight bottom bar +
                        1px side ticks this replaces were cut off by the
                        card's own `rounded-card overflow-hidden` exactly
                        where the curve starts, leaving the corners bare.
                        Border-only element + a vertical mask fade IS a
                        gradient border (no `mask-composite` punch-out needed
                        — there's no background to subtract), and it follows
                        the radius for free. */}
                    <Box
                      aria-hidden
                      className="rounded-card pointer-events-none absolute inset-0"
                      style={{
                        border: `${JOURNEY.card.rimWidth} solid color-mix(in oklab, var(--color-accent-deep) ${JOURNEY.card.rimOpacity}%, transparent)`,
                        maskImage: RIM_FADE,
                        WebkitMaskImage: RIM_FADE,
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
