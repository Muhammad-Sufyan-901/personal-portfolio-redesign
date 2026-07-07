import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Box } from "@/components/common/Box";

/** Custom cursor: 8px dot + 40px trailing ring, z-100 (design_system §7.3).
 *  Ring scales 1.6 over interactive targets; 2.4 + label when [data-cursor]
 *  provides one. Null on coarse pointers / reduced motion. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [enabled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  const [label, setLabel] = useState("");

  const active = enabled && !prefersReducedMotion;

  useIsomorphicLayoutEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, [active]);

  useGSAP(
    () => {
      if (!active || !ref.current) return;
      const dot = ref.current.querySelector(".cursor-dot");
      const ring = ref.current.querySelector(".cursor-ring");
      if (!dot || !ring) return;

      // Center via gsap.set — Tailwind translate would stack oddly with x/y.
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest("a, button, [data-cursor]");
        const cursorLabel = target instanceof HTMLElement ? (target.dataset.cursor ?? "") : "";
        setLabel(cursorLabel);
        gsap.to(ring, { scale: target ? (cursorLabel ? 2.4 : 1.6) : 1, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerover", onOver);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    },
    { scope: ref, dependencies: [active] },
  );

  if (!active) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100]"
    >
      <Box className="cursor-dot fixed top-0 left-0 h-2 w-2 rounded-full bg-paper" />
      <Box className="cursor-ring fixed top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border border-paper/50 mix-blend-difference">
        {label && (
          <Box
            as="span"
            className="font-mono text-meta text-paper"
          >
            {label}
          </Box>
        )}
      </Box>
    </Box>
  );
}
