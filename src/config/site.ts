/**
 * Site-wide SEO/meta config. Facts from PRD §2 + §3.7.
 * `url` omitted — the production domain is not in the PRD.
 */
export const siteConfig = {
  name: "Muhammad Sufyan",
  title: "Muhammad Sufyan — Software Engineer · Web & Mobile",
  description:
    "Muhammad Sufyan is a software engineer based in Indonesia, working across web and mobile — building digital applications that can help many people, independently or in a team.",
  links: {
    whatsapp: "https://wa.me/628991622164",
    email: "mailto:muhammadsufyann09@gmail.com",
    telegram: "https://t.me/+628991622164",
    github: "https://github.com/Muhammad-Sufyan-901",
  },
} as const;
