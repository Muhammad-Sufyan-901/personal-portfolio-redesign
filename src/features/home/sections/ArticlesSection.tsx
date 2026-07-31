import { Fragment, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { Box, ChapterEyebrow, Image, Link, MagneticButton } from "@/components/common";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { articles, ARTICLES_AUTHOR, ARTICLES_INDEX_URL, ARTICLES_STATEMENT } from "@/features/home/data/articles.data";
import { ARTICLES } from "@/features/home/utils/articles.tunables";

// Word-span statement grammar (Journey/Gallery precedent): RevealText can't
// wrap nested emphasis spans — split-type lines are atomic — so the focal
// phrase has to be React-owned markup, split at module scope.
const statementWords = ARTICLES_STATEMENT.text.split(" ");
const focalWords = new Set(ARTICLES_STATEMENT.focalWords.map((word) => word.toLowerCase()));
const isFocalWord = (word: string) => focalWords.has(word.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase());

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const pad2 = (value: number) => String(value).padStart(2, "0");

/** Chapter 09 Articles — the writing shelf.
 *
 *  A pinned section whose article "clippings" scrub sideways. The pin + damped
 *  applier is Gallery's engine verbatim (freeze-on-pause, exact reverse
 *  retrace); what differs is that this rail carries readable, clickable
 *  content, and the clipping is a tall narrow column so the chapter reads as a
 *  different medium from Journey's landscape cards directly above it.
 *
 *  Travel distance is measured, never tuned — add an article to the data file
 *  and the pin lengthens itself. */
export function ArticlesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLUListElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  // Degenerate-rail guard. With few enough articles (or a wide enough screen)
  // the whole track already fits, and there is nothing to scrub — pinning
  // would eat a viewport of scroll to move the rail zero pixels. When it fits,
  // fall through to the same flow layout reduced motion uses.
  const [fitsInView, setFitsInView] = useState(false);
  useIsomorphicLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setFitsInView(track.scrollWidth <= window.innerWidth + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const staticMode = prefersReducedMotion || fitsInView;

  useGSAP(
    () => {
      if (staticMode) return;

      const track = trackRef.current;
      if (!track) return;

      const cards = gsap.utils.toArray<HTMLElement>(".articles-card");
      const coverSetters = cards.map((card) => {
        const cover = card.querySelector<HTMLElement>(".articles-cover");
        return cover ? gsap.quickSetter(cover, "x", "px") : null;
      });
      const setTrackX = gsap.quickSetter(track, "x", "px");
      const setProgress = progressRef.current ? gsap.quickSetter(progressRef.current, "scaleX") : null;

      // Measured, not tuned: the whole choreography is derived from how wide
      // the track actually is at this viewport. offsetLeft/offsetWidth are
      // transform-independent, so they stay valid while the track is
      // translated — no need to un-transform before re-measuring.
      let distance = 0;
      let metrics: { center: number; width: number }[] = [];
      const measure = () => {
        distance = Math.max(0, track.scrollWidth - window.innerWidth);
        metrics = cards.map((card) => ({
          center: card.offsetLeft + card.offsetWidth / 2,
          width: card.offsetWidth,
        }));
      };

      // Statement de-veil, driven off pin progress rather than its own
      // ScrollTrigger (Gallery precedent) — the heading is the fixed frame the
      // clippings travel past, so it must finish reading before the first one
      // arrives. Words are visible by markup default; only this branch hides
      // them, which is what keeps the reduced-motion path readable.
      const words = gsap.utils.toArray<HTMLElement>(".articles-word");
      gsap.set(words, { autoAlpha: 0, filter: `blur(${ARTICLES.heading.blurFrom}px)` });
      const headingTl = gsap.timeline({ paused: true }).to(words, {
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: ARTICLES.heading.wordStagger,
        ease: "none",
      });
      const [revealFrom, revealTo] = ARTICLES.heading.revealSpan;

      measure();

      const state = { target: 0, rendered: 0, converged: true, step: -1 };
      const lastIndex = Math.max(1, articles.length - 1);

      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => "+=" + Math.round(distance + window.innerHeight * ARTICLES.tailVh),
        pin: true,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          measure();
          state.target = self.progress;
          state.converged = false;
        },
        onUpdate: (self) => {
          state.target = self.progress;
          headingTl.progress(clamp01((self.progress - revealFrom) / (revealTo - revealFrom)));
        },
        // will-change only while the pin is live — absent at rest, so the
        // compositor isn't holding layers for a section nobody is looking at.
        onToggle: (self) => {
          track.style.willChange = self.isActive ? "transform" : "";
        },
      });

      const apply = (progress: number) => {
        const x = -distance * progress;
        setTrackX(x);

        if (setProgress) setProgress(progress);

        const step = Math.round(progress * lastIndex) + 1;
        if (step !== state.step) {
          state.step = step;
          if (counterRef.current) counterRef.current.textContent = pad2(step);
        }

        // No `=== 0` early-out: the tunable is `as const`, so comparing the
        // literal to 0 is a type error, and a zero multiply already disables
        // the effect for the handful of cards in the rail.
        const viewport = window.innerWidth;
        for (let i = 0; i < metrics.length; i += 1) {
          const setCoverX = coverSetters[i];
          if (!setCoverX) continue;
          // −1 at the left edge → +1 at the right; the cover slides against
          // the card's travel, which is what reads as depth.
          const offset = ((metrics[i].center + x) / viewport - 0.5) * 2;
          setCoverX(-gsap.utils.clamp(-1, 1, offset) * ARTICLES.coverParallaxPx);
        }
      };

      // Damp applier on the single gsap.ticker (Gallery/Skills precedent — no
      // second RAF): chases the scrub target, lands one exact write on
      // convergence, then idles. Freeze-on-pause and exact reverse retrace
      // come free with it.
      const tick = (_time: number, deltaTime: number) => {
        const dt = Math.min(deltaTime / 1000, 1 / 30);
        const k = 1 - Math.exp(-ARTICLES.damp * dt);
        state.rendered += (state.target - state.rendered) * k;
        if (Math.abs(state.target - state.rendered) < 1e-4) {
          if (state.converged) return;
          state.rendered = state.target;
          state.converged = true;
        } else {
          state.converged = false;
        }
        apply(state.rendered);
      };
      gsap.ticker.add(tick);
      apply(0);

      // Keyboard reachability. While the track is translated, tabbing into an
      // off-screen clipping would focus something the visitor cannot see, so
      // map the focused card's index back to a page scroll position and jump
      // there. `immediate` because the browser has already moved focus — an
      // eased catch-up would just lag behind the caret.
      const onFocusIn = (event: FocusEvent) => {
        const card = (event.target as HTMLElement).closest(".articles-card");
        if (!card) return;
        const index = cards.indexOf(card as HTMLElement);
        if (index < 0) return;
        // Derived from the card's own measured centre, not `index / lastIndex`:
        // the tail (`ARTICLES.tailVh`) means the last card is NOT reached at
        // progress 1, so an even index split lands every card short and the
        // final one past itself. `metrics` already holds the exact answer.
        const p = clamp01((metrics[index].center - window.innerWidth / 2) / distance);
        const y = st.start + p * (st.end - st.start);
        if (lenis) lenis.scrollTo(y, { immediate: true });
        else window.scrollTo(0, y);
      };
      track.addEventListener("focusin", onFocusIn);

      return () => {
        track.removeEventListener("focusin", onFocusIn);
        gsap.ticker.remove(tick);
        st.kill();
      };
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, lenis], revertOnUpdate: true },
  );

  // An empty rail would eat a whole viewport of pinned scroll to show nothing.
  if (articles.length === 0) return null;

  return (
    <Box
      as="section"
      id="articles"
      ref={sectionRef}
      className={cn(
        "bg-ink relative isolate flex flex-col",
        // Reduced motion: normal flow + native horizontal scroll. No pin, no
        // transform, no measured travel — every clipping stays reachable by
        // scroll and by keyboard, which is the whole contract.
        staticMode ? "py-section" : "h-svh overflow-hidden",
      )}
    >
      {/* Header row. `justify-between` parks the action opposite the statement
          (owner ask 2026-08-01); `items-end` sits it on the statement's last
          baseline rather than floating at the top of a four-line block.
          `flex-wrap` is what makes that safe below lg — the action drops under
          the statement instead of crushing its measure.
          The svh padding is deliberately lean: this section is PINNED, so every
          pixel spent above the eyebrow comes straight out of the card height in
          the rail below. */}
      <Box className="px-page-x flex flex-wrap items-end justify-between gap-x-10 gap-y-6 pt-[6svh]">
        <Box className="min-w-0">
          <ChapterEyebrow
            index="09"
            label="Writing"
          />
          <Box
            as="h2"
            /* The 26ch measure is the reading width this statement wants, but on
               a short viewport it costs four lines, and every line it takes comes
               straight off the rail below — at 1024×600 that starved the cards
               down to 234px and squeezed the photograph out of a photo-led card.
               Horizontal room is exactly what is abundant at that size, so trade
               measure for height there and let it run to two lines. */
            className="articles-statement font-display-lead text-statement text-paper mt-6 max-w-[26ch] [@media(max-height:768px)]:max-w-[58ch] lg:[@media(max-height:768px)]:text-item"
          >
            {statementWords.map((word, i) => (
              <Fragment key={i}>
                <Box
                  as="span"
                  className={cn("articles-word inline-block", isFocalWord(word) && "font-display-tail italic")}
                >
                  {word}
                </Box>
                {i < statementWords.length - 1 ? " " : ""}
              </Fragment>
            ))}
          </Box>
        </Box>

        {/* House CTA, same shape as About's "Download CV" and Skills' "Contact
            Me" — MagneticButton wrapping a Link whose `.magnetic-label` gets
            the counter-move. Sized at eyebrow rather than About's `text-item`:
            it sits beside a display-scale statement and is a secondary path,
            so it should read as an offer, not compete for the same voice. */}
        <MagneticButton className="mb-2 shrink-0">
          <Link
            href={ARTICLES_INDEX_URL}
            className="magnetic-label font-mono text-eyebrow text-paper hover:text-accent group inline-flex items-center gap-3 tracking-[0.08em] uppercase underline decoration-1 underline-offset-8 transition-colors"
          >
            View All Articles
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

      {/* Rail. In the pinned branch the row is height-constrained (`min-h-0`
          under `flex-1`) and every card is `h-full`, so the rail itself decides
          how tall a clipping is — not its copy. That is what keeps cards from
          overflowing a short viewport and what makes them all one height
          regardless of title length.
          Since the byline-card redesign (2026-08-01) the cover is `absolute`,
          so it neither absorbs nor demands height; the only in-flow content is
          the byline and the text block, pushed apart by `justify-between`. The
          older "the cover absorbs whatever height is left" contract is gone
          along with the frame it described. */}
      <Box
        className={cn(
          "flex",
          // Lean padding in the pinned branch, for the same reason the header's
          // svh padding is lean: the section is a fixed viewport, so gutters
          // here are subtracted directly from card height (owner ask
          // 2026-08-01 — taller cards).
          staticMode ? "mt-14 items-start overflow-x-auto" : "min-h-0 flex-1 items-center pt-6 pb-6",
        )}
      >
        {/* `max-h` is the ceiling on how tall a clipping may get on a very tall
            viewport; below it the rail's own height decides, and `items-center`
            parks any shortfall symmetrically instead of at the top. Raised
            34rem → 42rem with the 2026-08-01 taller-cards pass: at 1080 the old
            cap was binding at exactly the available height, so it would have
            eaten the reclaimed padding before a single pixel reached a card. */}
        <Box
          as="ul"
          ref={trackRef}
          className={cn("px-page-x flex gap-6", staticMode ? "snap-x snap-mandatory" : "h-full max-h-[42rem]")}
        >
          {articles.map((article, i) => (
            <Box
              as="li"
              key={article.url}
              className={cn(
                "articles-card w-[78vw] shrink-0 sm:w-[52vw] lg:w-[clamp(20rem,32vw,30rem)]",
                // The cover is absolute now, so it no longer sizes the card and
                // the static branch needs its own silhouette. `aspect-[3/4]`
                // keeps the portrait clipping proportion; the 34rem cap is the
                // pinned track's own, so both modes agree on the tallest a
                // clipping may be.
                staticMode ? "aspect-[3/4] max-h-[34rem] snap-start" : "h-full",
              )}
            >
              <Link
                href={article.url}
                data-cursor="Read"
                /* Explicit name: without it the accessible name concatenates
                   byline + title + description + "View Details" — roughly 40
                   words per card, twelve times over. */
                aria-label={`${article.title} — ${article.publication}`}
                className="group border-line rounded-card relative flex h-full flex-col justify-between overflow-hidden border p-6"
              >
                {/* Full-bleed cover as a real image element, never
                    `style={{ backgroundImage }}`: a CSS background gets no
                    `loading="lazy"` (twelve cards are all in the DOM at once),
                    no `Image` error fallback, and would force the parallax onto
                    `background-position` — a paint-layer property repainted
                    every ticker frame instead of a composited transform. */}
                <Image
                  src={article.cover}
                  alt=""
                  aria-hidden
                  priority={i < 2 ? "eager" : "lazy"}
                  className={cn(
                    // Damped at REST, not just on hover. The covers are
                    // programming photography, so most of them are screenshots
                    // of code — and a card title set over other, legible text
                    // is noise no scrim fixes: the gradient runs bottom-up, so
                    // it never reaches the code sitting behind the byline. At
                    // half brightness the image reads as texture and
                    // atmosphere, which is the only job it has here.
                    "articles-cover duration-(--dur-fast) absolute inset-0 h-full w-full brightness-50 transition-[filter] ease-out group-hover:brightness-[.35]",
                    // scale-115 is load-bearing, not decoration: it gives the
                    // parallax shift somewhere to travel without exposing the
                    // card edge (ceiling note on coverParallaxPx). No parallax
                    // in static mode, so no overscan there either.
                    // `transition-[filter]` and never a bare `transition`: the
                    // ticker writes `transform` to this element every frame,
                    // and a CSS transition on transform would ease every one of
                    // those writes into lag.
                    !staticMode && "scale-115",
                  )}
                />

                {/* Permanent legibility scrim. The reference darkens only on
                    hover, which leaves resting text sitting on a raw
                    photograph. One element does both jobs: opaque ink under the
                    text block, a 25% floor at the top so the photograph still
                    reads behind the byline. */}
                <Box
                  aria-hidden
                  className="from-ink via-ink/90 to-ink/30 absolute inset-0 bg-linear-to-t via-40% to-80%"
                />

                {/* Byline. `z-10` works without `relative` because these are
                    flex items — that is what lifts them over the absolute
                    scrim. The ink pill is what actually buys AA up here: the
                    scrim is deliberately thin at the top, so contrast has to be
                    purchased locally rather than by darkening the whole card. */}
                <Box className="border-paper/10 bg-ink/85 z-10 flex w-fit items-center gap-2.5 rounded-full border p-1 pr-3.5 backdrop-blur-md">
                  <Image
                    src={ARTICLES_AUTHOR.avatar}
                    alt=""
                    aria-hidden
                    className="size-8 rounded-full"
                  />
                  <Box className="flex flex-col">
                    <Box
                      as="span"
                      className="font-mono text-meta text-paper-bright leading-tight"
                    >
                      {ARTICLES_AUTHOR.name}
                    </Box>
                    {/* Reading time only — `publication · date` lives above the
                        title instead. Three facts in this pill wrapped "7 min
                        read" onto a second line at 390px and again at 1024×600,
                        leaving one ragged pill in a rail of tidy ones; the
                        card's full width below has room the pill does not.
                        text-paper/70, not text-muted: at text-meta this line
                        needs 4.5:1, and muted does not clear that over a
                        photograph even inside this pill. */}
                    {article.readingTime && (
                      <Box
                        as="span"
                        className="font-mono text-meta text-paper/70 leading-tight"
                      >
                        {article.readingTime}
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box className="z-10">
                  {/* Displaced from the byline pill, which is too narrow to
                      hold it without wrapping. Hidden on short viewports, where
                      the bottom block has to give its remaining pixels to the
                      title and the CTA. */}
                  <Box
                    as="p"
                    className="font-mono text-meta text-paper/70 mb-2 uppercase [@media(max-height:768px)]:hidden"
                  >
                    {article.publication} · {article.date}
                  </Box>
                  <Box
                    as="h3"
                    /* Safety valve, not a style: the rail fixes card height, so
                       a runaway title would otherwise push the CTA out of the
                       card on a short viewport. */
                    className="text-item text-paper-bright line-clamp-2 font-sans font-semibold"
                  >
                    {article.title}
                  </Box>
                  <Box
                    as="p"
                    className="text-body text-paper mt-2 line-clamp-2 [@media(max-height:768px)]:line-clamp-1"
                  >
                    {article.description}
                  </Box>
                  {/* Deliberately NOT a shadcn Button: the whole card is one
                      anchor, and a real button or link nested inside one is
                      invalid interactive content — it would also add a
                      second tab stop per card, which the focusin handler above
                      assumes does not exist. This is the affordance label (the
                      same call the old "Read ↗" span made) wearing the house
                      pill from Journey / Projects / MenuButton. Ember arrives
                      on hover only, so the resting fold keeps its single accent
                      moment for the progress rail below (Scalpel Rule).
                      ponytail: promote to a real anchor with
                      `after:absolute after:inset-0` the day a card needs two
                      destinations. Not before. */}
                  <Box
                    as="span"
                    className="border-paper/15 bg-paper/10 text-paper-bright font-mono text-meta group-hover:border-accent/40 group-hover:bg-accent-tint group-hover:text-accent duration-(--dur-fast) mt-5 inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 uppercase backdrop-blur-md transition-colors ease-out"
                  >
                    View Details
                    <Box
                      as="span"
                      aria-hidden
                      className="duration-(--dur-fast) transition-transform ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    >
                      ↗
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Scrub position. Decorative in the static branch's terms — the native
          scrollbar already reports position there — so it only exists while
          the rail is actually pinned. */}
      {!staticMode && (
        <Box
          aria-hidden
          className="px-page-x flex items-center gap-5 pb-6"
        >
          {/* 2px, not the system's 1px hairline: this is a meter, not a
              boundary, and at 1px the chapter's single ember moment washed out
              to grey on screen. The Hairline Depth Rule governs borders. */}
          <Box className="bg-line relative h-0.5 flex-1 overflow-hidden">
            <Box
              ref={progressRef}
              className="bg-accent absolute inset-0 origin-left scale-x-0"
            />
          </Box>
          <Box
            as="p"
            className="font-mono text-meta text-muted tabular-nums uppercase"
          >
            <Box
              as="span"
              ref={counterRef}
              className="text-paper"
            >
              01
            </Box>
            {` / ${pad2(articles.length)}`}
          </Box>
        </Box>
      )}
    </Box>
  );
}
