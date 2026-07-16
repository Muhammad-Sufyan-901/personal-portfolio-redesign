import { lazy, Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Box, ChapterEyebrow, Image } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { channels, stageState } from "@/features/home/components/manifesto-3d/channels";
import { ModelErrorBoundary } from "@/features/home/components/manifesto-3d/ModelErrorBoundary";
import { HERO_REFINE } from "@/features/home/sections/hero.tunables";
import macbookPoster from "@/assets/images/macbook-poster.webp";

const ManifestoCanvas = lazy(() =>
  import("@/features/home/components/manifesto-3d/ManifestoCanvas").then((m) => ({
    default: m.ManifestoCanvas,
  })),
);

/** ============ Tunables (spec §13) ============ */
/** Hero pin distance — the seam's scroll runway. */
const SEAM_LENGTH = "+=120%";
/** Seam progress where the hidden window appears (0.42 × 120% ≈ half a
 *  viewport of scroll — "halfway down the screen"). */
const SEAM_APPEAR = 0.42;
/** <lg only: the window is born as a small centered box and zooms to
 *  full-bleed (the shipped mobile grammar). ≥lg the window is clipped to the
 *  name's inline slot instead — see the seam matchMedia contexts. */
const SEAM_BOX_SCALE = 0.14;
/** Manifesto root height (the stage pin length) — set in the JSX class. */
const MANIFESTO_HEIGHT = "h-[520vh]";
/** Exit-veil max backdrop blur. */
const VEIL_BLUR_MAX = 24;
/** Master-timeline phase fractions (P1 closed hold / P2 lid / P3 turn /
 *  P4 statement / P5 veil — spec §4.3). */
const PHASE = {
  lid: { at: 0.08, dur: 0.26 },
  logoUp: { at: 0.1, dur: 0.18 },
  logoDown: { at: 0.34, dur: 0.12 },
  spill: { at: 0.2, dur: 0.1 },
  yaw: { at: 0.34, dur: 0.26 },
  screenFull: { at: 0.42, dur: 0.16 },
  recede: { at: 0.58, dur: 0.26 },
  copyIn: { at: 0.58, dur: 0.04 },
  words: { at: 0.6, dur: 0.06, window: 0.22 },
  veil: { at: 0.84 },
} as const;

/** Statement pre-split at module scope — static data, React owns the markup
 *  (the documented manifesto pattern: no split-type, no revert cost). */
const statementLines = profile.manifesto.lines.map((line) => line.split(" "));
const isFocalWord = (word: string) =>
  word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase() === profile.manifesto.focalWord.toLowerCase();

function StatementWords({ staticRender = false }: { staticRender?: boolean }) {
  return (
    <>
      {statementLines.map((words, lineIndex) => (
        <Box
          key={lineIndex}
          as="span"
          className="block"
        >
          {words.map((word, wordIndex) => (
            <Box
              key={wordIndex}
              as="span"
              className={cn(
                !staticRender && "manifesto-word",
                "inline-block",
                isFocalWord(word) && "bg-accent-tint text-accent -mx-1 rounded px-1",
              )}
            >
              {word}
              {wordIndex < words.length - 1 ? " " : ""}
            </Box>
          ))}
        </Box>
      ))}
    </>
  );
}

/** Poster stand-in that fills the stage when WebGL/GLB/chunk loading fails —
 *  the seam, statement and veil keep working around it (spec §9). */
function StagePoster() {
  return (
    <Image
      src={macbookPoster}
      alt=""
      priority="eager"
      className="h-full w-full"
    />
  );
}

/** 02 — Manifesto: WebGL MacBook scroll-story (PROMPT #4, seam re-rigged for
 *  the one-line hero name, v2.1).
 *
 *  T1 "seam" (hero pinned from scroll 0, breakpoint-split via matchMedia):
 *  ≥lg the fixed stage is CLIPPED to the name's inline slot rect — the gap
 *  between "Muh." and "Sufyan." — and the clip-path expands from that rect
 *  to full-bleed while the words exit horizontally (lead → left, tail →
 *  right); the stage keeps full layout size, so the canvas renders full-res
 *  from frame 1. <lg keeps the shipped grammar: a hidden centered box
 *  (scale 0.14) zooms to full-bleed while the stacked rows exit vertically.
 *  Then the pinned stage plays the MacBook choreography (T2 master scrub
 *  tweens the `channels` singleton — the render loop damps toward it):
 *  closed hold → lid opens facing away (logo beat) → 180° reveal turn onto
 *  the lit wallpaper → statement over the receded machine → blur+ember veil
 *  out of which About resolves.
 *
 *  The timelines never wait for the model: a late GLB damp-catches-up and the
 *  poster fallback keeps the full DOM sequence on WebGL failure. */
export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const section = sectionRef.current;
      const hero = document.getElementById("hero");
      const stage = section?.querySelector<HTMLElement>(".manifesto-stage");
      const glow = section?.querySelector<HTMLElement>(".manifesto-glow");
      const veil = section?.querySelector<HTMLElement>(".manifesto-veil");
      const copy = section?.querySelector<HTMLElement>(".manifesto-copy");
      if (!section || !hero || !stage || !glow || !veil || !copy) return;

      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word", section);
      const heroName = hero.querySelector<HTMLElement>(".hero-name");

      // Measurements via accumulated offsets, never gBCR: offsets are
      // transform-independent (pointer parallax, pin park position after a
      // mid-page refresh). Accumulated because the parallax transform on
      // .hero-name makes the h1 an offsetParent — a single hop would measure
      // against it.
      const accum = (el: HTMLElement, prop: "offsetTop" | "offsetLeft") => {
        let v = 0;
        for (let node: HTMLElement | null = el; node && node !== hero; node = node.offsetParent as HTMLElement | null) {
          v += node[prop];
        }
        return v;
      };
      const pinShift = () => Math.min(0, window.innerHeight - hero.offsetHeight);

      const radiusToken = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--radius-lg"));
      const radius = Number.isNaN(radiusToken) ? 8 : radiusToken;

      // Shared initial states via gsap.set (the CSS classes only carry safe
      // pre-JS defaults: stage transparent, veil transparent). The stage's
      // own initial state is per-breakpoint — set inside each seam context.
      gsap.set(glow, { opacity: 0.35 });
      gsap.set(copy, { autoAlpha: 0 });
      gsap.set(words, { opacity: 0.15 });
      gsap.set(veil, { opacity: 0 });

      // Stage lifecycle: hidden at rest (T1's scrub owns the appearance),
      // alive from just before the window opens through P5, hidden past the
      // manifesto. The render loop only runs while the stage could be seen;
      // derived from progress on update AND refresh so a mid-page load
      // (scrollRestoration) lands correct without crossing edges. Declared
      // before all triggers — their onRefresh can fire during creation.
      let seamStarted = false;
      let stageVisible = true;
      const syncActive = () => {
        stageState.active = seamStarted && stageVisible;
      };
      const syncStageActive = (seamProgress: number) => {
        // pre-warm slightly before the window appears so the first visible
        // frame isn't also the first rendered one
        seamStarted = seamProgress > SEAM_APPEAR - 0.1;
        syncActive();
      };
      const applyStageState = (self: ScrollTrigger) => {
        const visible = !(self.progress >= 1 && !self.isActive);
        if (visible !== stageVisible) {
          stageVisible = visible;
          // T1's scrub owns visibility before the stage region — only manage
          // the alpha here when inside/past the manifesto runway.
          if (!visible || self.progress > 0) gsap.set(stage, { autoAlpha: visible ? 1 : 0 });
        }
        syncActive();
      };

      // T1 — the seam: hero pinned from scroll 0; nothing shows for the
      // first half-viewport of scroll. The window's birth is breakpoint-
      // split (matchMedia contexts below); pin/scrub config is shared.
      const seamTimeline = () =>
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "clamp(bottom bottom)",
            end: SEAM_LENGTH,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => syncStageActive(self.progress),
            onRefresh: (self) => syncStageActive(self.progress),
          },
        });

      const mm = gsap.matchMedia();

      mm.add(HERO_REFINE.oneLineMinBp, () => {
        // ≥lg — the one-line name: the stage is clipped to the inline slot
        // rect (the door between the words) and expands to full-bleed while
        // the words ride horizontally off-screen. No scale — the canvas
        // keeps full layout size the whole way.
        const slot = hero.querySelector<HTMLElement>(".hero-slot");
        const wordEls = gsap.utils.toArray<HTMLElement>(".hero-name .hero-word", hero);
        const heroItems = gsap.utils.toArray<HTMLElement>(".hero-item, .hero-bar", hero);
        if (import.meta.env.DEV && (!slot || wordEls.length !== 2)) {
          console.warn("manifesto seam: hero slot/words not found — desktop seam degraded");
        }

        const fullClip = `inset(0px 0px 0px 0px round 0px)`;
        // Shape-matched inset(T R B L round r) strings on both ends — GSAP
        // needs identical shape/unit counts to interpolate a clip-path.
        const slotClip = () => {
          if (!slot) return fullClip;
          const top = accum(slot, "offsetTop") + pinShift();
          const left = accum(slot, "offsetLeft");
          const bottom = window.innerHeight - top - slot.offsetHeight;
          const right = window.innerWidth - left - slot.offsetWidth;
          return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${radius}px)`;
        };

        // Explicitly neutralize the other context's rig — matchMedia revert
        // does not reliably clear the inline styles across a live resize.
        gsap.set(stage, { autoAlpha: 0, clipPath: slotClip(), scale: 1, borderRadius: "0px" });

        const seam = seamTimeline();
        seam
          .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, SEAM_APPEAR)
          .fromTo(stage, { clipPath: slotClip }, { clipPath: fullClip, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
          .fromTo(channels, { sceneIntro: 0 }, { sceneIntro: 1, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
          .to(glow, { opacity: 1, duration: 0.5 }, 0.5);
        if (heroName) seam.to(heroName, { x: 0, y: 0, duration: 0.05 }, SEAM_APPEAR - 0.07);
        if (slot && wordEls.length === 2) {
          seam
            .to(
              wordEls[0],
              {
                x: () => HERO_REFINE.seam.wordExit.leadX * (accum(wordEls[0], "offsetLeft") + wordEls[0].offsetWidth),
                duration: 0.45,
              },
              0.5,
            )
            .to(
              wordEls[1],
              {
                x: () => HERO_REFINE.seam.wordExit.tailX * (window.innerWidth - accum(wordEls[1], "offsetLeft")),
                duration: 0.45,
              },
              0.5,
            );
        }
        if (heroItems.length) {
          seam.to(heroItems, { autoAlpha: 0, duration: 0.25, immediateRender: false }, 0.4);
        }
      });

      mm.add(`not all and ${HERO_REFINE.oneLineMinBp}`, () => {
        // <lg — the shipped grammar, unchanged: the window is born as a
        // small centered box (visual rounding pre-divided by the scale so it
        // equals the radius token while small) and zooms to full-bleed while
        // the stacked rows exit vertically.
        const rows = gsap.utils.toArray<HTMLElement>(".hero-name .hero-word", hero);
        const heroItems = gsap.utils.toArray<HTMLElement>(".hero-item, .hero-bar", hero);
        if (import.meta.env.DEV && rows.length !== 2) {
          console.warn("manifesto seam: hero name rows not found — row choreography skipped");
        }
        const rowTop = (row: HTMLElement) => accum(row, "offsetTop") + pinShift();
        const boxRadius = `${(radius / SEAM_BOX_SCALE).toFixed(0)}px`;

        // clipPath cleared for the same live-resize reason as the ≥lg set.
        gsap.set(stage, {
          autoAlpha: 0,
          scale: SEAM_BOX_SCALE,
          borderRadius: boxRadius,
          transformOrigin: "50% 50%",
          clipPath: "none",
        });

        const seam = seamTimeline();
        seam
          .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, SEAM_APPEAR)
          .fromTo(stage, { scale: SEAM_BOX_SCALE }, { scale: 1, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
          .fromTo(stage, { borderRadius: boxRadius }, { borderRadius: "0px", duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
          .fromTo(channels, { sceneIntro: 0 }, { sceneIntro: 1, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
          .to(glow, { opacity: 1, duration: 0.5 }, 0.5);
        if (heroName) seam.to(heroName, { x: 0, y: 0, duration: 0.05 }, SEAM_APPEAR - 0.07);
        if (rows.length === 2) {
          seam
            .to(rows[0], { y: () => -(rowTop(rows[0]) + rows[0].offsetHeight), duration: 0.45 }, 0.5)
            .to(rows[1], { y: () => window.innerHeight - rowTop(rows[1]) + rows[1].offsetHeight, duration: 0.45 }, 0.5);
        }
        if (heroItems.length) {
          seam.to(heroItems, { autoAlpha: 0, duration: 0.25, immediateRender: false }, 0.4);
        }
      });

      // T2 — master scrub across the 520vh runway. No invalidateOnRefresh:
      // every value here is a resolution-independent 0→1 abstraction, and
      // invalidating plain-object tweens mid-scrub re-records drifted starts.
      // Built once, outside the matchMedia split — the story is breakpoint-
      // agnostic (its {scale:1→1.05} veil tween is valid in both contexts:
      // ≥lg the seam never touches scale, <lg the seam ends at scale 1).
      const master = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: applyStageState,
          onRefresh: applyStageState,
        },
      });
      master
        .fromTo(channels, { lidProgress: 0 }, { lidProgress: 1, duration: PHASE.lid.dur }, PHASE.lid.at)
        .fromTo(channels, { logoGlow: 0 }, { logoGlow: 1, duration: PHASE.logoUp.dur }, PHASE.logoUp.at)
        .fromTo(
          channels,
          { logoGlow: 1 },
          { logoGlow: 0, duration: PHASE.logoDown.dur, immediateRender: false },
          PHASE.logoDown.at,
        )
        .fromTo(channels, { screenGlow: 0 }, { screenGlow: 0.25, duration: PHASE.spill.dur }, PHASE.spill.at)
        .fromTo(
          channels,
          { screenGlow: 0.25 },
          { screenGlow: 1, duration: PHASE.screenFull.dur, immediateRender: false },
          PHASE.screenFull.at,
        )
        .fromTo(channels, { yawProgress: 0 }, { yawProgress: 1, duration: PHASE.yaw.dur }, PHASE.yaw.at)
        .fromTo(channels, { recede: 0 }, { recede: 1, duration: PHASE.recede.dur }, PHASE.recede.at)
        .fromTo(copy, { autoAlpha: 0 }, { autoAlpha: 1, duration: PHASE.copyIn.dur }, PHASE.copyIn.at)
        .fromTo(
          words,
          { opacity: 0.15 },
          {
            opacity: 1,
            duration: PHASE.words.dur,
            stagger: { amount: PHASE.words.window - PHASE.words.dur },
          },
          PHASE.words.at,
        )
        .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.13 }, PHASE.veil.at)
        .fromTo(
          veil,
          { "--veil-blur": "0px" },
          { "--veil-blur": `${VEIL_BLUR_MAX}px`, duration: 1 - PHASE.veil.at },
          PHASE.veil.at,
        )
        .fromTo(stage, { scale: 1 }, { scale: 1.05, duration: 1 - PHASE.veil.at }, PHASE.veil.at);

      return () => {
        mm.revert();
        stageState.active = true;
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Reduced motion: no pins, no seam, no canvas, no veil — a normal static
  // chapter. ≥lg the poster strip lives in the hero's inline slot instead
  // (relocated placement, spec §9), so it renders here only below lg.
  if (prefersReducedMotion) {
    return (
      <Box
        as="section"
        id="manifesto"
        className="bg-ink relative px-page-x py-section"
      >
        <Box className="mx-auto flex max-w-4xl flex-col items-center gap-10 text-center">
          <ChapterEyebrow
            index="02"
            label="WHO I AM"
          />
          <Box
            as="h2"
            className="font-display text-statement text-paper"
          >
            <StatementWords staticRender />
          </Box>
          <Image
            src={macbookPoster}
            alt="An open MacBook, its screen glowing with a monochrome swirl wallpaper"
            width={1600}
            height={1000}
            className="w-full max-w-3xl rounded-lg lg:hidden"
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      as="section"
      id="manifesto"
      ref={sectionRef}
      className={cn("relative", MANIFESTO_HEIGHT, "-mt-[100svh]")}
    >
      {/* Fixed stage (z-20): ember horizon + transparent WebGL canvas.
          Hidden at load (opacity-0 pre-JS default) — the seam summons it
          through the name's inline slot (≥lg, clip-path) or as a small
          centered box (<lg, scale) at half a viewport of scroll. Purely
          visual — pointer-events pass through to the page. */}
      <Box
        aria-hidden
        role="presentation"
        className="manifesto-stage bg-ink pointer-events-none fixed inset-0 z-20 overflow-hidden opacity-0"
      >
        <Box className="manifesto-glow absolute inset-0 bg-[radial-gradient(ellipse_75%_50%_at_50%_95%,var(--color-accent-deep),transparent_65%)] blur-2xl" />
        <Box className="absolute inset-0">
          <ModelErrorBoundary fallback={<StagePoster />}>
            <Suspense fallback={null}>
              <ManifestoCanvas />
            </Suspense>
          </ModelErrorBoundary>
        </Box>
      </Box>

      {/* Sticky inner (z-30, above the stage): statement overlay + exit veil.
          The veil's own opacity/blur animate — never this wrapper's (an
          opacity<1 ancestor would become the backdrop root and the blur
          would stop sampling the canvas). */}
      <Box className="pointer-events-none sticky top-0 z-30 flex h-svh items-center justify-center overflow-hidden px-page-x">
        <Box className="manifesto-copy relative flex max-w-4xl flex-col items-center gap-6 text-center">
          <ChapterEyebrow
            index="02"
            label="WHO I AM"
          />
          <Box
            as="h2"
            className="font-display text-statement text-paper"
          >
            <StatementWords />
          </Box>
        </Box>
        <Box
          aria-hidden
          className="manifesto-veil to-ink from-accent-deep/25 absolute inset-0 z-10 bg-linear-to-t to-65% opacity-0 [backdrop-filter:blur(var(--veil-blur))]"
        />
      </Box>
    </Box>
  );
}
