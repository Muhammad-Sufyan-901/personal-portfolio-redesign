import type { ReactNode } from "react";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      defaultTheme="dark"
      storageKey="vite-ui-theme"
    >
      <TooltipProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
