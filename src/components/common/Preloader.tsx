import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import SplitType from "split-type";
import { gsap } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useLenis } from "@/hooks/useLenis";
import { useUIStore } from "@/store/useUIStore";
import { Box } from "@/components/common/Box";
import { PRELOADER_REFINE } from "@/utils/preloader.tunables";
import type { Profile } from "@/types/portfolio";

interface PreloaderProps {
  /** The hero wordmark strings — passed down from `__root` so common/ stays
   *  free of feature imports. MUST match the hero h1 (the morph lands the
   *  wordmark on its word rects and swaps under the flash). */
  name: Profile["heroName"];
}

/** Full-screen overlay, z-90 (design_system §11.0) — the name-as-shared-
 *  element morph (P0–P5, reference/preloader-refine-notes.md):
 *  P0/P1 the wordmark's chars cascade up (unclipped, settling rotation,
 *  staggered from the center outward) and it breathes dead-center while a
 *  real loading gate holds (fonts + aurora shader, min/max bounded); P2 it
 *  FLIP-morphs onto the hero h1's word rects while an EMBER SHEET wipes
 *  bottom→top, fully covering exactly as the name lands; after a full-cover
 *  hold an INK SHEET wipes bottom→top over it, and at ink full-cover one
 *  atomic call cuts to the page (invisible — the ink sheet matches the bg;
 *  the wordmark→h1 swap happens inside that cut, so the name never doubles).
 *  The name rides ABOVE both sheets the whole way (white on red, then white
 *  on ink as the boundary passes — the reference look, sans cyan per D3).
 *  Hero chrome + aurora ramp start at the reveal (P4, owned by HeroSection
 *  off the `preloaderDone` flip). Scroll unlocks when the last chrome group
 *  starts. Runs on every load/refresh. Reduced motion: plain ink cover,
 *  fonts-gated ≤ reducedMotion.holdMax, then a single cut. */
export function Preloader({ name }: PreloaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();
  const setPreloaderDone = useUIStore((s) => s.setPreloaderDone);
  const [finished, setFinished] = useState(false);

  const active = !prefersReducedMotion;

  // Reduced motion: no morph, no flash, no breath — hold under an ink cover
  // (still gated on fonts so the hero doesn't FOUT), then one cut. Scroll is
  // never locked here (lenis is null; native scroll stays live).
  useIsomorphicLayoutEffect(() => {
    if (active) return;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setPreloaderDone(true);
      setFinished(true);
    };
    document.fonts.ready.then(finish);
    const cap = window.setTimeout(finish, PRELOADER_REFINE.reducedMotion.holdMax * 1000);
    return () => window.clearTimeout(cap);
  }, [active, setPreloaderDone]);

  // Scroll-lock while the door is closed (the ONE lock mechanism — arch
  // RULE 3's Lenis owner exposes stop/start). Cleanup unlocks on `finished`.
  useIsomorphicLayoutEffect(() => {
    if (!active || finished) return;
    lenis?.stop();
    return () => lenis?.start();
  }, [active, finished, lenis]);

  useGSAP(
    () => {
      const root = ref.current;
      if (!active || !root) return;

      const { hold, center, travel, chars: charsCfg, sheets, chrome } = PRELOADER_REFINE;
      const wordmark = root.querySelector<HTMLElement>(".pre-wordmark");
      const markWords = gsap.utils.toArray<HTMLElement>(".pre-word", root);
      const ember = root.querySelector<HTMLElement>(".pre-sheet-ember");
      const ink = root.querySelector<HTMLElement>(".pre-sheet-ink");
      if (!wordmark || !ember || !ink || markWords.length !== 2) return;

      const cleanups: (() => void)[] = [];
      const cleanup = () => cleanups.forEach((fn) => fn());

      // Park via gsap.set, never CSS (house rule).
      gsap.set([ember, ink], { yPercent: 100 });
      gsap.set(wordmark, { yPercent: -50, scale: center.scaleFrom });

      // --- P0/P1 — char cascade + breath + loading gate ---------------
      // Chars rise UNCLIPPED from below with a settling rotation, staggered
      // from the center of the combined name outward (the reference's fill:
      // lead word right→left, tail word left→right). Split before paint.
      const split = new SplitType(markWords, { types: "chars" });
      cleanups.push(() => split.revert());
      gsap.set(split.chars, { y: charsCfg.rise, rotation: charsCfg.rotation, autoAlpha: 0 });
      gsap.to(split.chars, {
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: charsCfg.dur,
        delay: charsCfg.delay,
        stagger: { each: charsCfg.staggerEach, from: "center" },
      });

      // Gate: fonts + aurora first-frame + hero mounted (the route chunk is
      // code-split — the morph needs the h1 rects). The manifesto GLB preload
      // is already kicked by the lazy island at mount; it streams, per D2.
      const auroraReady = new Promise<void>((resolve) => {
        if (useUIStore.getState().auroraReady) return resolve();
        const unsub = useUIStore.subscribe((s) => {
          if (s.auroraReady) {
            unsub();
            resolve();
          }
        });
        cleanups.push(unsub);
      });
      // Plain DOM query, NOT gsap.utils.toArray: inside this useGSAP context
      // toArray silently scopes selectors to the overlay ref (verified —
      // callbacks like onRepeat re-enter the context), and the h1 lives
      // outside it.
      const heroWords = () => Array.from(document.querySelectorAll<HTMLElement>(".hero-name .hero-word"));
      const heroMounted = new Promise<void>((resolve) => {
        const poll = window.setInterval(() => {
          if (heroWords().length === 2) {
            window.clearInterval(poll);
            resolve();
          }
        }, 50);
        cleanups.push(() => window.clearInterval(poll));
      });
      // Cleanup-registered timers: a StrictMode/RM remount must not let a
      // stale closure fire openDoor/swap against the live run's DOM.
      const wait = (s: number) =>
        new Promise<void>((r) => {
          const id = window.setTimeout(r, s * 1000);
          cleanups.push(() => window.clearTimeout(id));
        });

      let gateOpen = false;
      Promise.all([document.fonts.ready, auroraReady, heroMounted, wait(hold.min)]).then(() => {
        gateOpen = true;
      });
      // hold.max is a HARD cap — it force-opens the door regardless of the
      // breath boundary (worst case: a ≤8% scale snap on this degenerate
      // path). openDoor's own guard dedups the two paths.
      wait(hold.max).then(() => {
        gateOpen = true;
        openDoor();
      });

      // Breath loop: proceed only at the scaleTo boundary (odd iteration
      // ends) so P2 never jump-cuts mid-breath.
      let iteration = 0;
      const breath = gsap.to(wordmark, {
        scale: center.scaleTo,
        duration: center.breathDur,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        onRepeat: () => {
          iteration += 1;
          if (gateOpen && iteration % 2 === 1) openDoor();
        },
      });

      // --- P2/P3 — morph, sheet wipes, ink-covered cut -----------------
      let doorOpened = false;
      let swapped = false;

      const swap = (targets: HTMLElement[]) => {
        if (swapped) return;
        swapped = true;
        // The sanctioned swap window: one atomic frame under full ink cover —
        // the ink sheet matches the page bg, so the cut is invisible.
        gsap.set(targets, { autoAlpha: 1 });
        gsap.set(wordmark, { autoAlpha: 0 });
        gsap.set([ember, ink], { autoAlpha: 0 });
        gsap.set(root, { backgroundColor: "transparent" });
        setPreloaderDone(true);
      };

      const openDoor = () => {
        if (doorOpened) return;
        doorOpened = true;
        breath.kill();
        gsap.set(wordmark, { scale: center.scaleTo });

        // Measure NOW — always post-resize-fresh. The h1 sits laid out under
        // the overlay at autoAlpha 0 (visibility hides, layout stays), its
        // parallax transform still 0 (inert + overlay block pointermove).
        const targets = heroWords();
        const targetRects = targets.map((el) => el.getBoundingClientRect());
        const markRects = markWords.map((el) => el.getBoundingClientRect());

        // Degenerate maxHold path with the route chunk still absent: no rects
        // to land on — cut straight through the swap contract.
        if (targetRects.length !== 2) {
          swap(targets);
          gsap.delayedCall((chrome.order.length - 1) * chrome.stagger, () => setFinished(true));
          return;
        }

        const revealAt = travel.dur + sheets.hold + sheets.inkIn;
        const tl = gsap.timeline({ onComplete: () => setFinished(true) });
        markWords.forEach((el, i) => {
          const c = markRects[i];
          const t = targetRects[i];
          tl.to(
            el,
            {
              x: t.left - c.left,
              y: t.top - c.top,
              scale: t.width / c.width,
              transformOrigin: "0 0",
              duration: travel.dur,
              ease: travel.ease,
            },
            0,
          );
        });
        // Ember sheet wipes bottom→top, fully covering exactly as the name
        // lands; ink sheet follows after the hold; the atomic cut fires at
        // ink full-cover.
        tl.to(
          ember,
          { yPercent: 0, duration: sheets.emberIn, ease: sheets.ease },
          Math.max(0, travel.dur - sheets.emberIn),
        )
          .to(ink, { yPercent: 0, duration: sheets.inkIn, ease: sheets.ease }, travel.dur + sheets.hold)
          .call(() => swap(targets), [], revealAt)
          // Overlay outlives the reveal just long enough that unmount (and the
          // scroll-lock cleanup → lenis.start) lands exactly when the LAST
          // chrome group starts (D4 unlock point).
          .to({}, { duration: (chrome.order.length - 1) * chrome.stagger }, ">");

        // Resize mid-morph: snap-complete the swap, no re-tween.
        const onResize = () => {
          if (swapped) return;
          tl.kill();
          swap(targets);
          gsap.delayedCall((chrome.order.length - 1) * chrome.stagger, () => setFinished(true));
        };
        window.addEventListener("resize", onResize);
        cleanups.push(() => window.removeEventListener("resize", onResize));
      };

      return cleanup;
    },
    { scope: ref, dependencies: [active], revertOnUpdate: true },
  );

  if (finished) return null;

  // Reduced motion: a plain ink cover until the fonts-gated cut.
  if (!active) {
    return (
      <Box
        aria-hidden
        className="bg-ink fixed inset-0 z-90"
      />
    );
  }

  return (
    <Box
      ref={ref}
      aria-hidden
      // pointer-events-none: inert + the Lenis lock already block interaction,
      // and the overlay must not eat clicks while it lingers transparent (P4).
      className="bg-ink pointer-events-none fixed inset-0 z-90"
    >
      <Box className="pre-sheet-ember bg-accent absolute inset-0" />
      <Box className="pre-sheet-ink bg-ink absolute inset-0" />
      <Box
        className="pre-wordmark absolute inset-x-0 flex items-baseline justify-center"
        style={{
          top: PRELOADER_REFINE.center.y,
          fontSize: PRELOADER_REFINE.center.fontSize,
          gap: PRELOADER_REFINE.center.gap,
        }}
      >
        <Box
          as="span"
          className="pre-word text-hero-line font-display-lead font-medium whitespace-nowrap text-paper"
          style={{ fontSize: "inherit" }}
        >
          {name.lead}
        </Box>
        <Box
          as="span"
          className="pre-word text-hero-line font-display-tail italic whitespace-nowrap text-paper"
          style={{ fontSize: "inherit" }}
        >
          {name.tail}
        </Box>
      </Box>
    </Box>
  );
}
