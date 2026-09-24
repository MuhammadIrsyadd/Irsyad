"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PhotoItem } from "@/lib/photos";

const PhotosContext = createContext<PhotoItem[]>([]);

export function PhotosProvider({
  photos,
  children,
}: {
  photos: PhotoItem[];
  children: ReactNode;
}) {
  return <PhotosContext.Provider value={photos}>{children}</PhotosContext.Provider>;
}

export function usePhotos() {
  return useContext(PhotosContext);
}
