import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { siteConfig } from "@/config/site";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/store/useUIStore";
import { Box } from "./Box";

const SESSION_KEY = "preloader-done";

/**
 * Chapter 00 (design_system §11.0): mono counter 0→100 + name mask-reveal,
 * then the whole overlay wipes upward. Runs once per session; under reduced
 * motion it renders nothing and signals done immediately.
 * z-scale: preloader z-[90] < cursor z-[100] (cursor is always on top).
 */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const setPreloaderDone = useUIStore((s) => s.setPreloaderDone);
  const [skipped] = useState(() => sessionStorage.getItem(SESSION_KEY) === "1");
  const [finished, setFinished] = useState(false);
  const active = !skipped && !prefersReducedMotion && !finished;

  // Skipped session / reduced motion: signal done without ever animating.
  useIsomorphicLayoutEffect(() => {
    if (skipped) {
      setPreloaderDone(true);
    } else if (prefersReducedMotion) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setPreloaderDone(true);
    }
  }, [skipped, prefersReducedMotion, setPreloaderDone]);

  // Lock scroll while the overlay is up (lenis is null under reduced motion,
  // but the overlay never renders there anyway).
  useEffect(() => {
    if (!active) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [active, lenis]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !active) return;
      const name = el.querySelector(".preloader-name");
      const counter = el.querySelector(".preloader-counter");
      if (!name || !counter) return;

      const progress = { value: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setPreloaderDone(true);
          setFinished(true); // unmounts the overlay (render null)
        },
      });

      tl.from(name, { yPercent: 100, duration: 1, delay: 0.2 })
        .to(
          progress,
          {
            value: 100,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              counter.textContent = String(Math.round(progress.value));
            },
          },
          "<",
        )
        // curtain wipe — power4.inOut ≈ --ease-inout cubic-bezier(0.83,0,0.17,1)
        .to(el, { yPercent: -100, duration: 1.2, ease: "power4.inOut" }, ">+=0.2");
    },
    { scope: ref, dependencies: [active, setPreloaderDone] },
  );

  if (!active) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-6 bg-ink"
    >
      <Box className="overflow-hidden">
        <Box
          as="span"
          className="preloader-name block font-display text-chapter text-paper"
        >
          {siteConfig.name}
        </Box>
      </Box>
      <Box
        as="span"
        className="preloader-counter font-mono text-index text-muted"
      >
        0
      </Box>
    </Box>
  );
}
