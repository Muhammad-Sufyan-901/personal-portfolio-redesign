import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "./Box";

/**
 * Custom cursor: 8px dot + 40px trailing ring. Ring scales up and shows a
 * label over interactive targets (`a`, `button`, or anything with
 * `data-cursor="View"`). Returns null on touch devices and under reduced
 * motion — the native cursor stays.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const prefersReducedMotion = usePrefersReducedMotion();
  // device trait — read once, no listener needed
  const [finePointer] = useState(() => window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  const enabled = finePointer && !prefersReducedMotion;

  useEffect(() => {
    if (!enabled) return;
    // hide the native cursor only while the custom one is active
    document.documentElement.classList.add("cursor-none");
    return () => document.documentElement.classList.remove("cursor-none");
  }, [enabled]);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root || !enabled) return;
      const dot = root.querySelector(".cursor-dot");
      const ring = root.querySelector(".cursor-ring");
      if (!dot || !ring) return;

      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power2.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power2.out" });

      let shown = false;
      const onMove = (e: PointerEvent) => {
        if (!shown) {
          shown = true;
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.2 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target.closest("a, button, [data-cursor]") : null;
        setLabel(target?.getAttribute("data-cursor") ?? "");
        gsap.to(ring, {
          scale: target ? (target.hasAttribute("data-cursor") ? 2.4 : 1.6) : 1,
          duration: 0.3,
          ease: "power3.out",
        });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerover", onOver);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
      };
    },
    { scope: ref, dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50"
    >
      <Box className="cursor-dot absolute top-0 left-0 h-2 w-2 rounded-full bg-paper" />
      <Box className="cursor-ring absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border border-paper/50 mix-blend-difference">
        {label ? (
          <Box
            as="span"
            className="font-mono text-meta text-paper"
          >
            {label}
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
