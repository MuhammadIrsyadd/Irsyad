"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBootStage("login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [setBootStage]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-8 sm:py-12 bg-black select-none overflow-hidden"
    >
      {/* 3D Spline Scene: Inverted so Background is Pure Black and 3D "Hello" is White */}
      <div className="absolute inset-0 z-0 h-full w-full overflow-hidden">
        <iframe
          src="https://my.spline.design/scripthello-P7ql64eoqdvvTay6PFZdADyL/"
          title="3D Spline Background"
          className="h-full w-full border-0 block"
          style={{
            width: "100%",
            height: "100%",
            filter: "invert(1)",
            transform: "translateZ(0)",
          }}
          allow="autoplay; fullscreen"
          loading="eager"
        />
      </div>

      {/* Top spacer (leaves the entire center clear for 3D White "Hello") */}
      <div className="relative z-10" />

      {/* Bottom Area: Monogram Logo & Progress Bar */}
      <div className="relative z-10 flex flex-col items-center gap-5 pointer-events-none pb-4 sm:pb-6">
        {/* Monogram Logo (Clean, prominent, no text) */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-white.png"
            alt="Muh Irsyad"
            draggable={false}
            className="h-14 w-14 sm:h-16 sm:w-16 object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]"
          />
        </motion.div>

        {/* Sleek macOS boot progress bar (Smooth GPU animated) */}
        <div className="h-1.5 w-60 sm:w-72 overflow-hidden rounded-full bg-white/20 shadow-lg backdrop-blur-md">
          <motion.div
            initial={{ width: "8%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)]"
          />
        </div>
      </div>
    </motion.div>
  );
}
