import { useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { Box } from "@/components/common";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

// Owner-supplied ASCIIText (codepen.io/JuanFuentes/pen/eYEeoyE), retargeted
// from a text texture to an image and folded into this repo's WebGL shape
// (AuroraBackground precedent, .agents/skills/animated-ui-references):
//   · shaders verbatim — the wave IS the shimmer the reference footer has
//     (frame-diffing lukebaffait.fr 150ms apart shows the glyph field churning)
//   · uTime driven by gsap.ticker, never a private rAF (arch RULE 3)
//   · texture uploaded ONCE (the source is a static image, not live text)
//   · no hue-rotate / mix-blend-difference / rainbow gradient — the reference
//     footer is a fixed dark ember, and difference-over-ink is wrong here
//   · the pointer spotlight is a background-clip:text radial gradient rather
//     than 10k per-cell spans (or a second <pre>, which doubles the relayout)
//   · offscreen / hidden / reduced-motion all stop the loop dead

const VERT = `
varying vec2 vUv;
uniform float uTime;
uniform float uEnableWaves;

void main() {
    vUv = uv;
    float time = uTime * 5.;

    float waveFactor = uEnableWaves;

    vec3 transformed = position;

    transformed.x += sin(time + position.y) * 0.5 * waveFactor;
    transformed.y += cos(time + position.z) * 0.15 * waveFactor;
    transformed.z += sin(time + position.x) * waveFactor;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
}
`;

const FRAG = `
varying vec2 vUv;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
    float time = uTime;
    vec2 pos = vUv;

    float r = texture2D(uTexture, pos + cos(time * 2. - time + pos.x) * .01).r;
    float g = texture2D(uTexture, pos + tan(time * .5 + pos.x - time) * .01).g;
    float b = texture2D(uTexture, pos - cos(time * 2. + time + pos.y) * .01).b;
    float a = texture2D(uTexture, pos).a;
    gl_FragColor = vec4(r, g, b, a);
}
`;

const CHARSET = ` .'\`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$`;

/** Cell size in px. ~9px gives ≈165 columns on a 1440 viewport, matching the
 *  reference field's density (measured ≈180 at its capture width). */
const CELL_PX = 9;
/** The glyph field is noise — every rebuild relayouts a ~7.5k-char `pre`, and
 *  at 60fps that alone pins a core. 15fps still reads as a live shimmer. */
const RENDER_FPS = 15;
/** Full-strength waves (1.0) ripple the plane hard enough to read as a flag;
 *  the reference only shimmers. */
const WAVE_STRENGTH = 0.35;
/** How much of the frame the hands span before letterboxing kicks in. */
const PLANE_FILL = 0.96;

const PRE_CLASS =
  "pointer-events-none absolute top-1/2 left-1/2 m-0 -translate-x-1/2 -translate-y-1/2 p-0 font-ascii leading-none whitespace-pre select-none";

/** Spotlight radius, and the ember pair it fades between. The gradient's last
 *  stop extends forever, so `deep` is also the field's resting colour. */
const SPOT = "4.5rem";
const SPOT_GRADIENT =
  `radial-gradient(circle ${SPOT} at var(--ascii-x) var(--ascii-y),` +
  " var(--color-accent) 0 55%," +
  " color-mix(in srgb, var(--color-accent-deep) 32%, transparent) 100%)";

type AsciiHandsProps = {
  /** Wide (~3:1) artwork; light subject on transparency reads best — alpha 0
   *  maps straight to a space, so there is no rectangular plate around it. */
  src: string;
  className?: string;
};

/** Decorative ASCII rasterisation of `src`, dark ember on ink, with a bright
 *  ember spotlight that tracks the pointer. Renders nothing if the image or
 *  WebGL is unavailable — the footer stands on its own without it. */
export function AsciiHands({ src, className }: AsciiHandsProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const ctn = ref.current;
    if (!ctn) return;

    let disposed = false;
    // Everything below is created asynchronously (after image decode), so the
    // teardown has to be a mutable handle rather than a closure over locals.
    let teardown: (() => void) | null = null;

    const image = new Image();
    image.decoding = "async";

    const start = () => {
      if (disposed) return;

      const scratch = document.createElement("canvas");
      const ctx = scratch.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Luminance source: one upload, never redrawn. The shimmer lives in the
      // shader's UV offsets, not in the texture.
      const source = document.createElement("canvas");
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      source.getContext("2d")?.drawImage(image, 0, 0);
      const imageAspect = image.naturalWidth / image.naturalHeight;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);

      const texture = new THREE.CanvasTexture(source);
      texture.minFilter = THREE.NearestFilter;

      const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
      camera.position.z = 30;
      const scene = new THREE.Scene();

      const material = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: texture },
          uEnableWaves: { value: prefersReducedMotion ? 0 : WAVE_STRENGTH },
        },
      });
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 36, 36), material);
      scene.add(mesh);

      const pre = document.createElement("pre");
      pre.className = PRE_CLASS;
      pre.setAttribute("aria-hidden", "true");
      pre.style.fontSize = `${CELL_PX}px`;
      // Every rebuild relayouts the whole block; containment keeps that cost
      // inside the element instead of dirtying the footer's layout tree.
      // `strict` implies size containment, so setSize() must give it explicit
      // dimensions or it collapses to 0.
      pre.style.contain = "strict";
      // Park the spotlight off-canvas so nothing glows until the pointer
      // arrives (the px unit also lets gsap infer it for quickTo).
      pre.style.setProperty("--ascii-x", "-999px");
      pre.style.setProperty("--ascii-y", "-999px");
      pre.style.color = "transparent";
      pre.style.backgroundImage = SPOT_GRADIENT;
      pre.style.backgroundClip = "text";

      ctn.append(pre);
      renderer.domElement.style.display = "none";
      ctn.appendChild(renderer.domElement);

      let cols = 0;
      let rows = 0;

      const setSize = (w: number, h: number) => {
        if (w <= 0 || h <= 0) return;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();

        // Cell advance comes from the rendered face, so the grid stays locked
        // to whatever --font-ascii resolves to on this platform.
        ctx.font = `${CELL_PX}px ${getComputedStyle(pre).fontFamily}`;
        const cellW = ctx.measureText("A").width || CELL_PX * 0.6;
        cols = Math.max(1, Math.floor(w / cellW));
        rows = Math.max(1, Math.floor(h / CELL_PX));
        scratch.width = cols;
        scratch.height = rows;
        // Required by `contain: strict`, and it anchors the spotlight gradient
        // to a box that only changes on resize.
        pre.style.width = `${cols * cellW}px`;
        pre.style.height = `${rows * CELL_PX}px`;

        const visibleH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
        let planeW = visibleH * camera.aspect * PLANE_FILL;
        let planeH = planeW / imageAspect;
        if (planeH > visibleH * PLANE_FILL) {
          planeH = visibleH * PLANE_FILL;
          planeW = planeH * imageAspect;
        }
        mesh.geometry.dispose();
        mesh.geometry = new THREE.PlaneGeometry(planeW, planeH, 36, 36);
      };

      const draw = (elapsed: number) => {
        material.uniforms.uTime.value = Math.sin(elapsed);
        renderer.render(scene, camera);
        if (!cols || !rows) return;

        ctx.clearRect(0, 0, cols, rows);
        ctx.drawImage(renderer.domElement, 0, 0, cols, rows);
        const px = ctx.getImageData(0, 0, cols, rows).data;

        let out = "";
        for (let y = 0; y < rows; y++) {
          for (let x = 0; x < cols; x++) {
            const i = (x + y * cols) * 4;
            if (px[i + 3] === 0) {
              out += " ";
              continue;
            }
            const gray = (0.3 * px[i] + 0.6 * px[i + 1] + 0.1 * px[i + 2]) / 255;
            // `invert` in the source port: dense glyphs for bright pixels.
            out += CHARSET[CHARSET.length - 1 - Math.floor((1 - gray) * (CHARSET.length - 1))];
          }
          out += "\n";
        }
        pre.textContent = out;
      };

      const ro = new ResizeObserver(([entry]) => {
        const { width, height } = entry.contentRect;
        setSize(width, height);
        if (prefersReducedMotion) draw(0);
      });
      ro.observe(ctn);

      if (prefersReducedMotion) {
        teardown = () => {
          ro.disconnect();
          mesh.geometry.dispose();
          material.dispose();
          texture.dispose();
          renderer.dispose();
          renderer.forceContextLoss();
          pre.remove();
          renderer.domElement.remove();
        };
        return;
      }

      // A WebGL render + getImageData + 10k-char join is far too expensive to
      // run while the visitor is nine chapters up the page.
      let onScreen = false;
      const io = new IntersectionObserver(([entry]) => {
        onScreen = entry.isIntersecting;
      });
      io.observe(ctn);

      let acc = 0;
      let clock = 0;
      const tick = (_t: number, delta: number) => {
        if (!onScreen || document.hidden) return;
        clock += delta / 1000;
        acc += delta;
        if (acc < 1000 / RENDER_FPS) return;
        acc = 0;
        draw(clock);
      };
      gsap.ticker.add(tick);

      // The gradient's origin is the <pre>'s own box, not the container's.
      const toX = gsap.quickTo(pre, "--ascii-x", { duration: 0.35, ease: "power3.out" });
      const toY = gsap.quickTo(pre, "--ascii-y", { duration: 0.35, ease: "power3.out" });
      const onPointerMove = (e: PointerEvent) => {
        // Same gate as the draw loop: without it, a mouse move nine chapters up
        // still forces a layout read here and runs two tweens per frame.
        if (!onScreen) return;
        const r = pre.getBoundingClientRect();
        toX(e.clientX - r.left);
        toY(e.clientY - r.top);
      };
      const hoverCapable = window.matchMedia("(hover: hover)").matches;
      if (hoverCapable) window.addEventListener("pointermove", onPointerMove);

      teardown = () => {
        gsap.ticker.remove(tick);
        if (hoverCapable) window.removeEventListener("pointermove", onPointerMove);
        ro.disconnect();
        io.disconnect();
        mesh.geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        pre.remove();
        renderer.domElement.remove();
      };
    };

    image.onload = start;
    image.onerror = () => setFailed(true);
    image.src = src;

    return () => {
      disposed = true;
      image.onload = null;
      image.onerror = null;
      teardown?.();
    };
  }, [src, prefersReducedMotion]);

  // Missing image or no WebGL: drop out silently. The footer owns the sized
  // box around this, so the band keeps its shape either way.
  if (failed) return null;

  return (
    <Box
      ref={ref}
      aria-hidden
      className={className}
    />
  );
}
