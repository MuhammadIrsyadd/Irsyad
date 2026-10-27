import type { AppId } from "@/store/system-store";

export type AppMeta = {
  id: AppId;
  label: string;
  /** Short, first-person hint the avatar companion says on dock hover. */
  hint: string;
  /** What the avatar says while this app is the focused, open window. */
  openHint: string;
};

export const appRegistry: AppMeta[] = [
  {
    id: "finder",
    label: "Finder",
    hint: "Kenalan sama aku di sini 🙋",
    openHint: "Semoga kamu makin kenal aku 😄",
  },
  {
    id: "terminal",
    label: "Terminal",
    hint: "Skill & tools yang aku pakai 💻",
    openHint: "Coba ketik command tersembunyi 👀",
  },
  {
    id: "safari",
    label: "Safari",
    hint: "Kumpulan project yang pernah kubikin 🌐",
    openHint: "Klik salah satu buat lihat detailnya 🔍",
  },
  {
    id: "mail",
    label: "Mail",
    hint: "Mau ngobrol? Kirim pesan di sini 📬",
    openHint: "Ada yang mau kontak, semangat! 💌",
  },
  {
    id: "notes",
    label: "Notes",
    hint: "Cerita di balik project-project itu 📝",
    openHint: "Ini bagian favoritku buat cerita 📝",
  },
  {
    id: "photos",
    label: "Photos",
    hint: "Galeri momen & sertifikat 📸",
    openHint: "Koleksi momen yang aku suka lihat lagi 📸",
  },
  {
    id: "settings",
    label: "Settings",
    hint: "Ganti tema & warna aksen ⚙️",
    openHint: "Cocokin sesuai selera kamu ⚙️",
  },
];

export function getAppMeta(id: AppId): AppMeta {
  const meta = appRegistry.find((a) => a.id === id);
  if (!meta) throw new Error(`Unknown app id: ${id}`);
  return meta;
}
