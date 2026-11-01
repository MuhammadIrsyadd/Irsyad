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
    hint: "Get to know me here 🙋",
    openHint: "Hope you get to know me better 😄",
  },
  {
    id: "terminal",
    label: "Terminal",
    hint: "The skills & tools I use 💻",
    openHint: "Try typing a hidden command 👀",
  },
  {
    id: "safari",
    label: "Safari",
    hint: "Projects I've built 🌐",
    openHint: "Click one to see the details 🔍",
  },
  {
    id: "mail",
    label: "Mail",
    hint: "Want to chat? Send a message here 📬",
    openHint: "Someone's reaching out, nice! 💌",
  },
  {
    id: "notes",
    label: "Notes",
    hint: "The stories behind those projects 📝",
    openHint: "My favorite part to talk about 📝",
  },
  {
    id: "photos",
    label: "Photos",
    hint: "Moments & certificates 📸",
    openHint: "Moments I like to look back on 📸",
  },
  {
    id: "settings",
    label: "Settings",
    hint: "Change the theme & accent color ⚙️",
    openHint: "Make it your own ⚙️",
  },
];

export function getAppMeta(id: AppId): AppMeta {
  const meta = appRegistry.find((a) => a.id === id);
  if (!meta) throw new Error(`Unknown app id: ${id}`);
  return meta;
}
