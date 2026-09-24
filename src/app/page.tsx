import fs from "node:fs";
import path from "node:path";
import HomeClient from "@/components/HomeClient";
import { WallpaperProvider } from "@/components/WallpaperProvider";
import { PhotosProvider } from "@/components/PhotosProvider";
import { buildWallpapers } from "@/lib/wallpapers";
import { buildPhotos } from "@/lib/photos";

function listDir(...segments: string[]) {
  const dir = path.join(process.cwd(), "public", ...segments);
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
}

export default function Page() {
  const wallpapers = buildWallpapers(listDir("images", "wallpapers"));
  const photos = buildPhotos(listDir("images", "photos"));

  return (
    <WallpaperProvider wallpapers={wallpapers}>
      <PhotosProvider photos={photos}>
        <HomeClient />
      </PhotosProvider>
    </WallpaperProvider>
  );
}
