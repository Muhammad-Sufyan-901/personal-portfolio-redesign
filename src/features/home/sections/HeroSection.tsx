import { useRef } from "react";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useUIStore } from "@/store/useUIStore";
import { profile } from "@/features/home/data/profile.data";
import { AuroraBackground } from "@/features/home/components/AuroraBackground";
import { Box } from "@/components/common";

const [firstName, ...restName] = profile.name.split(" ");
const surname = restName.join(" ");

/** 01 — Hero (design_system §11.1 + PLAN v3): full-viewport name with the
 *  reference's mixed-pairing device (first name grotesk, surname Fraunces
 *  italic + period), tagline + role, ember scroll cue, canvas aurora behind.
 *  Entrance char reveal is gated on the preloader's completion cue. */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const preloaderDone = useUIStore((s) => s.preloaderDone);

  useGSAP(
    () => {
      const section = ref.current;
      if (prefersReducedMotion || !section) return;

      // The name word spans are the clip wrappers (block overflow-hidden in
      // JSX) — split chars only; split-type ≥0.3 handles nested spans.
      const split = new SplitType(section.querySelector(".hero-name") as HTMLElement, {
        types: "chars",
      });

      // Hide via gsap.set, never CSS — JS-dead/reduced-motion must stay visible.
      gsap.set(split.chars, { yPercent: 100 });
      gsap.set(".hero-item", { autoAlpha: 0, y: 24 });

      // Curtain still up: stay hidden; revertOnUpdate re-splits cleanly when
      // preloaderDone flips.
      if (!preloaderDone) return () => split.revert();

      const tl = gsap.timeline();
      tl.to(split.chars, { yPercent: 0, duration: 1, stagger: 0.025 }).to(
        ".hero-item",
        { autoAlpha: 1, y: 0, stagger: 0.08 },
        "-=0.55",
      );

      // Scroll-cue bob.
      gsap.to(".hero-cue-icon", {
        y: 6,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // ±10px pointer parallax on the name (hover-capable pointers only).
      if (window.matchMedia("(hover: hover)").matches) {
        const name = section.querySelector(".hero-name");
        if (name) {
          const xTo = gsap.quickTo(name, "x", { duration: 0.6 });
          const yTo = gsap.quickTo(name, "y", { duration: 0.6 });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX / window.innerWidth - 0.5) * 20);
            yTo((e.clientY / window.innerHeight - 0.5) * 20);
          };
          section.addEventListener("pointermove", onMove);
          return () => {
            section.removeEventListener("pointermove", onMove);
            split.revert();
          };
        }
      }

      return () => split.revert();
    },
    { scope: ref, dependencies: [preloaderDone, prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="hero"
      ref={ref}
      className="relative isolate flex min-h-svh flex-col items-center justify-center px-page-x"
    >
      <AuroraBackground />

      <Box
        as="h1"
        aria-label={profile.name}
        className="hero-name text-center text-display text-paper"
      >
        <Box
          as="span"
          className="block overflow-hidden pb-[0.12em] -mb-[0.12em] font-sans font-medium sm:inline-block"
        >
          {firstName}
        </Box>{" "}
        <Box
          as="span"
          className="block overflow-hidden pb-[0.12em] -mb-[0.12em] font-display italic sm:inline-block"
        >
          {surname}.
        </Box>
      </Box>

      <Box
        as="p"
        className="hero-item mt-8 max-w-xl text-center text-body text-muted"
      >
        {profile.tagline}
      </Box>
      <Box
        as="p"
        className="hero-item mt-4 font-mono text-eyebrow tracking-widest text-paper uppercase"
      >
        {profile.role}
      </Box>

      <Box
        aria-hidden
        className="hero-item absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <Box
          as="span"
          className="font-mono text-meta text-muted uppercase"
        >
          Scroll
        </Box>
        <Box
          as="span"
          className="hero-cue-icon block h-6 w-px bg-accent"
        />
      </Box>
    </Box>
  );
}
