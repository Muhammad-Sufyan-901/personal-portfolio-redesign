import { Outlet } from "@tanstack/react-router";
import { Box } from "@/components/common";
import { MenuPopout } from "@/components/layouts/MenuPopout";
import { SiteMenu } from "@/components/layouts/SiteMenu";
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
        <MenuPopout />
        <Outlet />
      </Box>
    </Box>
  );
}
