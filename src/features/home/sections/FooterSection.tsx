import { lazy, Suspense, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { Box, Link } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { socialLinks } from "@/features/home/data/contact.data";
import { navLinks } from "@/constants/navigation.constant";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/** Footer — the ink bookend after 08's light invert (PLAN v3.1 §3, rebuilt to
 *  the owner's reference/footer-refine.mp4 rather than the older marquee spec:
 *  no name marquee, no back-to-top, and the ASCII hands stand in for the
 *  planned ember "ornament converge").
 *
 *  Three bands: a space-between meta row, the full-bleed ASCII hands, and the
 *  hero's name repeated at display scale with its descenders cropped by the
 *  page edge — the same crop the reference uses.
 *
 *  DO NOT rename .footer-word to .hero-word: Preloader.tsx polls
 *  `.hero-name .hero-word` and requires exactly two matches document-wide for
 *  its FLIP morph onto the hero h1. */

// Lazy boundary, same reason as ManifestoSection's: three is ~500kB and this
// is the last band of the page — eager-importing it doubles the entry chunk.
const AsciiHands = lazy(() => import("@/features/home/components/AsciiHands").then((m) => ({ default: m.AsciiHands })));

/** Alpha-keyed derivative of the owner's `hands.jpg` (which is a PNG with the
 *  transparency checkerboard flattened into real grey pixels — those would
 *  rasterise as a solid field of glyphs). The checker is neutral and skin is
 *  not, so the key is on saturation; recipe is in the change log. */
const HANDS_SRC = "/assets/images/hands.png";

const YEAR = new Date().getFullYear();

/** The reference's WORK / INFO / CONTACT column, mapped onto our anchors. */
const FOOTER_ANCHOR_HREFS = ["#projects", "#about", "#contact"];
const footerAnchors = FOOTER_ANCHOR_HREFS.flatMap((href) => navLinks.filter((link) => link.href === href));

const email = socialLinks.find((channel) => channel.href.startsWith("mailto:"));

// Reference gives the surname's terminal period the ember; heroName.tail
// carries it, so peel it off rather than hard-coding "Sufyan".
const tailStem = profile.heroName.tail.replace(/\.$/, "");
const tailDot = profile.heroName.tail.slice(tailStem.length);

const LINK_CLASS = "footer-line block w-fit text-paper uppercase transition-colors hover:text-accent";

export function FooterSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      // One entrance, played once on enter — the reference's footer is a
      // timeline, not a scrub (the page is stationary while it runs).
      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
      });

      // Name: two centre-out wipes. clipPath, not xPercent — in the reference
      // the letters never move, only the mask grows: the lead word opens
      // leftward from its right edge, the tail word rightward from its left.
      // clearProps because a resting inset(0) crops to the border box, which
      // would shave the italic tail's overhang.
      tl.fromTo(
        ".footer-word-lead",
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 1.1, ease: "power4.inOut", clearProps: "clipPath" },
        0,
      )
        .fromTo(
          ".footer-word-tail",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.1, ease: "power4.inOut", clearProps: "clipPath" },
          0,
        )
        // Meta lines type in, reading order. Linear so it reads as typing.
        .fromTo(
          ".footer-line",
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 0.5, ease: "none", stagger: 0.12, clearProps: "clipPath" },
          0.15,
        )
        .fromTo(".footer-hands", { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, ease: "none" }, 0);
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="footer"
      id="footer"
      ref={sectionRef}
      className="bg-ink relative flex min-h-svh flex-col overflow-hidden px-page-x pt-section"
    >
      <Box className="relative z-10 flex flex-wrap justify-between gap-x-10 gap-y-10 font-mono text-eyebrow">
        <Box className="flex flex-col gap-1.5">
          {email && (
            <Link
              href={email.href}
              className="footer-line block w-fit text-paper transition-colors hover:text-accent"
            >
              {email.value}
            </Link>
          )}
          <Box
            as="p"
            className="footer-line text-muted"
          >
            © {YEAR}
          </Box>
        </Box>

        <Box
          as="ul"
          className="flex flex-col gap-1.5"
        >
          {socialLinks.map((social) => (
            <Box
              as="li"
              key={social.href}
            >
              <Link
                href={social.href}
                className={LINK_CLASS}
              >
                {social.label}
              </Link>
            </Box>
          ))}
        </Box>

        <Box
          as="ul"
          className="flex flex-col gap-1.5"
        >
          {footerAnchors.map((anchor) => (
            <Box
              as="li"
              key={anchor.href}
            >
              <Link
                href={anchor.href}
                className={LINK_CLASS}
              >
                {anchor.label}
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Flex child, not an absolute inset: percentage insets collided with
          the wrapped link columns at 390px. flex-1 hands it exactly the space
          below the meta row at every viewport; -mx-page-x is the house
          full-bleed idiom. The box lives here rather than inside AsciiHands so
          the band keeps its shape while the lazy chunk is still in flight.

          -mb-[15vw] lets the field BLEED DOWN behind the name (which is z-10
          above it), as the reference does. That is not decoration: the artwork
          is ~2:1 and the leftover band is ~3.6:1, so without the bleed the
          plane fits to height and the hands span barely half the width. 15vw
          tracks the name's own height (text-hero-line 15.5vw × 0.95 leading),
          so it scales instead of guessing px. */}
      <Box className="footer-hands pointer-events-none relative mt-10 -mx-page-x -mb-[15vw] min-h-0 flex-1">
        <Suspense fallback={null}>
          <AsciiHands
            src={HANDS_SRC}
            className="absolute inset-0"
          />
        </Suspense>
      </Box>

      <Box
        as="p"
        className="sr-only"
      >
        {profile.name}
      </Box>
      {/* The hands' flex-1 already pins this to the page edge. The 0.95
          line-height sits the baseline within ~8px of it, so this margin only
          nudges the baseline back above the fold — the descenders then fall
          past it and the root's overflow-hidden crops them, as the reference
          does. Inverse of the hero's pb/-mb pair, which keeps descenders whole. */}
      <Box
        aria-hidden
        className="footer-name relative z-10 -mb-[0.02em] flex items-baseline justify-between text-hero-line text-paper"
      >
        <Box
          as="span"
          className="footer-word footer-word-lead block font-display-lead font-medium whitespace-nowrap"
        >
          {profile.heroName.lead}
        </Box>
        <Box
          as="span"
          className="footer-word footer-word-tail block font-display-tail whitespace-nowrap italic"
        >
          {tailStem}
          <Box
            as="span"
            className="text-accent"
          >
            {tailDot}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
