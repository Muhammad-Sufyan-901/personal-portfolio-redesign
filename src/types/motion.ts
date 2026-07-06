export type RevealMode = "lines" | "chars" | "words";

/** yPercent scrub range for ParallaxImage (defaults -8 → 8, design_system §7.2). */
export interface ParallaxConfig {
  from?: number;
  to?: number;
}
