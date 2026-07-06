import { createContext, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// THE single Lenis owner (system_architecture §2 RULE 3).
// Nothing else may create a Lenis instance or its own RAF loop.

// eslint-disable-next-line react-refresh/only-export-components -- context must live with its owner
export const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useIsomorphicLayoutEffect(() => {
    // Reduced motion: no Lenis at all — native scroll; ScrollTrigger tracks window directly.
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      smoothWheel: true,
      syncTouch: false,
    });

    instance.on("scroll", () => ScrollTrigger.update());
    const update = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(update);
      instance.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
