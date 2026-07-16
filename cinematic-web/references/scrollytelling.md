# Scrollytelling — beat system, video modes, kinetic type

## Architecture: one number drives everything

Fixed full-screen stage (canvas/video/text are `position:fixed`), plus an invisible
`#scroller` div whose height creates the scrollbar. Each frame, convert scroll into a
"beat float":

```js
scroller.style.height = (N*140 + 40) + 'vh';           // ~140vh per beat
const bfTarget = clamp(scrollY / (1.40*innerHeight), 0, N-1);
bf = lerp(bf, bfTarget, 0.07);                          // inertia — never use raw value
```

`bf` = 2.4 means "between beat 2 and 3". Camera position, text opacity, video state,
HUD — all are pure functions of `bf`. This makes scrubbing bidirectional for free and
keeps every subsystem in sync.

This beat-float system is deliberately hand-rolled — it replaces Lenis (the `lerp(bf,…,0.07)`
inertia IS the smooth-scroll) and GSAP ScrollTrigger (the fixed stage + per-beat weight IS
pinning + scrub) to keep the output a single dependency-free file. If you're porting a
GSAP/Lenis mental model: `pin:true` → fixed stage, `scrub` → `bf` is the progress, a
ScrollTrigger timeline → any function of `bf`. Don't add GSAP/Lenis unless the user asks;
they buy nothing here and break the zero-build promise.

Per-beat weight (for fading anything per-section):
```js
const w = clamp(1 - Math.abs(bf - i) * 1.45);   // 1 at center, 0 away
```

**Crossfade rule:** adjacent beats' visible windows MUST overlap. If beat i fades out
completely before beat i+1 fades in, the user sees dead black between sections — the
most common scrollytelling bug. With the weight formula above, factor ≤1.5 guarantees
overlap at the midpoint.

## Video backgrounds — three modes, one decision rule

Full-frame video per beat. Two implementations:
- **DOM layer**: `<video>` fixed behind everything (no WebGL post applies to it).
- **In-scene** (preferred with 3D): VideoTexture on a plane PARENTED TO THE CAMERA at
  z≈-14, scaled to fill the frustum, `fog:false`, `renderOrder:-5`. Bloom/grain/CA then
  grade the video too — much more cohesive. Cover-fit by adjusting `tex.repeat/offset`
  against screen vs video aspect.

Modes:

| mode | behavior | when |
|---|---|---|
| play-when-centered | video plays (looped) only while its beat is centered; paused otherwise | DEFAULT. Works with any encoding. |
| true-scrub | `currentTime = beatProgress * duration`; scroll drives time both directions | ONLY if videos are re-encoded with dense keyframes — otherwise it FLICKERS |
| hybrid | scrub while scrolling, gentle play when idle | showpieces, after re-encode |

```js
// play-when-centered
if (ready) {
  if (w > 0.3 && v.paused) v.play().catch(()=>{});
  else if (w <= 0.3 && !v.paused) v.pause();
}
// true-scrub (gate the seeks — never lerp currentTime every frame)
const target = clamp(bf - i + 0.5) * (v.duration - 0.08);
if (!v.seeking && Math.abs(v.currentTime - target) > 0.05) v.currentTime = target;
```

Sparse-keyframe video + true-scrub = visible flicker ("kedap-kedip"). Ask whether the
user can re-encode; if not, use play-when-centered. Re-encode recipe:
`scripts/encode-scrub.md`.

Autoplay unlock: `muted` + `playsinline` attributes AND prime decode on first gesture:
```js
function prime(){ vids.forEach(v => v.play().then(()=>v.pause()).catch(()=>{})); }
addEventListener('pointerdown', prime, {once:true});
addEventListener('scroll', prime, {once:true});
```

Opacity: crossfade `mat.opacity = smooth(0.15,0.7,w) * 0.92` — never hard-cut.

## Image-sequence scrub (frame-accurate hero — the Apple / thewatch.60fps technique)

For a hero that ROTATES/transforms locked to scroll (watch turntable, phone exploded
view), a canvas image sequence beats video true-scrub: every frame IS a keyframe, so it
never flickers and seeks instantly both directions. Cost = many files + a preload wall.
Use for ONE showpiece hero, not full-page backgrounds.

Generate frames from a turntable render or
`ffmpeg -i spin.mp4 -vf fps=60 frames/%03d.webp`. 60–180 frames is the sweet spot;
WebP/AVIF at ~1600px keeps the whole set under a few MB.

```js
const FRAMES = 120, PAD = 3, HERO_BEAT = 0;
const imgs = [], loaded = {n:0};
for (let i=0;i<FRAMES;i++){ const im = new Image();
  im.onload = () => loaded.n++;
  im.src = `frames/${String(i).padStart(PAD,'0')}.webp`;      // 000..119
  imgs[i] = im; }
const cv = document.querySelector('#hero'), cx = cv.getContext('2d');
let lastFrame = -1;
function draw(i){ const im = imgs[i]; if (!im || !im.complete) return;
  const s = Math.max(cv.width/im.width, cv.height/im.height); // cover-fit
  const w = im.width*s, h = im.height*s;
  cx.clearRect(0,0,cv.width,cv.height);
  cx.drawImage(im, (cv.width-w)/2, (cv.height-h)/2, w, h); }
function tickHero(){                                          // in the rAF loop
  const t = clamp(bf - HERO_BEAT, 0, 1);                     // 0..1 across the hero beat
  const f = Math.round(t * (FRAMES-1));
  if (f !== lastFrame){ draw(f); lastFrame = f; }            // redraw only on change
}
```

- **Preload gate:** don't reveal the hero until `loaded.n/FRAMES > 0.9` (show a loader %);
  scrubbing into un-decoded frames is the exact flicker you switched off video to avoid.
- **HiDPI:** `cv.width = innerWidth*Math.min(dpr,1.7)` (+ CSS size) or it renders soft.
- **Never redraw every rAF** — gate on frame change (above); drawImage is not free.
- **Fallback:** if frames fail, show frame `000` as a static `<img>` poster — not a blank canvas.

## Degradation ladder (never a blank screen)

video missing → poster still (or depth-parallax still) → procedural THEME env.
Implement by simply leaving the fallback layer underneath: if the video errors or
never loads, its plane stays invisible and the environment shows. Test by renaming
one video file away.

## Asset filename contract

When the user will generate assets themselves, write them a production sheet
(`ASSETS.md`) with: one ready-to-paste generation prompt per beat, aspect + duration
+ "camera locked, loopable" for videos, and the EXACT required filename
(`beat-00-hero.mp4`, …). The filename is the entire integration contract — when files
appear in `assets/video/`, the site picks them up with zero config.

## Kinetic typography

Line-mask reveal — each headline line wrapped in an overflow-hidden span:

```html
<h2><span class="ln"><span>Line one</span></span>
    <span class="ln"><span>accent line</span></span></h2>
<style>.ln{display:block;overflow:hidden}.ln span{display:block;transform:translateY(112%)}</style>
```
```js
const rev = smooth(0.25, 0.85, w);
spans.forEach((s, li) => { const d = li*0.14;                    // stagger
  s.style.transform = `translateY(${(1-clamp((rev-d)/(1-d)))*112}%)`; });
```

Section block structure (in THEME's voice): mono kicker with a leading rule line →
2-line display headline (`<em>` = accent color) → body ≤44ch → mono coord/spec line →
optional CTA. Body and coord fade in AFTER the headline (offset smooth windows).

## Scrim — text over media

Always place a gradient scrim between media and text:
```css
.scrim{position:fixed;inset:0;pointer-events:none;z-index:9;
  background:linear-gradient(180deg, rgba(bg,.5) 0%, transparent 30%,
             transparent 52%, rgba(bg,.82) 100%);}
```
Text also gets `text-shadow: 0 4px 44px rgba(0,0,0,.85)` on dark themes.

## HUD grammar (what makes it feel "designed")

Five fixed elements, all mono micro-type (0.56–0.66rem, letter-spacing 0.2–0.35em,
uppercase): brand mark top-left (small SVG mark + wordmark + one-line descriptor),
status top-right (2 lines, one accent value), progress rail right-center (one diamond
per beat: outline → filled when active → dim-filled when passed), progress bar bottom
(2px, accent gradient, box-shadow glow), cue line bottom-center (fades out after first
scroll). Big faint motif glyph (THEME.motif) fixed right, swapping per beat.
