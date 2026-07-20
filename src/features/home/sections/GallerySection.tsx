import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Box, ChapterEyebrow } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { GALLERY } from "@/features/home/utils/gallery.tunables";

/** PLACEHOLDER — the PRD carries no gallery statement (PLAN decision 13);
 *  owner-voice options are presented at the chapter gate. Grammar mirrors the
 *  reference: roman lead + italic-serif focal words mid-sentence. */
const STATEMENT = {
  text: "Every project here taught me something worth keeping.",
  focalWords: ["taught", "keeping"],
};
const statementWords = STATEMENT.text.split(" ");
const isFocalWord = (word: string) => STATEMENT.focalWords.includes(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());

const TURN = Math.PI * 2;
const TRAVEL = GALLERY.path.travelTurns * TURN;
const TAIL = GALLERY.path.tailTurns * TURN;
const ENTRY_FADE = GALLERY.path.entryFadeTurns * TURN;
const EXIT_FADE = GALLERY.path.exitFadeTurns * TURN;

/** Deterministic per-item jitter (stable across renders/HMR — keeps beat
 *  screenshots reproducible; the shader-hash idiom, not Math.random). */
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

// ponytail: low-perf = core count only; upgrade to a frame-time probe if a
// capable low-core device ever shows up in analytics.
const LOW_PERF = typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4;

/** One derivation, module scope: anonymous dummy cards (owner decision — the
 *  04-style ember gradient, no imagery/data until real covers ship), each
 *  with a sequential jittered conveyor start (entry order IS path order),
 *  radius/size variance, and a static z-tilt. */
const ringDensity = LOW_PERF ? GALLERY.lowPerf.ringDensity : GALLERY.orbit.ringDensity;
const [sizeMin, sizeMax] = GALLERY.orbit.sizeVariance;
const ORBIT_ITEMS = Array.from({ length: ringDensity }, (_, i) => {
  const size = sizeMin + (sizeMax - sizeMin) * rand(i, 4);
  return {
    // jitter < 0.5 slot and clamp ≥ 0 — order preserved, none visible at p=0
    startAngle: Math.max(
      0,
      (i + (rand(i, 1) - 0.5) * 2 * GALLERY.path.spacingJitter) * GALLERY.path.spacingTurns * TURN,
    ),
    radiusScale: 1 + (rand(i, 2) - 0.5) * 2 * GALLERY.orbit.jitter.r,
    tilt: (rand(i, 3) - 0.5) * 2 * GALLERY.orbit.jitter.tilt,
    widthCss: `clamp(${Math.round(110 * size)}px, ${(GALLERY.orbit.coverW * size).toFixed(1)}vw, ${Math.round(300 * size)}px)`,
    mobileHidden: i >= GALLERY.mobile.ringDensity,
  };
});

/** 07 Gallery — dummy covers enter one by one through the left screen edge
 *  and ride the ellipse per item (conveyor): bottom/near arc left→right,
 *  edge-on at the right edge, one full back-arc lap, then fade out at the
 *  right extreme, exiting in entry order — while the statement de-veils at
 *  the depth mid-plane (near covers in front of it, far behind)
 *  (reference/gallery-refine.mp4). */
export function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".gallery-cover");
      if (items.length === 0) return;

      // Viewport-derived geometry, re-measured on every refresh (resize-safe).
      let rx = 0;
      let ry = 0;
      let halfVw = 0;
      let totalMaster = 1;
      const measure = () => {
        // rem-based like the covers' max-lg visibility — px would diverge at
        // non-default root font size (audit F1, 2nd recurrence of this trap)
        const mobile = !window.matchMedia("(width >= 64rem)").matches;
        const cfg = mobile ? GALLERY.mobile : GALLERY.orbit;
        rx = window.innerWidth * cfg.radiusX;
        ry = Math.max(window.innerHeight * cfg.radiusY, Math.min(GALLERY.orbit.minRadiusY, window.innerHeight * 0.42));
        halfVw = window.innerWidth / 2;
        // master span ends when the last VISIBLE cover exits (mobile hides
        // the tail of the train via CSS) + a heading-alone tail beat
        const lastVisible = Math.min(mobile ? GALLERY.mobile.ringDensity : ORBIT_ITEMS.length, ORBIT_ITEMS.length) - 1;
        totalMaster = ORBIT_ITEMS[lastVisible]!.startAngle + TRAVEL + TAIL;
      };

      const scaleFar = LOW_PERF ? GALLERY.lowPerf.scaleFar : GALLERY.depth.scaleFar;
      const setters = items.map((el, i) => {
        gsap.set(el, {
          xPercent: -50,
          yPercent: -50,
          rotation: ORBIT_ITEMS[i]!.tilt,
          transformPerspective: GALLERY.curve.perspective,
        });
        return {
          el,
          x: gsap.quickSetter(el, "x", "px"),
          y: gsap.quickSetter(el, "y", "px"),
          // scaleX/scaleY — the "scale" shorthand silently no-ops in quickSetter
          sx: gsap.quickSetter(el, "scaleX"),
          sy: gsap.quickSetter(el, "scaleY"),
          ry: gsap.quickSetter(el, "rotationY", "deg"),
          o: gsap.quickSetter(el, "opacity"),
          lastZ: -1,
          lastHidden: false,
        };
      });

      /** Place every cover for a damped master progress p: each item owns a
       *  clamped travel t along the ellipse (angle = π − t, θ decreasing:
       *  left edge → bottom/near → right edge-on → back-arc lap → fade at
       *  the right extreme), fading in over its first span and out over its
       *  last; depth (near = ring bottom) drives scale/opacity/z —
       *  straddling the heading's fixed z-20 mid-plane; yaw follows screen
       *  x (the reference's curved traversal — covers enter and wrap near
       *  edge-on, unfurling toward center). */
      const position = (p: number) => {
        const master = totalMaster * p;
        for (let i = 0; i < setters.length; i++) {
          const item = ORBIT_ITEMS[i]!;
          const s = setters[i]!;
          const t = Math.min(Math.max(master - item.startAngle, 0), TRAVEL);
          if (t <= 0 || t >= TRAVEL) {
            // not yet started / fully exited — one hide write, then skip
            if (!s.lastHidden) {
              s.lastHidden = true;
              s.o(0);
            }
            continue;
          }
          s.lastHidden = false;

          const angle = Math.PI - t;
          const depth = (Math.sin(angle) + 1) / 2; // 1 = near (ring bottom)
          const eIn = clamp01(t / ENTRY_FADE);
          const enter = 1 - (1 - eIn) * (1 - eIn); // power2.out
          const eOut = clamp01((t - (TRAVEL - EXIT_FADE)) / EXIT_FADE);
          const exit = eOut * eOut; // power2.in

          const x = Math.cos(angle) * rx * item.radiusScale;
          s.x(x);
          s.y(Math.sin(angle) * ry * item.radiusScale);
          const scale = scaleFar + (GALLERY.depth.scaleNear - scaleFar) * depth;
          s.sx(scale);
          s.sy(scale);
          s.ry(-GALLERY.curve.maxYaw * Math.max(-1, Math.min(1, x / halfVw)));
          s.o(enter * (1 - exit) * (GALLERY.depth.opacityFar + (1 - GALLERY.depth.opacityFar) * depth));
          const z = 1 + Math.round(depth * 39);
          if (z !== s.lastZ) {
            s.lastZ = z;
            s.el.style.zIndex = String(z);
          }
        }
      };

      if (prefersReducedMotion) {
        // Static mid-orbit pose (entered, not exiting), heading revealed by
        // markup default, no pin, no scrub — only a resize re-place (no
        // ScrollTrigger refresh runs in this branch).
        const place = () => {
          measure();
          position(GALLERY.rmProgress);
        };
        place();
        window.addEventListener("resize", place, { passive: true });
        return () => window.removeEventListener("resize", place);
      }

      const words = gsap.utils.toArray<HTMLElement>(".gallery-word");
      gsap.set(words, { autoAlpha: 0, filter: `blur(${GALLERY.heading.blurFrom}px)` });
      const headingTl = gsap.timeline({ paused: true }).to(words, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: GALLERY.heading.wordStagger,
        ease: "none",
      });

      measure();
      position(0); // pre-entry — covers off-left, stage holds only the eyebrow

      const state = { target: 0, rendered: 0, converged: true };
      const [revealFrom, revealTo] = GALLERY.heading.revealSpan;

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + Math.round(window.innerHeight * GALLERY.pinRunway),
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measure();
          position(state.rendered);
        },
        onUpdate: (self) => {
          // The damp applier chases this; the heading de-veil maps directly
          // to raw progress — both scrub-pure and fully reversible.
          state.target = self.progress;
          headingTl.progress(clamp01((self.progress - revealFrom) / (revealTo - revealFrom)));
        },
        // will-change only while the pin is live — absent at rest
        onToggle: (self) => {
          const value = self.isActive ? "transform, opacity" : "";
          for (const s of setters) s.el.style.willChange = value;
        },
      });

      // Damp applier on the single gsap.ticker (FrameDriver precedent — no
      // second RAF): eases the rendered master progress toward the scrub
      // target, lands one exact write on convergence, then idles (zero
      // drift at rest).
      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime / 1000, 1 / 30);
        const k = 1 - Math.exp(-GALLERY.damp * dt);
        state.rendered += (state.target - state.rendered) * k;
        if (Math.abs(state.target - state.rendered) < 1e-4) {
          if (state.converged) return;
          state.rendered = state.target;
          state.converged = true;
        } else {
          state.converged = false;
        }
        position(state.rendered);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="gallery"
      ref={sectionRef}
      className="bg-ink relative isolate flex h-svh items-center justify-center overflow-hidden"
    >
      <ChapterEyebrow
        index="07"
        label="Selected Work"
        className="left-page-x absolute top-8 z-50"
      />
      <Box
        as="h2"
        className="font-display-lead text-statement text-paper relative z-20 max-w-[24ch] px-page-x text-center"
      >
        {statementWords.map((word, i) => (
          <Fragment key={i}>
            <Box
              as="span"
              className={cn("gallery-word inline-block", isFocalWord(word) && "font-display-tail italic")}
            >
              {word}
            </Box>
            {i < statementWords.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </Box>
      {ORBIT_ITEMS.map((item, i) => (
        <Box
          key={i}
          className={cn(
            "gallery-cover pointer-events-none absolute top-1/2 left-1/2 select-none",
            item.mobileHidden && "max-lg:hidden",
          )}
          style={{ width: item.widthCss }}
        >
          {/* Owner-approved dummy cover — 04's placeholder gradient, no text */}
          <Box className="border-line aspect-4/3 w-full rounded-md border bg-[radial-gradient(120%_120%_at_28%_18%,var(--color-accent)_0%,var(--color-accent-deep)_42%,var(--color-ink)_88%)]" />
        </Box>
      ))}
    </Box>
  );
}
