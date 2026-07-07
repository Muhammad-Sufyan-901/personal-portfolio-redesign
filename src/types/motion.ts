export type RevealMode = "lines" | "words" | "chars";

export interface ParallaxConfig {
  /** yPercent at section top (default -8) */
  from?: number;
  /** yPercent at section bottom (default 8) */
  to?: number;
}
