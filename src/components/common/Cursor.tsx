import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Box } from "@/components/common/Box";
import { cn } from "@/lib/utils";

/** Custom cursor: 8px dot + 40px trailing ring, z-100 (design_system §7.3).
 *  Ring scales 1.6 over interactive targets; morphs into a paper pill with the
 *  label when [data-cursor] provides one (no mix-blend — the pill stays white
 *  on any background). Null on coarse pointers / reduced motion. */
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
      // Hidden until the first pointermove so it never paints parked at 0,0.
      gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 });

      const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
      const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

      let seen = false;
      const onMove = (e: PointerEvent) => {
        if (!seen) {
          seen = true;
          gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
          gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
        }
        dotX(e.clientX);
        dotY(e.clientY);
        ringX(e.clientX);
        ringY(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        const target = (e.target as HTMLElement).closest("a, button, [data-cursor]");
        const cursorLabel = target instanceof HTMLElement ? (target.dataset.cursor ?? "") : "";
        setLabel(cursorLabel);
        // Labeled targets stay at scale 1 — the pill sizes itself via w-auto;
        // scaling it would blur the label text.
        gsap.to(ring, { scale: target && !cursorLabel ? 1.6 : 1, duration: 0.3 });
      };

      // Fade out when the pointer leaves the viewport; back on next move.
      const onLeave = () => {
        seen = false;
        gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerover", onOver);
      document.documentElement.addEventListener("pointerleave", onLeave);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerover", onOver);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  // Separate block — keying the main one on `label` would tear down the
  // pointer listeners (revertOnUpdate) on every hover.
  useGSAP(
    () => {
      if (!active) return;
      const ring = ref.current?.querySelector(".cursor-ring");
      if (!ring) return;
      // Re-bake centering: GSAP caches element width for xPercent, and the
      // pill's auto width ≠ the 40px circle — without this it sits off-center
      // until the next pointermove.
      gsap.set(ring, { xPercent: -50, yPercent: -50 });
      if (label) gsap.from(ring, { scale: 0.7, duration: 0.3, ease: "back.out(2)", overwrite: "auto" });
    },
    { scope: ref, dependencies: [label, active] },
  );

  if (!active) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-100"
    >
      <Box className="cursor-dot fixed top-0 left-0 h-2 w-2 rounded-full bg-paper" />
      <Box
        className={cn(
          "cursor-ring fixed top-0 left-0 flex items-center justify-center rounded-full",
          label
            ? "bg-paper h-10 w-auto px-5 whitespace-nowrap"
            : "border-paper/50 h-10 w-10 border mix-blend-difference",
        )}
      >
        {label && (
          <Box
            as="span"
            className="font-mono text-meta text-ink font-bold uppercase tracking-wider"
          >
            {label}
          </Box>
        )}
      </Box>
    </Box>
  );
}
