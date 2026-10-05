"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const start = Date.now();
    // 3.8 seconds allows WebGL Spline 3D scene to load and be enjoyed
    const duration = 3800;
    let raf: number;
    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, 6 + (elapsed / duration) * 94);
      setProgress(pct);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootStage("login"), 250);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setBootStage]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-10 sm:py-14 select-none overflow-hidden bg-[#0a0a0c]"
    >
      {/* 3D Spline Interactive Scene */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <iframe
          src="https://my.spline.design/scripthello-P7ql64eoqdvvTay6PFZdADyL/"
          title="3D Spline Background"
          className="h-full w-full border-0 block"
          style={{
            width: "100%",
            height: "100%",
            filter: "invert(0.93) hue-rotate(180deg) contrast(1.1)",
          }}
          allow="autoplay; fullscreen"
          loading="eager"
        />
      </div>

      {/* Top spacer */}
      <div className="relative z-10" />

      {/* Bottom Loading Progress Bar & Monogram */}
      <div className="relative z-10 flex flex-col items-center gap-4 pointer-events-none pb-4 sm:pb-6">
        {/* Subtle white monogram badge */}
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-white.png"
            alt="Muh Irsyad"
            draggable={false}
            className="h-7 w-7 object-contain opacity-85 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
          />
          <span className="text-[11px] font-medium tracking-widest uppercase text-white/70">
            Portfolio OS
          </span>
        </div>

        {/* Sleek macOS boot progress bar */}
        <div className="h-1.5 w-56 sm:w-64 overflow-hidden rounded-full bg-white/20 shadow-lg backdrop-blur-md">
          <motion.div
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
