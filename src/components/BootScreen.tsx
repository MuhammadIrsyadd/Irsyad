"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootStage("login");
    }, 3200);

    return () => clearTimeout(timer);
  }, [setBootStage]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black select-none overflow-hidden"
    >
      {/* 3D Spline Interactive Background (Hardware Accelerated) */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <iframe
          src="https://my.spline.design/scripthello-P7ql64eoqdvvTay6PFZdADyL/"
          title="3D Spline Background"
          className="h-full w-full border-0 block"
          style={{
            width: "100%",
            height: "100%",
            transform: "translateZ(0)",
            willChange: "transform",
          }}
          allow="autoplay; fullscreen"
          loading="eager"
        />
        {/* Subtle dark vignette overlay to ensure high contrast for the logo */}
        <div className="pointer-events-none absolute inset-0 bg-black/40" />
      </div>

      {/* Foreground Boot Elements (Centered, bold, silky smooth) */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-10 pointer-events-none">
        <motion.div
          initial={{ scale: 0.88, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-white.png"
            alt="Muh Irsyad"
            draggable={false}
            className="h-32 w-32 sm:h-36 sm:w-36 object-contain drop-shadow-[0_0_45px_rgba(255,255,255,0.45)]"
          />
        </motion.div>

        {/* Silky-smooth GPU-accelerated progress bar (Zero re-renders, 60fps) */}
        <div className="h-1.5 w-60 sm:w-72 overflow-hidden rounded-full bg-white/20 shadow-lg backdrop-blur-md">
          <motion.div
            initial={{ width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.0, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
