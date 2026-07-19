import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Box } from "@/components/common";
import { navLinks } from "@/constants/navigation.constant";

// Same boundary quirk fix as MenuPopout's POPOUT_END: end: "max" flips
// isActive false at the exact document bottom, so persistent triggers use a
// large fixed end no real page reaches.
const HUD_END = 100_000;

/** Matches MenuPopout's after-hero reveal point. */
const HUD_START = 0.45;

/** Fixed scroll wayfinding, hidden over the hero (same choreography as
 *  MenuPopout): center-left "(22)" overall page-scroll percentage, and
 *  center-right current-chapter label + within-chapter progress track.
 *  Keys off whichever navLinks anchors are live in the DOM, so future
 *  chapters appear here with zero changes. Decorative (aria-hidden) —
 *  SiteMenu is the real navigation. */
export function ScrollProgressHUD() {
  const ref = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const root = ref.current;
      const numEl = numRef.current;
      const labelEl = labelRef.current;
      const barEl = barRef.current;
      if (!root || !numEl || !labelEl || !barEl) return;

      // Scoped selector strings resolve against `root` — query the document
      // explicitly for the chapter anchors that actually exist.
      const sections = navLinks.flatMap(({ label, href }) => {
        const el = document.querySelector<HTMLElement>(href);
        return el ? [{ label, el }] : [];
      });
      if (sections.length === 0) return;

      // Chapter thresholds are measured live from layout, not from cached
      // ScrollTrigger .start values: the HUD mounts before the sections'
      // pins exist (the hero's scroll room IS a pin spacer), so anything
      // snapshotted at creation is stale. Pinned elements go position:fixed
      // mid-pin, but their .pin-spacer stays in normal flow — measure that.
      // Active chapter = last one whose mid-viewport threshold was passed
      // (position-only, so the manifesto's multi-vh pin can't open a dead
      // zone between chapters).
      const docTop = (el: HTMLElement, scroll: number) => {
        const parent = el.parentElement;
        const box = parent?.classList.contains("pin-spacer") ? parent : el;
        return box.getBoundingClientRect().top + scroll;
      };

      const setBar = gsap.quickSetter(barEl, "scaleY");
      let activeIndex = 0;

      ScrollTrigger.create({
        start: 0,
        // The trigger is only the update driver; scroll, document end, and
        // section positions are all read live (self.progress/self.end go
        // stale when the document height drifts after the last refresh).
        end: "max",
        onUpdate: (self) => {
          const scroll = self.scroll();
          const max = Math.max(ScrollTrigger.maxScroll(window), 1);
          numEl.textContent = String(Math.round(gsap.utils.clamp(0, 1, scroll / max) * 100));

          const mid = window.innerHeight / 2;
          const starts = sections.map(({ el }) => Math.max(0, docTop(el, scroll) - mid));
          let i = starts.length - 1;
          while (i > 0 && starts[i] > scroll) i--;

          const start = starts[i];
          const next = starts[i + 1] ?? max;
          setBar(gsap.utils.clamp(0, 1, (scroll - start) / Math.max(next - start, 1)));

          if (i !== activeIndex) {
            activeIndex = i;
            labelEl.textContent = sections[i].label;
            if (!prefersReducedMotion) {
              gsap.fromTo(labelEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, overwrite: true });
            }
          }
        },
      });

      // After-hero reveal, mirroring MenuPopout.
      gsap.set(root, { autoAlpha: 0 });
      ScrollTrigger.create({
        start: () => window.innerHeight * HUD_START,
        end: HUD_END,
        onToggle: (self) =>
          prefersReducedMotion
            ? gsap.set(root, { autoAlpha: self.isActive ? 1 : 0 })
            : gsap.to(root, {
                autoAlpha: self.isActive ? 1 : 0,
                duration: 0.4,
                overwrite: true,
              }),
      });
    },
    { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none max-lg:hidden"
    >
      <Box className="fixed left-page-x top-1/2 z-60 -translate-y-1/2 font-mono text-index text-muted">
        (
        <Box
          as="span"
          ref={numRef}
          className="text-paper"
        >
          0
        </Box>
        )
      </Box>
      <Box className="fixed right-page-x top-1/2 z-60 flex -translate-y-1/2 items-start gap-3">
        <Box
          as="span"
          ref={labelRef}
          className="font-mono text-eyebrow text-muted"
        >
          {navLinks[0].label}
        </Box>
        <Box className="h-24 w-px bg-line">
          <Box
            ref={barRef}
            className="h-full w-full origin-top scale-y-0 bg-accent"
          />
        </Box>
      </Box>
    </Box>
  );
}
