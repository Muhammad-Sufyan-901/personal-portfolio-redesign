import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "./Box";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** max translate in px */
  strength?: number;
}

export function MagneticButton({ children, className, strength = 12 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      // Reduced motion or touch (no hover): plain static wrapper, no listeners.
      if (!el || prefersReducedMotion || !window.matchMedia("(hover: hover)").matches) return;

      const label = el.querySelector(".magnetic-label");
      if (!label) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
      const labelXTo = gsap.quickTo(label, "x", { duration: 0.4, ease: "power3.out" });
      const labelYTo = gsap.quickTo(label, "y", { duration: 0.4, ease: "power3.out" });

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 … 1
        const relY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        xTo(relX * strength);
        yTo(relY * strength);
        // inner label counter-moves slightly
        labelXTo(relX * strength * -0.35);
        labelYTo(relY * strength * -0.35);
      };

      const onLeave = () => {
        gsap.to([el, label], { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
      };

      el.addEventListener("pointermove", onMove);
      el.addEventListener("pointerleave", onLeave);
      return () => {
        el.removeEventListener("pointermove", onMove);
        el.removeEventListener("pointerleave", onLeave);
      };
    },
    { scope: ref, dependencies: [prefersReducedMotion, strength] },
  );

  return (
    <Box
      ref={ref}
      className={cn("inline-block", className)}
    >
      <Box
        as="span"
        className="magnetic-label inline-block"
      >
        {children}
      </Box>
    </Box>
  );
}
