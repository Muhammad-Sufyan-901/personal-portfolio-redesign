import { createRootRoute } from "@tanstack/react-router";
import { Cursor, Preloader } from "@/components/common";
import { RootLayout } from "@/components/layouts/RootLayout";
import { profile } from "@/features/home/data/profile.data";

// Wiring-only local component (keeps react-refresh lint happy). The name
// prop keeps common/ free of feature imports — the preloader wordmark MUST
// match the hero h1 it morphs onto.
const RootComponent = () => (
  <>
    <Preloader name={profile.heroName} />
    <Cursor />
    <RootLayout />
  </>
);

export const Route = createRootRoute({
  component: RootComponent,
});
