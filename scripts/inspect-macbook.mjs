/**
 * Inventory a glTF/GLB: every node (name, mesh, verts, world bbox) and every
 * material (name, emissive, textures, which meshes use it). Rigging decisions
 * for the manifesto MacBook cite this table (spec §5.2).
 *
 *   node scripts/inspect-macbook.mjs [public/models/macbook.glb]
 */
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";

const path = process.argv[2] ?? "public/models/macbook.glb";

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule() });

const doc = await io.read(path);
const root = doc.getRoot();

const fmt = (n) => (Math.abs(n) >= 1e6 || Number.isNaN(n) ? "?" : +n.toFixed(2));

/** World-space bbox of a node's own mesh (accessor min/max × world matrix). */
function nodeBBox(node) {
  const mesh = node.getMesh();
  if (!mesh) return null;
  const m = node.getWorldMatrix();
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute("POSITION");
    if (!pos) continue;
    const [aMin, aMax] = [pos.getMin([]), pos.getMax([])];
    // Transform all 8 corners — correct under rotation, cheap either way.
    for (let c = 0; c < 8; c++) {
      const p = [c & 1 ? aMax[0] : aMin[0], c & 2 ? aMax[1] : aMin[1], c & 4 ? aMax[2] : aMin[2]];
      const w = [
        m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12],
        m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13],
        m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14],
      ];
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], w[i]);
        max[i] = Math.max(max[i], w[i]);
      }
    }
  }
  return { min, max, size: min.map((v, i) => max[i] - v) };
}

console.log(`\n== ${path} ==`);
console.log("\n== NODES (name | mesh | verts | world bbox min → max | size) ==");
let totalVerts = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh();
  const verts = mesh
    ? mesh.listPrimitives().reduce((s, p) => s + (p.getAttribute("POSITION")?.getCount() ?? 0), 0)
    : 0;
  totalVerts += verts;
  const bb = nodeBBox(node);
  const kids = node.listChildren().length;
  console.log(
    [
      node.getName().padEnd(36),
      mesh ? `mesh:${mesh.getName()}`.padEnd(18) : (kids ? `(${kids} children)` : "(empty)").padEnd(18),
      String(verts).padStart(7),
      bb ? `[${bb.min.map(fmt)}] → [${bb.max.map(fmt)}] size [${bb.size.map(fmt)}]` : "",
    ].join(" | "),
  );
}

console.log("\n== MATERIALS (name | emissive | textures | meshes) ==");
const meshesByMat = new Map();
for (const mesh of root.listMeshes())
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial();
    if (!mat) continue;
    if (!meshesByMat.has(mat)) meshesByMat.set(mat, new Set());
    meshesByMat.get(mat).add(mesh.getName());
  }
for (const mat of root.listMaterials()) {
  const bits = [];
  const ef = mat.getEmissiveFactor();
  if (ef.some((v) => v > 0)) bits.push(`emisF=${ef.map(fmt)}`);
  if (mat.getEmissiveTexture()) bits.push("emisTex");
  const strength = mat.getExtension("KHR_materials_emissive_strength");
  if (strength) bits.push(`emisStr=${strength.getEmissiveStrength()}`);
  if (mat.getBaseColorTexture()) bits.push("baseTex");
  bits.push(`m/r=${fmt(mat.getMetallicFactor())}/${fmt(mat.getRoughnessFactor())}`);
  console.log(
    mat.getName().padEnd(26),
    "|",
    bits.join(" ").padEnd(40),
    "|",
    [...(meshesByMat.get(mat) ?? [])].join(","),
  );
}

console.log("\n== TEXTURES ==");
for (const tex of root.listTextures()) {
  const size = tex.getSize();
  console.log(
    (tex.getName() || tex.getURI() || "(embedded)").padEnd(26),
    "|",
    tex.getMimeType(),
    "|",
    size ? `${size[0]}×${size[1]}` : "?",
    "|",
    `${(tex.getImage()?.byteLength / 1024).toFixed(0)} KB`,
  );
}

const tris = root
  .listMeshes()
  .flatMap((m) => m.listPrimitives())
  .reduce((s, p) => s + (p.getIndices()?.getCount() ?? 0) / 3, 0);
console.log(`\nTOTAL: ${totalVerts} verts | ~${Math.round(tris)} tris | extensions: ${root.listExtensionsUsed().map((e) => e.extensionName).join(", ") || "none"}`);
