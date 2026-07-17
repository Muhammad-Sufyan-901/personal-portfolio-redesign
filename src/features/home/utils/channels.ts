/** Choreography channels — the single source of truth the manifesto's master
 *  scrub timeline tweens (DOM side) and the render loop damps toward (3D
 *  side). Plain module singleton: importing it costs nothing, so the section
 *  can tween it without pulling three.js into the main chunk. */
export interface ManifestoChannels {
  /** Seam: camera settle + exposure ease-in (0 rest strip → 1 fullscreen). */
  sceneIntro: number;
  /** 0 = closed lid → 1 = authored open (~112°). */
  lidProgress: number;
  /** 0 = rear-quarter to camera → 1 = front-on. */
  yawProgress: number;
  /** P4 package: scale down, sink, residual yaw drift. */
  recede: number;
  /** Screen wallpaper emissive driver (0 → spill → full). */
  screenGlow: number;
  /** Apple-logo emissive accent during the lid-open beat. */
  logoGlow: number;
}

export const channels: ManifestoChannels = {
  sceneIntro: 0,
  lidProgress: 0,
  yawProgress: 0,
  recede: 0,
  screenGlow: 0,
  logoGlow: 0,
};

/** T1 entry channels — scrubbed by the manifesto's entry timeline; the entry
 *  applier damps rendered copies toward these and writes the DOM (h1 rise and
 *  fade, birth-box clip). Same plain-singleton pattern as `channels`. */
export const entry = { rise: 0, birth: 0, growth: 0 };

/** Render-loop gate. The section flips `active` from its stage trigger
 *  (false once the veil has fully swallowed the stage / past About); the
 *  FrameDriver stops advancing frames while inactive or the tab is hidden. */
export const stageState = { active: true };
