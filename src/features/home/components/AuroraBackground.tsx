import { useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { gsap } from "@/lib/gsap";
import { useUIStore } from "@/store/useUIStore";
import { HERO_REFINE } from "@/features/home/sections/hero.tunables";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useState } from "react";
import { Box } from "@/components/common";

// React Bits <Aurora/> (ogl variant), adapted per design_system §7.5 +
// .agents/skills/animated-ui-references: uTime driven by gsap.ticker (no own
// rAF loop — arch RULE 3), colors from @theme tokens at mount, Box wrapper,
// perf pauses (hidden/offscreen/scroll-faded) + ScrollTrigger hero fade,
// reduced-motion/no-WebGL = static token gradient. Shaders verbatim.

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uIntensity;
uniform float uMidPoint;
uniform vec2 uMouse;
uniform float uHotspotRadius;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \\
  int index = 0;                                            \\
  for (int i = 0; i < 2; i++) {                               \\
     ColorStop currentColor = colors[i];                    \\
     bool isInBetween = currentColor.position <= factor;    \\
     index = int(mix(float(index), float(i), float(isInBetween))); \\
  }                                                         \\
  ColorStop currentColor = colors[index];                   \\
  ColorStop nextColor = colors[index + 1];                  \\
  float range = nextColor.position - currentColor.position; \\
  float lerpFactor = (factor - currentColor.position) / range; \\
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = uIntensity * height;

  // Damped pointer hotspot (uv space, bottom-origin y) — a weighted
  // emphasis on the band, never a 1:1 spotlight.
  float hotspot = smoothstep(uHotspotRadius, 0.0, distance(uv, uMouse));
  intensity *= 1.0 + hotspot * 0.5;

  float auroraAlpha = smoothstep(uMidPoint - uBlend * 0.5, uMidPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

const AMPLITUDE = 1.0;
const BLEND = 0.6;
const SPEED = 0.6;
/** The shipped intensity scalar — HERO_REFINE.aurora.intensity multiplies it
 *  (1.0 = the pre-refine look). */
const BASE_INTENSITY = 0.6;
/** coverage 0→1 maps to the alpha smoothstep midpoint 0.35→0.02 (the shipped
 *  look's 0.20 ≈ coverage 0.45); lower midpoint = chroma reaches further down. */
const midPointFor = (coverage: number) => 0.35 - 0.33 * coverage;
/** Idle seconds without pointer movement before the hotspot drifts on its own. */
const IDLE_AFTER = 2;

export function AuroraBackground() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [webglFailed, setWebglFailed] = useState(false);

  const active = !prefersReducedMotion && !webglFailed;

  // WebGL setup lives in a layout effect (DOM + GL resources), animations in
  // the same closure via gsap.ticker; useGSAP only owns the ScrollTrigger fade.
  useIsomorphicLayoutEffect(() => {
    const ctn = ref.current;
    if (!active || !ctn) {
      // Terminal no-shader paths (reduced motion / WebGL failed): the
      // preloader gate must never wait on a compile that won't happen.
      useUIStore.getState().setAuroraReady(true);
      return;
    }

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: true,
        // Fill-cost cap (the old 2D-canvas version's DPR≤1.5 rule, restored
        // for the bolder coverage).
        dpr: Math.min(window.devicePixelRatio, 1.5),
      });
    } catch {
      setWebglFailed(true);
      useUIStore.getState().setAuroraReady(true);
      return;
    }
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    // Colors from the live tokens (re-theme-safe by name); ogl Color parses hex.
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--color-accent").trim();
    const deep = styles.getPropertyValue("--color-accent-deep").trim();
    const stops = [deep, accent, deep].map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: AMPLITUDE },
        uColorStops: { value: stops },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: BLEND },
        uIntensity: { value: BASE_INTENSITY * HERO_REFINE.aurora.intensity },
        // midPoint scales WITH intensity — the alpha smoothstep reads the
        // scaled intensity, so without this coupling a brightness boost
        // silently expands coverage too (measured: 60% frame chroma vs the
        // reference's 37%). Coverage stays the one area knob.
        uMidPoint: { value: HERO_REFINE.aurora.intensity * midPointFor(HERO_REFINE.aurora.coverage) },
        // uv space, bottom-origin y — starts centered in the band up top.
        uMouse: { value: [0.5, 0.85] },
        uHotspotRadius: { value: HERO_REFINE.aurora.hotspot.radius },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    const ro = new ResizeObserver(() => {
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight];
    });
    ro.observe(ctn);

    let offscreen = false;
    const io = new IntersectionObserver(([entry]) => {
      offscreen = !entry.isIntersecting;
    });
    io.observe(ctn);

    // Hotspot targeting: one pointermove on window (the wrapper is
    // pointer-events-none); the tick damps toward the target with
    // frame-rate-independent exp decay — no second RAF, no quickTo.
    const { followLambda, idleDriftSpeed, idleDriftAmp } = HERO_REFINE.aurora.hotspot;
    const hoverCapable = window.matchMedia("(hover: hover)").matches;
    const mouse = { x: 0.5, y: 0.85 };
    const target = { x: 0.5, y: 0.85 };
    let lastPointerAt = -Infinity;
    const onPointerMove = (e: PointerEvent) => {
      target.x = e.clientX / window.innerWidth;
      target.y = 1 - e.clientY / window.innerHeight; // uv space: y is bottom-origin
      lastPointerAt = gsap.ticker.time;
    };
    if (hoverCapable) window.addEventListener("pointermove", onPointerMove);

    // gsap.ticker time is seconds — matches the original's ms*0.01*0.1 scaling.
    const tick = (time: number, deltaTime: number) => {
      if (document.hidden || offscreen || fadedRef.faded) return;
      // Idle (or touch): the hotspot drifts on a slow noise-ish path inside
      // the band instead of freezing.
      if (!hoverCapable || time - lastPointerAt > IDLE_AFTER) {
        target.x = 0.5 + Math.sin(time * idleDriftSpeed) * idleDriftAmp;
        target.y = 0.8 + Math.cos(time * idleDriftSpeed * 0.8) * idleDriftAmp * 0.4;
      }
      const k = 1 - Math.exp((-followLambda * deltaTime) / 1000);
      mouse.x += (target.x - mouse.x) * k;
      mouse.y += (target.y - mouse.y) * k;
      program.uniforms.uMouse.value = [mouse.x, mouse.y];
      program.uniforms.uTime.value = time * SPEED;
      renderer.render({ scene: mesh });
      if (!useUIStore.getState().auroraReady) useUIStore.getState().setAuroraReady(true);
    };
    const fadedRef = { faded: false };
    gsap.ticker.add(tick);

    // Scrub-fade over the hero (shares the faded flag with the ticker).
    const fade = gsap.to(ctn, {
      autoAlpha: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ctn.closest("section") ?? ctn,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          fadedRef.faded = self.progress === 1;
        },
      },
    });

    return () => {
      gsap.ticker.remove(tick);
      if (hoverCapable) window.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      io.disconnect();
      fade.scrollTrigger?.kill();
      fade.kill();
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [active]);

  if (!active) {
    return (
      <Box
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,var(--color-accent-tint),transparent_75%)]"
      />
    );
  }

  return (
    <Box
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    />
  );
}
