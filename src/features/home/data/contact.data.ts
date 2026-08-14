import type { ContactChannel } from "@/types/portfolio";

/** PRD §3.7 — verbatim. */
export const contactChannels: ContactChannel[] = [
  {
    label: "WhatsApp",
    value: "+62 8991622164",
    href: "https://wa.me/628991622164",
  },
  {
    label: "Gmail",
    value: "muhammadsufyann09@gmail.com",
    href: "mailto:muhammadsufyann09@gmail.com",
  },
  {
    label: "Telegram",
    value: "+62 8991622164",
    href: "https://t.me/+628991622164",
  },
];

/** Chapter 10 statement beats — one per statement/panel pair, rendered in
 *  order (the second pair mirrors its layout, not its copy). Owner-editable
 *  per the ARTICLES_STATEMENT precedent: change the copy here; `focalWords`
 *  render in the focal-phrase device (Instrument Serif italic), matched
 *  word-by-word, so a multi-word phrase lists each of its words.
 *
 *  [0] Facts from the PRD (§2 role "Software Engineer · Web & Mobile", §2
 *      location "Indonesia"); the "open to new opportunities" availability
 *      framing is NOT in the PRD — owner's explicit pick at the contact plan
 *      gate (2026-08-03).
 *  [1] Re-voiced from the PRD §2 bio verbatim facts ("I can work
 *      independently or in a team", "I hope to always keep learning something
 *      new") — owner's pick at the contact revision gate (2026-08-04). */
export const CONTACT_STATEMENTS = [
  {
    text: "Open to new opportunities — a software engineer from Indonesia, building for web and mobile.",
    focalWords: ["opportunities"],
  },
  {
    text: "I can work independently or in a team, and I hope to always keep learning something new with every project I ship.",
    focalWords: ["independently", "or", "in", "a", "team"],
  },
] as const;

/** Social/profile links — GitHub profile derived from the PRD §3.6 repository
 *  URLs (github.com/Muhammad-Sufyan-901). Used by the hero bottom bar and the
 *  contact chapter's social stack. */
export const socialLinks: ContactChannel[] = [
  {
    label: "GitHub",
    value: "github.com/Muhammad-Sufyan-901",
    href: "https://github.com/Muhammad-Sufyan-901",
  },
  {
    label: "Gmail",
    value: "muhammadsufyann09@gmail.com",
    href: "mailto:muhammadsufyann09@gmail.com",
  },
  {
    label: "WhatsApp",
    value: "+62 8991622164",
    href: "https://wa.me/628991622164",
  },
];
