# WebGL Kit — scaffold, post, environment, GLB recipe, interactions, shaders

## Contents
1. Scaffold & renderer numbers
2. Post-processing recipe
3. Procedural environment kit
4. Generic GLB display recipe
5. Interaction patterns
6. Particle system pattern
7. Proven shader library
8. WebAudio synth recipes
9. Gotchas (full list)

## 1. Scaffold

Single file, importmap CDN (no build step):
```html
<script type="importmap">
{ "imports":{
  "three":"https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
  "three/addons/":"https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/"
}}
</script>
```
Renderer settings that matter:
```js
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));   // >1.7 wastes GPU
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.95–1.15;                  // tune per scene brightness
scene.fog = new THREE.FogExp2(THEME.bg, 0.022–0.03);
// PBR materials need an environment:
scene.environment = new THREE.PMREMGenerator(renderer)
  .fromScene(new RoomEnvironment(), 0.05).texture;
```
Frame loop: clamp `dt = Math.min(clock.getDelta(), 0.05)` — protects charge/particle
logic at low FPS. Lerp everything (camera 0.05–0.07, hover 0.12) — never snap.

## 2. Post-processing recipe

EffectComposer chain: RenderPass → UnrealBloomPass → custom final ShaderPass → OutputPass.

- Bloom: strength 0.6–0.8 (dark scenes), radius 0.5–0.6, threshold 0.6–0.9. Raise
  strength temporarily on interaction peaks (charge/burst).
- Final pass combines: chromatic aberration `ca = 0.0015 + r2*0.007` (+ extra during
  charge/flash), vignette `smoothstep(1.25, 0.36, len(d)*1.35)` mixed ~0.9, film grain
  `(rnd(uv*res*0.5 + time) - 0.5) * 0.02`, and a `uFlash` uniform for white-out punches.
- **Grain law: ONE layer, amplitude 0.015–0.025.** Stacking a CSS grain overlay on top
  of shader grain reads as compression artifacts ("dot noise") — a real user complaint.

## 3. Procedural environment kit (all THEME-colored)

- **Sky dome**: SphereGeometry(120) BackSide ShaderMaterial — vertical gradient (3 stops
  from palette), optional horizon band `pow(max(0,1-abs(y-.015)*8),3)`, hash-cell stars
  with per-star twinkle. ~20 lines of GLSL.
- **Mountains**: 2–3 PlaneGeometry strips (rotated flat), vertices displaced by ridged
  FBM `1-abs(2*noise-1)` (4 octaves), flatShading, colors stepping toward fog. Edge
  taper `t=1-|z|/depth; y*=t*t`.
- **Floor**: big dark circle, `roughness:0.3, metalness:0.7` for soft reflections; plus
  an additive radial-gradient "light pool" plane (canvas texture) under the subject.
- **Atmosphere**: 200–250 drifting points (additive, size 0.03, canvas radial-dot
  sprite), slow upward drift with wrap.

## 4. Generic GLB display recipe (works for ANY model)

```js
// 1. Orient: longest bbox axis → vertical (GLB orientation is unpredictable)
if (size.x >= size.y && size.x >= size.z) root.rotation.z = Math.PI/2;
else if (size.z >= size.y && size.z >= size.x) root.rotation.x = -Math.PI/2;
// 2. Re-measure, scale to target height, center X/Z, rest bottom on ground
// 3. Material polish:
root.traverse(o => { if (o.isMesh && o.material) { o.material.envMapIntensity = 1.2;
  if ('roughness' in o.material) o.material.roughness *= 0.9; }});
```

**Interesting-end detection** (where to attach fire/glow/particles): sample world-space
vertices from the top 32% and bottom 32% of the model; the end whose points have the
larger mean horizontal spread is the "business end" (a blade flares, a pole doesn't).
Collect those vertices as the emitter pool so effects hug the actual geometry.

Lighting rig: hemisphere (cool sky / dark ground, 0.5) + directional key (slightly
cool, 0.8–1.2, from up-left) + accent PointLight at the interesting end + rim
PointLight (accent2) behind-opposite. Progress-load UX: show a loader with % from
`onProgress(ev.loaded/ev.total)`; on error show a graceful in-page message saying the
asset path needs a static server.

## 5. Interaction patterns

- **Mouse parallax**: `cam.pos.x = lerp(cam.pos.x, base.x + mouse.x*0.6, 0.06)` plus
  a fraction of mouse in `lookAt`. Subtle > dramatic.
- **Hover on a heavy model**: raycast an invisible proxy CapsuleGeometry around the
  model, never the raw mesh (12MB Meshy GLB ≈ 300k tris — per-frame raycast jank).
  On hit: rim glow up, spawn sparks at hit point, grow the custom cursor.
- **Rim glow**: clone each mesh SHARING its geometry into an overlay group with one
  additive fresnel ShaderMaterial (`pow(1-dot(n,v), 2.6) * uOp`). Fade `uOp` with
  hover/charge. Cheap and premium-looking.
- **Hold-to-charge**: `charge = clamp(charge + (holding ? dt*0.5 : -dt*0.9))`. Drive
  everything from `charge`: shake amplitude, bloom, light intensity/hue, particle
  rate, audio gain. At ≥0.985 fire a one-shot burst (flash uniform → decay, ring
  shockwave, particle explosion, boom sound), guarded by a `burstDone` latch that
  resets below 0.2.
- **Camera shake**: `pos += (rand-0.5) * (charge*0.05 + flash*0.10)` per axis.
- **Custom cursor**: hide the OS cursor, fixed div diamond following pointer;
  scale/brighten on hover targets and while holding.

## 6. Particle system pattern (one system, many uses)

One THREE.Points + BufferGeometry, CPU-updated arrays, additive blending, canvas
radial-dot sprite texture, `depthWrite:false`. Per particle: life, velocity, mode tag
(ember / hover-spark / burst). Ring-buffer spawn cursor — `spawn(pos, vel, mode)`
overwrites the oldest slot; parked particles live at y=-99. Color by life:
`rgb = (1.3L, 0.5L², 0.08L)` reads as fire; shift per mode. 800–1200 particles is
plenty; one draw call.

### Image → particle portrait (interactive, lobod-style)

Reconstruct a photo from thousands of dots that scatter from the cursor and spring back
home. 2D canvas handles 30–60k particles fine; reach for THREE.Points only past ~100k.
Build the pool by sampling image pixels — skip dark/transparent so the subject emerges
from black (use a photo with a black/transparent background):

```js
const gap = 4;                                    // px between samples; smaller = denser/heavier
const t = document.createElement('canvas'); t.width=img.width; t.height=img.height;
const d = t.getContext('2d'); d.drawImage(img,0,0);
const px = d.getImageData(0,0,img.width,img.height).data;
const P = [];
for (let y=0;y<img.height;y+=gap) for (let x=0;x<img.width;x+=gap){
  const i=(y*img.width+x)*4, a=px[i+3], b=(px[i]+px[i+1]+px[i+2])/3;
  if (a>128 && b>40) P.push({ x, y, hx:x, hy:y, vx:0, vy:0,   // hx/hy = home
    c:`rgb(${px[i]},${px[i+1]},${px[i+2]})`, s:Math.random()*1.6+0.7 }); }
```
Per frame: cursor repulsion inside a radius, then spring toward home with damping.
```js
const M = {x:-1e4, y:-1e4, r:110};                // r = influence radius (scale with dpr)
for (const p of P){
  const dx=p.x-M.x, dy=p.y-M.y, dist=Math.hypot(dx,dy)||1;
  if (dist<M.r){ const f=(M.r-dist)/M.r*3; p.vx+=dx/dist*f; p.vy+=dy/dist*f; }
  p.vx+=(p.hx-p.x)*0.02; p.vy+=(p.hy-p.y)*0.02;   // spring 0.02
  p.vx*=0.86; p.vy*=0.86;                          // damping (velocity×0.90 table entry)
  p.x+=p.vx; p.y+=p.vy;
  cx.fillStyle=p.c; cx.beginPath(); cx.arc(p.x,p.y,p.s,0,6.283); cx.fill(); }
```
Numbers that matter: spring 0.02 + damping 0.86 = the "gel then snap back" feel; push
force 3, radius 110 at 1×. Add a SECOND independent layer of slow-drifting ambient dots
(NOT homed) for the "gold flecks" depth behind the portrait. THREE.Points variant: store
home positions in an attribute, do repulsion in the VERTEX shader vs a `uMouse` uniform
(unproject to world) — same math, GPU-scaled to 500k+ points; use only when 2D canvas
actually drops frames.

## 7. Proven shader library

- **Magma / lava**: domain-warped FBM (`q`, `r` warp vectors), 4-stop color ramp
  (crust→dim→hot→core), ridged veins `smoothstep(0.1, 0, abs(2*fbm-1))` added as
  glowing cracks. Animate with slow time (t*0.08–0.1).
- **Liquid metal / chrome blob** (Hatom signature): high-subdiv `IcosahedronGeometry(1, 24)`
  displaced along its normal in the VERTEX shader by animated curl/FBM noise
  (`p += normal * fbm(p*1.5 + t*0.15) * 0.35`); material `metalness:1, roughness:0.06–0.15`.
  The chrome look is 90% the ENVIRONMENT — a mirror only shows what it reflects: feed a
  real HDRI (`RGBELoader` → `PMREMGenerator`) or a bright RoomEnvironment. Add a thin
  fresnel rim (accent color) + slight `iridescence` for the oil-slick edge. Lerp the
  displacement amplitude up on hover/scroll for the "flowing" beat. MUST recompute normals
  after displacement (`geometry.computeVertexNormals()` won't see shader displacement —
  derive them analytically from the noise gradient in-shader, or lighting goes flat).
  Heavier alternative = true metaballs via a raymarched SDF in a fullscreen quad — only
  when blobs must merge/split; otherwise displaced-mesh is far cheaper.
- **Fluid frost cursor trail**: ping-pong render targets (256–288px, HalfFloat).
  Each frame: sample prev with slight upward drift, 4-tap blur mix 0.35, decay ×0.962,
  add splat at cursor `smoothstep(0.055, 0, dist) * clamp(speed*22, 0.04, 0.85)`.
  In the final pass: distort UV by trail gradient, tint/whiten, sparkle inside trail.
- **Triplanar texture mapping** (photo-real surfaces on procedural geometry): blend
  weights `pow(abs(n), 4)` normalized; sample albedo/roughness on 3 planes; whiteout
  normal blend `normalize(nBase + tangentNormals)`; per-instance seed offsets variety.
- **Ice / crystal**: MeshPhysicalMaterial `transmission:1, ior:1.31, thickness:~1,
  iridescence:0.6–0.7, attenuationColor/Distance set` + flatShading for facets.
  For instanced/custom: fresnel + procedural env gradient + refract() body tint.
- **Instanced ShaderMaterial**: guard with `#ifdef USE_INSTANCING` (`instanceMatrix`)
  and `#ifdef USE_INSTANCING_COLOR` (`instanceColor` — free per-instance vec3, use it
  for glow/seed).

## 8. WebAudio synth (no audio files)

Init lazily on first pointerdown (autoplay policy). All in try/catch.
- **Bell**: 4 sine partials ×[1, 2.02, 2.98, 4.1], gains 0.28/(k+1), exp decay 2.6s.
- **Rumble**: looped brown-noise buffer (`last=(last+0.02*white)/1.02`) → lowpass 90Hz
  → gain driven by charge (lerp toward `charge*0.5`).
- **Boom**: sine 70→28Hz exp ramp 0.5s, gain 0.6 → exp decay 0.9s.

## 9. Gotchas

1. `#include <colorspace_fragment>` on its own line — inlining after other code
   breaks the GLSL preprocessor ("'#': invalid character").
2. VideoTexture + paused `currentTime` seek: fine occasionally, flickers when driven
   per-frame on sparse-keyframe files. Gate seeks (>0.05s delta, `!v.seeking`).
3. Autoplay: `muted` + `playsinline` attributes AND `.play()` primed on first gesture.
4. Background-tab throttling freezes video decode + rAF — don't debug playback in a
   hidden tab.
5. `fog:false` on camera-parented background planes, or fog tints them.
6. Add `scene.add(camera)` when parenting children to the camera — a camera not in
   the scene graph won't render its children.
7. Declare shared loaders/utils BEFORE first use (const TDZ) — easy to break when
   assembling a file from patterns.
8. Raycast proxies, not raw high-poly meshes (see §5).
9. Clamp dt; at 5fps an unclamped hold-to-charge fills instantly.
10. `localStorage`/`sessionStorage` unavailable in some artifact hosts — memory only.
11. Test the missing-asset path (rename a file) — the fallback layer must show, not
    a black screen.
12. Mobile: pointer events cover touch, but test hold-gesture (pointercancel fires
    on scroll) — cancel holds on `pointercancel`.
