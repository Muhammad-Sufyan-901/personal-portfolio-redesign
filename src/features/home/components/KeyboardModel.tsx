import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/keyboard/scene.gltf";

/** World size the keyboard is normalized to before the scroll zoom. */
const FIT_SIZE = 2.6;

/** The export's keys face +y (straight up) — tip the board toward the
 *  camera, keeping a slight editorial angle so it reads as an object. */
const TILT: [number, number, number] = [1.15, -0.12, 0];

/** The Sketchfab export ships a ground `Plane` and floating `text` nodes
 *  offset far from the board (baked node matrices) — scene garnish that
 *  wrecks both the bounding box and the void backdrop. We hide them and
 *  fit/center on the keyboard nodes only (manual, instead of drei Center
 *  which measures every child including hidden ones). */
const GARNISH_PREFIXES = ["Plane", "text"];
const KEYBOARD_NODES = ["keyboard.001", "keys.002", "under_key_light"];

useGLTF.preload(MODEL_URL);

interface KeyboardModelProps {
  /** Fired once with the outer group — the section's GSAP timeline tweens
   *  this group (zoom) and its descendant meshes (disintegration). */
  onReady: (group: THREE.Group) => void;
}

export function KeyboardModel({ onReady }: KeyboardModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef<THREE.Group>(null);

  const { fitScale, center } = useMemo(() => {
    scene.traverse((object) => {
      if (GARNISH_PREFIXES.some((prefix) => object.name.startsWith(prefix))) {
        object.visible = false;
      }
      // The under-key light layer ships as red emissive ×10 over mid-gray —
      // it blows out to a white slab once the keys lift off it. Near-black
      // base + moderate intensity keeps it a deep ember glow (the model's
      // red happens to sit right on the design system's ember accent).
      if (object instanceof THREE.Mesh && object.name.startsWith("under_key_light")) {
        const material = object.material as THREE.MeshStandardMaterial;
        material.color.setScalar(0.02);
        material.emissiveIntensity = 1.2;
      }
    });
    scene.updateMatrixWorld(true);
    const box = new THREE.Box3();
    for (const name of KEYBOARD_NODES) {
      const node = scene.getObjectByName(name);
      if (node) box.expandByObject(node);
    }
    const size = box.getSize(new THREE.Vector3());
    return {
      fitScale: FIT_SIZE / Math.max(size.x, size.y, size.z),
      center: box.getCenter(new THREE.Vector3()),
    };
  }, [scene]);

  useEffect(() => {
    if (groupRef.current) onReady(groupRef.current);
  }, [onReady]);

  return (
    <group ref={groupRef}>
      <group
        scale={fitScale}
        rotation={TILT}
      >
        <group position={[-center.x, -center.y, -center.z]}>
          <primitive object={scene} />
        </group>
      </group>
    </group>
  );
}
