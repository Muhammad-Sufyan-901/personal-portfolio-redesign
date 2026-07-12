import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { channels } from "@/features/home/components/manifesto-3d/channels";
import {
  buildMacbookRig,
  CAM,
  CLOSED_TUCK,
  DAMP_LAMBDA,
  FIT_SIZE,
  RECEDE_DRIFT,
  RECEDE_SCALE,
  YAW_START,
} from "@/features/home/components/manifesto-3d/rig";

const MODEL_URL = "/models/macbook.rigged.glb";
const DRACO_PATH = "/draco/"; // self-hosted decoder — no runtime CDN fetches

useGLTF.preload(MODEL_URL, DRACO_PATH);

/** Viewport height in world units at the model plane (for %-of-viewport moves). */
const FRUSTUM_H = 2 * CAM.pos[2] * Math.tan(THREE.MathUtils.degToRad(CAM.fov / 2));

/** The MacBook + its hinge rig + the per-frame damped application of the
 *  choreography channels. GSAP never touches three objects directly — the
 *  scrub tweens `channels`, this damps rendered values toward them, which is
 *  what turns a scrub into a weighted glide (spec §7). */
export function MacbookModel() {
  const { scene } = useGLTF(MODEL_URL, DRACO_PATH);
  const rig = useMemo(() => buildMacbookRig(scene), [scene]);
  // Portrait phones: the horizontal frustum is narrower than FIT_SIZE —
  // clamp the whole object so the closed footprint always fits the width.
  const viewportWidth = useThree((state) => state.viewport.width);
  const fitClamp = Math.min(1, (viewportWidth * 0.92) / (FIT_SIZE + 0.001));

  const recedeRef = useRef<THREE.Group>(null);
  const yawRef = useRef<THREE.Group>(null);
  const spillRef = useRef<THREE.PointLight>(null);
  const rendered = useRef({ lid: 0, yaw: 0, recede: 0, screen: 0, logo: 0 });

  useFrame((state, delta) => {
    // Clamp the first delta after a pause (clock keeps counting while the
    // FrameDriver skips frames) so damp never teleports.
    const dt = Math.min(delta, 1 / 30);
    const r = rendered.current;
    r.lid = THREE.MathUtils.damp(r.lid, channels.lidProgress, DAMP_LAMBDA, dt);
    r.yaw = THREE.MathUtils.damp(r.yaw, channels.yawProgress, DAMP_LAMBDA, dt);
    r.recede = THREE.MathUtils.damp(r.recede, channels.recede, DAMP_LAMBDA, dt);
    r.screen = THREE.MathUtils.damp(r.screen, channels.screenGlow, DAMP_LAMBDA, dt);
    r.logo = THREE.MathUtils.damp(r.logo, channels.logoGlow, DAMP_LAMBDA, dt);

    // Closed = +openAngle (×tuck), authored open = 0 (sign verified per spec
    // §5.4.4: + swings the lid forward-down flat onto the deck; - folds it
    // under).
    rig.lidPivot.rotation.x = rig.openAngle * CLOSED_TUCK * (1 - r.lid);

    // Idle life: never frozen mid-hold; independent of scroll.
    const t = state.clock.elapsedTime;
    const sway = Math.sin(t * 0.5) * 0.006; // ±0.35°
    const float = Math.sin(t * 0.7) * 0.005 * FRUSTUM_H; // ±0.5% viewport

    const yaw = yawRef.current;
    const recede = recedeRef.current;
    if (yaw) yaw.rotation.y = YAW_START * (1 - r.yaw) + sway + RECEDE_DRIFT * r.recede;
    if (recede) {
      const s = fitClamp * (1 - RECEDE_SCALE * r.recede);
      recede.scale.setScalar(s);
      recede.position.y = float - 0.04 * FRUSTUM_H * r.recede;
    }

    rig.setScreenGlow(r.screen);
    rig.setLogoGlow(r.logo);
    // Screen-light spill: emissive maps don't illuminate — a cool point light
    // on the screen's facing side (model-front) washes the deck and rims the
    // lid edges through P2 (glow, not content, while the screen faces away).
    if (spillRef.current) spillRef.current.intensity = r.screen * 2.5;
  });

  return (
    <group ref={recedeRef}>
      <group ref={yawRef}>
        <pointLight
          ref={spillRef}
          position={[0, 1.1, 0.9]}
          color="#cfd6ff"
          intensity={0}
          distance={4}
          decay={2}
        />
        <group
          position={rig.fitPosition}
          scale={rig.fitScale}
        >
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}
