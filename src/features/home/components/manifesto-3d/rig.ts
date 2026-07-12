import * as THREE from "three";

/** ============ Tunables (spec §13) ============ */
/** Normalized world width of the MacBook (base slab is 35.5 raw units). */
export const FIT_SIZE = 3.2;
/** Channel smoothing — λ for MathUtils.damp (per-frame catch-up weight). */
export const DAMP_LAMBDA = 6;
/** Product-shot camera. The look target tracks the machine's visual center
 *  (closed slab → open lid) so the MacBook stays centered on screen through
 *  the lid arc; `rise` keeps the slight top-down product pitch. */
export const CAM = {
  fov: 34,
  z: 6.2,
  rise: 0.6,
  centerClosed: 0.1,
  centerOpen: 1.05,
};
/** P1 rest pose: rear-quarter, logo side to camera (π = dead-rear). */
export const YAW_START = Math.PI - 0.35;
/** Slight closed over-rotation so the lid's front edge kisses the deck (the
 *  bbox-derived hinge sits ~0.7 raw units front of the true barrel, which
 *  otherwise leaves the lid a hair ajar). */
export const CLOSED_TUCK = 1.015;
/** P4 recede package. */
export const RECEDE_SCALE = 0.14; // scale 1 → 0.86
export const RECEDE_DRIFT = THREE.MathUtils.degToRad(6);
/** Emissive ceilings (visual — authored KHR strength 8 assumes ACES headroom). */
export const SCREEN_GLOW_MAX = 1.4;
export const LOGO_GLOW_MAX = 0.35;

/** Node/material names verified by scripts/inspect-macbook.mjs on
 *  macbook(.rigged).glb — the two sibling subtrees are the hinge split. */
const BASE_NODE = "BoBvWqDHZjAeVrp_44";
const LID_NODE = "VCQqxpxkUlzqcJI_62";
const SCREEN_MATERIAL = "sfCQkHOWyrsLmor";
const LOGO_MATERIAL = "CdgEAaPUlrQWQuD";
const PIVOT_NAME = "__lidPivot";

export interface MacbookRig {
  /** Rotate `rotation.x` from `+openAngle` (closed, lid flat on base) to `0`
   *  (authored open) — sign verified empirically in the sandbox sweep
   *  (spec §5.4.4): positive swings the lid forward-down flat onto the deck,
   *  negative folds it under the base. NOTE: judge poses by renders/world
   *  quaternions, not Box3.setFromObject — the lid's loose raw AABB inflates
   *  massively when rotated (bbox-of-bbox), which cost this build two false
   *  "broken hinge" reads. */
  lidPivot: THREE.Group;
  openAngle: number;
  /** Uniform fit scale + offset centering the base on origin, bottom at y=0. */
  fitScale: number;
  fitPosition: THREE.Vector3;
  setScreenGlow: (v: number) => void;
  setLogoGlow: (v: number) => void;
}

/** Build the hinge rig on the loaded GLTF scene (Case A: named subtrees).
 *  Idempotent — StrictMode/HMR re-runs reuse the pivot already attached. */
export function buildMacbookRig(scene: THREE.Group): MacbookRig {
  const base = scene.getObjectByName(BASE_NODE);
  const lid = scene.getObjectByName(LID_NODE);
  if (!base || !lid) throw new Error("MacBook rig: base/lid subtree not found in GLB");

  scene.updateWorldMatrix(true, true);
  const lidBox = new THREE.Box3().setFromObject(lid);
  const baseBox = new THREE.Box3().setFromObject(base);

  // Hinge line (world): at the base's DECK line, on the lid edge nearest the
  // base's rear top edge. Candidates evaluated per spec §5.4.2: lid z-min
  // (far edge, leaning away) vs z-max (≈ -11.8, coincides with base rear
  // ≈ -12.4) → z-max. For Y, the spec's lidBox.min.y (≈ -0.66) is the hinge
  // BARREL bottom — pivoting there sinks the closed lid a full lid-thickness
  // through the deck (verified in the sandbox sweep); the deck top
  // (baseBox.max.y) closes it flush on top.
  const hingeWorld = new THREE.Vector3(0, baseBox.max.y, lidBox.max.z);

  // Authored open angle: angle between the lid slab direction (hinge → far
  // edge, in the YZ plane) and the closed direction (flat toward base front).
  const openDir = new THREE.Vector2(
    lidBox.max.y - hingeWorld.y, // rise
    lidBox.min.z - hingeWorld.z, // lean-back
  ).normalize();
  const openAngle = new THREE.Vector2(0, 1).angleTo(openDir); // ≈ 1.95 rad

  let lidPivot = scene.getObjectByName(PIVOT_NAME) as THREE.Group | undefined;
  if (!lidPivot) {
    lidPivot = new THREE.Group();
    lidPivot.name = PIVOT_NAME;
    const parent = lid.parent as THREE.Object3D;
    parent.add(lidPivot);
    lidPivot.position.copy(parent.worldToLocal(hingeWorld.clone()));
    lidPivot.attach(lid); // attach preserves the authored world pose
  }

  // Materials: screen wallpaper is already an emissiveMap (KHR strength 8) —
  // keep it vivid against ACES by disabling tone mapping and drive intensity
  // ourselves. Logo is glossy black; give it a white emissive to ramp.
  let screenMat: THREE.MeshStandardMaterial | undefined;
  let logoMat: THREE.MeshStandardMaterial | undefined;
  scene.traverse((obj) => {
    const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (!mat) return;
    if (mat.name === SCREEN_MATERIAL) screenMat = mat;
    if (mat.name === LOGO_MATERIAL) logoMat = mat;
  });
  if (screenMat) {
    screenMat.toneMapped = false;
    screenMat.emissiveIntensity = 0;
  }
  if (logoMat) {
    logoMat.emissive.setScalar(1);
    logoMat.emissiveIntensity = 0;
  }
  if (import.meta.env.DEV && (!screenMat || !logoMat)) {
    console.warn("MacBook rig: screen/logo material not found", { screenMat, logoMat });
  }

  const size = baseBox.getSize(new THREE.Vector3());
  const center = baseBox.getCenter(new THREE.Vector3());
  const fitScale = FIT_SIZE / size.x;
  const fitPosition = new THREE.Vector3(
    -center.x * fitScale,
    -baseBox.min.y * fitScale, // base bottom on the shadow plane (y = 0)
    -center.z * fitScale,
  );

  return {
    lidPivot,
    openAngle,
    fitScale,
    fitPosition,
    setScreenGlow: (v) => screenMat && (screenMat.emissiveIntensity = v * SCREEN_GLOW_MAX),
    setLogoGlow: (v) => logoMat && (logoMat.emissiveIntensity = v * LOGO_GLOW_MAX),
  };
}
