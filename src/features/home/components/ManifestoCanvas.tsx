import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type * as THREE from "three";
import { KeyboardModel } from "@/features/home/components/KeyboardModel";

interface ManifestoCanvasProps {
  onModelReady: (group: THREE.Group) => void;
}

/** R3F stage for the manifesto keyboard. This file is the lazy boundary —
 *  the section imports it via React.lazy so three/fiber/drei code-split
 *  off the main chunk. Plain lights only: drei <Environment> presets fetch
 *  remote HDRs, which we don't allow. */
export function ManifestoCanvas({ onModelReady }: ManifestoCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 4], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight
        position={[0, 3, 5]}
        intensity={3}
      />
      <directionalLight
        position={[-4, -1, 2]}
        intensity={1}
      />
      <Suspense fallback={null}>
        <KeyboardModel onReady={onModelReady} />
      </Suspense>
    </Canvas>
  );
}
