"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { useCurrentWallpaper } from "@/components/WallpaperProvider";

export default function Wallpaper() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const theme = useSystemStore((s) => s.theme);
  const wallpaper = useCurrentWallpaper(wallpaperId);

  const isLight = theme === "light";

  // Reset load state whenever a different wallpaper is picked.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets error state when the user picks a different wallpaper
    setPhotoFailed(false);
  }, [wallpaper?.id]);

  const showImg = wallpaper && !photoFailed;

  return (
    <div
      className={`fixed inset-0 z-0 overflow-hidden transition-colors duration-700 ${
        isLight ? "bg-[#e8ecf4]" : "bg-[#0c0e14]"
      }`}
    >
      <AnimatePresence mode="sync">
        {showImg && (
          <motion.img
            key={wallpaper.id}
            src={wallpaper.src}
            alt=""
            onError={() => setPhotoFailed(true)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            // Daylight filter in light mode; cinematic contrast in dark mode
            style={{
              filter: isLight
                ? "brightness(1.2) contrast(0.96) saturate(1.18)"
                : "contrast(1.08) saturate(1.08)",
              transition: "filter 0.6s ease",
            }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
      </AnimatePresence>

      {showImg && <div className="grain-overlay absolute inset-0" />}

      {/* Light mode daylight ambient overlay */}
      <div
        className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
          isLight
            ? "bg-gradient-to-b from-sky-200/30 via-white/20 to-amber-100/30 mix-blend-screen opacity-100"
            : "opacity-0"
        }`}
      />

      {/* Dynamic vignette: soft in light mode, deep in dark mode */}
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-700 ${
          isLight
            ? "bg-gradient-to-b from-black/5 via-transparent to-black/25"
            : "bg-gradient-to-b from-black/10 via-transparent to-black/55"
        }`}
      />
    </div>
  );
}
