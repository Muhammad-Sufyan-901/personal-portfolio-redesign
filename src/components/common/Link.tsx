import type { ComponentPropsWithoutRef, MouseEvent } from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";

type LinkProps = {
  href: string;
  replace?: boolean;
  scroll?: boolean;
} & Omit<ComponentPropsWithoutRef<"a">, "href">;

const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href) || href.startsWith("mailto:") || href.startsWith("tel:");

/** Href-classifying link: hash → Lenis smooth-scroll + pushState (native under
 *  reduced motion / no Lenis); external/mailto/tel → raw <a> with safe rel;
 *  internal path → TanStack RouterLink. */
export function Link({ href, replace = false, scroll = true, target, rel, onClick, children, ...props }: LinkProps) {
  const lenis = useLenis();

  if (href.startsWith("#")) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);
      if (e.defaultPrevented) return;
      e.preventDefault();
      const el = document.querySelector<HTMLElement>(href);
      if (el) {
        if (lenis && scroll) {
          // force: survive a stopped Lenis (SiteMenu stops it while open)
          lenis.scrollTo(el, { force: true });
        } else {
          el.scrollIntoView();
        }
        history.pushState(null, "", href);
        // preventDefault() above kills the browser's fragment-navigation focus
        // reset, and pushState never sets one — so without this the caret stays
        // on the anchor and the next Tab resumes where it was. That silently
        // made the skip link bypass nothing. preventScroll so we don't fight
        // the scroll we just started.
        if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
      }
    };
    return (
      <a
        href={href}
        onClick={handleClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  if (isExternal(href)) {
    const isBlank = target === "_blank" || (!href.startsWith("mailto:") && !href.startsWith("tel:"));
    const safeRel = isBlank ? (rel ?? "noopener noreferrer") : rel;
    return (
      <a
        href={href}
        target={target ?? (isBlank ? "_blank" : undefined)}
        rel={safeRel}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <RouterLink
      to={href}
      replace={replace}
      onClick={onClick}
      {...props}
    >
      {children}
    </RouterLink>
  );
}
