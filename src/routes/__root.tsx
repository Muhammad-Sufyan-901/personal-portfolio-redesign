import { createRootRoute } from "@tanstack/react-router";
import { Cursor, Preloader } from "@/components/common";
import { RootLayout } from "@/components/layouts/RootLayout";

// Wiring-only local component (keeps react-refresh lint happy).
const RootComponent = () => (
  <>
    <Preloader />
    <Cursor />
    <RootLayout />
  </>
);

export const Route = createRootRoute({
  component: RootComponent,
});
