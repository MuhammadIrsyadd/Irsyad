"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);
  const [progress, setProgress] = useState(6);

  useEffect(() => {
    const start = Date.now();
    const duration = 1400;
    let raf: number;
    function tick() {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, 6 + (elapsed / duration) * 94);
      setProgress(pct);
      if (elapsed < duration) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setBootStage("login"), 220);
      }
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [setBootStage]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10 bg-black select-none"
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/MI-black.png"
          alt="Muh Irsyad"
          draggable={false}
          className="h-24 w-24 object-contain mix-blend-screen drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]"
        />
      </motion.div>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-white/20">
        <motion.div
          className="h-full rounded-full bg-white"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
