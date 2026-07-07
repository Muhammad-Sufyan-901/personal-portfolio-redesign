import { createContext, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

// SINGLE LENIS OWNER (system_architecture RULE 3) — nothing else may create a
// Lenis instance or its own RAF loop. Context must live with its owner.
// eslint-disable-next-line react-refresh/only-export-components
export const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Under reduced motion Lenis is NEVER created — native scroll.
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    // Arrow wrapper — direct handoff of ScrollTrigger.update fails strict TS.
    instance.on("scroll", () => ScrollTrigger.update());
    const tick = (t: number) => instance.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
