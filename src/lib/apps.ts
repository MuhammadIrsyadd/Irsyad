import type { AppId } from "@/store/system-store";

export type AppMeta = {
  id: AppId;
  label: string;
  icon: string;
  gradient: string;
  iconColor: string;
  /** Short, first-person hint the avatar companion says on dock hover. */
  hint: string;
  /** What the avatar says while this app is the focused, open window. */
  openHint: string;
};

export const appRegistry: AppMeta[] = [
  {
    id: "finder",
    label: "Finder",
    icon: "folder_open",
    gradient: "from-amber-400 to-amber-600",
    iconColor: "text-black",
    hint: "Kenalan sama aku di sini 🙋",
    openHint: "Semoga kamu makin kenal aku 😄",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: "terminal",
    gradient: "from-neutral-900 to-black",
    iconColor: "text-terminal-green",
    hint: "Skill & tools yang aku pakai 💻",
    openHint: "Coba ketik command tersembunyi 👀",
  },
  {
    id: "safari",
    label: "Safari",
    icon: "explore",
    gradient: "from-cyan-400 to-blue-600",
    iconColor: "text-white",
    hint: "Kumpulan project yang pernah kubikin 🌐",
    openHint: "Klik salah satu buat lihat detailnya 🔍",
  },
  {
    id: "mail",
    label: "Mail",
    icon: "mail",
    gradient: "from-purple-400 to-indigo-600",
    iconColor: "text-white",
    hint: "Mau ngobrol? Kirim pesan di sini 📬",
    openHint: "Ada yang mau kontak, semangat! 💌",
  },
  {
    id: "notes",
    label: "Notes",
    icon: "sticky_note_2",
    gradient: "from-yellow-300 to-amber-500",
    iconColor: "text-black",
    hint: "Cerita di balik project-project itu 📝",
    openHint: "Ini bagian favoritku buat cerita 📝",
  },
  {
    id: "photos",
    label: "Photos",
    icon: "photo_library",
    gradient: "from-rose-400 to-pink-600",
    iconColor: "text-white",
    hint: "Galeri momen & sertifikat 📸",
    openHint: "Koleksi momen yang aku suka lihat lagi 📸",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    gradient: "from-neutral-500 to-neutral-700",
    iconColor: "text-white",
    hint: "Ganti tema & warna aksen ⚙️",
    openHint: "Cocokin sesuai selera kamu ⚙️",
  },
];

export function getAppMeta(id: AppId): AppMeta {
  const meta = appRegistry.find((a) => a.id === id);
  if (!meta) throw new Error(`Unknown app id: ${id}`);
  return meta;
}
