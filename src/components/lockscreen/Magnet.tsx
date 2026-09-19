"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Mouse-following "magnetic" hover: while the cursor is within `padding`
// px of the element's edge, the element drifts toward it by
// (distance / magnetStrength); it eases back to rest when the cursor leaves.
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
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const { left, top, width, height } = el.getBoundingClientRect();
      const cx = left + width / 2;
      const cy = top + height / 2;
      const dx = Math.abs(cx - e.clientX);
      const dy = Math.abs(cy - e.clientY);

      if (dx < width / 2 + padding && dy < height / 2 + padding) {
        setActive(true);
        setPos({
          x: (e.clientX - cx) / magnetStrength,
          y: (e.clientY - cy) / magnetStrength,
        });
      } else {
        setActive(false);
        setPos({ x: 0, y: 0 });
      }
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, magnetStrength]);

  return (
    <div ref={ref} className={className} style={{ position: "relative", display: "inline-block" }}>
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: active ? activeTransition : inactiveTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
