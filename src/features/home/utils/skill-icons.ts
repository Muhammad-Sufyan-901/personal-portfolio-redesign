/** Owner-supplied brand SVGs (`src/assets/icons/`, SVG Repo) for the 06
 *  Skills accordion — supersedes the monochrome react-icons treatment
 *  (owner request 2026-07-21). Bundled URLs via import.meta.glob so the
 *  space-bearing filenames ("next js.svg") stay Vite-safe. */
const files = import.meta.glob<string>(
  [
    "@/assets/icons/*.svg",
    // decorative site assets sharing the folder — huge (gapura ≈465 KB each)
    // and not skill logos; excluding keeps them out of the bundle/dist
    "!**/arrow.svg",
    "!**/left gapura.svg",
    "!**/right gapura.svg",
    "!**/section ornament.svg",
    "!**/title ornament.svg",
  ],
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);

/** filename stem → url, independent of how Vite formats the glob keys */
const byStem: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const base = path.split("/").pop() ?? path;
  byStem[base.replace(/\.svg$/, "")] = url;
}

/** skill/tool name → filename stem, where lowercasing alone doesn't match */
const ALIASES: Record<string, string> = {
  "React JS": "react",
  "Vue.js": "vue",
  "Tailwind CSS": "tailwind",
};

export function skillIconUrl(name: string): string | undefined {
  return byStem[ALIASES[name] ?? name.toLowerCase()];
}
