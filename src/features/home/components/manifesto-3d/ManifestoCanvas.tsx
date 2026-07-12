import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";
import { channels, stageState } from "@/features/home/components/manifesto-3d/channels";
import { CAM, DAMP_LAMBDA } from "@/features/home/components/manifesto-3d/rig";
import { MacbookModel } from "@/features/home/components/manifesto-3d/MacbookModel";
import { StudioRig } from "@/features/home/components/manifesto-3d/StudioRig";

/** RULE 3 — no second RAF. `frameloop="never"`; frames advance from the one
 *  gsap.ticker heartbeat (Lenis → ScrollTrigger → render, same tick).
 *  fiber's advance() wants ms timestamps, ticker time is seconds — ×1000,
 *  same convention as SmoothScrollProvider's `raf(t * 1000)`. */
function FrameDriver() {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    const tick = (time: number) => {
      if (document.hidden || !stageState.active) return;
      advance(time * 1000);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance]);

  return null;
}

/** Fixed product-shot camera with the seam's `sceneIntro` settle: a small
 *  dolly-in + exposure lift as the strip grows to fullscreen. */
function CameraRig() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    let intro = channels.sceneIntro;
    const tick = (_: number, deltaMS: number) => {
      intro = THREE.MathUtils.damp(intro, channels.sceneIntro, DAMP_LAMBDA, deltaMS / 1000);
      camera.position.z = CAM.pos[2] * (1 + 0.06 * (1 - intro));
      camera.lookAt(0, CAM.lookY, 0);
      gl.toneMappingExposure = 0.72 + 0.28 * intro;
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [camera, gl]);

  return null;
}

/** R3F island for the manifesto MacBook. This file is the lazy boundary —
 *  the section imports it via React.lazy so three/fiber/drei stay out of the
 *  main chunk. Transparent clear color: the DOM ember-glow layer beneath the
 *  canvas is the horizon (and the loading state). */
export function ManifestoCanvas() {
  const [isMobile] = useState(() => window.matchMedia("(max-width: 768px)").matches);

  return (
    <Canvas
      frameloop="never"
      dpr={isMobile ? [1, 1.25] : [1, 1.75]}
      camera={{ fov: CAM.fov, position: [...CAM.pos], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <FrameDriver />
      <CameraRig />
      <StudioRig withShadows={!isMobile} />
      <Suspense fallback={null}>
        <MacbookModel />
      </Suspense>
    </Canvas>
  );
}
