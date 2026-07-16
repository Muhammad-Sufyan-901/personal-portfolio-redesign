import { Suspense, useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { gsap } from "@/lib/gsap";
import { channels, stageState } from "@/features/home/utils/channels";
import { CAM, DAMP_LAMBDA } from "@/features/home/utils/rig.tunables";
import { MacbookModel } from "@/features/home/components/manifesto-3d/MacbookModel";
import { StudioRig } from "@/features/home/components/manifesto-3d/StudioRig";

/** RULE 3 — no second RAF. `frameloop="never"`; frames advance from the one
 *  gsap.ticker heartbeat (Lenis → ScrollTrigger → render, same tick).
 *  fiber v9's advance() timestamp feeds state.clock directly and is in
 *  SECONDS — gsap ticker time passes through unchanged. (Passing ms here
 *  turns clock.elapsedTime/delta into ms-as-seconds — verified live: it made
 *  every clock-driven value thrash at ~2,750 rad/s, the "violent shake".) */
function FrameDriver() {
  const advance = useThree((state) => state.advance);

  useEffect(() => {
    const tick = (time: number) => {
      if (document.hidden || !stageState.active) return;
      advance(time);
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [advance]);

  return null;
}

/** Aim the camera for a given lid/intro state — the machine's visual center
 *  (closed slab → open lid) stays at screen center for any scroll position. */
function aimCamera(camera: THREE.Camera, gl: THREE.WebGLRenderer, lid: number, intro: number) {
  const center = CAM.centerClosed + (CAM.centerOpen - CAM.centerClosed) * lid;
  camera.position.set(0, center + CAM.rise, CAM.z * (1 + 0.06 * (1 - intro)));
  camera.lookAt(0, center, 0);
  gl.toneMappingExposure = 0.72 + 0.28 * intro;
}

/** Product-shot camera. Aimed synchronously from the CURRENT channel state on
 *  mount (no un-aimed default frame can ever render, wherever in the scroll
 *  the canvas arrives), then the look target damps along the lid channel;
 *  the seam's `sceneIntro` adds a small dolly-in + exposure lift. */
function CameraRig() {
  const camera = useThree((state) => state.camera);
  const gl = useThree((state) => state.gl);

  useEffect(() => {
    let intro = channels.sceneIntro;
    let lid = channels.lidProgress;
    aimCamera(camera, gl, lid, intro);
    const tick = (_: number, deltaMS: number) => {
      const dt = Math.min(deltaMS / 1000, 1 / 30);
      intro = THREE.MathUtils.damp(intro, channels.sceneIntro, DAMP_LAMBDA, dt);
      lid = THREE.MathUtils.damp(lid, channels.lidProgress, DAMP_LAMBDA, dt);
      aimCamera(camera, gl, lid, intro);
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
      // offsetSize: measure the container's LAYOUT size, not its
      // getBoundingClientRect — the seam scales the stage (0.14 → 1) and
      // gBCR includes transforms, so the default sized the canvas to ~14%
      // of the viewport at load (scene stuck top-left until scroll events
      // re-measured it up). Offset dimensions ignore ancestor transforms.
      resize={{ scroll: true, debounce: { scroll: 50, resize: 0 }, offsetSize: true }}
      camera={{
        fov: CAM.fov,
        position: [0, CAM.centerClosed + CAM.rise, CAM.z],
        near: 0.1,
        far: 60,
      }}
      onCreated={({ camera, gl }) => {
        // Aim before anything can render — a default-orientation camera must
        // never produce the first frame, even mid-scroll on a slow load.
        aimCamera(camera, gl, channels.lidProgress, channels.sceneIntro);
      }}
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
