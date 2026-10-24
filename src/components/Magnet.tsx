"use client";

import { useEffect, useRef, type ReactNode } from "react";

// Mouse-following "magnetic" hover: while the cursor is within `padding`
// px of the element's edge, the element drifts toward it by
// (distance / magnetStrength); it eases back to rest when the cursor leaves.
// The transform is written straight to the DOM once per animation frame —
// no React state — so a page full of magnets doesn't re-render on every
// mouse move.
export default function Magnet({
  children,
  padding = 100,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  className,
}: {
  children: ReactNode;
  padding?: number;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let active = false;
    let lastX = 0;
    let lastY = 0;

    function apply() {
      frame = 0;
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const inside =
        Math.abs(cx - lastX) < width / 2 + padding && Math.abs(cy - lastY) < height / 2 + padding;

      if (inside) {
        active = true;
        inner.style.transition = activeTransition;
        inner.style.transform = `translate3d(${(lastX - cx) / magnetStrength}px, ${(lastY - cy) / magnetStrength}px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = inactiveTransition;
        inner.style.transform = "translate3d(0, 0, 0)";
      }
    }

    function onMove(e: MouseEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [padding, magnetStrength, activeTransition, inactiveTransition]);

  return (
    <div ref={ref} className={className} style={{ position: "relative", display: "inline-block" }}>
      <div ref={innerRef} style={{ transform: "translate3d(0, 0, 0)" }}>
        {children}
      </div>
    </div>
  );
}
