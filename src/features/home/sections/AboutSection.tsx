import { Fragment, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Box, ChapterEyebrow, Link, MagneticButton, ParallaxImage, RevealText } from "@/components/common";
import { SCRUB_Y } from "@/components/common/RevealText";
import { profile } from "@/features/home/data/profile.data";
import { siteConfig } from "@/config/site";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { MANIFESTO_ENTRY } from "@/features/home/utils/manifesto.tunables";
import { ABOUT_REFINE } from "@/features/home/utils/about.tunables";
import { cn } from "@/lib/utils";

/** Real portrait (824×1280, landed 2026-07-19). ParallaxImage still
 *  graceful-hides if the asset ever goes missing. */
const PORTRAIT_SRC = "/assets/images/profile/about-profile.png";

const { headline: H, description: D, stats: S, portrait: P, damp, veiledOpacity, blurEnabled } = ABOUT_REFINE;
const { overlap } = MANIFESTO_ENTRY.veil.aboutResolve;

type StatementWord = { text: string; emphasized: boolean };

/** Per-word focal flags via char-range intersection with the emphasis phrases
 *  — word-membership would mis-flag the roman "and" ("precision AND care").
 *  ponytail: first occurrence per phrase only — current data has no repeats. */
function toWords(text: string, phrases: readonly string[]): StatementWord[] {
  const ranges = phrases.flatMap((phrase) => {
    const i = text.indexOf(phrase);
    return i === -1 ? [] : [[i, i + phrase.length] as const];
  });
  let cursor = 0;
  return text.split(" ").map((word) => {
    const start = text.indexOf(word, cursor);
    cursor = start + word.length;
    return { text: word, emphasized: ranges.some(([a, b]) => start < b && start + word.length > a) };
  });
}

const statementWords = toWords(profile.aboutStatement, profile.aboutStatementEmphasis ?? []);

/** React Bits GlareHover band recipe (example values: −30°, white .3 →
 *  paper/30, 300% size) — shared by the hover + entrance bands. */
const GLARE_BAND =
  "pointer-events-none absolute inset-0 motion-reduce:hidden bg-linear-[-30deg] from-transparent from-60% via-paper/30 via-70% to-transparent to-100% bg-position-[-100%_-100%] bg-size-[300%_300%] bg-no-repeat";

/** Tint gradient resolved from tunable token NAMES (single-source, no hex). */
const TINT_GRADIENT = `linear-gradient(to top, var(--color-${P.tint.stops[0]}), var(--color-${P.tint.stops[1]}))`;

/** Bio reveal length — own-position scrub over a viewport fraction. */
const descEnd = () => `+=${D.reveal.spanVh * window.innerHeight}`;

/** D4 portrait composition (v11): real photo under the ember DUOTONE
 *  filter (owner request 2026-07-19 — mix-blend-color over opaque accent
 *  stops: luminance preserved, hue pulled to ember; the old opaque
 *  normal-blend wash stays deleted or it would hide the photo). The rounded
 *  clip wrapper keeps the thin static ember glow (box-shadow — follows the
 *  radius, zero filter cost) and carries TWO React Bits GlareHover bands
 *  (adapted per animated-ui-references — token colors,
 *  `motion-reduce:hidden` fallback the source lacks): a pure-CSS hover
 *  sweep, and a GSAP-owned `.about-glare-in` band swept once when the
 *  portrait first scrolls into view — separate elements, because a GSAP
 *  write on the hover band would fight its CSS transition. ParallaxImage
 *  stays untouched. */
function EmberPortrait({ className, rounding }: { className?: string; rounding: string }) {
  return (
    <Box className={cn("relative", className)}>
      <Box
        className={cn(
          "about-clip group relative h-full overflow-hidden",
          "shadow-[0_0_40px_-8px_var(--color-ember-glow-deep)]",
          rounding,
        )}
      >
        <ParallaxImage
          src={PORTRAIT_SRC}
          alt="Portrait of Muhammad Sufyan"
          className="h-full w-full"
          imageFit="cover"
        />
        <Box
          aria-hidden
          className="about-tint pointer-events-none absolute inset-0 mix-blend-color"
          style={{ backgroundImage: TINT_GRADIENT }}
        />
        <Box
          aria-hidden
          className={cn("about-glare-in", GLARE_BAND)}
        />
        <Box
          aria-hidden
          className={cn(
            "about-glare",
            GLARE_BAND,
            "transition-[background-position] duration-2000 ease-out group-hover:bg-position-[100%_100%]",
          )}
        />
      </Box>
    </Box>
  );
}

/** Odometer strip for one digit: 0..d for the visible roll; a 0 digit rolls
 *  the full cycle 0..9..0 (the ones slot of "10" — the finale crescendo).
 *  The final entry is always index len−1, so the settled markup offset and
 *  the scrubbed target share one formula: −100·(len−1)/len %. */
function digitStrip(digit: number): number[] {
  return digit > 0 ? Array.from({ length: digit + 1 }, (_, i) => i) : [...Array.from({ length: 10 }, (_, i) => i), 0];
}

/** Overdrive stat card (odometer ignition, 2026-07-19): markup is the
 *  SETTLED state — strips show the final digit via inline transform, the
 *  SVG rect renders a full clean border (dash channels exist only on the
 *  motion path), the glare band is parked at opacity-0. The finale timeline
 *  veils everything pre-paint and scrubs it back, so reduced motion renders
 *  this complete with zero JS. rx falls back to 1rem: rounded-2xl resolves
 *  Tailwind's default-theme --radius-2xl, which our @theme doesn't redefine.
 *  Glass-with-color chrome (React Bits GlassIcons, adapted per
 *  animated-ui-references): an ember plate rotated behind a smoked-glass
 *  front — bg-ink/40, not the source's light glass, which fails AA under
 *  the label over the plate. Hover is pure CSS (--ease-inout IS the source
 *  curve), gated motion-safe:. `.stat-card` is the WRAPPER so the shell
 *  beat ignites plate+glass as one; the wrapper, .stat-strip and
 *  .stat-glare stay transition-free (GSAP writes them every scrub frame).
 *  Plate sits at 6°, not the source's 15° — these wide cards would cross
 *  the previous staircase card. */
function StatCard({ value, label, className }: { value: number; label: string; className?: string }) {
  const strips = String(value)
    .split("")
    .map((d) => digitStrip(Number(d)));
  const inset = S.border.strokePx / 2;
  return (
    <Box className={cn("stat-card group relative", className)}>
      <Box
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 origin-bottom-right rotate-6 rounded-2xl",
          "bg-linear-to-b from-accent to-accent-deep",
          "shadow-[0_0_40px_-8px_var(--color-ember-glow-deep)]",
          "transition-transform duration-(--dur-fast) ease-inout",
          "motion-safe:group-hover:rotate-10 motion-safe:group-hover:-translate-x-2 motion-safe:group-hover:-translate-y-2",
        )}
      />
      <Box
        className={cn(
          "relative overflow-hidden rounded-2xl bg-ink/40 px-7 py-5 backdrop-blur-md",
          "transition-transform duration-(--dur-fast) ease-inout motion-safe:group-hover:scale-[1.03]",
        )}
      >
        <svg
          aria-hidden
          focusable="false"
          className="text-paper/30 pointer-events-none absolute inset-0 h-full w-full"
        >
          <rect
            className="stat-border"
            pathLength={100}
            fill="none"
            stroke="currentColor"
            strokeWidth={S.border.strokePx}
            style={{
              x: inset,
              y: inset,
              width: `calc(100% - ${S.border.strokePx}px)`,
              height: `calc(100% - ${S.border.strokePx}px)`,
              rx: `calc(var(--radius-2xl, 1rem) - ${inset}px)`,
            }}
          />
        </svg>
        <Box
          aria-hidden
          className={cn(
            "stat-glare pointer-events-none absolute inset-y-0 left-0 w-[55%] opacity-0",
            "from-paper/0 via-paper/20 to-paper/0 bg-linear-to-r",
          )}
        />
        <Box
          as="p"
          aria-label={`${value}+`}
          className="font-display-tail text-chapter text-paper flex items-end justify-center italic tabular-nums"
        >
          <Box
            as="span"
            aria-hidden
            className="flex items-end"
          >
            {strips.map((strip, slot) => (
              <Box
                key={slot}
                as="span"
                className="stat-slot block h-[1em] min-w-[1ch] overflow-x-visible overflow-y-clip text-center"
              >
                <Box
                  as="span"
                  className="stat-strip block"
                  style={{ transform: `translateY(${(-100 * (strip.length - 1)) / strip.length}%)` }}
                >
                  {strip.map((digit, row) => (
                    <Box
                      key={row}
                      as="span"
                      className="block h-[1em]"
                    >
                      {digit}
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
            <Box
              as="span"
              className="self-start text-[0.5em] leading-none"
            >
              +
            </Box>
          </Box>
        </Box>
        <Box
          as="p"
          className="text-eyebrow text-paper/75 mt-1 text-center font-mono whitespace-pre-line uppercase"
        >
          {label}
        </Box>
      </Box>
    </Box>
  );
}

/** 03 — About: the factual persona block on the reference's About beat.
 *  v4 (2026-07-19): the section scrolls past 100vh with beats in document
 *  order — word-blur headline → description (+CV) → version + statistics
 *  finale — while the portrait STICKS on the right until the section ends
 *  (reference passage). Portrait keeps the orange duotone grade + focus
 *  blur; the finale beat sharpens it. Still the manifesto veil's landing
 *  target — entry trigger geometry is the G seam contract.
 *  v5 (2026-07-19, /impeccable overdrive): odometer-ignition stats finale —
 *  display-scale digit rolls, self-drawing borders, glare sweeps (StatCard +
 *  ABOUT_REFINE.stats). */
export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (prefersReducedMotion || !section) return;
      const inner = section.querySelector<HTMLElement>(".about-inner");
      const finalEl = section.querySelector<HTMLElement>(".about-final");
      const items = gsap.utils.toArray<HTMLElement>(".about-item", section);
      const words = gsap.utils.toArray<HTMLElement>(".about-word", section);
      if (!inner || !finalEl) return;

      // Markup defaults are the SETTLED state (reduced motion renders
      // complete for free) — the motion path hides everything pre-paint.
      const wordVeil = {
        opacity: veiledOpacity,
        y: H.yDrift,
        ...(blurEnabled && { filter: `blur(${H.blurFromPx}px)` }),
      };
      gsap.set(items, { autoAlpha: 0, y: 24 });
      gsap.set(words, wordVeil);

      // §4.6 grammar: ONE scrubbed, reversible entry timeline coupled to the
      // veil tail (trigger geometry = the seam contract, scrub:true only).
      // Words stagger INDIVIDUALLY in DOM order across H.span — the
      // sharp/blur boundary travels mid-line like the reference. Timing is
      // layout-independent (word count is static) → build once.
      const spanLen = H.span[1] - H.span[0];
      const step = spanLen / (words.length - 1 + H.trail);
      const wordDur = H.trail * step;
      const tl = gsap.timeline({ defaults: { ease: "none" } });
      tl.fromTo(inner, { autoAlpha: 0, y: 48 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0);
      words.forEach((word, i) => {
        const at = H.span[0] + i * step;
        tl.fromTo(
          word,
          { ...wordVeil },
          { opacity: 1, y: 0, ...(blurEnabled && { filter: "blur(0px)" }), duration: wordDur },
          at,
        );
        // Blur is finite — drop the filter at each word's settle point,
        // inside the scrubbed timeline so it re-renders on reverse.
        if (blurEnabled) tl.set(word, { filter: "none" }, at + wordDur);
      });
      tl.fromTo(items, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: { amount: 0.15 } }, 0.5);

      ScrollTrigger.create({
        animation: tl,
        trigger: section,
        start: "top bottom",
        end: () => `top ${overlap * 100}%`,
        scrub: true,
      });

      // CV action — the bio's veiled blur→sharp grammar on ONE unsplittable
      // target (nested Link + arrow; split-type would atomize it), so the
      // same veil fromTo inline. Own-position trigger like the bio; span ≈
      // one bio line's resolve distance (targetDur ≈ half the line
      // timeline). NOT an .about-item — the veil IS its pre-state, and
      // double-tweening opacity with the entry stagger would conflict.
      const cv = section.querySelector<HTMLElement>(".about-cv");
      if (cv) {
        const cvVeil = {
          opacity: veiledOpacity,
          y: SCRUB_Y,
          ...(blurEnabled && { filter: `blur(${D.blurFromPx}px)` }),
        };
        gsap.set(cv, cvVeil);
        const ctl = gsap.timeline({ defaults: { ease: "none" } });
        ctl.fromTo(
          cv,
          { ...cvVeil },
          { opacity: 1, y: 0, ...(blurEnabled && { filter: "blur(0px)" }), duration: 1 },
          0,
        );
        if (blurEnabled) ctl.set(cv, { filter: "none" }, 1);
        ScrollTrigger.create({
          animation: ctl,
          trigger: cv,
          start: D.reveal.start,
          end: () => `+=${(D.reveal.spanVh / 2) * window.innerHeight}`,
          scrub: 3 / damp,
        });
      }

      // Portrait glare-in — one React Bits-style sweep per instance (mobile
      // block + desktop rail) the first time it scrolls into view; hover
      // replays stay pure CSS on the sibling band. Time-based, not scrubbed:
      // an appearance flourish, not a scroll beat. Desktop's sticky clip is
      // measured unstuck at refresh (near the section top), so this fires as
      // the section first enters.
      gsap.utils.toArray<HTMLElement>(".about-clip", section).forEach((clip) => {
        const band = clip.querySelector<HTMLElement>(".about-glare-in");
        if (!band) return;
        gsap.fromTo(
          band,
          { backgroundPosition: "-100% -100%" },
          {
            backgroundPosition: "100% 100%",
            duration: P.glareIn.dur,
            scrollTrigger: { trigger: clip, start: P.glareIn.start, once: true },
          },
        );
      });

      // Finale — odometer ignition (v5): ONE scrubbed master timeline; cards
      // ignite in staircase/DOM order (shell → border draw → digit roll →
      // glare sweep), the version line rides the tail. Markup is the settled
      // state — the sets below veil the visibility-critical elements
      // pre-paint (fromTo from-states cover the card innards: while a card
      // is autoAlpha-0 its strips/border/glare are moot), and every hygiene
      // .set lives INSIDE the timeline so it re-renders on reverse.
      const cards = gsap.utils.toArray<HTMLElement>(".stat-card", section);
      const version = section.querySelector<HTMLElement>(".about-version");
      const cardVeil = {
        autoAlpha: 0,
        y: S.yDrift,
        ...(blurEnabled && { filter: `blur(${D.blurFromPx}px)` }),
      };
      const settle = { autoAlpha: 1, y: 0, ...(blurEnabled && { filter: "blur(0px)" }) };
      gsap.set(cards, cardVeil);
      if (version) gsap.set(version, cardVeil);

      const ftl = gsap.timeline({ defaults: { ease: "none" } });
      let base = 0;
      let versionAt = 0;
      cards.forEach((card, i) => {
        const span = S.spans[i] ?? 1;
        const at = (f: number) => base + f * span;
        const dur = (w: readonly number[]) => ((w[1] ?? 0) - (w[0] ?? 0)) * span;

        ftl.fromTo(card, { ...cardVeil }, { ...settle, duration: dur(S.beat.shell) }, at(S.beat.shell[0]));
        if (blurEnabled) ftl.set(card, { filter: "none" }, at(S.beat.shell[1]));

        const rect = card.querySelector<SVGRectElement>(".stat-border");
        if (rect) {
          ftl.fromTo(
            rect,
            { strokeDasharray: 100, strokeDashoffset: 100 },
            { strokeDashoffset: 0, duration: dur(S.beat.border) },
            at(S.beat.border[0]),
          );
          // Dash-seam hygiene — a scrubbed .set re-renders on reverse, so
          // scrolling back re-applies the dash for the un-draw.
          ftl.set(rect, { strokeDasharray: "none" }, at(S.beat.border[1]));
        }

        // Digit roll — the LAST slot spins the whole beat with the decel
        // ease (easing lives only here; timeline defaults stay ease:"none"
        // per scrub grammar). Higher-order slots ("10"'s tens) flip
        // linearly across the final tensFlipFrac, riding the 9→0 carry.
        const strips = gsap.utils.toArray<HTMLElement>(".stat-strip", card);
        const rollStart = at(S.beat.roll[0]);
        const rollDur = dur(S.beat.roll);
        strips.forEach((strip, slot) => {
          const len = strip.children.length;
          const last = slot === strips.length - 1;
          const flipDur = last ? rollDur : rollDur * S.roll.tensFlipFrac;
          ftl.fromTo(
            strip,
            // BOTH transform channels — GSAP parses the settled % transform
            // as px into `y`; zeroing only yPercent leaves the strip offset.
            { y: 0, yPercent: 0 },
            {
              yPercent: (-100 * (len - 1)) / len,
              duration: flipDur,
              ...(last && { ease: S.roll.ease }),
            },
            rollStart + rollDur - flipDur,
          );
        });

        const glare = card.querySelector<HTMLElement>(".stat-glare");
        if (glare) {
          // Parked outside the overflow-clip at opacity 1 → the sweep is a
          // pure composited transform, reversible inside the scrub.
          ftl.fromTo(
            glare,
            { opacity: 1, xPercent: S.glare.fromX, skewX: -12 },
            { xPercent: S.glare.toX, duration: dur(S.beat.glare) },
            at(S.beat.glare[0]),
          );
        }

        versionAt = at(S.version.at);
        base += span * S.cardStagger;
      });

      if (version) {
        ftl.fromTo(version, { ...cardVeil }, { ...settle, duration: S.version.dur }, versionAt);
        // The timeline's final act — the piece the last-section anchor
        // (stats.trigger comment in about.tunables.ts) guards.
        if (blurEnabled) ftl.set(version, { filter: "none" }, versionAt + S.version.dur);
      }

      ScrollTrigger.create({
        animation: ftl,
        trigger: finalEl,
        start: S.trigger.start,
        end: S.trigger.end,
        scrub: 3 / damp,
      });

      // v11: the portrait renders the photo under the STATIC ember duotone
      // + glare bands — no motion overlays of its own. Its wrapper still
      // rides the .about-item entry stagger.
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="about"
      ref={sectionRef}
      // overflow-CLIP, not hidden: an overflow-hidden ancestor silently kills
      // position:sticky (it becomes the containment context and never
      // scrolls); clip crops the halo bleed without creating a scroll
      // container, so the portrait rail can stick.
      className="bg-ink px-page-x relative min-h-svh overflow-clip"
    >
      {/* Text column — above the portrait panel in z. Beat gaps are
          viewport-scale so the section scrolls past 100vh in the reference
          order: headline → description → version + statistics.
          pointer-events: the full-width z-10 box would swallow every hover
          meant for the portrait rail beneath it (the glare hover never fired
          on desktop) — the box goes pointer-transparent, its children opt
          back in, and empty column space falls through to the rail. */}
      <Box className="about-inner pointer-events-none relative z-10 flex min-h-svh flex-col pt-[14svh] pb-[10svh] lg:pb-[8svh] *:pointer-events-auto">
        <ChapterEyebrow
          index="03"
          label="ABOUT"
        />

        {/* H1 — E v2 faces: roman inherits Switzer from the h2, focal words
            swap to the serif italic (D3). Word spans are React-owned (the
            StatementWords pattern — split-type line-groups nested spans as
            atomic units and would break wraps); spaces live BETWEEN the
            inline-block spans or they get swallowed. max-w widened so the
            text slightly overflows onto the portrait panel (inner is z-10). */}
        <Box
          as="h2"
          aria-label={profile.aboutStatement}
          className="about-statement font-display-lead text-statement text-paper mt-[5svh] lg:max-w-[72%]"
        >
          <Box
            as="span"
            aria-hidden
          >
            {statementWords.map((word, i) => (
              <Fragment key={i}>
                <Box
                  as="span"
                  className={cn("about-word inline-block", word.emphasized && "font-display-tail italic")}
                >
                  {word.text}
                </Box>
                {i < statementWords.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </Box>
        </Box>

        {/* H2 — description reveals line-by-line on its own position (the
            headline→description gate is physical layout distance now). */}
        <RevealText
          as="p"
          scrub={3 / damp}
          stagger={D.lineStagger}
          blurFrom={blurEnabled ? D.blurFromPx : 0}
          veiledOpacity={veiledOpacity}
          start={D.reveal.start}
          end={descEnd}
          className="about-item text-item text-paper mt-[12svh] max-w-[36ch] lg:mt-[14svh] lg:ml-[20%]"
        >
          {profile.bio}
        </RevealText>

        {/* The reference's "INFO" spot — our info action is the CV; resolves
            with the bio's veiled-blur grammar (.about-cv scrub, not an item). */}
        <Box className="about-cv mt-12 lg:ml-[20%]">
          <MagneticButton>
            <Link
              href={profile.cvUrl}
              className="magnetic-label text-item text-paper hover:text-accent group inline-flex items-center gap-3 font-mono uppercase underline decoration-1 underline-offset-8 transition-colors"
            >
              Download CV
              <Box
                as="span"
                aria-hidden
                className="text-accent transition-transform group-hover:translate-x-1"
              >
                →
              </Box>
            </Link>
          </MagneticButton>
        </Box>

        {/* Finale — statistics above the reference's version beat. Own
            reveal (not an .about-item). Top margin MATCHES the
            heading→description gap (owner instruction); the lg bottom margin
            gives the reveal window scroll room before the document ends
            (About is the last section) and holds the stuck portrait for a
            closing beat. */}
        <Box className="about-final mt-[12svh] lg:mt-[14svh] lg:mb-[24svh]">
          {/* Odometer cards (v5) — the glass-pill grammar overdriven:
              display-scale digit slots that roll like a machine counter, a
              self-drawing SVG hairline, one glare sweep each. Still one card
              per row, staircasing left → center → right at intrinsic size;
              the container is capped to the TEXT ZONE (the portrait rail
              owns the right 40vw, the inner column is padded by
              --spacing-page-x) so no card crosses into the portrait. */}
          <Box className="flex flex-col gap-y-5 lg:max-w-[calc(60vw-2*var(--spacing-page-x))]">
            {profile.stats.map((stat, i) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                className={i % 3 === 0 ? "self-start" : i % 3 === 1 ? "self-center" : "self-end"}
              />
            ))}
          </Box>
          <Box
            as="p"
            className="about-version font-display-lead text-chapter text-paper mt-10"
          >
            <Box
              as="span"
              aria-hidden
              className="text-muted"
            >
              →{" "}
            </Box>
            V{siteConfig.version}
          </Box>
        </Box>

        {/* Portrait — mobile: stacked full-width block at the end. */}
        <Box className="about-item -mx-page-x mt-14 lg:hidden">
          <EmberPortrait
            className="h-[55svh]"
            rounding="rounded-t-[3rem]"
          />
        </Box>
      </Box>

      {/* Portrait rail — desktop: right ~40vw for the whole section; the
          inner wrapper STICKS just below the top and releases flush at the
          section bottom (the reference's persistent portrait). */}
      <Box className="about-item absolute top-0 right-0 bottom-0 hidden w-[40vw] lg:block">
        <Box className="sticky top-[6svh] h-[88svh]">
          <EmberPortrait
            className="h-full"
            rounding="rounded-l-[clamp(3rem,9vw,11rem)]"
          />
        </Box>
      </Box>
    </Box>
  );
}
