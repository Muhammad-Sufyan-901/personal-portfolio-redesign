import { Outlet } from "@tanstack/react-router";
import { Box } from "@/components/common";
import { useUIStore } from "@/store/useUIStore";

/** Site frame — Header/MobileMenu mount here when chapter 01 lands.
 *  Page content is `inert` while the preloader curtain is up (established
 *  overlay-containment pattern) so focus/AT can't reach behind it. */
export function RootLayout() {
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  return (
    <Box
      className="relative min-h-screen"
      inert={!preloaderDone}
    >
      <Outlet />
    </Box>
  );
}
