import { createRootRoute } from "@tanstack/react-router";
import { RootLayout } from "@/components/layouts/RootLayout";

// Preloader + Cursor mount here when chapter 00 lands.
export const Route = createRootRoute({
  component: RootLayout,
});
