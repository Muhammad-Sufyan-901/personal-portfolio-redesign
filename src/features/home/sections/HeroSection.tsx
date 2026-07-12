import { Fragment, useRef } from "react";
import SplitType from "split-type";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useUIStore } from "@/store/useUIStore";
import { profile } from "@/features/home/data/profile.data";
import { socialLinks } from "@/features/home/data/contact.data";
import { navLinks } from "@/constants/navigation";
import { AuroraBackground } from "@/features/home/components/AuroraBackground";
import { Box, Image, Link } from "@/components/common";
import { MenuButton } from "@/components/layouts/MenuButton";
import macbookPoster from "@/assets/images/macbook-poster.webp";

const [firstName, ...restName] = profile.name.split(" ");
const surname = restName.join(" ");

/** Tagline split around the italic-serif emphasis phrase. */
const [taglinePre, taglinePost] = profile.taglineEmphasis
  ? profile.tagline.split(profile.taglineEmphasis)
  : [profile.tagline, undefined];

const heroAnchors = navLinks.filter((l) => ["Journey", "Gallery", "Contact"].includes(l.label));

/** 01 — Hero (reference-exact revision): bold ogl aurora curtain from the
 *  top, tagline top-left with italic emphasis, name stacked in two giant
 *  rows at the bottom (grotesk first name left / Fraunces-italic surname
 *  right), hairline bottom bar (role · social links · chapter anchors).
 *  Char reveal gated on the preloader cue. */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const preloaderDone = useUIStore((s) => s.preloaderDone);

  useGSAP(
    () => {
      const section = ref.current;
      if (prefersReducedMotion || !section) return;

      // The name word spans are the clip wrappers (block overflow-hidden in
      // JSX) — split chars only; split-type ≥0.3 handles nested spans. Split
      // the two row spans individually (never the h1): a revert on the h1
      // would replace the manifesto window slot that now sits between them.
      const rows = Array.from(section.querySelectorAll<HTMLElement>(".hero-name > span:not(.hero-window-slot)"));
      const split = new SplitType(rows, { types: "chars" });

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

      // ±10px pointer parallax on the name (hover-capable pointers only).
      if (window.matchMedia("(hover: hover)").matches) {
        const name = section.querySelector(".hero-name");
        if (name) {
          const xTo = gsap.quickTo(name, "x", { duration: 0.6 });
          const yTo = gsap.quickTo(name, "y", { duration: 0.6 });
          const onMove = (e: PointerEvent) => {
            // A name that is splitting must not also chase the cursor — the
            // manifesto seam owns the rows once scroll leaves the very top.
            if (window.scrollY > 8) return;
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
      className="relative isolate flex min-h-svh flex-col px-page-x pb-6"
    >
      <AuroraBackground />

      {/* Top row: tagline left, Menu right (navbar removed — this scrolls
          away with the hero; MenuPopout takes over past 100vh) */}
      <Box className="mt-10 flex items-start justify-between gap-6">
        <Box
          as="p"
          className="hero-item max-w-[34ch] text-body text-paper"
        >
          {taglinePre}
          {profile.taglineEmphasis && (
            <Box
              as="span"
              className="font-display italic"
            >
              {profile.taglineEmphasis}
            </Box>
          )}
          {taglinePost}
        </Box>

        <Box className="hero-item shrink-0">
          <MenuButton />
        </Box>
      </Box>

      <Box className="flex-1" />

      {/* Name stacked in two giant rows: first name left, surname right */}
      <Box
        as="h1"
        aria-label={profile.name}
        className="hero-name flex flex-col text-hero text-paper"
      >
        <Box
          as="span"
          className="block self-start overflow-hidden pb-[0.12em] -mb-[0.12em] font-sans font-medium whitespace-nowrap"
        >
          {firstName}
        </Box>
        {/* Manifesto window slot: the live WebGL strip's rest-state rect is
            measured from this element (the seam clip origin). Renders nothing
            itself; under reduced motion it carries the static poster. */}
        <Box
          as="span"
          aria-hidden
          className="hero-window-slot block h-manifesto-slot w-full"
        >
          {prefersReducedMotion && (
            <Image
              src={macbookPoster}
              alt=""
              priority="eager"
              className="h-full w-full rounded-lg"
            />
          )}
        </Box>
        <Box
          as="span"
          className="block self-end overflow-hidden pb-[0.12em] -mb-[0.12em] font-display italic whitespace-nowrap"
        >
          {surname}.
        </Box>
      </Box>

      {/* Hairline bottom bar: role · socials · anchors (hero-bar: the seam
          fades the bar itself so its hairline exits with the chrome) */}
      <Box className="hero-bar mt-10 flex flex-col gap-4 border-t border-line pt-5 font-mono text-eyebrow md:flex-row md:items-center md:justify-between">
        <Box
          as="p"
          className="hero-item text-muted uppercase"
        >
          {profile.role}
        </Box>

        <Box className="hero-item flex items-center gap-3">
          {socialLinks.map((social, i) => (
            <Fragment key={social.href}>
              {i > 0 && (
                <Box
                  as="span"
                  aria-hidden
                  className="text-faint"
                >
                  /
                </Box>
              )}
              <Link
                href={social.href}
                className="text-paper uppercase transition-colors hover:text-accent"
              >
                {social.label}
              </Link>
            </Fragment>
          ))}
        </Box>

        <Box
          as="nav"
          aria-label="Hero shortcuts"
          className="hero-item flex items-center gap-6"
        >
          {heroAnchors.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted uppercase transition-colors hover:text-paper"
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
