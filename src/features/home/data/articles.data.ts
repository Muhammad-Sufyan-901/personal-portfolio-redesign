import type { Article } from "@/types/portfolio";
import { profile } from "@/features/home/data/profile.data";

/** Chapter 09 Articles — the ONLY file the owner edits to ship this chapter.
 *
 *  PROVENANCE: none of this is PRD content. The PRD defers a blog entirely
 *  ("Blog is out of scope unless explicitly requested at planning approval",
 *  §5; "Include a Writing/Blog chapter? (default: no.)", §6), which is why
 *  every entry below is a PLACEHOLDER rather than a real article — the house
 *  rule is transcribe, never fabricate. The owner asked for the shell first
 *  (2026-07-26) and fills the real entries here.
 *
 *  ┌──────────────────────────────────────────────────────────────────────┐
 *  │ NOTHING BELOW IS PUBLISHED. Every `url` is `https://example.com/…`   │
 *  │ and every `cover` is a hot-linked Unsplash URL. Both are the         │
 *  │ ship-guard — if either survives to production, this file was never   │
 *  │ filled in.                                                           │
 *  └──────────────────────────────────────────────────────────────────────┘
 *
 *  The earlier stubs prefixed every visible string with `TODO(owner) —`.
 *  Dropped on purpose (owner decision 2026-08-01): ~15 characters of boilerplate
 *  per field distorted the two-line clamp these 12 entries exist to exercise.
 *  Titles and descriptions are therefore realistic in LENGTH AND SHAPE — never
 *  in content — so the rail measures, wraps and clamps the way it will with
 *  real copy. The url/cover guard above replaces the prefix as the marker.
 *
 *  TO FILL: replace each object with a real article, swap the Unsplash URLs for
 *  files in `public/assets/images/articles/`, and rewrite ARTICLES_STATEMENT.
 *  The section reads length, order and fields straight off this array — no
 *  component change is needed for any count, and an empty array makes the
 *  chapter render nothing at all. `description` and `cover` are REQUIRED (the
 *  card is a full-bleed photograph with a standfirst); `readingTime` is not. */

/** One byline for the whole shelf — these are the owner's own pieces, so an
 *  `author` field repeated across all 12 entries would be 24 duplicated
 *  strings and a lie about the shape of the data. Add `author?` to `Article`
 *  the day a guest post lands, not before.
 *
 *  The avatar reuses the About portrait: AboutSection (chapter 03) has already
 *  fetched that exact URL by the time this chapter scrolls into view, so the
 *  twelve 32px avatars cost one cache hit between them. */
export const ARTICLES_AUTHOR = {
  name: profile.name,
  avatar: "/assets/images/profile/about-profile.png",
} as const;

export const articles: Article[] = [
  {
    title: "The re-render you cannot see",
    publication: "Medium",
    date: "Jul 2026",
    description: "Profiling a dashboard that felt slow for reasons the flame chart kept insisting were not there.",
    url: "https://example.com/placeholder-01",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "6 min read",
  },
  {
    title: "Shipping a design system nobody has to read the docs for",
    publication: "dev.to",
    date: "Jun 2026",
    description:
      "Constraints beat documentation. What happened when the tokens stopped being suggestions and started being the only option.",
    url: "https://example.com/placeholder-02",
    cover: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "11 min read",
  },
  {
    title: "Flutter and React Native, three years in",
    publication: "Hashnode",
    date: "May 2026",
    description:
      "Not a benchmark post. A note on which one I reach for first, and the two cases where that answer flips.",
    url: "https://example.com/placeholder-03",
    cover: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "8 min read",
  },
  {
    /* The long one — this is the entry that has to survive the 390px
       breakpoint at line-clamp-2. If a title ever needs to be longer than
       this, the clamp is doing its job; don't widen the card for it. */
    title:
      "Everything I got wrong about scroll-driven animation before I had to build one that ran at sixty frames on a four-year-old Android",
    publication: "Personal blog",
    date: "Apr 2026",
    description:
      "One pinned section, one ticker, and a long argument with the compositor about who owns the transform.",
    url: "https://example.com/placeholder-04",
    cover: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "14 min read",
  },
  {
    title: "Strict mode is not the enemy",
    publication: "Medium",
    date: "Mar 2026",
    description:
      "Every loose type I deleted from a Laravel-backed admin panel, and the three bugs that fell out on the way.",
    url: "https://example.com/placeholder-05",
    cover: "https://images.unsplash.com/photo-1593720213428-28a5b9e94613?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "7 min read",
  },
  {
    /* No readingTime — proves the optional branch still renders a clean
       byline with only publication and date. */
    title: "Notes from a year of QA before I wrote features",
    publication: "dev.to",
    date: "Feb 2026",
    description:
      "Testing other people's code first turned out to be the most useful thing that ever happened to how I write mine.",
    url: "https://example.com/placeholder-06",
    cover: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=700&h=900&q=70",
  },
  {
    title: "A smaller bundle, one honest import at a time",
    publication: "Hashnode",
    date: "Jan 2026",
    description: "No clever tricks. Just reading the analyzer output properly and deleting what it kept pointing at.",
    url: "https://example.com/placeholder-07",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "5 min read",
  },
  {
    title: "Why I stopped reaching for state management",
    publication: "Medium",
    date: "Dec 2025",
    description:
      "Most of what I used to put in a store was derivable, and the rest fit in one very small zustand slice.",
    url: "https://example.com/placeholder-08",
    cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "9 min read",
  },
  {
    title: "Reduced motion is a feature, not a fallback",
    publication: "Personal blog",
    date: "Nov 2025",
    description:
      "Building the still version first made the animated version better. A short case for designing both at once.",
    url: "https://example.com/placeholder-09",
    cover: "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "6 min read",
  },
  {
    title: "The migration nobody noticed",
    publication: "dev.to",
    date: "Oct 2025",
    description:
      "Moving a production app across a major version in increments small enough that no release note was needed.",
    url: "https://example.com/placeholder-10",
    cover: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "12 min read",
  },
  {
    /* Second entry with no readingTime, and the shortest title in the set —
       together they check that the byline pill and the text block both stay
       put when there is the least possible content to hold them up. */
    title: "On finishing things",
    publication: "Personal blog",
    date: "Sep 2025",
    description:
      "The last ten percent of a side project is where all the learning is, and it is the part I used to skip.",
    url: "https://example.com/placeholder-11",
    cover: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=700&h=900&q=70",
  },
  {
    title: "Reading the framework source is faster than guessing",
    publication: "Hashnode",
    date: "Aug 2025",
    description:
      "Two afternoons in node_modules that saved a week of workarounds, and how I pick which file to open first.",
    url: "https://example.com/placeholder-12",
    cover: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=700&h=900&q=70",
    readingTime: "10 min read",
  },
];

/** Chapter heading. Re-voiced from PRD facts only (owner ask 2026-08-01) — the
 *  same treatment `profile.skillsStatement` and `profile.journeyStatement`
 *  already get, since the PRD carries no writing line of its own to transcribe:
 *    · "three years"            → stats §2, "3 Years of Experience"
 *    · "building for web and mobile" → role §2, "Software Engineer · Web & Mobile"
 *    · "what I learned"         → bio §2, "I hope to always keep learning something new"
 *    · "helps someone else"     → tagline §2, "help many people"
 *  No invented facts, and nothing here claims a piece was published — that is
 *  the entries' job, and they are still placeholders.
 *
 *  `focalWords` are matched case-insensitively after stripping punctuation, and
 *  each match renders in the site's focal-phrase device (Instrument Serif
 *  italic against Switzer roman). Keep it to one or two words — the device is
 *  an accent, and the chapter statements above all use it sparingly. */
export const ARTICLES_STATEMENT = {
  text: "Notes from three years of building for web and mobile — what I learned, written down in case it helps someone else.",
  focalWords: ["learned"],
} as const;
