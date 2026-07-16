# AI Asset Pipeline — images, textures, video, 3D models

When the user has no assets, generate them WITH the user (their accounts/tools) and
integrate. All outputs land in a flat contract: `assets/img/`, `assets/textures/`,
`assets/video/`, `assets/3d/` with the exact filenames the site expects.

## Still images (scene art / posters)

Prompt formula that works:
- NAME the subjects concretely ("a towering white-coated captain at the bow of his
  ship"), never "dark silhouettes of figures" — vague subjects generate mush.
- Default to LANDSCAPE full-frame ("wide 16:9 cinematic composition") unless the beat
  is truly vertical.
- Fix the style: "dark cinematic anime film style" / "photorealistic product shot" +
  lighting note ("dramatic rim lighting", "even diffuse light").
- One focal action per image. Multi-event prompts split attention and degrade all of it.

## Seamless PBR textures (the photoreal-surface trick)

1. Generate the albedo photo:
   "Seamless tileable texture: top-down macro photograph of <SURFACE — e.g. frosted
   glacial ice with compact snow grain, fine hairline cracks, tiny air bubbles>.
   Uniform soft diffuse lighting, no shadows, no perspective, completely flat surface
   filling the entire frame. Photorealistic, extremely detailed. Square 1:1."
   ("no shadows / uniform light" is what makes it usable as albedo.)
2. Derive normal + roughness maps: `python scripts/make_pbr.py in.png name outdir/`
   (de-lights the albedo, Sobel-on-bandpassed-luminance normal map, detail-based
   roughness).
3. Load with `MirroredRepeatWrapping` (hides imperfect tiling), albedo as sRGB, maps
   as linear. Apply via triplanar (procedural geometry) or standard UVs (ground).

## Video clips (cinemagraph backgrounds)

Prompt template (image-to-video, any generator — Veo/Flow, Seedance, Kling, Runway):
"Cinemagraph, very slow ambient motion. <scene description>. Camera locked, extremely
slow push-in. <style>. Loopable, no large movement." 8s, aspect matching the layout.

Quality checklist (fixes most "burik"/soft results):
1. Select the highest-quality model tier (not the fast/default tier).
2. Download at the highest offered resolution (1080p option, not the default button).
3. Feed the FULL-RES still as the reference frame, never a compressed web copy.
4. Keep motion minimal — the more moves, the more the model re-invents detail = mush.
5. On the site, film grain + vignette legitimately mask remaining compression.

For true-scrub scrollytelling the clips must be re-encoded with dense keyframes —
see `scripts/encode-scrub.md`. Without it, expect flicker; use play-when-centered.

Sharpness rescue (cinemagraph-specific): render the sharp STILL as the base layer and
blend the video on top only where it moves — static areas keep 2K sharpness.

## 3D models

- Organic/complex shapes (characters, creatures, ornate props) = external GLB.
  AI route: Meshy et al. image-to-3D → GLB with PBR textures. User-owned outputs.
- Geometric shapes (rings, crystals, terrain, architecture) = procedural code, no asset.
- Heavy GLBs (10–60MB) are fine served locally; for production, compress:
  `npx @gltf-transform/cli optimize in.glb out.glb --compress draco --texture-compress webp`
- The pro pattern (igloo.inc, Hatom): assets sculpted/simulated offline in DCC tools,
  baked to color/normal/roughness/AO maps, served as Draco + compressed textures.
  Real-time layer adds refraction/fresnel/post on top. Replicate the *pipeline* — never
  copy another site's actual asset files (copyright).

## Production sheet pattern

When the user generates assets themselves, ALWAYS write `ASSETS.md` into the project:
one copy-paste prompt per asset, the generator settings (aspect/duration/quality tier),
and the exact target filename. The site ships with fallbacks so it runs before any
asset exists; each file that appears upgrades the experience automatically.
