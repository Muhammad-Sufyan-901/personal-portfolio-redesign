import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "@/components/common";
import { MenuButton } from "@/components/layouts/MenuButton";

// ponytail: end: "max" flips isActive back to false at the exact document
// bottom (GSAP boundary quirk — progress hitting 1 reads as "past end"), so
// a user scrolled fully to the footer would see the button vanish. A large
// fixed end no real page reaches keeps it active for the rest of the scroll.
const POPOUT_END = 100_000;

/** Fixed top-right Menu trigger (replaces the old navbar). Hidden over the
 *  hero; pops out with a scale-overshoot once the user scrolls past 100vh,
 *  retracts back above it. Reduced motion: plain show/hide, no scale. */
export function MenuPopout() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (prefersReducedMotion) {
        gsap.set(el, { autoAlpha: 0 });
        const trigger = ScrollTrigger.create({
          start: () => window.innerHeight,
          end: POPOUT_END,
          onToggle: (self) => gsap.set(el, { autoAlpha: self.isActive ? 1 : 0 }),
        });
        return () => trigger.kill();
      }

      gsap.set(el, { autoAlpha: 0, scale: 0.4, y: -8, transformOrigin: "top right" });
      const trigger = ScrollTrigger.create({
        start: () => window.innerHeight,
        end: POPOUT_END,
        onToggle: (self) =>
          gsap.to(
            el,
            self.isActive
              ? { autoAlpha: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(2)" }
              : { autoAlpha: 0, scale: 0.4, y: -8, duration: 0.3, ease: "power2.in" },
          ),
      });
      return () => trigger.kill();
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      ref={ref}
      className="fixed top-6 right-page-x z-[60]"
    >
      <MenuButton />
    </Box>
  );
}
