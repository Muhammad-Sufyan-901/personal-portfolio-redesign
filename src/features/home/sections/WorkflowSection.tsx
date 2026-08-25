import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { BugPlay, Code2, PencilRuler, RefreshCw, Search, type LucideIcon } from "lucide-react";
import { Box, ChapterEyebrow } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { WORKFLOW_LEDE, WORKFLOW_STATEMENT, workflowSteps } from "@/features/home/data/workflow.data";
import { WORKFLOW } from "@/features/home/utils/workflow.tunables";
import type { WorkflowIconKey } from "@/types/portfolio";

/** Key → component, kept HERE rather than in the data file so `portfolio.ts`
 *  never has to import React or lucide (`tech-icons.ts` precedent). A key with
 *  no entry fails compilation, which is the whole point of the string union. */
const STEP_ICONS: Record<WorkflowIconKey, LucideIcon> = {
  discover: Search,
  shape: PencilRuler,
  build: Code2,
  verify: BugPlay,
  sustain: RefreshCw,
};

const pad2 = (value: number) => String(value).padStart(2, "0");
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

// StatementWords pattern (Achievements/Articles/Gallery precedent): RevealText
// can't carry nested emphasis — split-type treats a nested span as one atomic
// unit — so the focal words have to be React-owned markup, split at module scope.
const statementWords = WORKFLOW_STATEMENT.text.split(" ");
const focalWords = new Set(WORKFLOW_STATEMENT.focalWords.map((word) => word.toLowerCase()));
const isFocalWord = (word: string) => focalWords.has(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());

// Pin budget, resolved once at module scope: an opening beat (cascade → read →
// handoff), then the travel, then a real rest beat. The playhead maps onto
// TRAVEL_FRAC only, which is what makes the tail an actual hold rather than
// Articles' slow-down.
const lastIndex = workflowSteps.length - 1;
const P = WORKFLOW.pin;
const HEAD_VH = P.cascadeVh + P.readVh + P.handoffVh;
const TOTAL_VH = HEAD_VH + P.perStepVh * lastIndex + P.tailVh;
const HEAD_FRAC = HEAD_VH / TOTAL_VH;
const TRAVEL_FRAC = (P.perStepVh * lastIndex) / TOTAL_VH;

// introTl positions, DERIVED as shares of the opening beat rather than written
// as literals. They therefore sum to exactly 1 by construction — which is the
// property `introTl.progress(p / HEAD_FRAC)` depends on, and the property the
// first build broke by hand-placing "0.55" against a timeline that had silently
// grown to 2.12s. Retuning `readVh` now moves all three together.
const CASCADE_END = P.cascadeVh / HEAD_VH;
const HANDOFF_AT = (P.cascadeVh + P.readVh) / HEAD_VH;
const HANDOFF_DUR = P.handoffVh / HEAD_VH;
const WORD_SPREAD = CASCADE_END * WORKFLOW.heading.spreadRatio;
const WORD_DURATION = CASCADE_END - WORD_SPREAD;

/** 10 Workflow — the five steps every build runs through, as a pinned rail
 *  (owner reference `reference/workflow-reference.mp4`).
 *
 *  Not a PRD chapter: see the provenance banner in `workflow.data.ts`.
 *
 *  THE INVERSION worth understanding before editing this. The reference reads
 *  as "a rail sliding left", but building it that way puts five chapter-scale
 *  titles inside one transformed track at ~190px spacing — they overlap, and
 *  each needs a counter-translation write to stay legible. So nothing here
 *  translates as a group: every step is an `absolute inset-0` overlay of the
 *  whole stage, and only its `.wf-travel` cluster (disc + bubble) takes the
 *  per-frame `x`. `.wf-copy` sits at a fixed centred position and merely
 *  crossfades. Same picture, one list, no counter-translation, no measurement.
 *
 *  Settled state is the MARKUP default (Achievements precedent) — all five
 *  steps render filled and legible, and only the motion branch idles them. That
 *  is what makes the reduced-motion path a readable vertical list for free. */
export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Reduced motion is the ONLY static trigger. Articles' `fitsInView` guard
  // does not port: a rail's travel here is `lastIndex × gap`, which is always
  // positive, so there is no degenerate case to detect. And `gap.min` keeps
  // both neighbours on screen at 390px, so there is no mobile branch either.
  const staticMode = prefersReducedMotion;

  useGSAP(
    () => {
      if (staticMode) return;

      const setters = gsap.utils
        .toArray<HTMLElement>(".wf-step")
        .map((step) => {
          const travel = step.querySelector<HTMLElement>(".wf-travel");
          const disc = step.querySelector<HTMLElement>(".wf-disc");
          const on = step.querySelector<HTMLElement>(".wf-on");
          const bubble = step.querySelector<HTMLElement>(".wf-bubble");
          const copy = step.querySelector<HTMLElement>(".wf-copy");
          if (!travel || !disc || !on || !bubble || !copy) return null;

          // Centring lives in the transform, not in a Tailwind -translate class:
          // GSAP owns the whole `transform` string on these nodes, so a class
          // translate would be overwritten on the first write (Gallery idiom).
          gsap.set(travel, { xPercent: -50, yPercent: -50 });
          gsap.set(bubble, { xPercent: -50, yPercent: -50 });
          gsap.set(copy, { xPercent: -50 });

          return {
            travel,
            copy,
            x: gsap.quickSetter(travel, "x", "px"),
            // scaleX/scaleY, never "scale" — the shorthand silently no-ops in
            // quickSetter (already documented at GallerySection.tsx:105).
            sx: gsap.quickSetter(disc, "scaleX"),
            sy: gsap.quickSetter(disc, "scaleY"),
            // Halo + fill + ember dot + numeral share this wrapper, so the
            // whole "active" look is ONE opacity write per step per frame.
            on: gsap.quickSetter(on, "opacity"),
            by: gsap.quickSetter(bubble, "y", "px"),
            a: gsap.quickSetter(step, "opacity"),
            ca: gsap.quickSetter(copy, "opacity"),
            cf: gsap.quickSetter(copy, "filter"),
            lastBlur: -1,
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

      if (setters.length === 0) return;

      let gap = 0;
      const measure = () => {
        gap = gsap.utils.clamp(WORKFLOW.gap.min, WORKFLOW.gap.max, window.innerWidth * WORKFLOW.gap.vw);
      };
      measure();

      // Opening beat, one paused timeline scrubbed off raw pin progress (no
      // second ScrollTrigger — Gallery/Articles precedent): the statement
      // de-veils across the first half, then the whole intro card blurs away
      // and the rail fades up. Everything is visible by markup default; this
      // branch is the only thing that hides any of it.
      const intro = sectionRef.current?.querySelector<HTMLElement>(".wf-intro");
      const rail = sectionRef.current?.querySelector<HTMLElement>(".wf-rail");
      const words = gsap.utils.toArray<HTMLElement>(".wf-word");

      // Plain opacity, never autoAlpha, anywhere in this chapter: autoAlpha
      // resolves to `visibility: hidden`, which deletes the node from the
      // accessibility tree — and four of five process steps plus the chapter's
      // own h2 spend most of this pin at opacity 0. Nothing here is
      // interactive, so opacity alone costs nothing.
      gsap.set(words, { opacity: 0, filter: `blur(${WORKFLOW.heading.blurFrom}px)` });
      if (rail) gsap.set(rail, { opacity: 0 });

      const H = WORKFLOW.heading;

      const introTl = gsap.timeline({ paused: true });
      introTl.to(
        words,
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: WORD_DURATION,
          // `stagger.amount`, NOT a per-word number — see the tunables' note.
          // `amount` spreads the starts across a fixed window, so the cascade's
          // length never depends on how many words the statement has.
          stagger: { amount: WORD_SPREAD },
          ease: "none",
        },
        0,
      );
      // Blur is finite: drop the filter entirely once the cascade has landed,
      // so a display-scale heading isn't left on a filtered layer.
      introTl.set(words, { filter: "none" }, CASCADE_END);
      // CASCADE_END → HANDOFF_AT is the READ BEAT — deliberately empty. Nothing
      // is scheduled across it, which is exactly what makes it a hold: the
      // statement sits fully revealed and the rail sits at zero for `readVh` of
      // scroll (~1s at a normal scroll rate). Lengthen it with `pin.readVh`
      // alone; every position here is derived, so nothing else moves.
      if (intro) {
        introTl.to(
          intro,
          { opacity: 0, filter: `blur(${H.blurFrom + 2}px)`, duration: HANDOFF_DUR, ease: "none" },
          HANDOFF_AT,
        );
      }
      if (rail) introTl.to(rail, { opacity: 1, duration: HANDOFF_DUR, ease: "none" }, HANDOFF_AT);

      // The progress mapping below assumes a 1.0-long timeline. Fail loudly in
      // dev rather than shipping another silent desync.
      if (import.meta.env.DEV && Math.abs(introTl.duration() - 1) > 1e-6) {
        console.warn(`[workflow] introTl duration is ${introTl.duration()}, expected 1 — check WORKFLOW.heading.`);
      }

      const { discScaleFrom: FROM, farAlpha: FAR, alphaSpan, copyBand, liftPx, blurPx } = WORKFLOW;

      const apply = (progress: number) => {
        const playhead = clamp01((progress - HEAD_FRAC) / TRAVEL_FRAC) * lastIndex;

        for (let i = 0; i < setters.length; i += 1) {
          const s = setters[i];
          const distance = Math.abs(i - playhead);

          s.x((i - playhead) * gap);

          // Activeness, smoothstepped. Linear read as mush through the
          // crossfade; smoothstep(0.5) is still exactly 0.5, so the two
          // neighbours' opacities sum to 1 at mid-transit and the fold never
          // dips dark between steps.
          const smoothstep = (t: number) => t * t * (3 - 2 * t);
          const e = smoothstep(1 - Math.min(1, distance));

          const scale = FROM + (1 - FROM) * e;
          s.sx(scale);
          s.sy(scale);
          s.on(e);
          s.by(-liftPx * e);

          // Ambient fade over a wider span than the morph, so a step two slots
          // out ghosts on the track instead of hard-cutting at the neighbour
          // boundary.
          s.a(FAR + (1 - FAR) * (1 - Math.min(1, distance / alphaSpan)));

          // The copy runs on its OWN, narrower band — see `copyBand`. Sharing
          // the node's band stacks two half-lit titles on each other mid-transit
          // and reads as a smear; the reference goes fully dark between titles.
          const ec = smoothstep(Math.max(0, 1 - distance / copyBand));
          s.ca(ec);
          // The one expensive write, so it is guarded twice: only steps inside
          // the (narrow) copy band ever carry a filter at all, and the string is
          // only rewritten when the rounded px value actually changes.
          // Everything else parks on "none".
          const blur = ec === 0 ? 0 : Math.round((1 - ec) * blurPx);
          if (blur !== s.lastBlur) {
            s.lastBlur = blur;
            s.cf(blur === 0 ? "none" : `blur(${blur}px)`);
          }
        }
      };

      const state = { target: 0, rendered: 0, converged: true };

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * TOTAL_VH),
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          state.target = self.progress;
          // Mandatory. Without it the tick's converged early-return holds
          // old-viewport `gap` px through the `document.fonts.ready` refresh and
          // every resize — the exact trap SkillsSection documents.
          state.converged = false;
        },
        onUpdate: (self) => {
          state.target = self.progress;
          introTl.progress(clamp01(self.progress / HEAD_FRAC));
        },
        // Promoted only while the pin is live, so the compositor isn't holding
        // layers for a chapter nobody is looking at. `filter` is deliberately
        // NOT in this list — a permanently promoted chapter-scale blurred text
        // layer is the cost the blur guard above exists to avoid.
        onToggle: (self) => {
          for (const s of setters) {
            s.travel.style.willChange = self.isActive ? "transform" : "";
            s.copy.style.willChange = self.isActive ? "opacity" : "";
          }
        },
      });

      // Damped applier on the single gsap.ticker (Gallery/Articles precedent —
      // no second RAF): chases the scrub target, lands one exact write on
      // convergence, then idles. Freeze-on-pause and exact reverse retrace come
      // free with it.
      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime / 1000, 1 / 30);
        const k = 1 - Math.exp(-WORKFLOW.damp * dt);
        state.rendered += (state.target - state.rendered) * k;
        if (Math.abs(state.target - state.rendered) < 1e-4) {
          if (state.converged) return;
          state.rendered = state.target;
          state.converged = true;
        } else {
          state.converged = false;
        }
        apply(state.rendered);
      };
      gsap.ticker.add(tick);
      apply(0);

      return () => {
        gsap.ticker.remove(tick);
        st.kill();
        // quickSetter writes bypass the GSAP context, so `revertOnUpdate` does
        // NOT clear them. Without this, toggling the OS reduced-motion switch
        // mid-session leaves the static list wearing translated, faded, blurred
        // inline styles. (Articles and Gallery have the same latent hole —
        // separate follow-up, not this chapter's job.)
        gsap.set([".wf-step", ".wf-travel", ".wf-disc", ".wf-on", ".wf-bubble", ".wf-copy", ".wf-word"], {
          clearProps: "all",
        });
      };
    },
    { scope: sectionRef, dependencies: [staticMode], revertOnUpdate: true },
  );

  // A one-step rail would eat ~4 viewports of pinned scroll to move nothing.
  if (workflowSteps.length < 2) return null;

  return (
    <Box
      as="section"
      id="workflow"
      ref={sectionRef}
      className={cn("bg-ink relative", staticMode ? "px-page-x py-section" : "h-svh overflow-hidden")}
    >
      {/* 1×1 grid stack in the pinned branch: the intro card and the rail
          occupy the same cell, so the intro can blur away exactly where the
          rail arrives instead of scrolling off above it. */}
      <Box className={cn(!staticMode && "grid h-full")}>
        <Box
          className={cn(
            "wf-intro",
            // pointer-events-none because at rest this card sits transparent
            // ON TOP of the rail. Nothing in it is interactive, so nothing is
            // lost — but without this it would swallow the whole stage.
            !staticMode && "px-page-x pointer-events-none z-10 col-start-1 row-start-1 grid place-items-center",
          )}
        >
          <Box className={cn(!staticMode && "max-w-[46rem] text-center")}>
            <ChapterEyebrow
              index="10"
              label="How I Work"
            />
            {/* Box as="h2" + token classes, not Heading: Heading's
                default-variant responsive sizes survive twMerge over the fluid
                --text-* tokens (documented in the Journey build). */}
            <Box
              as="h2"
              className={cn(
                "font-display-lead text-statement text-paper mt-6",
                staticMode ? "max-w-[30ch]" : "mx-auto",
              )}
            >
              {statementWords.map((word, i) => (
                <Fragment key={i}>
                  <Box
                    as="span"
                    className={cn("wf-word inline-block", isFocalWord(word) && "font-display-tail italic")}
                  >
                    {word}
                  </Box>
                  {i < statementWords.length - 1 ? " " : ""}
                </Fragment>
              ))}
            </Box>
            {/* Short viewports give their pixels to the rail (Articles
                precedent) — the lede is the first thing that can go. */}
            <Box
              as="p"
              className={cn(
                "text-body text-muted mt-5 max-w-[52ch] [@media(max-height:768px)]:hidden",
                !staticMode && "mx-auto",
              )}
            >
              {WORKFLOW_LEDE}
            </Box>
          </Box>
        </Box>

        <Box className={cn("wf-rail", !staticMode && "relative col-start-1 row-start-1")}>
          {/* The track. It needs no animation at all: the active node is always
              at horizontal centre, so the traversed/ahead boundary is
              permanently at 50% — two static halves beat any mask or scaleX on
              both cost and code, and scaling a repeating gradient would stretch
              the dash pattern anyway. The phase discontinuity at the seam sits
              under the 112px disc that is always parked exactly there.
              Underscores are required in arbitrary values (GallerySection:275). */}
          {!staticMode && (
            <Box
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-[45%] h-px"
            >
              <Box className="absolute inset-y-0 left-0 w-1/2 bg-[repeating-linear-gradient(to_right,var(--color-line-strong)_0_10px,transparent_10px_16px)] opacity-60" />
              <Box className="absolute inset-y-0 left-1/2 w-1/2 bg-[repeating-linear-gradient(to_right,var(--color-line)_0_6px,transparent_6px_18px)]" />
            </Box>
          )}

          {/* role="list" is not redundant: Tailwind preflight sets
              list-style:none, and Safari/VoiceOver drops list semantics when it
              does — on an ordered process that is the one thing AT must keep. */}
          <Box
            as="ol"
            role="list"
            className={cn(staticMode ? "border-line mt-14 border-t" : "absolute inset-0")}
          >
            {workflowSteps.map((step, i) => {
              const Icon = STEP_ICONS[step.icon];
              return (
                <Box
                  as="li"
                  key={step.title}
                  className={cn(
                    "wf-step",
                    staticMode
                      ? "border-line grid grid-cols-[auto_1fr] items-center gap-x-6 border-b py-8"
                      : "pointer-events-none absolute inset-0",
                  )}
                >
                  <Box
                    className={cn("wf-travel", staticMode ? "flex items-center gap-4" : "absolute top-[45%] left-1/2")}
                  >
                    {/* No border on the disc. At neighbour distance its fill is
                        at opacity 0 and the bubble alone reads as the
                        reference's small outlined circle — a bordered disc
                        would double that ring. */}
                    <Box className={cn("wf-disc relative rounded-full", staticMode ? "size-14" : "size-32")}>
                      <Box className="wf-on absolute inset-0">
                        {!staticMode && (
                          <Box
                            aria-hidden
                            className="bg-paper/8 absolute -inset-2 rounded-full"
                          />
                        )}
                        <Box
                          aria-hidden
                          className="bg-paper absolute inset-0 rounded-full"
                        />
                        {/* The chapter's one ember object besides the eyebrow
                            index: a 4px connector between disc and bubble,
                            visible only while a step is centred. A 112px ember
                            disc would be a wash, not a scalpel. */}
                        {!staticMode && (
                          <Box
                            aria-hidden
                            className="bg-accent absolute -top-3 left-1/2 size-1 -translate-x-1/2 rounded-full"
                          />
                        )}
                        {/* font-sans font-medium, not font-display: Instrument
                            Serif ships weight 400 only and the reference
                            numeral is bold. aria-hidden because it duplicates
                            the sr-only ordinal on the heading below. */}
                        <Box
                          as="span"
                          aria-hidden
                          className={cn(
                            "text-ink absolute inset-0 grid place-items-center font-sans font-medium tabular-nums",
                            staticMode ? "text-item" : "text-statement",
                          )}
                        >
                          {pad2(i + 1)}
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      className={cn(
                        "wf-bubble border-line bg-ink grid size-12 shrink-0 place-items-center rounded-full border",
                        !staticMode && "absolute top-1/2 left-1/2",
                      )}
                    >
                      <Icon
                        aria-hidden
                        className="text-muted size-5"
                      />
                    </Box>
                  </Box>

                  <Box
                    className={cn(
                      "wf-copy",
                      !staticMode &&
                        "absolute top-[calc(45%+8rem)] left-1/2 w-[min(88vw,46rem)] text-center [@media(max-height:768px)]:top-[calc(45%+5.5rem)]",
                    )}
                  >
                    <Box
                      as="h3"
                      className={cn(
                        "font-sans font-medium",
                        staticMode ? "text-item text-paper-bright" : "text-chapter text-paper-bright text-balance",
                      )}
                    >
                      {/* Stated once, AT-independently — no reliance on
                          aria-posinset, and it cannot double-announce because
                          the visible numeral is aria-hidden. */}
                      <Box
                        as="span"
                        className="sr-only"
                      >
                        {`Step ${i + 1}. `}
                      </Box>
                      {step.title}
                    </Box>

                    {!staticMode && (
                      <Box
                        as="p"
                        aria-hidden
                        className="font-mono text-meta text-faint my-4 [@media(max-height:768px)]:my-2"
                      >
                        — • —
                      </Box>
                    )}

                    {/* 64ch, not the house 52ch: the copy grew to two sentences
                        (owner ask 2026-08-26) and at 52ch that is four lines on
                        the fold, which pushes the chip row off a 1024x600
                        viewport. Wider measure, fewer lines — horizontal room is
                        exactly what is abundant here. */}
                    <Box
                      as="p"
                      className={cn("text-body text-muted", staticMode ? "mt-2 max-w-[68ch]" : "mx-auto max-w-[64ch]")}
                    >
                      {step.description}
                    </Box>

                    {/* What the step produces. Hairline chips, deliberately
                        quiet — they are texture under the description, not a
                        second heading, so they get `text-meta`/`text-faint` and
                        no ember. Hidden on short viewports (the lede's rule):
                        this is the first thing that can go, which is why the
                        data file forbids anything load-bearing here. */}
                    {step.detail.length > 0 && (
                      <Box
                        as="ul"
                        role="list"
                        className={cn(
                          "flex flex-wrap items-center gap-2",
                          staticMode ? "mt-4" : "mt-6 justify-center [@media(max-height:768px)]:hidden",
                        )}
                      >
                        {step.detail.map((label) => (
                          <Box
                            as="li"
                            key={label}
                            /* text-muted, NOT text-faint. These are announced
                               list items, not ornament — and `--text-meta` is
                               12px, so they need 4.5:1. faint measures 2.34:1
                               on ink; muted measures 7.04:1. They still read
                               quieter than the description because they are a
                               third of its size, not because they are dimmer. */
                            className="border-line text-muted font-mono text-meta rounded-full border px-3 py-1 uppercase"
                          >
                            {label}
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
