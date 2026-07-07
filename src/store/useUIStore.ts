import { create } from "zustand";

interface UIState {
  /** Hero timeline's start cue — set by the Preloader on completion. */
  preloaderDone: boolean;
  menuOpen: boolean;
  setPreloaderDone: (done: boolean) => void;
  setMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  preloaderDone: false,
  menuOpen: false,
  setPreloaderDone: (preloaderDone) => set({ preloaderDone }),
  setMenuOpen: (menuOpen) => set({ menuOpen }),
}));
