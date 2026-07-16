# Theming — everything derives from THEME

The single most common failure: the user names a theme ("pirate era", "cyberpunk",
"luxury watch") and the generated site still looks like the generic default
(purple dusk + random serif). Theme must penetrate EVERY layer: background, palette,
fonts, motifs, copy voice, even easing feel. Declare one THEME object at the top of
the file and derive everything from it — no hardcoded colors/fonts anywhere else.

## THEME schema

```js
const THEME = {
  palette: {
    bg:      '#07060d',  // page + fog + scene background
    ink:     '#f2ede4',  // primary text
    accent:  '#e8a13c',  // CTAs, labels, glows, progress
    accent2: '#5c9fd8',  // secondary glow / rim light
    muted:   '#8b8398',  // captions, HUD secondary
  },
  fonts: { display:'…', body:'…', mono:'ui-monospace, SF Mono, Menlo, monospace' },
  motif: {
    glyphs: [],        // theme accents rendered big & faint (kanji, runes, symbols)
    labels: [],        // HUD micro-copy vocabulary ("DOSSIER", "MK·IV", "EST. 3021")
  },
  env: '…',            // procedural background style, see table below
};
```

## Font pairing by mood (Fontshare/Google, all free)

| Mood | display | body | feels like |
|---|---|---|---|
| epic / mythic / historical | Zodiak (900) | Satoshi | film title cards |
| tech / cyberpunk / sci-fi | Clash Display or Space Grotesk | Inter | HUD, labs |
| luxury / fashion / watch | Gambetta or Playfair Display | Satoshi | editorial print |
| playful / toy / game | Cabinet Grotesk | General Sans | modern poster |
| brutalist / crypto / bold | Archivo Black / Druk-like | IBM Plex Mono | crypto landing |

Always keep a mono font for HUD micro-copy — small, letter-spaced (0.2–0.35em),
uppercase. That mono layer is what makes pages read "designed".

## Palette rules

- Dark scenes: bg luminance < 10%; ink is warm off-white, never pure #fff.
- Exactly ONE hot accent. A second accent only as a cool counterweight (fire↔ice,
  gold↔steel). More than two accents reads as noise.
- Derive scene lighting from the palette too: key light slightly cool of ink,
  rim lights = accent/accent2, fog = bg.
- Light scenes (rare, elegant): bg 60–70% grey-blue, ink near-black, effects must
  DARKEN (frost, ink) because white glows are invisible on white.

## Procedural env styles (pick by theme, or build a new one)

| env key | contents | fits |
|---|---|---|
| night-war | starfield, ember horizon band, ridged FBM mountains, glossy dark floor | battle, epic, mythic |
| dusk-magic | purple gradient dome, amber horizon, soft mountains | fantasy product |
| void-studio | pure dark + reflective floor + light pool + dust | product showcase |
| glacier-day | light grey-blue fog world, snow ground | ice, minimal, clean |
| line-art | white/paper bg, thin dark line terrain, no fills | editorial, elegant |

The env is the FALLBACK layer under optional video backgrounds — build it even when
videos exist.

## Copy voice

Write copy in the theme's voice, in the user's language. Structure per section:
mono kicker label ("DOSSIER 03 // …"), 2-line display headline (one line may be
accent-colored via <em>), 1–2 sentence body ≤44ch, mono coord/spec line. Headline
words should be concrete and physical ("Waktu, ditempa." / "Tak pernah membelakangi.")
— not marketing abstractions.

## Anti-patterns

- Reusing the previous project's environment for a new theme (the "purple dusk for
  everything" bug).
- Hardcoding any color/font outside THEME.
- Decorative glyphs from the wrong culture/genre for the theme.
- Two fonts maximum plus mono; never three display fonts.
