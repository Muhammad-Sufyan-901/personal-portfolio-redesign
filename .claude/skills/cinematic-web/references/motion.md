# Motion — parallax systems, transitions, easing vocabulary

Motion quality is what separates "template" from "award site". Two rules above all:
every value LERPS toward its target (nothing snaps), and every transition OVERLAPS
(something is always arriving while something leaves).

## 1. Parallax — four layers of it

**a) Mouse parallax (always on).** Camera offset + counter-offset in lookAt:
```js
cam.x = lerp(cam.x, base.x + mouse.x*0.6, 0.06);
camera.lookAt(look.x + mouse.x*0.25, look.y + mouse.y*0.15, look.z);
```
Subtle beats dramatic: 0.4–0.8 world-units max. Give 2–3 scene layers different
multipliers (bg mountains ×0.2, subject ×1, foreground dust ×1.4) for depth.

**b) Scroll parallax (layered speeds).** In 3D this is FREE: place layers at different
Z and dolly the camera — near things move faster automatically. In DOM overlays,
translate fixed layers by different fractions of scroll:
```js
bgEl.style.transform  = `translateY(${scrollY*0.12}px)`;   // slow
fgEl.style.transform  = `translateY(${scrollY*-0.06}px)`;  // counter-drift
```
Keep DOM parallax on `transform` only (compositor-cheap), max 2–3 layers.

**c) Depth-map parallax for stills** (makes flat images feel 3D — powerful with AI art):
plane with 160×160 segments, grayscale depth texture (near=white), displaced in the
vertex shader and sheared by mouse:
```glsl
float d = texture2D(uDepth, uv).r;
p.z += (d - 0.5) * uDisp;          // uDisp 0.7–1.4
p.xy += uMouse * (d - 0.5) * 0.9;  // parallax shear
```
Depth maps come from the asset pipeline (see asset-pipeline.md) or any monocular
depth model. This is the standard upgrade for "still image" beats.

**d) Media micro-parallax.** Full-frame video/still backgrounds get a slow breathing
zoom + tiny counter-translate so they never feel frozen:
`scale(1.04 + sin(t*0.2)*0.004) translate(mouse.x*-1.2%, mouse.y*-1.2%)`.

## 2. Transition library (between beats/sections)

| transition | recipe | use when |
|---|---|---|
| overlap crossfade | both layers' smooth windows overlap ≥30% | DEFAULT — stills, videos |
| noise dissolve | fragment: `if (hash(floor(uv*200.)) < uDissolve) discard;` plus vertex scatter `p += dir*(0.4+n*4.)*uDissolve` | 3D objects entering/leaving |
| directional wipe | `alpha *= smoothstep(uEdge-0.08, uEdge+0.08, uv.x)` animate uEdge | chapter changes, reveals |
| flash cut | post uniform `uFlash=1` on the event, decay `flash -= dt*2.2`, adds white + extra CA | impacts, bursts, climax |
| camera-dolly-through | camera moves through fog/darkness between waypoints; fog hides the content swap | one-continuous-scene stories |
| frost/blur veil | fullscreen veil: blur taps + whiten driven by a mask that sweeps | cold/dream themes, igloo-style |

Implementation notes: dissolves and wipes live in the OBJECT's material (uniform per
beat); flash and veils live in the final post pass (one uniform each). Never run two
full-screen transitions simultaneously.

**Text transitions:** line-mask reveal in (stagger 0.12–0.14 per line), exit by
translateY(-30px) + fade — exit ~2× faster than entry. Kickers slide in from the left
with their rule line; body/coords trail the headline by an offset smooth window.

**Page intro:** loader (brand + progress) → fade loader 0.9s → content reveals in
stages: media first, headline lines next, HUD last, cue line very last. Never pop
everything at frame one.

## 3. Easing vocabulary (the numbers)

| what | value |
|---|---|
| camera position lerp | 0.05–0.07 per frame |
| scroll inertia (beat float) | 0.07–0.08 |
| hover states | 0.12 |
| charge accumulate / release | +dt·0.5 / −dt·0.9 |
| spring-back (physical) | vel×0.90–0.94 per frame |
| one-shot ease-out | `1 - pow(1-t, 3)` |
| smooth window | `smoothstep(a, b, x)` — never linear opacity |
| stagger between siblings | 0.12–0.14 |

Feel guide: UI responds fast (0.1+), camera responds slow (0.05), physical things
spring (velocity + damping). If a motion feels cheap, the cause is almost always a
linear ramp or a snap — replace with smoothstep/lerp before touching anything else.
