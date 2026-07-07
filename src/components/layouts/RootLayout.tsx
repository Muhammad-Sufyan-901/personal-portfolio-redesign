import { Outlet } from "@tanstack/react-router";
import { Box } from "@/components/common";

/** Site frame — Header/MobileMenu mount here when chapter 01 lands. */
export function RootLayout() {
  return (
    <Box className="relative min-h-screen">
      <Outlet />
    </Box>
  );
}
