import { lazy, Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Box, ChapterEyebrow, Image } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { channels, stageState } from "@/features/home/components/manifesto-3d/channels";
import { ModelErrorBoundary } from "@/features/home/components/manifesto-3d/ModelErrorBoundary";
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
/** The window is born as a small centered box and zooms to full-bleed. */
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
              {wordIndex < words.length - 1 ? " " : ""}
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

/** 02 — Manifesto: WebGL MacBook scroll-story (PROMPT #4).
 *
 *  A live window is born between the hero's two name rows (T1 "seam": hero
 *  pinned, the fixed stage's clip-path expands from the slot rect to full
 *  viewport while the rows ride off-screen), then the pinned stage plays the
 *  MacBook choreography (T2 master scrub tweens the `channels` singleton —
 *  the render loop damps toward it): closed hold → lid opens facing away
 *  (logo beat) → 180° reveal turn onto the lit wallpaper → statement over the
 *  receded machine → blur+ember veil out of which About resolves.
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
      const nameRows = gsap.utils.toArray<HTMLElement>(".hero-name > span", hero);
      const heroItems = gsap.utils.toArray<HTMLElement>(".hero-item, .hero-bar", hero);
      const heroName = hero.querySelector<HTMLElement>(".hero-name");
      if (import.meta.env.DEV && nameRows.length !== 2) {
        console.warn("manifesto seam: hero name rows not found — row choreography skipped");
      }

      // Row exit distances via accumulated offsets, never gBCR: offsets are
      // transform-independent (pointer parallax, pin park position after a
      // mid-page refresh). Accumulated because the parallax transform on
      // .hero-name makes the h1 an offsetParent — a single hop would measure
      // against it.
      const rowTop = (row: HTMLElement) => {
        let top = 0;
        for (let el: HTMLElement | null = row; el && el !== hero; el = el.offsetParent as HTMLElement | null) {
          top += el.offsetTop;
        }
        return top + Math.min(0, window.innerHeight - hero.offsetHeight);
      };

      // The window is born as a small centered box: the border radius is
      // pre-divided by the scale so its VISUAL rounding equals the radius
      // token while small, then relaxes to square as it reaches full-bleed.
      const radiusToken = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--radius-lg"));
      const boxRadius = `${((Number.isNaN(radiusToken) ? 8 : radiusToken) / SEAM_BOX_SCALE).toFixed(0)}px`;

      // Initial states via gsap.set (the CSS classes only carry safe pre-JS
      // defaults: stage transparent, veil transparent). Hidden at load —
      // the window only exists once the seam summons it.
      gsap.set(stage, {
        autoAlpha: 0,
        scale: SEAM_BOX_SCALE,
        borderRadius: boxRadius,
        transformOrigin: "50% 50%",
      });
      gsap.set(glow, { opacity: 0.35 });
      gsap.set(copy, { autoAlpha: 0 });
      gsap.set(words, { opacity: 0.15 });
      gsap.set(veil, { opacity: 0 });

      // Stage lifecycle: hidden at rest (T1's scrub owns the appearance),
      // alive from just before the zoom-in through P5, hidden past the
      // manifesto. The render loop only runs while the stage could be seen;
      // derived from progress on update AND refresh so a mid-page load
      // (scrollRestoration) lands correct without crossing edges. Declared
      // before both triggers — their onRefresh can fire during creation.
      let seamStarted = false;
      let stageVisible = true;
      const syncActive = () => {
        stageState.active = seamStarted && stageVisible;
      };
      const syncStageActive = (seamProgress: number) => {
        // pre-warm slightly before the box appears so the first visible
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

      // T1 — the seam: hero pinned from scroll 0. Nothing shows for the first
      // half-viewport of scroll; then the window zooms in as a small centered
      // box and expands to full-bleed while the name rows exit and the chrome
      // fades.
      const seam = gsap.timeline({
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
      seam
        .fromTo(stage, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.08 }, SEAM_APPEAR)
        .fromTo(stage, { scale: SEAM_BOX_SCALE }, { scale: 1, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
        .fromTo(stage, { borderRadius: boxRadius }, { borderRadius: "0px", duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
        .fromTo(channels, { sceneIntro: 0 }, { sceneIntro: 1, duration: 1 - SEAM_APPEAR }, SEAM_APPEAR)
        .to(glow, { opacity: 1, duration: 0.5 }, 0.5);
      if (heroName) seam.to(heroName, { x: 0, y: 0, duration: 0.05 }, SEAM_APPEAR - 0.07);
      if (nameRows.length === 2) {
        seam
          .to(nameRows[0], { y: () => -(rowTop(nameRows[0]) + nameRows[0].offsetHeight), duration: 0.45 }, 0.5)
          .to(
            nameRows[1],
            { y: () => window.innerHeight - rowTop(nameRows[1]) + nameRows[1].offsetHeight, duration: 0.45 },
            0.5,
          );
      }
      if (heroItems.length) {
        seam.to(heroItems, { autoAlpha: 0, duration: 0.25, immediateRender: false }, 0.4);
      }

      // T2 — master scrub across the 520vh runway. No invalidateOnRefresh:
      // every value here is a resolution-independent 0→1 abstraction, and
      // invalidating plain-object tweens mid-scrub re-records drifted starts.
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
        stageState.active = true;
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Reduced motion: no pins, no seam, no canvas, no veil — a normal static
  // chapter (the hero slot carries the poster strip separately, spec §9).
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
            className="w-full max-w-3xl rounded-lg"
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
          Hidden at load (opacity-0 pre-JS default) — the seam summons it as
          a small centered box that zooms to full-bleed at half a viewport of
          scroll. Purely visual — pointer-events pass through to the page. */}
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
