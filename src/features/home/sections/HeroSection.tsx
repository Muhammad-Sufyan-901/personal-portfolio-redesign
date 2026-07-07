import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { Box, Heading, Link, Text } from "@/components/common";
import { AuroraBackground } from "@/features/home/components/AuroraBackground";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";

/**
 * Chapter 01 — INTRO (design_system §11.1). Entrance timeline is gated on
 * `preloaderDone`: content stays gsap-hidden while the preloader curtain is
 * up, then plays as one gesture. Reduced motion: everything renders static
 * (the animated branch never hides anything).
 */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReducedMotion) return; // static final state

      const name = el.querySelector<HTMLElement>(".hero-name");
      if (!name) return;

      // Word spans are block + overflow-hidden in the JSX — they are the clip
      // wrappers, so splitting chars only is enough (split-type ≥0.3 handles
      // the nested spans).
      const split = new SplitType(name, { types: "chars" });

      // Initial hide lives here, not in CSS — if JS dies, content stays visible.
      gsap.set(split.chars, { yPercent: 100 });
      gsap.set(".hero-item", { autoAlpha: 0, y: 24 });

      let removeParallax: (() => void) | undefined;

      if (preloaderDone) {
        gsap
          .timeline()
          .to(split.chars, { yPercent: 0, duration: 1, stagger: 0.025 })
          .to(".hero-item", { autoAlpha: 1, y: 0, stagger: 0.08 }, "-=0.55");

        // scroll cue bob
        gsap.to(".hero-cue-arrow", {
          y: 6,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 1.5,
        });

        // mouse parallax on the name — desktop only
        if (window.matchMedia("(hover: hover)").matches) {
          const xTo = gsap.quickTo(name, "x", { duration: 0.8, ease: "power3.out" });
          const yTo = gsap.quickTo(name, "y", { duration: 0.8, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX / window.innerWidth - 0.5) * 2 * 10);
            yTo((e.clientY / window.innerHeight - 0.5) * 2 * 10);
          };
          window.addEventListener("pointermove", onMove);
          removeParallax = () => window.removeEventListener("pointermove", onMove);
        }
      }

      return () => {
        removeParallax?.();
        split.revert();
      };
    },
    // revertOnUpdate: the preloaderDone flip re-splits from clean markup
    // instead of splitting already-split DOM.
    { scope: ref, dependencies: [preloaderDone, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="intro"
      ref={ref}
      className="relative isolate flex min-h-screen flex-col px-page-x pt-18"
    >
      <AuroraBackground />

      <Box className="flex flex-1 flex-col justify-center gap-8">
        <Heading
          level={1}
          variant="display"
          className="hero-name"
        >
          {profile.name.split(" ").map((word) => (
            <Box
              as="span"
              key={word}
              className="block overflow-hidden"
            >
              {word}
            </Box>
          ))}
        </Heading>

        <Text className="hero-item max-w-[68ch] font-sans text-body text-muted">{profile.tagline}</Text>

        <Text
          as="p"
          className="hero-item font-mono text-index text-accent uppercase"
        >
          {profile.role}
        </Text>

        <Box
          as="ul"
          className="hero-item flex flex-wrap gap-x-8 gap-y-3"
        >
          {profile.stats.map((stat, i) => (
            <Box
              as="li"
              key={stat.label}
              className={cn("font-mono text-meta text-muted", i > 0 && "border-l border-line pl-8")}
            >
              <Box
                as="span"
                className="text-paper"
              >
                {stat.value}
              </Box>{" "}
              {stat.label}
            </Box>
          ))}
        </Box>
      </Box>

      <Box className="pb-10">
        <Link
          href="#manifesto"
          aria-label="Scroll to next chapter"
          className="hero-item inline-flex items-baseline gap-2 font-mono text-meta text-accent"
        >
          <Box
            as="span"
            aria-hidden="true"
            className="hero-cue-arrow inline-block"
          >
            ↓
          </Box>
          Scroll
        </Link>
      </Box>
    </Box>
  );
}
