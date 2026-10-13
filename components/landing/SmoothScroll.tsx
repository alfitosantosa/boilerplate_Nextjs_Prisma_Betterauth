"use client";

import type { ReactNode } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Lenis smooth scroll untuk permukaan marketing saja — dashboard tidak ikut.
 * `anchors: true` memuluskan navigasi ke #anchor di navbar.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
