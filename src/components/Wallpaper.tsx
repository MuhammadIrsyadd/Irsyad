"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { useCurrentWallpaper } from "@/components/WallpaperProvider";

export default function Wallpaper() {
  const [photoFailed, setPhotoFailed] = useState(false);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const wallpaper = useCurrentWallpaper(wallpaperId);

  // Reset load state whenever a different wallpaper is picked.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resets error state when the user picks a different wallpaper
    setPhotoFailed(false);
  }, [wallpaper?.id]);

  const showImg = wallpaper && !photoFailed;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0c0e14]">
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
            // slight contrast/saturation lift + grain overlay below keep
            // upscaled photos from looking flat.
            style={{ filter: "contrast(1.08) saturate(1.08)" }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
      </AnimatePresence>

      {showImg && <div className="grain-overlay absolute inset-0" />}

      {/* gentle darkening so dock & menu-bar text stays legible */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/55" />
    </div>
  );
}
