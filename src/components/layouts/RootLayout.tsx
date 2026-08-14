import { Outlet } from "@tanstack/react-router";
import { Box, Link } from "@/components/common";
import { MenuPopout } from "@/components/shared/MenuPopout";
import { ScrollProgressHUD } from "@/components/shared/ScrollProgressHUD";
import { SiteMenu } from "@/components/shared/SiteMenu";
import { useUIStore } from "@/store/useUIStore";

/** Site frame. Containment (established overlay pattern):
 *  - everything is inert while the preloader curtain (z-90) is up;
 *  - Header + page content are inert while the SiteMenu (z-80) is open,
 *    so focus can't reach behind the overlay (the menu owns its close). */
export function RootLayout() {
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  const menuOpen = useUIStore((s) => s.menuOpen);

  return (
    <Box
      className="relative min-h-screen"
      inert={!preloaderDone}
    >
      <SiteMenu />
      <Box inert={menuOpen}>
        {/* Deferred from the hero audit (F7) to "footer polish" — landed with
            the Footer chapter. Above the z-60 chrome, below the z-80 menu.
            text-ink, not paper: paper-bright on ember measures 3.68:1 at 13px
            and --text-eyebrow is too small to count as large text; ink is
            4.72:1. The ring is ink for the same reason — the global
            :focus-visible ember ring would be ember-on-ember here. */}
        <Link
          href="#hero"
          className="bg-accent text-ink sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-70 focus:rounded-sm focus:px-4 focus:py-2 focus:font-mono focus:text-eyebrow focus:uppercase focus:outline-ink"
        >
          Skip to content
        </Link>
        <MenuPopout />
        <ScrollProgressHUD />
        <Outlet />
      </Box>
    </Box>
  );
}
