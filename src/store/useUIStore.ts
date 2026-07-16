import { create } from "zustand";

interface UIState {
  /** Hero handoff cue — set by the Preloader at the flash-covered swap. */
  preloaderDone: boolean;
  /** Preloader gate signal — set by AuroraBackground once its shader has
   *  rendered a first frame (or terminally failed / reduced motion). */
  auroraReady: boolean;
  menuOpen: boolean;
  setPreloaderDone: (done: boolean) => void;
  setAuroraReady: (ready: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  preloaderDone: false,
  auroraReady: false,
  menuOpen: false,
  setPreloaderDone: (preloaderDone) => set({ preloaderDone }),
  setAuroraReady: (auroraReady) => set({ auroraReady }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
