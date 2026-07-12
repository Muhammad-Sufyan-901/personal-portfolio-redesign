import { lazy, Suspense, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import type * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { Box, ChapterEyebrow } from "@/components/common";
import { profile } from "@/features/home/data/profile.data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const ManifestoCanvas = lazy(() =>
  import("@/features/home/components/ManifestoCanvas").then((m) => ({
    default: m.ManifestoCanvas,
  })),
);

const OUTRO_LABEL = "About Me";

/** How much the keyboard grows across the zoom act (relative to fit size). */
const ZOOM_SCALE = 2.8;

/** Chapter 02 — scrolly-telling 3D keyboard (pinned, scrubbed).
 *  Acts: zoom (0–3.5) → disintegrate + copy fade (3.5–10, one continuous
 *  drift so fragments keep floating through the hand-off) → overlay/outro
 *  (7–10). GSAP tweens the three.js objects directly; the model arrives
 *  async, so the timeline builds only once `model` lands in state. */
export function ManifestoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [model, setModel] = useState<THREE.Group | null>(null);

  useGSAP(
    () => {
      // Reduced motion: no canvas is mounted, no pin — copy and outro
      // render statically because these sets never run.
      if (prefersReducedMotion) return;

      gsap.set(".manifesto-overlay", { autoAlpha: 0 });
      gsap.set(".manifesto-outro", { autoAlpha: 0, y: 60 });

      if (!model) return;

      const meshes: THREE.Mesh[] = [];
      model.traverse((object) => {
        if ((object as THREE.Mesh).isMesh && object.visible) meshes.push(object as THREE.Mesh);
      });

      // One scatter vector per fragment, fixed at setup so the scrub is
      // deterministic in both directions. Offsets are chosen in WORLD units,
      // then divided by each mesh's world scale — the Sketchfab node chain
      // bakes a ×100 scale, so a raw local "+=" would fling fragments miles
      // offscreen. (Column length of matrixWorld = world scale; keeps three
      // as a type-only import here so it stays in the lazy chunk.)
      model.updateWorldMatrix(true, true);
      const scatter = meshes.map((mesh) => {
        const e = mesh.matrixWorld.elements;
        const worldScale = Math.hypot(e[0], e[1], e[2]) || 1;
        return {
          x: gsap.utils.random(-1.8, 1.8) / worldScale,
          y: gsap.utils.random(-1.2, 1.6) / worldScale,
          z: gsap.utils.random(-2, 0.8) / worldScale,
          rx: gsap.utils.random(-Math.PI / 2, Math.PI / 2),
          ry: gsap.utils.random(-Math.PI / 2, Math.PI / 2),
        };
      });

      const tl = gsap.timeline({
        // Scrubbed timeline — linear mapping, not the repo's power4.out default.
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // Act 1 — zoom: the whole board grows toward the viewer.
      tl.to(model.scale, { x: ZOOM_SCALE, y: ZOOM_SCALE, z: ZOOM_SCALE, duration: 3.5 }, 0).to(
        model.position,
        { y: -0.2, duration: 3.5 },
        0,
      );

      // Act 2 — disintegration: each fragment drifts along its own vector,
      // one continuous tween through the end of the pin (relative "+=" so
      // baked FBX local positions don't matter).
      meshes.forEach((mesh, index) => {
        const at = 3.5 + index * 0.08;
        tl.to(
          mesh.position,
          {
            x: `+=${scatter[index].x}`,
            y: `+=${scatter[index].y}`,
            z: `+=${scatter[index].z}`,
            duration: 10 - at,
          },
          at,
        ).to(mesh.rotation, { x: `+=${scatter[index].rx}`, y: `+=${scatter[index].ry}`, duration: 10 - at }, at);
      });
      tl.to(".manifesto-copy", { autoAlpha: 0, duration: 1 }, 3.5);

      // Act 3 — hand-off: gradient scrim swallows the fragments, outro rises.
      tl.to(".manifesto-overlay", { autoAlpha: 1, duration: 2 }, 7).to(
        ".manifesto-outro",
        { autoAlpha: 1, y: 0, duration: 2 },
        8,
      );
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, model], revertOnUpdate: true },
  );

  return (
    <Box
      as="section"
      id="manifesto"
      ref={sectionRef}
      className="bg-ink relative min-h-svh overflow-hidden"
    >
      {!prefersReducedMotion && (
        <Box className="pointer-events-none absolute inset-0">
          <Suspense fallback={null}>
            <ManifestoCanvas onModelReady={setModel} />
          </Suspense>
        </Box>
      )}

      <Box className="absolute inset-x-0 top-0 z-10 px-page-x pt-10">
        <ChapterEyebrow
          index="02"
          label="WHO I AM"
        />
      </Box>

      <Box className="manifesto-copy absolute inset-0 z-10 flex items-center justify-center px-page-x">
        <Box
          as="h2"
          className="font-display text-statement text-paper max-w-4xl text-center"
        >
          {profile.manifesto.lines.join(" ")}
        </Box>
      </Box>

      {!prefersReducedMotion && (
        <Box className="manifesto-overlay pointer-events-none absolute inset-0 z-20 bg-linear-to-b from-ink/0 via-ink/60 to-ink" />
      )}

      <Box className="manifesto-outro absolute inset-x-0 bottom-0 z-30 flex justify-center pb-24">
        <Box
          as="p"
          className="font-display text-chapter text-paper"
        >
          {OUTRO_LABEL}
        </Box>
      </Box>
    </Box>
  );
}
