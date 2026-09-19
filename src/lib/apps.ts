import type { AppId } from "@/store/system-store";

export type AppMeta = {
  id: AppId;
  label: string;
  icon: string;
  gradient: string;
  iconColor: string;
  /** Short, first-person hint the avatar companion says on hover. */
  hint: string;
};

export const appRegistry: AppMeta[] = [
  {
    id: "finder",
    label: "Finder",
    icon: "folder_open",
    gradient: "from-amber-400 to-amber-600",
    iconColor: "text-black",
    hint: "Kenalan sama aku di sini 🙋",
  },
  {
    id: "terminal",
    label: "Terminal",
    icon: "terminal",
    gradient: "from-neutral-900 to-black",
    iconColor: "text-terminal-green",
    hint: "Skill & tools yang aku pakai 💻",
  },
  {
    id: "safari",
    label: "Safari",
    icon: "explore",
    gradient: "from-cyan-400 to-blue-600",
    iconColor: "text-white",
    hint: "Kumpulan project yang pernah kubikin 🌐",
  },
  {
    id: "mail",
    label: "Mail",
    icon: "mail",
    gradient: "from-purple-400 to-indigo-600",
    iconColor: "text-white",
    hint: "Mau ngobrol? Kirim pesan di sini 📬",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "settings",
    gradient: "from-neutral-500 to-neutral-700",
    iconColor: "text-white",
    hint: "Ganti tema & warna aksen ⚙️",
  },
];

export function getAppMeta(id: AppId): AppMeta {
  const meta = appRegistry.find((a) => a.id === id);
  if (!meta) throw new Error(`Unknown app id: ${id}`);
  return meta;
}
