// Photos are auto-discovered the same way wallpapers are: any image file
// in public/images/photos/ shows up in the Photos app automatically, no
// code changes needed. Sort order is alphabetical by filename, so prefix
// with numbers (01-cert.jpg, 02-event.jpg, ...) to control the order.

export type PhotoItem = {
  id: string;
  src: string;
  label: string;
};

const IMAGE_FILE = /\.(jpe?g|png|webp)$/i;

function toLabel(file: string) {
  return file
    .replace(IMAGE_FILE, "")
    .replace(/^\d+[-_.\s]*/, "")
    .replace(/[-_]+/g, " ")
    .trim() || file;
}

/** Server-side: turn a directory listing into ordered photo items. */
export function buildPhotos(files: string[]): PhotoItem[] {
  return files
    .filter((f) => IMAGE_FILE.test(f))
    .sort((a, b) => a.localeCompare(b))
    .map((file) => ({
      id: file,
      src: `/images/photos/${file}`,
      label: toLabel(file),
    }));
}
