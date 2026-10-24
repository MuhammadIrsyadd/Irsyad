"use client";

import { useEffect, useRef, type RefObject } from "react";

// Lock-screen backdrop: a fine silver dot grid in the dark. The cursor
// acts like a flashlight — dots near it light up and lean away as if
// pushed by a magnet — and a click sends a shockwave ring through the
// grid that lines up with the unlock portal. Monochrome on purpose, so it
// sits quietly behind the silver wordmark.

interface DotFieldProps {
  /** Normalized pointer, -0.5..0.5 on each axis (ref, not state: the canvas
   *  loop reads it every frame, so pointer moves never re-render React). */
  mouseRef: RefObject<{ x: number; y: number }>;
  ripple?: { x: number; y: number; id: number } | null;
}

const DOT_RGB = "215, 226, 234"; // same #D7E2EA as the lock-screen text
const BASE_ALPHA = 0.2;
const MAJOR_ALPHA = 0.34; // every 4th row/column, like graph paper
const LIGHT_RADIUS = 240; // css px around the cursor that gets lit
const PUSH = 11; // max outward lean of a lit dot, css px
const RING_WIDTH = 46;
const RING_SPEED = 1.6; // css px per ms — crosses the screen in ~0.9s, like the portal

type Ring = { x: number; y: number; start: number };

export default function DotFieldBackground({ mouseRef, ripple = null }: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ringsRef = useRef<Ring[]>([]);

  useEffect(() => {
    if (ripple) ringsRef.current.push({ x: ripple.x, y: ripple.y, start: performance.now() });
  }, [ripple]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let spacing = 28;
    let dots: { x: number; y: number; major: boolean }[] = [];
    let frame = 0;
    // smoothed cursor, starts in the middle of the screen
    const cur = { x: 0.5, y: 0.5 };
    let lastDrawn = { x: -1, y: -1 };

    function layout() {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(w * dpr);
      canvas!.height = Math.floor(h * dpr);
      spacing = w < 640 ? 24 : 28;
      // centre the grid so both margins match
      const ox = (w % spacing) / 2;
      const oy = (h % spacing) / 2;
      dots = [];
      for (let row = 0, y = oy; y <= h; row++, y += spacing) {
        for (let col = 0, x = ox; x <= w; col++, x += spacing) {
          dots.push({ x, y, major: row % 4 === 0 && col % 4 === 0 });
        }
      }
      lastDrawn = { x: -1, y: -1 }; // force a redraw
    }

    function draw(now: number) {
      const mx = cur.x * w;
      const my = cur.y * h;
      const rings = ringsRef.current;

      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.globalAlpha = 1;
      ctx!.fillStyle = "#07080b";
      ctx!.fillRect(0, 0, w, h);

      // the flashlight itself: a faint cool glow under the lit dots
      const glow = ctx!.createRadialGradient(mx, my, 0, mx, my, LIGHT_RADIUS * 1.6);
      glow.addColorStop(0, `rgba(${DOT_RGB}, 0.1)`);
      glow.addColorStop(1, `rgba(${DOT_RGB}, 0)`);
      ctx!.fillStyle = glow;
      ctx!.fillRect(mx - LIGHT_RADIUS * 1.6, my - LIGHT_RADIUS * 1.6, LIGHT_RADIUS * 3.2, LIGHT_RADIUS * 3.2);

      ctx!.fillStyle = `rgb(${DOT_RGB})`;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        let dx = d.x - mx;
        let dy = d.y - my;
        let dist = Math.hypot(dx, dy) || 1;

        // flashlight influence, smooth falloff
        let f = dist < LIGHT_RADIUS ? 1 - dist / LIGHT_RADIUS : 0;
        f = f * f * (3 - 2 * f);
        let x = d.x + (dx / dist) * f * PUSH;
        let y = d.y + (dy / dist) * f * PUSH;
        let lit = f;

        // shockwave rings from clicks
        for (let r = 0; r < rings.length; r++) {
          const ring = rings[r];
          const radius = (now - ring.start) * RING_SPEED;
          dx = d.x - ring.x;
          dy = d.y - ring.y;
          dist = Math.hypot(dx, dy) || 1;
          const off = Math.abs(dist - radius);
          if (off < RING_WIDTH) {
            const g = 1 - off / RING_WIDTH;
            x += (dx / dist) * g * 12;
            y += (dy / dist) * g * 12;
            lit = Math.max(lit, g);
          }
        }

        const base = d.major ? MAJOR_ALPHA : BASE_ALPHA;
        const size = (d.major ? 1.8 : 1.4) + lit * 2.4;
        ctx!.globalAlpha = Math.min(1, base + lit * 0.8);
        if (lit > 0.05) {
          // lit dots are big enough to look square — draw them round
          ctx!.beginPath();
          ctx!.arc(x, y, size / 2, 0, Math.PI * 2);
          ctx!.fill();
        } else {
          // the ~2k resting dots stay cheap 1-2px rects
          ctx!.fillRect(x - size / 2, y - size / 2, size, size);
        }
      }
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop);
      const target = mouseRef.current;
      cur.x += (target.x + 0.5 - cur.x) * 0.14;
      cur.y += (target.y + 0.5 - cur.y) * 0.14;

      // drop rings that have left the screen
      const maxR = Math.hypot(w, h);
      ringsRef.current = ringsRef.current.filter((r) => (now - r.start) * RING_SPEED < maxR + RING_WIDTH);

      // Nothing moving → skip the redraw entirely (the idle lock screen
      // costs next to nothing).
      const settled =
        Math.abs(cur.x - lastDrawn.x) * w < 0.2 && Math.abs(cur.y - lastDrawn.y) * h < 0.2;
      if (settled && ringsRef.current.length === 0) return;
      lastDrawn = { x: cur.x, y: cur.y };
      draw(now);
    }

    layout();
    window.addEventListener("resize", layout);
    frame = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", layout);
    };
  }, [mouseRef]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="block h-full w-full" />
      {/* Vignette: keeps the corners dark and the grid feeling endless */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}
