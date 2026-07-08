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

/** Social/profile links — GitHub profile derived from the PRD §3.6 repository
 *  URLs (github.com/Muhammad-Sufyan-901). Used by the hero bottom bar. */
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
