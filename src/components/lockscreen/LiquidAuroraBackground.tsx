"use client";

import { useEffect, useRef, useCallback } from "react";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  speed: number;
  color: string;
}

interface LiquidAuroraProps {
  mousePos: { x: number; y: number }; // normalized -0.5 to 0.5
  isUnlocking?: boolean;
  ripple?: { x: number; y: number; id: number } | null;
}

export default function LiquidAuroraBackground({
  mousePos,
  isUnlocking = false,
  ripple = null,
}: LiquidAuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseTargetRef = useRef({ x: 0.5, y: 0.5 });
  const mouseCurrentRef = useRef({ x: 0.5, y: 0.5 });
  const ripplesRef = useRef<Ripple[]>([]);
  const unlockingRef = useRef(isUnlocking);
  unlockingRef.current = isUnlocking;

  // Update normalized target coordinates (0 to 1 range)
  useEffect(() => {
    mouseTargetRef.current = {
      x: mousePos.x + 0.5,
      y: mousePos.y + 0.5,
    };
  }, [mousePos]);

  // Spawn ripple on click
  const addRipple = useCallback((x: number, y: number) => {
    ripplesRef.current.push({
      x,
      y,
      radius: 5,
      maxRadius: Math.max(window.innerWidth, window.innerHeight) * 1.1,
      opacity: 0.85,
      speed: 18,
      color: "rgba(255, 193, 116, ",
    });
    // Add secondary violet/cyan echo ripple
    setTimeout(() => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: Math.max(window.innerWidth, window.innerHeight) * 0.9,
        opacity: 0.6,
        speed: 14,
        color: "rgba(168, 85, 247, ",
      });
    }, 90);
  }, []);

  useEffect(() => {
    if (ripple) {
      addRipple(ripple.x, ripple.y);
    }
  }, [ripple, addRipple]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    function handleResize() {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    // Aurora blob configurations
    const orbs = [
      {
        baseX: 0.35,
        baseY: 0.35,
        radius: 0.45,
        color: "rgba(245, 158, 11, ", // Amber/Gold
        peakOpacity: 0.38,
        speedX: 0.0006,
        speedY: 0.0008,
        ampX: 0.14,
        ampY: 0.12,
        phase: 0,
      },
      {
        baseX: 0.65,
        baseY: 0.4,
        radius: 0.5,
        color: "rgba(139, 92, 246, ", // Indigo/Violet
        peakOpacity: 0.42,
        speedX: 0.0007,
        speedY: 0.0005,
        ampX: 0.16,
        ampY: 0.14,
        phase: Math.PI / 2,
      },
      {
        baseX: 0.5,
        baseY: 0.7,
        radius: 0.55,
        color: "rgba(6, 182, 212, ", // Cyan/Teal
        peakOpacity: 0.32,
        speedX: 0.0005,
        speedY: 0.0007,
        ampX: 0.15,
        ampY: 0.1,
        phase: Math.PI,
      },
      {
        baseX: 0.75,
        baseY: 0.65,
        radius: 0.4,
        color: "rgba(244, 63, 94, ", // Rose/Pink
        peakOpacity: 0.28,
        speedX: 0.0008,
        speedY: 0.0006,
        ampX: 0.12,
        ampY: 0.15,
        phase: Math.PI * 1.5,
      },
    ];

    let lastTime = performance.now();

    function render(now: number) {
      animId = requestAnimationFrame(render);
      const dt = Math.min(now - lastTime, 40);
      lastTime = now;

      // Smooth mouse interpolation (inertia)
      mouseCurrentRef.current.x += (mouseTargetRef.current.x - mouseCurrentRef.current.x) * 0.065;
      mouseCurrentRef.current.y += (mouseTargetRef.current.y - mouseCurrentRef.current.y) * 0.065;

      const scale = dpr;
      const w = width * scale;
      const h = height * scale;

      if (w <= 0 || h <= 0) return;

      // 1. Deep obsidian base gradient
      const bgGrad = ctx!.createRadialGradient(
        w * 0.5,
        h * 0.45,
        w * 0.1,
        w * 0.5,
        h * 0.5,
        Math.max(w, h) * 0.85
      );
      bgGrad.addColorStop(0, "#0e111a");
      bgGrad.addColorStop(0.5, "#090a0f");
      bgGrad.addColorStop(1, "#040507");
      ctx!.fillStyle = bgGrad;
      ctx!.fillRect(0, 0, w, h);

      // Use lighter composite for luminous blending
      ctx!.globalCompositeOperation = "screen";

      // 2. Render floating aurora mesh orbs
      const unlockExpansion = unlockingRef.current ? 1.4 : 1.0;
      const unlockBrightness = unlockingRef.current ? 1.5 : 1.0;

      for (let i = 0; i < orbs.length; i++) {
        const o = orbs[i];
        const t = now;
        const ox = (o.baseX + Math.sin(t * o.speedX + o.phase) * o.ampX) * w;
        const oy = (o.baseY + Math.cos(t * o.speedY + o.phase) * o.ampY) * h;
        const rad = Math.min(w, h) * o.radius * unlockExpansion;

        const grad = ctx!.createRadialGradient(ox, oy, 0, ox, oy, rad);
        const op = Math.min(o.peakOpacity * unlockBrightness, 0.85);
        grad.addColorStop(0, `${o.color}${op})`);
        grad.addColorStop(0.45, `${o.color}${op * 0.45})`);
        grad.addColorStop(0.8, `${o.color}${op * 0.1})`);
        grad.addColorStop(1, `${o.color}0)`);

        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(ox, oy, rad, 0, Math.PI * 2);
        ctx!.fill();
      }

      // 3. Interactive Cursor Spotlight Orb
      const mousePixelX = mouseCurrentRef.current.x * w;
      const mousePixelY = mouseCurrentRef.current.y * h;
      const spotlightRad = Math.min(w, h) * 0.45;

      const mouseGrad = ctx!.createRadialGradient(
        mousePixelX,
        mousePixelY,
        0,
        mousePixelX,
        mousePixelY,
        spotlightRad
      );
      mouseGrad.addColorStop(0, "rgba(255, 220, 160, 0.35)");
      mouseGrad.addColorStop(0.25, "rgba(245, 158, 11, 0.22)");
      mouseGrad.addColorStop(0.55, "rgba(139, 92, 246, 0.15)");
      mouseGrad.addColorStop(0.85, "rgba(6, 182, 212, 0.05)");
      mouseGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx!.fillStyle = mouseGrad;
      ctx!.beginPath();
      ctx!.arc(mousePixelX, mousePixelY, spotlightRad, 0, Math.PI * 2);
      ctx!.fill();

      // 4. Render Expanding Click Ripples (Shockwave)
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += r.speed * (dt / 16);
        r.opacity *= 0.965;

        const rx = r.x * scale;
        const ry = r.y * scale;
        const rRad = r.radius * scale;

        if (r.opacity > 0.01 && r.radius < r.maxRadius) {
          ctx!.save();
          // Draw outer glowing wave ring
          ctx!.beginPath();
          ctx!.arc(rx, ry, rRad, 0, Math.PI * 2);
          ctx!.lineWidth = Math.max(3 * scale, 1);
          ctx!.strokeStyle = `${r.color}${r.opacity * 0.8})`;
          ctx!.shadowColor = `${r.color}0.9)`;
          ctx!.shadowBlur = 18 * scale;
          ctx!.stroke();

          // Draw softer inner halo
          ctx!.beginPath();
          ctx!.arc(rx, ry, Math.max(rRad - 12 * scale, 1), 0, Math.PI * 2);
          ctx!.lineWidth = Math.max(1.5 * scale, 1);
          ctx!.strokeStyle = `${r.color}${r.opacity * 0.4})`;
          ctx!.stroke();
          ctx!.restore();
        } else {
          ripplesRef.current.splice(i, 1);
        }
      }

      // Reset composite operation
      ctx!.globalCompositeOperation = "source-over";
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block h-full w-full object-cover transition-opacity duration-700"
      />

      {/* Subtle Apple-style Liquid Glass specular grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Film grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle vignette rim */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}
