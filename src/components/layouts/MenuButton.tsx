import { useUIStore } from "@/store/useUIStore";
import { Box, MagneticButton } from "@/components/common";
import { Button } from "@/components/ui/button";

/** Glass "Menu" pill — opens the fullscreen SiteMenu. Presentational only
 *  (no positioning); callers place it (hero top row, fixed pop-out). */
export function MenuButton() {
  const setMenuOpen = useUIStore((s) => s.setMenuOpen);

  return (
    <MagneticButton>
      <Button
        variant="ghost"
        aria-label="Open menu"
        className="h-10 rounded-full border border-paper/15 bg-paper/10 px-6 font-mono text-eyebrow text-paper uppercase backdrop-blur-md hover:bg-paper/20 hover:text-paper dark:hover:bg-paper/20"
        onClick={() => setMenuOpen(true)}
      >
        <Box
          as="span"
          className="magnetic-label"
        >
          Menu
        </Box>
      </Button>
    </MagneticButton>
  );
}
