"use client";

import { motion } from "framer-motion";
import { useSystemStore, type AccentColor } from "@/store/system-store";
import { useWallpapers } from "@/components/WallpaperProvider";
import { sound } from "@/lib/sound";

const accents: { id: AccentColor; label: string; colorClass: string }[] = [
  { id: "amber", label: "Amber", colorClass: "bg-amber-400" },
  { id: "violet", label: "Violet", colorClass: "bg-purple-400" },
  { id: "cyan", label: "Cyan", colorClass: "bg-cyan-400" },
  { id: "coral", label: "Coral", colorClass: "bg-rose-400" },
];

export default function ControlCenter({ onClose }: { onClose: () => void }) {
  const accent = useSystemStore((s) => s.accent);
  const setAccent = useSystemStore((s) => s.setAccent);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const toggleSound = useSystemStore((s) => s.toggleSound);
  const theme = useSystemStore((s) => s.theme);
  const toggleTheme = useSystemStore((s) => s.toggleTheme);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const setWallpaper = useSystemStore((s) => s.setWallpaper);
  const wallpapers = useWallpapers();

  function handleSoundToggle() {
    toggleSound();
    if (!soundEnabled) {
      sound.open();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      onClick={(e) => e.stopPropagation()}
      className="glass-modal absolute right-4 top-13 z-[950] w-80 overflow-hidden rounded-2xl border border-white/20 p-4 shadow-2xl backdrop-blur-2xl"
    >
      <div className="flex flex-col gap-3">
        {/* Top 2 Big Tiles (Wifi & Sound) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Wifi Card */}
          <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-white/10 p-3">
            <div className="flex items-center justify-between">
              <span className="material-symbols-outlined text-xl text-cyan-400">wifi</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-[12px] font-semibold text-white">Wi-Fi</span>
              <span className="text-[10px] text-white/60">Irsyad-5G (Online)</span>
            </div>
          </div>

          {/* Sound Card */}
          <button
            onClick={handleSoundToggle}
            className={`flex flex-col justify-between rounded-xl border p-3 text-left transition-all ${
              soundEnabled
                ? "border-[var(--accent-400)]/40 bg-[var(--accent-500)]/20"
                : "border-white/10 bg-white/10 hover:bg-white/15"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`material-symbols-outlined text-xl ${
                  soundEnabled ? "text-[var(--accent-300)]" : "text-white/60"
                }`}
              >
                {soundEnabled ? "volume_up" : "volume_off"}
              </span>
              <span
                className={`text-[9px] font-mono-ui font-semibold uppercase ${
                  soundEnabled ? "text-[var(--accent-300)]" : "text-white/40"
                }`}
              >
                {soundEnabled ? "ON" : "OFF"}
              </span>
            </div>
            <div className="mt-2 flex flex-col">
              <span className="text-[12px] font-semibold text-white">Sound FX</span>
              <span className="text-[10px] text-white/60">
                {soundEnabled ? "Audio Aktif" : "Mute (Klik untuk aktif)"}
              </span>
            </div>
          </button>
        </div>

        {/* Display & Accent Section */}
        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
              Tema & Aksen
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80 hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-[13px]">
                {theme === "dark" ? "dark_mode" : "light_mode"}
              </span>
              <span className="capitalize">{theme}</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[12px] text-white/80">Warna Aksen</span>
            <div className="flex gap-2">
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  title={a.label}
                  className="group relative flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110"
                >
                  <span
                    className={`h-5 w-5 rounded-full ${a.colorClass} shadow-md transition-all ${
                      accent === a.id ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Wallpaper Picker */}
        <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
            Wallpaper Desktop
          </span>
          <div className="grid grid-cols-4 gap-2">
            {wallpapers.map((w) => {
              const isActive = wallpaperId === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setWallpaper(w.id)}
                  className={`group relative aspect-video overflow-hidden rounded-lg border transition-all ${
                    isActive
                      ? "border-[var(--accent-400)] ring-2 ring-[var(--accent-400)]/50 scale-105"
                      : "border-white/10 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={w.src} alt={w.label} className="h-full w-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* System info badge */}
        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-[11px] text-white/60">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px] text-amber-400">verified</span>
            Portfolio OS v1.2
          </span>
          <span className="font-mono-ui text-[10px] text-white/40">Liquid Glass</span>
        </div>
      </div>
    </motion.div>
  );
}
