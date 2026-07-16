import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useUIStore } from "@/store/useUIStore";
import { profile } from "@/features/home/data/profile.data";
import { socialLinks } from "@/features/home/data/contact.data";
import { navLinks } from "@/constants/navigation.constant";
import { AuroraBackground } from "@/features/home/components/AuroraBackground";
import { HERO_REFINE } from "@/features/home/utils/hero.tunables";
import { PRELOADER_REFINE } from "@/utils/preloader.tunables";
import { Box, Image, Link } from "@/components/common";
import { MenuButton } from "@/components/shared/MenuButton";
import macbookPoster from "@/assets/images/macbook-poster.webp";

/** Tagline split around the italic-serif emphasis phrase. */
const [taglinePre, taglinePost] = profile.taglineEmphasis
  ? profile.tagline.split(profile.taglineEmphasis)
  : [profile.tagline, undefined];

const heroAnchors = navLinks.filter((l) => ["Journey", "Gallery", "Contact"].includes(l.label));

/** 01 — Hero (one-line revision, v2.1 + preloader-morph handoff): bold ogl
 *  aurora curtain, tagline top-left with italic emphasis, and the name as
 *  ONE line ≥lg — `Muh.` (Switzer lead) · inline slot · `Sufyan.`
 *  (Instrument Serif italic tail) — the slot is the door the manifesto seam
 *  opens through. Below lg the name stacks to the shipped two rows. Hairline
 *  bottom bar (role · social links · chapter anchors).
 *
 *  Entrance: the NAME never animates here — the preloader wordmark morphs
 *  onto the h1's word rects and swaps under the flash peak (P3); this
 *  section keeps the words invisible-but-measurable until then. The chrome
 *  ([data-chrome] groups) staggers in off the `preloaderDone` flip, delayed
 *  past the burst decay (P4, order/timing from PRELOADER_REFINE.chrome). */
export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const preloaderDone = useUIStore((s) => s.preloaderDone);

  useGSAP(
    () => {
      const section = ref.current;
      if (prefersReducedMotion || !section) return;

      const { chrome, auroraIn } = PRELOADER_REFINE;
      const words = gsap.utils.toArray<HTMLElement>(".hero-name .hero-word", section);
      const bar = section.querySelector<HTMLElement>(".hero-bar");
      const aurora = section.querySelector<HTMLElement>(".hero-aurora");
      const groups = chrome.order.map((key) => gsap.utils.toArray<HTMLElement>(`[data-chrome="${key}"]`, section));

      const cleanups: (() => void)[] = [];
      const cleanup = () => cleanups.forEach((fn) => fn());

      // Hide via gsap.set, never CSS — JS-dead/reduced-motion must stay visible.
      gsap.set(groups.flat(), { autoAlpha: 0, y: 24 });
      if (bar) gsap.set(bar, { borderTopColor: "transparent" });
      // The WRAPPER, never AuroraBackground's own root — its scrub-fade
      // ScrollTrigger records the inner container's start alpha on refresh.
      if (aurora) gsap.set(aurora, { autoAlpha: 0 });

      // Door still closed: the words wait invisible-but-measurable (autoAlpha
      // keeps layout) for the preloader morph to land on their rects. The
      // swap shows them; the revertOnUpdate re-run on the preloaderDone flip
      // then leaves them at their natural visible state.
      if (!preloaderDone) {
        gsap.set(words, { autoAlpha: 0 });
        return cleanup;
      }

      // P4 — chrome stagger + aurora glow ramp, both from the reveal
      // (preloaderDone now flips at the ink sheet's full-cover cut).
      const tl = gsap.timeline();
      if (aurora) tl.to(aurora, { autoAlpha: 1, duration: auroraIn, ease: "power2.out" }, 0);
      groups.forEach((els, i) => {
        if (els.length) {
          tl.to(els, { autoAlpha: 1, y: 0, duration: chrome.itemDur }, i * chrome.stagger);
        }
      });
      if (bar) {
        tl.to(
          bar,
          { borderTopColor: "var(--color-line-strong)", duration: chrome.itemDur },
          chrome.order.indexOf("meta") * chrome.stagger,
        );
      }

      const hoverCapable = window.matchMedia("(hover: hover)").matches;

      // D5 — opt-in cyan flash on the tail word (ships OFF; flip the
      // HERO_REFINE gate only with owner approval).
      if (HERO_REFINE.surnameHoverFlash.enabled && hoverCapable) {
        const tail = section.querySelector<HTMLElement>(".hero-word-tail");
        if (tail) {
          const { durIn, durOut } = HERO_REFINE.surnameHoverFlash;
          const onEnter = () => gsap.to(tail, { color: "var(--color-flash)", duration: durIn });
          const onLeave = () => gsap.to(tail, { color: "var(--color-paper)", duration: durOut });
          tail.addEventListener("pointerenter", onEnter);
          tail.addEventListener("pointerleave", onLeave);
          cleanups.push(() => {
            tail.removeEventListener("pointerenter", onEnter);
            tail.removeEventListener("pointerleave", onLeave);
          });
        }
      }

      // ±10px pointer parallax on the name (hover-capable pointers only).
      if (hoverCapable) {
        const name = section.querySelector(".hero-name");
        if (name) {
          const xTo = gsap.quickTo(name, "x", { duration: 0.6 });
          const yTo = gsap.quickTo(name, "y", { duration: 0.6 });
          const onMove = (e: PointerEvent) => {
            // A name that is splitting must not also chase the cursor — the
            // manifesto seam owns the words once scroll leaves the very top.
            if (window.scrollY > 8) return;
            xTo((e.clientX / window.innerWidth - 0.5) * 20);
            yTo((e.clientY / window.innerHeight - 0.5) * 20);
          };
          section.addEventListener("pointermove", onMove);
          cleanups.push(() => section.removeEventListener("pointermove", onMove));
        }
      }

      return cleanup;
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
      {/* Wrapper so the P4 ramp never touches AuroraBackground's own root
          (its scroll scrub-fade records that element's start alpha). */}
      <Box
        aria-hidden
        className="hero-aurora absolute inset-0 -z-10"
      >
        <AuroraBackground />
      </Box>

      {/* Top row: tagline left, Menu right (navbar removed — this scrolls
          away with the hero; MenuPopout takes over past 100vh) */}
      <Box className="mt-10 flex items-start justify-between gap-6">
        <Box
          as="p"
          data-chrome="tagline"
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

        <Box
          data-chrome="tagline"
          className="hero-item shrink-0"
        >
          <MenuButton />
        </Box>
      </Box>

      <Box className="flex-1" />

      {/* Name: two stacked rows (<lg) that fuse into ONE line ≥lg — lead ·
          inline slot · tail. The slot (flex-1, min-width tunable) is the gap
          the manifesto stage opens through; under reduced motion it carries
          the poster strip instead (spec: relocated placement). */}
      <Box
        as="h1"
        aria-label={profile.name}
        className="hero-name flex flex-col text-hero text-paper lg:flex-row lg:items-baseline lg:text-hero-line"
      >
        <Box
          as="span"
          className="hero-word block self-start overflow-hidden pb-[0.12em] -mb-[0.12em] font-display-lead font-medium whitespace-nowrap lg:self-auto"
        >
          {HERO_REFINE.name.lead}
        </Box>
        <Box
          as="span"
          aria-hidden
          className="hero-slot relative hidden lg:block lg:flex-1 lg:self-stretch"
          style={{ minWidth: HERO_REFINE.seam.slotWidthIdle }}
        >
          {prefersReducedMotion && (
            <Image
              src={macbookPoster}
              alt=""
              priority="eager"
              objectFit="cover"
              className="absolute inset-0 h-full w-full rounded-lg"
            />
          )}
        </Box>
        <Box
          as="span"
          className="hero-word hero-word-tail block self-end overflow-hidden pb-[0.12em] -mb-[0.12em] font-display-tail italic whitespace-nowrap lg:self-auto"
        >
          {HERO_REFINE.name.tail}
        </Box>
      </Box>

      {/* Hairline bottom bar: role · socials · anchors (hero-bar: the seam
          fades the bar itself so its hairline exits with the chrome) */}
      <Box className="hero-bar border-line-strong mt-10 flex flex-col gap-4 border-t pt-5 font-mono text-eyebrow md:flex-row md:items-center md:justify-between">
        <Box
          as="p"
          data-chrome="meta"
          className="hero-item text-paper uppercase"
        >
          {profile.role}
        </Box>

        <Box
          data-chrome="socials"
          className="hero-item flex items-center gap-3"
        >
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
          data-chrome="nav"
          className="hero-item flex items-center gap-6"
        >
          {heroAnchors.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-paper-bright text-paper uppercase transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
