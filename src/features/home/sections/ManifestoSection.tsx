import { Fragment, lazy, Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { Box, ChapterEyebrow, Image } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { channels, entry, stageState } from "@/features/home/utils/channels";
import { MANIFESTO_ENTRY } from "@/features/home/utils/manifesto.tunables";
import { ModelErrorBoundary } from "@/features/home/components/manifesto-3d/ModelErrorBoundary";
import macbookPoster from "@/assets/images/macbook-poster.webp";

const ManifestoCanvas = lazy(() =>
  import("@/features/home/components/manifesto-3d/ManifestoCanvas").then((m) => ({
    default: m.ManifestoCanvas,
  })),
);

/** ============ Story tunables (entry/veil numbers: manifesto.tunables) ============ */
/** Manifesto root height (the T2 stage-pin length) — set in the JSX class. */
const MANIFESTO_HEIGHT = "h-[520vh]";
/** Runway lengths in vh — MUST mirror MANIFESTO_ENTRY.t1Span ("+=200%") and
 *  MANIFESTO_HEIGHT; converts combined-runway fractions into T2 time. */
const RUNWAY_VH = { t1: 200, t2: 520 } as const;
/** Master-timeline phase fractions (P1 closed hold / P2 lid / P3 turn /
 *  P4 statement — spec §4.3). P5 veil timing lives in MANIFESTO_ENTRY.veil. */
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
} as const;

/** Statement pre-split at module scope — static data, React owns the markup
 *  (the documented manifesto pattern: no split-type, no revert cost). */
const statementLines = profile.manifesto.lines.map((line) => line.split(" "));
const isFocalWord = (word: string) =>
  word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase() === profile.manifesto.focalWord.toLowerCase();

/** D3 re-typeset: roman run in the lead grotesk, focal words in the tail
 *  serif-italic (+ the shipped ember wash). Inter-word spaces live as text
 *  nodes BETWEEN the inline-block spans — inside them they get swallowed. */
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
            <Fragment key={wordIndex}>
              <Box
                as="span"
                className={cn(
                  !staticRender && "manifesto-word",
                  "inline-block",
                  isFocalWord(word) && "font-display-tail bg-accent-tint text-accent -mx-1 rounded px-1 italic",
                )}
              >
                {word}
              </Box>
              {wordIndex < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </Box>
      ))}
    </>
  );
}

/** Poster stand-in that fills the stage when WebGL/GLB/chunk loading fails —
 *  the entry box, statement and veil keep working around it (spec §9). */
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

/** 02 — Manifesto: WebGL MacBook scroll-story behind a CENTER-BORN entry
 *  (2026-07-17 refine — supersedes the slot-rect seam).
 *
 *  T1 "entry" (hero pinned from scroll 0, breakpoint-agnostic): three scrubbed
 *  sub-beats tween the `entry` channels — b1 the h1 rises to the mid-viewport
 *  landing line while the chrome fades; b2 the stage appears at viewport
 *  center as a small rounded box (clip-path inset — the canvas keeps full
 *  layout size, so it renders full-res from frame 1); b3 the box grows
 *  monotonically to full-bleed WHILE the h1 zooms out around center at full
 *  opacity — justify-between spreads the two words, so the scale pushes lead
 *  left / tail right off-screen (the reference zoom-through; the z-20 stage
 *  occludes whatever remains) — and the lid cracks open over the growth tail
 *  (storyPrelude). A damp applier on gsap.ticker (the FrameDriver pattern —
 *  no second RAF) writes the DOM so the entry carries the same damped feel as
 *  the 3D story. Then the pinned stage plays the MacBook choreography (T2
 *  master scrub, lid picking up from the prelude): closed hold → lid opens
 *  facing away (logo beat) → 180° reveal turn onto the lit wallpaper →
 *  statement over the receded machine → the fast blur+ember veil out of which
 *  About resolves.
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
      const veilTint = section?.querySelector<HTMLElement>(".manifesto-veil-tint");
      const copy = section?.querySelector<HTMLElement>(".manifesto-copy");
      if (!section || !hero || !stage || !glow || !veil || !veilTint || !copy) return;

      const words = gsap.utils.toArray<HTMLElement>(".manifesto-word", section);
      const heroName = hero.querySelector<HTMLElement>(".hero-name");
      const heroItems = gsap.utils.toArray<HTMLElement>(".hero-item, .hero-bar", hero);
      if (import.meta.env.DEV && !heroName) {
        console.warn("manifesto entry: .hero-name not found — rise/fade degraded");
      }

      const {
        beats,
        chromeFade,
        riseToY,
        birth,
        exit: EXIT,
        storyPrelude: PRELUDE,
        damp: DAMP,
        veil: VEIL,
      } = MANIFESTO_ENTRY;

      // h1 measurement via accumulated offsets, never gBCR: offsets are
      // transform-independent (pointer parallax, pin park position after a
      // mid-page refresh). Accumulated because the parallax transform on
      // .hero-name makes the h1 an offsetParent — a single hop would measure
      // against it.
      const accumTop = (el: HTMLElement) => {
        let v = 0;
        for (let node: HTMLElement | null = el; node && node !== hero; node = node.offsetParent as HTMLElement | null) {
          v += node.offsetTop;
        }
        return v;
      };
      const pinShift = () => Math.min(0, window.innerHeight - hero.offsetHeight);
      /** px the h1 travels so its center rests on the riseToY landing line. */
      let riseDelta = 0;
      const measureRise = () => {
        if (!heroName) return;
        riseDelta = riseToY * window.innerHeight - (accumTop(heroName) + pinShift() + heroName.offsetHeight / 2);
      };
      measureRise();

      // Birth-box geometry — pure viewport math, zero DOM measurement (the
      // slot-rect machinery this grammar retired). minWPx floors phones,
      // maxHFrac caps short viewports.
      const birthRect = () => {
        const w = Math.max(birth.minWPx, (birth.wVw / 100) * window.innerWidth);
        const h = Math.min(w / birth.aspect, birth.maxHFrac * window.innerHeight);
        return { top: (window.innerHeight - h) / 2, left: (window.innerWidth - w) / 2, w, h };
      };
      /** Shape-matched inset(T R B L round r) from the centered birth rect to
       *  full-bleed at growth 1 (radius decays with the insets). */
      const clipAt = (growth: number) => {
        const b = birthRect();
        const inv = 1 - growth;
        const top = b.top * inv;
        const left = b.left * inv;
        const bottom = (window.innerHeight - b.top - b.h) * inv;
        const right = (window.innerWidth - b.left - b.w) * inv;
        return `inset(${top.toFixed(1)}px ${right.toFixed(1)}px ${bottom.toFixed(1)}px ${left.toFixed(1)}px round ${(birth.radius * inv).toFixed(1)}px)`;
      };

      // Shared initial states via gsap.set (the CSS classes only carry safe
      // pre-JS defaults: stage transparent, veil transparent).
      gsap.set(glow, { opacity: 0.35 });
      gsap.set(copy, { autoAlpha: 0 });
      gsap.set(words, { opacity: 0.15 });
      gsap.set(veil, { opacity: 0 });
      gsap.set(stage, { autoAlpha: 0, clipPath: clipAt(0) });

      // Stage lifecycle: hidden at rest (the entry applier owns the birth
      // appearance), alive from just before the box is born through P5,
      // hidden past the manifesto. Derived from progress on update AND
      // refresh so a mid-page load (scrollRestoration) lands correct without
      // crossing edges. Declared before both triggers — their onRefresh can
      // fire during creation.
      let entryStarted = false;
      let stageVisible = true;
      const syncActive = () => {
        stageState.active = entryStarted && stageVisible;
      };
      const syncEntryActive = (progress: number) => {
        // pre-warm slightly before the box is born so the first visible
        // frame isn't also the first rendered one
        entryStarted = progress > beats.birth[0] - 0.1;
        syncActive();
      };
      const applyStageState = (self: ScrollTrigger) => {
        const visible = !(self.progress >= 1 && !self.isActive);
        if (visible !== stageVisible) {
          stageVisible = visible;
          // The entry applier owns visibility through the pin — only manage
          // the alpha here when inside/past the manifesto runway.
          if (!visible || self.progress > 0) gsap.set(stage, { autoAlpha: visible ? 1 : 0 });
        }
        syncActive();
      };

      // T1 — the entry: hero pinned from scroll 0; three scrubbed sub-beats
      // tween the `entry` channels at the tunable fractions (overlaps
      // intended — the box is born while the name is still fading, per the
      // reference). Chrome fades inside b1 and is fully gone before birth.
      const t1 = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "clamp(bottom bottom)",
          end: MANIFESTO_ENTRY.t1Span,
          pin: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => syncEntryActive(self.progress),
          onRefresh: (self) => {
            measureRise();
            syncEntryActive(self.progress);
          },
        },
      });
      t1.fromTo(entry, { rise: 0 }, { rise: 1, duration: beats.rise[1] - beats.rise[0] }, beats.rise[0])
        .fromTo(entry, { birth: 0 }, { birth: 1, duration: beats.birth[1] - beats.birth[0] }, beats.birth[0])
        .fromTo(entry, { growth: 0 }, { growth: 1, duration: beats.growth[1] - beats.growth[0] }, beats.growth[0])
        .fromTo(
          channels,
          { sceneIntro: 0 },
          { sceneIntro: 1, duration: beats.growth[1] - beats.growth[0] },
          beats.growth[0],
        )
        .fromTo(glow, { opacity: 0.35 }, { opacity: 1, duration: beats.growth[1] - beats.growth[0] }, beats.growth[0])
        // storyPrelude: the lid cracks open over the growth tail so the
        // machine is visibly animating while the box grows; T2's lid tween
        // picks up from PRELUDE.lid.
        .fromTo(
          channels,
          { lidProgress: 0 },
          { lidProgress: PRELUDE.lid, duration: PRELUDE.window[1] - PRELUDE.window[0] },
          PRELUDE.window[0],
        )
        // .to, not fromTo: the shipped chrome-fade pattern. A fromTo's startAt
        // snapshot collides with the preloader-era autoAlpha history on the
        // [data-chrome] els (backward crossing left them 0/hidden while the
        // bar restored); .to records the live post-entrance values instead.
        .to(
          heroItems,
          { autoAlpha: 0, duration: chromeFade[1] - chromeFade[0], immediateRender: false },
          chromeFade[0],
        );

      // Entry applier — damps rendered copies toward the entry channels and
      // writes the DOM (h1 rise/zoom-out + birth-box clip) so the entry
      // carries T2's damped feel. Rides the single gsap.ticker (FrameDriver
      // precedent, NOT a second RAF); idles once converged at either edge so
      // the pointer parallax owns the h1 at rest and T2's lifecycle handler
      // owns the stage past the pin.
      const rendered = { rise: 0, birth: 0, growth: 0 };
      if (heroName) gsap.set(heroName, { transformOrigin: "50% 50%" });
      const setNameX = heroName ? gsap.quickSetter(heroName, "x", "px") : null;
      const setNameY = heroName ? gsap.quickSetter(heroName, "y", "px") : null;
      // scaleX/scaleY, never the "scale" shorthand — quickSetter binds one
      // primitive property and silently no-ops on shorthands.
      const setNameScaleX = heroName ? gsap.quickSetter(heroName, "scaleX") : null;
      const setNameScaleY = heroName ? gsap.quickSetter(heroName, "scaleY") : null;
      let nameX = 0;
      let lastProgress = -1;
      const entryTick = (_time: number, deltaTime: number) => {
        const trigger = t1.scrollTrigger;
        if (!trigger) return;
        const p = trigger.progress;
        const dt = Math.min(deltaTime / 1000, 1 / 30);
        const kRise = 1 - Math.exp(-DAMP.rise * dt);
        const kGrow = 1 - Math.exp(-DAMP.growth * dt);
        rendered.rise += (entry.rise - rendered.rise) * kRise;
        rendered.birth += (entry.birth - rendered.birth) * kGrow;
        rendered.growth += (entry.growth - rendered.growth) * kGrow;
        const converged =
          Math.abs(entry.rise - rendered.rise) < 1e-3 &&
          Math.abs(entry.birth - rendered.birth) < 1e-3 &&
          Math.abs(entry.growth - rendered.growth) < 1e-3;
        if (converged) {
          rendered.rise = entry.rise;
          rendered.birth = entry.birth;
          rendered.growth = entry.growth;
        }
        // One exact write lands on the frame convergence flips true; after
        // that, idle at the edges until the pin re-engages.
        if (converged && p === lastProgress && (p === 0 || p === 1)) return;
        const wasAtRest = lastProgress <= 0;
        lastProgress = p;

        if (heroName && setNameX && setNameY && setNameScaleX && setNameScaleY) {
          // decay any pointer-parallax x residue as the rise takes over
          if (wasAtRest && p > 0) nameX = Number(gsap.getProperty(heroName, "x")) || 0;
          if (p > 0) {
            nameX += (0 - nameX) * kRise;
            setNameX(nameX);
          }
          setNameY(rendered.rise * riseDelta);
          // Zoom-through exit: full opacity throughout — the growing box
          // pushes the spread words off-screen, then occludes them.
          const nameScale = 1 + (EXIT.scaleTo - 1) * rendered.growth;
          setNameScaleX(nameScale);
          setNameScaleY(nameScale);
        }

        // Past the manifesto runway T2's lifecycle owns the stage (hidden,
        // above About in the z-order) — a late damp write here would re-show
        // it over About (fast-flick / mid-page-reload race).
        if (stageVisible) {
          stage.style.clipPath = clipAt(rendered.growth);
          const alpha = birth.fromOpacity + rendered.birth * (1 - birth.fromOpacity);
          stage.style.opacity = String(alpha);
          stage.style.visibility = alpha > 0.001 ? "inherit" : "hidden";
        }
      };
      gsap.ticker.add(entryTick);

      // T2 — master scrub across the 520vh runway. No invalidateOnRefresh:
      // every value here is a resolution-independent 0→1 abstraction, and
      // invalidating plain-object tweens mid-scrub re-records drifted starts.
      // The story fractions are SETTLED — only the veil segment is retuned
      // (fast collapse; span converted from the combined-runway fraction).
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
        // Picks up from the T1 storyPrelude crack. immediateRender: false is
        // load-bearing — the fromTo snapshot would otherwise write the
        // prelude pose at load while the machine must rest closed.
        .fromTo(
          channels,
          { lidProgress: PRELUDE.lid },
          { lidProgress: 1, duration: PHASE.lid.dur, immediateRender: false },
          PHASE.lid.at,
        )
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
        .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.13 }, VEIL.at)
        // Ember tint dissolves over the tail so the veil ends pure ink and
        // About's top edge crosses ink-on-ink (no visible seam).
        .fromTo(veilTint, { opacity: 1 }, { opacity: 0, duration: 1 - VEIL.tintOutAt }, VEIL.tintOutAt)
        .fromTo(stage, { scale: 1 }, { scale: 1.05, duration: 1 - VEIL.at }, VEIL.at);
      // Fast collapse: span is a fraction of the COMBINED (T1+T2) runway.
      // Feature-detect: without backdrop-filter the gradient+opacity veil
      // above carries the same timing skeleton on its own.
      const blurSpanT2 = VEIL.collapse.span * ((RUNWAY_VH.t1 + RUNWAY_VH.t2) / RUNWAY_VH.t2);
      if (typeof CSS !== "undefined" && CSS.supports("backdrop-filter", "blur(1px)")) {
        master.fromTo(
          veil,
          { "--veil-blur": "0px" },
          { "--veil-blur": `${VEIL.collapse.blurPx}px`, duration: blurSpanT2 },
          VEIL.at,
        );
      }

      return () => {
        gsap.ticker.remove(entryTick);
        // the applier's raw style writes aren't context-tracked — restore by hand
        stage.style.clipPath = "";
        stage.style.opacity = "";
        stage.style.visibility = "";
        if (heroName) gsap.set(heroName, { x: 0, y: 0, scale: 1, opacity: 1 });
        stageState.active = true;
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  // Reduced motion: no pins, no entry, no canvas, no veil — a normal static
  // chapter with the poster figure on every viewport (the hero slot that
  // carried it ≥lg is retired).
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
            label="WHO AM I"
          />
          <Box
            as="h2"
            className="font-display-lead text-statement text-paper"
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
          Hidden at load (opacity-0 pre-JS default) — the entry applier births
          it at viewport center as a small rounded clip-path box once the name
          has faded, then grows it to full-bleed. Purely visual —
          pointer-events pass through to the page. */}
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
            label="WHO AM I"
          />
          <Box
            as="h2"
            className="font-display-lead text-statement text-paper"
          >
            <StatementWords />
          </Box>
        </Box>
        {/* Veil root is SOLID ink; the ember tint lives on its own child layer
            and dissolves over the T2 tail (tintOutAt) so the veil's bottom
            edge ends pure ink — About's top crosses ink-on-ink, no seam. */}
        <Box
          aria-hidden
          className="manifesto-veil bg-ink absolute inset-0 z-10 opacity-0 [backdrop-filter:blur(var(--veil-blur))]"
        >
          <Box className="manifesto-veil-tint from-accent-deep/25 absolute inset-0 bg-linear-to-t to-transparent to-65%" />
        </Box>
      </Box>
    </Box>
  );
}
