---
name: circle-wipe
description: Viewport-anchored circle wipe between chapters (10 Contact) — fixed disc, scrubbed scale, cover-radius math, handoff, and ordering a beat after the wipe
metadata:
  type: reference
---

# Circle wipe (10 Contact, 2026-08-04)

The reusable recipe for a full-viewport wipe that reveals an incoming chapter.
Live in `src/features/home/sections/ContactSection.tsx`. Supersedes the dome cap
(see "Dead approach" below).

## Shape

A `fixed` disc, rendered only when `!prefersReducedMotion`:

```
bg-invert-bg pointer-events-none fixed top-full left-1/2 z-40
h-[50vmax] w-[50vmax] -translate-x-1/2 -translate-y-1/2 rounded-full
```

`top-full left-1/2` + the negative translates put its centre exactly on the
**viewport's** bottom-centre. `z-40` sits above the previous chapter's stacking
context and below the `z-60` site chrome (HUD / MenuButton). `pointer-events-none`
is load-bearing — at cover scale it lies over the clickable outgoing section.

## The layer model — get this wrong and it reads as a rectangle

**THE most important part, and the one that is invisible until you screenshot it.**
The incoming sheet must NOT paint its own background during the wipe, or the screen
reads as a rising light *rectangle with a bulge on top* instead of a circle. Reference
frame `b_0045` is the proof: the disc spans only x≈625–1300 at the viewport's bottom
edge and **both bottom corners are dark**.

Give the sheet a **static** `relative z-50` (above the `z-40` disc) and hold its
background transparent until the handoff:

| phase | disc | sheet bg | sheet content |
| --- | --- | --- | --- |
| wipe (`top bottom` → `top 50%`) | growing | **transparent** | `autoAlpha: 0` |
| beat (`top 50%` → `top top`) | held at cover | **transparent** | timeline plays |
| settled (past `top top`) | hidden | opaque | visible |

No mid-animation z-index juggling — the z-order is static, only the background and the
disc's visibility flip. And because the sheet is *above* the disc, the content beat can
play over a full-cover disc while the sheet is still transparent: that is how the
heading starts at full cover yet finishes long before the sheet has travelled to the top
of the viewport.

Set the transparency in JS, **after** the reduced-motion early-return, so the
`bg-invert-bg` class remains the default for the reduced-motion and no-JS paths
(`useGSAP`'s revert restores it on cleanup):

```js
if (sheet) gsap.set(sheet, { backgroundColor: "transparent" });
```

## Drive

One transform-only scrub on the *incoming sheet*:

```js
gsap.fromTo(circle, { scale: 0 }, {
  scale: () => coverScale(circle),
  ease: "none",
  scrollTrigger: {
    trigger: sheetRef.current, start: "top bottom", end: "top 50%",
    scrub: true, invalidateOnRefresh: true,
    onToggle: (self) => { circle.style.willChange = self.isActive ? "transform" : ""; },
  },
});
```

**Pacing: `end: "top 50%"`, i.e. half a viewport of scroll — not a full one.** Measured
off `contact-refine.mp4`: radius grows 2.63px per 1px of scroll, and cover at 1920×1080
is 1445px, so the wipe completes in ~549px ≈ 0.51 viewport. Running it over a full
viewport (the first build) makes it feel sluggish and unlike the reference.

**Anchoring to the viewport (fixed) rather than the section is the whole point.**
A section-anchored shape's centre rises with the page as you scroll; the reference's
centre does not move at all (measured stable at (720, 900) across the entire scrub at
1440×900). Transform-only also means no `clip-path: circle()` repaint of a
full-viewport element every frame.

## Three traps

1. **Never derive the base radius from `innerWidth`/`innerHeight`.** CSS `vmax`
   (and `svh`) resolve against the **layout** viewport; `innerHeight` tracks the
   **visual** one. On mobile they diverge with URL-bar chrome — at 390×844 they read
   844 vs 953, and a derived `0.25 × max(innerWidth, innerHeight)` base left the disc
   **95px short of the corners**. Measure the element instead:

   ```js
   const coverScale = (disc) => {
     const base = disc.offsetWidth / 2;   // layout box — transform can't feed back in
     return base ? (Math.hypot(innerWidth / 2, innerHeight) / base) * 1.02 : 1;
   };
   ```

   `Math.hypot(innerWidth / 2, innerHeight)` = bottom-centre to the farthest corner;
   `× 1.02` is antialiasing headroom. Verified after the fix: desktop 1176 ≥ 1153
   needed, mobile 998 ≥ 978.

2. **Hand off with a real `ScrollTrigger.create`, not the scrub's `onLeave`.** The
   handoff sits at `top top` (one half-viewport *after* the wipe ends), where the sheet
   finally fills the viewport and takes its background back while the disc retires:

   ```js
   ScrollTrigger.create({
     trigger: sheet, start: "top top",
     onEnter:     () => { gsap.set(sheet, { backgroundColor: "" });            gsap.set(circle, { autoAlpha: 0 }); },
     onLeaveBack: () => { gsap.set(sheet, { backgroundColor: "transparent" }); gsap.set(circle, { autoAlpha: 1 }); },
   });
   ```

   It must be a standalone trigger because it has to resolve correctly when the page
   **loads already scrolled into the section** — ScrollTrigger evaluates `onEnter`
   against the current position on refresh; a scrub tween's `onLeave` does not. Flip the
   background and the disc in the SAME callback so no frame can have a transparent sheet
   over a hidden disc (that would be a dark flash).

3. **Toggle `will-change` in `onToggle`.** A permanently promoted `50vmax` layer is a
   real memory cost (same reasoning as the Articles rail).

## Ordering a beat after the wipe

Anchor a `once` timeline to the scrub's **`end`** position (not `top top`) so the beat
starts the frame the disc reaches full cover — "wipe completes → heading → content"
becomes structural, not a timing coincidence:

```js
gsap.timeline({ scrollTrigger: { trigger: sheet, start: "top 50%", once: true } })  // == the scrub's end
  .from(".contact-heading", { x: () => window.innerWidth, autoAlpha: 0, duration: 1.2 })
  .from(".contact-lede", { autoAlpha: 0, duration: 0.4 }, "-=0.75")
  .from(".contact-pair-lead .contact-word", { autoAlpha: 0, y: 14, stagger: 0.03 }, "-=0.55")
  .from(".contact-pair-lead .contact-panel", { autoAlpha: 0, y: 32 }, "<");
```

The heading enters from a **full viewport width** to the right (`x: () => window.innerWidth`,
function-based so `invalidateOnRefresh` re-resolves it) over ~1.2s. The default ease is
already `power4.out` (`src/lib/gsap.ts`), which matches the reference's measured
deceleration (left edge 1655→995→840→390→200 across 0.9s). An `xPercent: 20`-style nudge
is far too small — it reads as a twitch, not a slide.

**A full-viewport slide needs `overflow-x-clip` on the sheet**, or it is real horizontal
page scroll. Assert it — `scrollbar-width: none` + Lenis hide X overflow from visual checks.

**Reveal primitives carry their own trigger and will fire while the screen is still
covered** — `RevealText mode="chars"` on the heading fired at `top 80%`, i.e. mid-wipe
in the dark. Hand-roll the tween into the timeline instead. Content below the fold
(later pairs, socials, form) can keep independent `top 85%, once` triggers; geometry
already orders it last.

## Dead approach — the dome cap (2026-08-03 → 2026-08-04)

A `130vw` half-ellipse (`rounded-t-[50%_100%]`) pinned `absolute bottom-[calc(100%-1px)]`
above the section, scrubbing `scaleY: 1 → 0.001` with `transformOrigin: "50% 100%"`.
Read as a semicircle rising over the outgoing chapter. Rejected because it is
section-anchored (centre rises with the page) and because its `130vw` width forced
`overflow-x-clip` on the section root to stop real horizontal page pan. Neither
constraint exists with a fixed disc.

## Verifying it

chrome-devtools MCP may fail to attach ("browser is already running for
…/chrome-profile") — use the puppeteer-core fallback in
[qa-auditor/runtime-smoke-testing.md](../qa-auditor/runtime-smoke-testing.md). Assert:
circle centre stable across ≥4 scrub samples; `renderedRadius >= Math.hypot(innerWidth/2, innerHeight)`
at the end (do **not** re-assert a derived formula — that's what was broken);
`opacity 0` + `visibility hidden` past the handoff; no horizontal overflow at 1440 and 390.

Park at exact trigger positions using the dev-only handle `window.__ScrollTrigger`
(exposed in `src/lib/gsap.ts` under `import.meta.env.DEV`) instead of guessing pixel
offsets — `getAll().find(t => t.trigger === sheet && t.vars.scrub)` then
`scrollTo(0, st.start + (st.end - st.start) * p)`. Note **`t.vars.scrub`, not `t.scrub`**;
the latter is undefined on the instance and the `find` silently returns nothing.

**`elementFromPoint` cannot answer "is this painted?"** It hit-tests geometry, so a
full-width sheet returns as the hit target even when it is completely transparent —
a corner probe built on it reports "sheet" for every phase and proves nothing. For the
only-the-circle-is-light check, use a **screenshot**, plus `getComputedStyle(sheet).backgroundColor`
as the numeric companion.

Dark-flash check at the handoff: sweep ±120px across it and assert **zero** frames where
the sheet is transparent AND the disc is not both visible and covering.

Harness gotcha that cost a false "the heading never animates": measure the trigger's
document offset **after** the page has settled at a deep scroll position. Measuring
`getBoundingClientRect().top + scrollY` at scroll 0 (before fonts/images finish and
ScrollTrigger refreshes) yields a stale target that lands *past* the `once` trigger, so
every sample reads the settled end state.
