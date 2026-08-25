import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { achievements, ACHIEVEMENTS_STATEMENT } from "@/features/home/data/achievements.data";
import { ACHIEVEMENTS } from "@/features/home/utils/achievements.tunables";

const pad2 = (value: number) => String(value).padStart(2, "0");

// StatementWords pattern (Gallery/Journey/Articles precedent): RevealText can't
// carry nested emphasis — split-type treats a nested span as one atomic unit —
// so the focal words have to be React-owned markup, split at module scope.
const statementWords = ACHIEVEMENTS_STATEMENT.text.split(" ");
const focalWords = new Set(ACHIEVEMENTS_STATEMENT.focalWords.map((word) => word.toLowerCase()));
const isFocalWord = (word: string) => focalWords.has(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());

/** 09 Achievements — PRD §3.5 as a flat four-column table whose rows fill with
 *  a light bar wiping in from the left (owner reference
 *  `reference/achievement-refine.mp4`).
 *
 *  Why a table and not cards: §3.5 carries title/issuer/date and no imagery.
 *  These lived in 08 Journey until 2026-08-25 as ember pills with a hover panel
 *  whose entire body was PLACEHOLDER text — the form was asking for content the
 *  PRD does not have. A table asks for exactly three facts.
 *
 *  The inversion is ONE `mix-blend-difference` bar over neutral text, not a
 *  duplicated ink copy: invert-bg differenced over ink stays a light panel and
 *  over paper collapses to near-ink, so the flip lands on the bar's moving edge
 *  mid-glyph, which is what the reference does. Two things fall out of it and
 *  are load-bearing: the section root needs `isolate` (the blend must resolve
 *  against this section's own bg-ink, not the page), and NO coloured text may
 *  sit under the bar — accent-deep comes back cyan. The ember hover tick is
 *  therefore a sibling rendered AFTER the bar.
 *
 *  Settled state is the FILLED row, so the markup renders filled and the motion
 *  branch sets the idle state — reduced motion falls through to a readable
 *  static light table with no tweens. */
export function AchievementsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // Rows are filled by markup default (see the note above) — this branch is
      // the only thing that empties them.
      gsap.set(".ach-fill", { scaleX: 0 });
      gsap.set(".ach-text", { opacity: ACHIEVEMENTS.reveal.idleOpacity });

      const triggers = gsap.utils.toArray<HTMLElement>(".ach-row").map((row) => {
        const tl = gsap
          .timeline({ paused: true })
          .to(row.querySelector(".ach-fill"), {
            scaleX: 1,
            duration: ACHIEVEMENTS.reveal.duration,
            ease: ACHIEVEMENTS.reveal.ease,
          })
          .to(
            row.querySelector(".ach-text"),
            { opacity: 1, duration: ACHIEVEMENTS.reveal.duration, ease: "none" },
            "<",
          );

        // The reference does not just play once: a row empties again when it
        // leaves past `end` and refills on the way back. That is this one
        // string. The top-down wave is emergent — each row crosses its own
        // trigger line ~93px after the one above it.
        return ScrollTrigger.create({
          trigger: row,
          start: ACHIEVEMENTS.reveal.start,
          end: ACHIEVEMENTS.reveal.end,
          animation: tl,
          toggleActions: "play reverse play reverse",
        });
      });

      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="achievements"
      ref={sectionRef}
      className="bg-ink px-page-x py-section relative isolate"
    >
      <ChapterEyebrow
        index="09"
        label="Recognition"
      />

      {/* Owner ask 2026-08-25: Journey's h2 weight and size, and its statement
          grammar — `font-display-lead text-statement` with italic-serif focal
          words. Left-aligned against the table below; Journey centres its own
          because it sits over a centred timeline. No blur de-veil here: the
          rows already own this viewport's reveal, and two staggered entrances
          competing in one screen reads as noise. */}
      <Box
        as="h2"
        className="font-display-lead text-statement text-paper mt-6 max-w-[30ch]"
      >
        {statementWords.map((word, i) => (
          <Fragment key={i}>
            <Box
              as="span"
              className={cn("inline-block", isFocalWord(word) && "font-display-tail italic")}
            >
              {word}
            </Box>
            {i < statementWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Box>

      <Box
        as="ul"
        className="border-line mt-10 border-t"
      >
        {achievements.map((item, index) => (
          <Box
            as="li"
            key={`${item.title}-${item.period}`}
            className="ach-row group border-line relative border-b"
          >
            {/* px-4 is the reference's inset: its rows run the full page gutter but
                the first and last cells sit 16px inside the fill edge. */}
            <Box className="ach-text grid grid-cols-[2.5rem_1fr] items-center gap-y-1 px-4 py-8 md:grid-cols-[3.5rem_1fr_1.4fr_auto] md:gap-y-0">
              <Box
                as="span"
                className="font-mono text-index text-paper"
              >
                {pad2(index + 1)}
              </Box>
              <Box
                as="span"
                className="text-body text-paper"
              >
                {item.org}
              </Box>
              {/* On mobile the 4 tracks collapse to [index | stacked block], so
                  these two skip the index gutter rather than sitting under it. */}
              <Box
                as="span"
                className="text-body text-paper col-start-2 md:col-start-auto md:text-center"
              >
                {item.title}
              </Box>
              <Box
                as="span"
                className="font-mono text-index text-paper col-start-2 md:col-start-auto md:text-right md:font-sans md:text-body"
              >
                {item.period}
              </Box>
            </Box>

            {/* ABOVE the text on purpose: difference blends against its
                backdrop, so the text has to be underneath it. */}
            <Box
              aria-hidden
              className="ach-fill bg-invert-bg pointer-events-none absolute inset-0 origin-left mix-blend-difference"
            />

            {/* Outside the blend (renders after the bar) — ember under
                difference would come back cyan. */}
            <Box
              aria-hidden
              className="bg-accent-deep duration-(--dur-fast) pointer-events-none absolute inset-y-0 left-0 w-0 transition-[width] ease-out group-hover:w-[3px]"
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
