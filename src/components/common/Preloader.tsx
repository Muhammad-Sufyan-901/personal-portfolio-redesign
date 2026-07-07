import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { siteConfig } from "@/config/site";
import { Box } from "@/components/common/Box";

const SESSION_KEY = "preloader-done";

/** Full-screen ink overlay, z-90 (design_system §11.0): Mono counter 0→100 +
 *  name mask-reveal → curtain wipe up. Runs once per session; signals
 *  useUIStore.preloaderDone (the Hero timeline's start cue). Reduced motion /
 *  repeat visit: renders null and signals done immediately. */
export function Preloader() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const setPreloaderDone = useUIStore((s) => s.setPreloaderDone);
  const [skipped] = useState(() => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1");
  const [finished, setFinished] = useState(false);

  const active = !skipped && !prefersReducedMotion;

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

      const counter = ref.current.querySelector(".preloader-counter");
      const name = ref.current.querySelector(".preloader-name");
      const proxy = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem(SESSION_KEY, "1");
          setPreloaderDone(true);
          setFinished(true);
        },
      });

      tl.from(name, { yPercent: 100, duration: 1 })
        .to(
          proxy,
          {
            value: 100,
            duration: 1.8,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter) counter.textContent = String(Math.round(proxy.value));
            },
          },
          "<",
        )
        .to(ref.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut", // ≈ --ease-inout
        });
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  if (!active || finished) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="fixed inset-0 z-[90] bg-ink"
    >
      <Box className="flex h-full items-center justify-center px-page-x">
        <Box className="overflow-hidden">
          <Box
            as="span"
            className="preloader-name block text-center font-display text-chapter text-paper"
          >
            {siteConfig.name}
          </Box>
        </Box>
      </Box>
      <Box
        as="span"
        className="preloader-counter absolute right-page-x bottom-8 font-mono text-index text-muted"
      >
        0
      </Box>
    </Box>
  );
}
