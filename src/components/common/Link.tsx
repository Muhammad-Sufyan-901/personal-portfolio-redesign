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
      const el = document.querySelector(href);
      if (el) {
        if (lenis && scroll) {
          // force: survive a stopped Lenis (MobileMenu stops it while open)
          lenis.scrollTo(el as HTMLElement, { force: true });
        } else {
          (el as HTMLElement).scrollIntoView();
        }
        history.pushState(null, "", href);
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
