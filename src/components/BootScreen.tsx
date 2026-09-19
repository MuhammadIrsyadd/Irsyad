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
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-black"
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[0_0_40px_rgba(245,158,11,0.5)]"
      >
        <span className="material-symbols-outlined icon-fill text-4xl text-black">
          diamond
        </span>
      </motion.div>
      <div className="h-1.5 w-52 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-white/80"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
}
