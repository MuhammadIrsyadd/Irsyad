"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { WallpaperOption } from "@/lib/wallpapers";

const WallpaperContext = createContext<WallpaperOption[]>([]);

export function WallpaperProvider({
  wallpapers,
  children,
}: {
  wallpapers: WallpaperOption[];
  children: ReactNode;
}) {
  return <WallpaperContext.Provider value={wallpapers}>{children}</WallpaperContext.Provider>;
}

export function useWallpapers() {
  return useContext(WallpaperContext);
}

/** Selected wallpaper, falling back to the first one (the default). */
export function useCurrentWallpaper(id: string): WallpaperOption | undefined {
  const list = useWallpapers();
  return list.find((w) => w.id === id) ?? list[0];
}
