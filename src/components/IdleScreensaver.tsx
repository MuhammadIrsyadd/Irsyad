"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/lib/content";

const IDLE_MS = 90_000; // wake on any input; no activity for this long triggers it

export default function IdleScreensaver() {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function reset() {
      setIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => setIdle(true), IDLE_MS);
    }
    const events: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "wheel",
    ];
    events.forEach((ev) => window.addEventListener(ev, reset));
    reset();
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, reset));
    };
  }, []);

  return (
    <AnimatePresence>
      {idle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.4 } }}
          transition={{ duration: 0.9 }}
          className="fixed inset-0 z-[9650] flex cursor-pointer flex-col items-center justify-center gap-3 bg-black/75 backdrop-blur-md"
        >
          <motion.span
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="hero-heading block text-center text-[10vw] font-black uppercase leading-none tracking-tight sm:text-[7vw]"
            style={{ fontFamily: "var(--font-kanit), 'Kanit', sans-serif" }}
          >
            {profile.name}
          </motion.span>
          <motion.span
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="text-[11px] uppercase tracking-[0.3em] text-white/50"
          >
            Sentuh untuk lanjut
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
