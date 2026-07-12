import { useMemo } from "react";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/** Page-visible colors come from computed tokens (aurora precedent) — raw
 *  hex below is island-internal light temperature only, unreachable by CSS. */
function useAccentColor(): string {
  return useMemo(() => {
    const value = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim();
    return value || "#e8380f";
  }, []);
}

interface StudioRigProps {
  /** ≤768px: shadows off, per the §10 mobile budget. */
  withShadows?: boolean;
}

/** Procedural studio — zero network fetches (no HDRI presets): a soft key,
 *  a cool fill, a thin top strip for the aluminum edge highlight, plus one
 *  warm ember directional agreeing with the DOM glow layer's horizon. */
export function StudioRig({ withShadows = true }: StudioRigProps) {
  const accent = useAccentColor();

  return (
    <>
      <Environment
        resolution={256}
        frames={1}
      >
        <Lightformer
          form="rect"
          intensity={0.85}
          color="#ffffff"
          position={[-4, 5, 4]}
          scale={[4, 2.5, 1]}
          target={[0, 0.5, 0]}
        />
        <Lightformer
          form="rect"
          intensity={0.3}
          color="#cdd6f4"
          position={[5, 2, 2]}
          scale={[4, 4, 1]}
          target={[0, 0.5, 0]}
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#ffffff"
          position={[0, 6, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[8, 0.6, 1]}
        />
      </Environment>
      <ambientLight intensity={0.12} />
      {/* Ember horizon: low, behind-left, matching the DOM glow layer. */}
      <directionalLight
        position={[-3, 0.6, -4]}
        intensity={1.4}
        color={accent}
      />
      {withShadows && (
        <ContactShadows
          resolution={512}
          scale={12}
          blur={2.4}
          opacity={0.5}
          far={6}
          color="#000000"
        />
      )}
    </>
  );
}
