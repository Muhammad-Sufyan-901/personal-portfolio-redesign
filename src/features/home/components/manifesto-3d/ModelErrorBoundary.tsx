import { Component, type ReactNode } from "react";

interface ModelErrorBoundaryProps {
  /** Poster/static stand-in — the page must never hold a black hole (§9). */
  fallback: ReactNode;
  children: ReactNode;
}

/** Catches lazy-chunk load errors, WebGL context creation failures, and GLB
 *  fetch/parse rejections from the R3F island. Class component by necessity —
 *  React error boundaries have no hook form. */
export class ModelErrorBoundary extends Component<ModelErrorBoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (import.meta.env.DEV) console.warn("Manifesto 3D failed — poster fallback:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
