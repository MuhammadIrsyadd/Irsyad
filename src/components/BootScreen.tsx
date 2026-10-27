"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";

// A single hand-drawn stroke spelling "hello" in joined-up script, written
// on screen like the macOS welcome. Pure SVG: no 3D runtime or third-party
// iframe to download, so the boot screen paints instantly.
const HELLO_PATH =
  "M18 150 C40 140 70 108 86 70 C98 40 92 18 80 26 C66 36 60 100 58 152 C62 128 76 106 94 106 C112 106 116 124 114 142 C113 154 124 158 138 150 C154 140 172 124 168 110 C164 96 140 102 138 124 C136 146 156 158 180 148 C202 138 222 98 228 66 C234 34 222 18 212 30 C200 46 196 112 202 140 C206 156 222 156 238 146 C258 132 278 98 284 66 C290 34 278 18 268 30 C256 46 252 112 258 140 C262 156 280 156 296 144 C304 128 318 108 336 108 C354 108 360 128 352 144 C344 160 318 160 312 142 C306 124 324 108 342 110 C356 112 368 112 382 104";

const WRITE_S = 2.6; // how long the pen takes to write the word
const HOLD_S = 0.7; // pause on the finished word before the lock screen

export default function BootScreen() {
  const setBootStage = useSystemStore((s) => s.setBootStage);
  const reduceMotion = useReducedMotion();
  const total = reduceMotion ? 1.2 : WRITE_S + HOLD_S;

  useEffect(() => {
    const t = setTimeout(() => setBootStage("login"), total * 1000);
    return () => clearTimeout(t);
  }, [setBootStage, total]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: "easeInOut" }}
      className="fixed inset-0 z-[9999] flex select-none flex-col items-center justify-between overflow-hidden bg-black py-8 sm:py-12"
    >
      <div />

      <svg
        viewBox="0 0 400 200"
        className="w-[78vw] max-w-[720px]"
        role="img"
        aria-label="hello"
      >
        <defs>
          <linearGradient id="hello-ink" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#c7d4de" />
          </linearGradient>
        </defs>
        <motion.path
          d={HELLO_PATH}
          fill="none"
          stroke="url(#hello-ink)"
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: WRITE_S, ease: [0.55, 0.05, 0.35, 1] }}
        />
      </svg>

      {/* Monogram + progress, synced to the pen */}
      <div className="flex flex-col items-center gap-5 pb-4 sm:pb-6">
        <motion.img
          src="/images/logo-white.webp"
          alt="Muh Irsyad"
          draggable={false}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="h-14 w-14 object-contain sm:h-16 sm:w-16"
        />
        <div className="h-1.5 w-60 overflow-hidden rounded-full bg-white/20 sm:w-72">
          <motion.div
            initial={{ scaleX: 0.04 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: total, ease: [0.3, 0, 0.2, 1] }}
            style={{ transformOrigin: "left center" }}
            className="h-full w-full rounded-full bg-white"
          />
        </div>
      </div>
    </motion.div>
  );
}
