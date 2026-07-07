import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { Box } from "@/components/common/Box";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** max translate in px */
  strength?: number;
}

/** Pointer-follow magnetic wrapper (design_system §8G): wrapper follows the
 *  cursor up to `strength` px; an inner .magnetic-label counter-moves ×-0.35;
 *  elastic spring back on leave. Hover-capable pointers only. */
export function MagneticButton({ children, className, strength = 12 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (prefersReducedMotion || !el) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.4 });
      const yTo = gsap.quickTo(el, "y", { duration: 0.4 });
      const label = el.querySelector(".magnetic-label");
      const labelX = label ? gsap.quickTo(label, "x", { duration: 0.4 }) : null;
      const labelY = label ? gsap.quickTo(label, "y", { duration: 0.4 }) : null;

      const onMove = (e: PointerEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        xTo(relX * strength);
        yTo(relY * strength);
        labelX?.(relX * strength * -0.35);
        labelY?.(relY * strength * -0.35);
      };
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
        if (label) gsap.to(label, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.4)" });
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
      {children}
    </Box>
  );
}
