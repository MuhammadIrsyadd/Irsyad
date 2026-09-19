import fs from "node:fs";
import path from "node:path";
import HomeClient from "@/components/HomeClient";
import { WallpaperProvider } from "@/components/WallpaperProvider";
import { buildWallpapers } from "@/lib/wallpapers";

export default function Page() {
  const dir = path.join(process.cwd(), "public", "images", "wallpapers");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir) : [];

  return (
    <WallpaperProvider wallpapers={buildWallpapers(files)}>
      <HomeClient />
    </WallpaperProvider>
  );
}
