import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/providers/SmoothScrollProvider";
import { ThemeProvider } from "@/providers/theme-provider";

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
