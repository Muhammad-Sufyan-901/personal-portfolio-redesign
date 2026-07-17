import { profile } from "@/features/home/data/profile.data";

/** Single source of truth for every magic number the hero refine introduced
 *  (one-line name, fonts, aurora, chrome). The manifesto entry/story numbers
 *  live in manifesto.tunables.ts (`MANIFESTO_ENTRY`) and `channels`. */
export const HERO_REFINE = {
  /** Content comes from the data layer (owner-approved 2026-07-16). */
  name: profile.heroName,
  FONTS: {
    /** Upgrade slot — NOT YET WIRED (flipping it is a no-op today): when
     *  licensed Apparel/Factory Grotesk woff2 land at
     *  public/fonts/{apparel,factory-grotesk}/, add the FontFace + CSS-var
     *  repoint wiring and this flag swaps the hero faces. */
    useReferenceFaces: false,
    lead: { family: "Switzer", file: "/fonts/switzer/Switzer-Medium.woff2", weight: 500 },
    tail: {
      family: "Instrument Serif",
      file: "/fonts/instrument-serif/InstrumentSerif-Italic-latin.woff2",
      weight: 400,
      style: "italic",
    },
    reference: {
      lead: { family: "Factory Grotesk", file: "/fonts/factory-grotesk/FactoryGrotesk-Medium.woff2", weight: 500 },
      tail: { family: "Apparel", file: "/fonts/apparel/Apparel-Italic.woff2", weight: 400, style: "italic" },
    },
  },
  aurora: {
    /** Multiplies the shader's shipped 0.6 intensity scalar (1.0 = as shipped). */
    intensity: 1.5,
    /** 0..1 — how far down the viewport the chroma reaches (maps to the
     *  smoothstep midpoint). Tuned against frame_0001: measured frame-chroma
     *  ref 37% / shipped 32% / this setting ≈ 40% — area was already close,
     *  the boost is mostly vividness (intensity). */
    coverage: 0.55,
    hotspot: { followLambda: 4, idleDriftSpeed: 0.15, idleDriftAmp: 0.25, radius: 0.45 },
  },
  chrome: { label: "text-paper", labelHover: "hover:text-paper-bright", rule: "border-line-strong" },
  /** Reference's cyan flash on the tail word — opt-in, ships OFF. */
  surnameHoverFlash: { enabled: false, durIn: 0.15, durOut: 0.4 },
} as const;
