// Wallpapers are auto-discovered: any file named wallpaper<N>.(jpg|jpeg|png|webp)
// in public/images/wallpapers/ shows up in Settings, ordered by N. To add a
// new one just drop in the next number (wallpaper5.jpg, wallpaper6.jpg, ...)
// — no code changes. The first one (wallpaper1) is the default.

export type WallpaperOption = {
  id: string; // file base name, e.g. "wallpaper1"
  label: string;
  src: string;
};

const WALLPAPER_FILE = /^wallpaper(\d+)\.(jpe?g|png|webp)$/i;

/** Server-side: turn a directory listing into ordered wallpaper options. */
export function buildWallpapers(files: string[]): WallpaperOption[] {
  return files
    .map((file) => ({ file, match: WALLPAPER_FILE.exec(file) }))
    .filter((f): f is { file: string; match: RegExpExecArray } => f.match !== null)
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .map(({ file, match }) => ({
      id: `wallpaper${match[1]}`,
      label: `Wallpaper ${match[1]}`,
      src: `/images/wallpapers/${file}`,
    }));
}
