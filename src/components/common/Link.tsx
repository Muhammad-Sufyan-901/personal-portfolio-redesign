import React from "react";
import { Link as RouterLink } from "@tanstack/react-router";
import { useLenis } from "@/hooks/useLenis";

// ============================================
// LINK COMPONENT (Next.js Style)
// ============================================

interface LinkOwnProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  replace?: boolean;
  scroll?: boolean;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

type LinkProps = LinkOwnProps & Omit<React.ComponentPropsWithRef<"a">, keyof LinkOwnProps | "href">;

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, className, replace = false, scroll = true, target, rel, onClick, ...restProps }, ref) => {
    // Lenis owns smooth scrolling; null under prefers-reduced-motion (native, instant).
    const lenis = useLenis();

    // Check if link is external
    const isExternal = href.startsWith("http") || href.startsWith("//");
    const isHash = href.startsWith("#");
    const isMailTo = href.startsWith("mailto:");
    const isTel = href.startsWith("tel:");

    // Handle scroll behavior
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Call user's onClick if provided
      onClick?.(e);

      // Handle hash links with smooth scroll
      if (isHash && !e.defaultPrevented) {
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        if (element) {
          if (lenis) {
            lenis.scrollTo(element);
          } else {
            element.scrollIntoView({ block: "start" });
          }
          // Update URL without page reload
          window.history.pushState({}, "", href);
        }
      }

      // Handle scroll to top for internal navigation
      if (!isExternal && !isHash && scroll && !e.defaultPrevented) {
        // Schedule scroll to top after navigation completes
        setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(0);
          } else {
            window.scrollTo(0, 0);
          }
        }, 0);
      }
    };

    // Auto-set rel for external links
    const externalRel = isExternal && target === "_blank" ? rel || "noopener noreferrer" : rel;

    // External links or special protocols (mailto, tel)
    if (isExternal || isMailTo || isTel) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          target={target}
          rel={externalRel}
          onClick={handleClick}
          {...restProps}
        >
          {children}
        </a>
      );
    }

    // Hash links
    if (isHash) {
      return (
        <a
          ref={ref}
          href={href}
          className={className}
          onClick={handleClick}
          {...restProps}
        >
          {children}
        </a>
      );
    }

    // Internal links using @tanstack/react-router
    return (
      <RouterLink
        ref={ref}
        to={href as unknown as string}
        className={className}
        replace={replace}
        onClick={handleClick as unknown as React.MouseEventHandler<HTMLAnchorElement>}
        {...(restProps as unknown as Record<string, unknown>)}
      >
        {children}
      </RouterLink>
    );
  },
);

Link.displayName = "Link";

export { Link };
export type { LinkProps };
