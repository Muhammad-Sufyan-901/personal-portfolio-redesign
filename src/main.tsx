import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { AppProviders } from "@/providers/AppProviders";
import "./styles/globals.css";
import { routeTree } from "./routeTree.gen";

// Single-page site with a preloader on every load — always start at the hero.
// (history.scrollRestoration is set to "manual" in @/lib/gsap, which the
// AppProviders import chain runs before this module body.)
window.scrollTo(0, 0);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
