import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { Box } from "@/components/common/Box";

const RING_RADIUS = 54;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/** Full-screen overlay, z-90 (design_system §11.0), three acts:
 *  (1) "Welcome" + circular 0→100% loader on ink, (2) an ember page slides
 *  up from the bottom revealing "To My Portfolio" (char reveal), (3) the
 *  ember page splits into a double curtain (xPercent ±100) to reveal the
 *  site. Runs on every load/refresh; signals useUIStore.preloaderDone (the
 *  Hero timeline's start cue). Reduced motion: renders null and signals
 *  done immediately. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const setPreloaderDone = useUIStore((s) => s.setPreloaderDone);
  const [finished, setFinished] = useState(false);

  const active = !prefersReducedMotion;

  // Skipped or reduced-motion path: signal done in a layout effect.
  useIsomorphicLayoutEffect(() => {
    if (!active) setPreloaderDone(true);
  }, [active, setPreloaderDone]);

  // Scroll-lock while the curtain is up.
  useIsomorphicLayoutEffect(() => {
    if (!active || finished) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [active, finished, lenis]);

  useGSAP(
    () => {
      if (!active || !ref.current) return;

      const welcomeScreen = ref.current.querySelector(".pre-welcome");
      const welcomeText = ref.current.querySelector(".pre-welcome-text");
      const counter = ref.current.querySelector(".pre-counter");
      const ringProgress = ref.current.querySelector(".pre-ring-progress") as SVGCircleElement | null;
      const emberLeft = ref.current.querySelector(".pre-ember-l");
      const emberRight = ref.current.querySelector(".pre-ember-r");
      const emberContent = ref.current.querySelector(".pre-ember-content");
      const proxy = { value: 0 };

      // Hide via gsap.set, never CSS — JS-dead/reduced-motion must stay visible.
      const split = new SplitType(ref.current.querySelector(".pre-portfolio-text") as HTMLElement, { types: "chars" });
      gsap.set(split.chars, { yPercent: 100 });
      gsap.set([emberLeft, emberRight, emberContent], { yPercent: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          setPreloaderDone(true);
          setFinished(true);
        },
      });

      // Act 1 — "Welcome" mask-reveal + circular loader fill.
      tl.from(welcomeText, { yPercent: 100, duration: 0.8 })
        .to(
          proxy,
          {
            value: 100,
            duration: 2,
            ease: "power2.inOut",
            onUpdate: () => {
              const pct = Math.round(proxy.value);
              if (counter) counter.textContent = `${pct}%`;
              if (ringProgress) {
                ringProgress.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - proxy.value / 100));
              }
            },
          },
          "<0.2",
        )
        // Act 2 — ember page slides up from the bottom, text reveals.
        .to(welcomeScreen, { autoAlpha: 0, duration: 0.4 }, "+=0.15")
        .to([emberLeft, emberRight, emberContent], { yPercent: 0, duration: 1, ease: "power4.inOut" }, "<0.1")
        .to(split.chars, { yPercent: 0, duration: 0.8, stagger: 0.03 }, "-=0.3")
        // Act 3 — double curtain splits apart to reveal the site.
        .to(emberContent, { autoAlpha: 0, duration: 0.4 }, "+=0.4")
        .to(emberLeft, { xPercent: -100, duration: 1.1, ease: "power4.inOut" }, "<0.1")
        .to(emberRight, { xPercent: 100, duration: 1.1, ease: "power4.inOut" }, "<");

      return () => split.revert();
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  if (!active || finished) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-90"
    >
      <Box className="pre-welcome fixed inset-0 flex items-center justify-center bg-ink">
        <Box className="relative flex size-40 items-center justify-center">
          <Box
            as="svg"
            viewBox="0 0 120 120"
            className="absolute inset-0 -rotate-90"
          >
            <Box
              as="circle"
              cx={60}
              cy={60}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={2}
              className="stroke-line"
            />
            <Box
              as="circle"
              cx={60}
              cy={60}
              r={RING_RADIUS}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              className="pre-ring-progress stroke-accent"
              style={{
                strokeDasharray: RING_CIRCUMFERENCE,
                strokeDashoffset: RING_CIRCUMFERENCE,
              }}
            />
          </Box>
          <Box className="relative flex flex-col items-center gap-2">
            <Box className="overflow-hidden">
              <Box
                as="span"
                className="pre-welcome-text block text-center font-display text-chapter text-paper"
              >
                Welcome
              </Box>
            </Box>
            <Box
              as="span"
              className="pre-counter font-mono text-index text-muted"
            >
              0%
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className="pre-ember-l absolute inset-y-0 left-0 w-1/2 bg-accent" />
      <Box className="pre-ember-r absolute inset-y-0 right-0 w-1/2 bg-accent" />
      <Box className="pre-ember-content absolute inset-0 flex items-center justify-center px-page-x">
        <Box className="overflow-hidden">
          <Box
            as="span"
            className="pre-portfolio-text block text-center font-display text-chapter text-ink"
          >
            To My Portfolio
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
