import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Box } from "@/components/common/Box";
import { Header } from "@/components/layouts/Header";
import { MobileMenu } from "@/components/layouts/MobileMenu";
import { useUIStore } from "@/store/useUIStore";

export function RootLayout() {
  const preloaderDone = useUIStore((s) => s.preloaderDone);
  const menuOpen = useUIStore((s) => s.menuOpen);

  return (
    <Box className="min-h-screen bg-ink font-sans">
      {/* F1 fix: while the preloader overlay is up, everything behind it is
          inert (unfocusable/unclickable). Reduced-motion + session-skip paths
          set preloaderDone immediately, so content is never wrongly inert. */}
      <Box inert={!preloaderDone || undefined}>
        {/* Inner wrapper goes inert while the menu dialog is open (focus containment). */}
        <Box inert={menuOpen || undefined}>
          <Header />
          <Outlet />
        </Box>
        <MobileMenu />
      </Box>

      <TanStackRouterDevtools
        position="bottom-right"
        initialIsOpen={false}
      />
    </Box>
  );
}
