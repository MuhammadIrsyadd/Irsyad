"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { profile } from "@/lib/content";

export default function HomeLogo() {
  const [hovered, setHovered] = useState(false);
  const openApp = useSystemStore((s) => s.openApp);

  return (
    <div className="pointer-events-auto fixed bottom-4 left-4 z-20 flex flex-col items-start sm:bottom-6 sm:left-6">
      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="glass-modal pointer-events-none mb-2 rounded-xl px-2.5 py-1 text-[11px] font-medium text-white shadow-xl backdrop-blur-md"
          >
            <span className="text-[var(--accent-300)] font-semibold">{profile.shortName || "Muh Irsyad"}</span>
            <span className="text-white/50 ml-1.5 font-mono-ui text-[10px]">Portfolio Irsyad</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Small corner logo badge */}
      <motion.button
        onClick={() => openApp("finder")}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        title="Buka Finder / About Me"
        aria-label="Logo Portofolio"
        className="group relative flex h-12 w-12 sm:h-15 sm:w-15 items-center justify-center rounded-2xl border border-white/15 bg-black/40 p-2 shadow-2xl backdrop-blur-xl transition-colors hover:border-[var(--accent-400)]/40 hover:bg-black/60"
      >
        {/* Subtle glowing halo */}
        <div className="absolute inset-0 rounded-2xl bg-[var(--accent-500)]/10 opacity-0 blur-md transition-opacity group-hover:opacity-100" />

        <img
          src="/images/MI.png"
          alt="Logo"
          className="relative z-10 h-full w-full rounded-xl object-cover drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105"
        />
      </motion.button>
    </div>
  );
}
