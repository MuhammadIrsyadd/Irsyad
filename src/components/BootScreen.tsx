"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);
  const [progress, setProgress] = useState(8);
  const [splineLoaded, setSplineLoaded] = useState(false);

  useEffect(() => {
    const start = Date.now();
    // 2.6 seconds gives enough time to render and enjoy the 3D Spline scene
    const duration = 2600;
    let raf: number;
    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, 8 + (elapsed / duration) * 92);
      setProgress(pct);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootStage("login"), 280);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setBootStage]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none overflow-hidden"
    >
      {/* 3D Spline Interactive Background */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <iframe
          src="https://my.spline.design/scripthello-P7ql64eoqdvvTay6PFZdADyL/"
          title="3D Spline Background"
          onLoad={() => setSplineLoaded(true)}
          className={`h-full w-full border-0 transition-opacity duration-700 ${
            splineLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ width: "100%", height: "100%" }}
        />
        {/* Subtle dark vignette overlay to ensure high contrast for logo and smooth transition to dark lock screen */}
        <div className="pointer-events-none absolute inset-0 bg-black/45 backdrop-blur-[1px]" />
      </div>

      {/* Foreground Boot Elements */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-white.png"
            alt="Muh Irsyad"
            draggable={false}
            className="h-24 w-24 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.45)]"
          />
        </motion.div>

        {/* Sleek macOS boot progress bar */}
        <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/25 shadow-lg backdrop-blur-md">
          <motion.div
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}
