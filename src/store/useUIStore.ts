import { create } from "zustand";

interface UIState {
  preloaderDone: boolean;
  menuOpen: boolean;
  setPreloaderDone: (v: boolean) => void;
  setMenuOpen: (v: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  preloaderDone: false,
  menuOpen: false,
  setPreloaderDone: (v) => set({ preloaderDone: v }),
  setMenuOpen: (v) => set({ menuOpen: v }),
}));
