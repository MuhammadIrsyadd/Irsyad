"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appOrder, useSystemStore, type AppId } from "@/store/system-store";
import { getAppMeta } from "@/lib/apps";
import { profile } from "@/lib/content";
import { useWallpapers } from "@/components/WallpaperProvider";

// The File / Edit / View / Go / Window / Help menus, wired to real actions.
// Like macOS: click a title to open, then just hover the others to switch.

type Item = { label: string; shortcut?: string; checked?: boolean; action: () => void } | "sep";
type Menu = { title: string; items: Item[] };

const GO_LABELS: Record<AppId, string> = {
  finder: "About me",
  terminal: "Skills (Terminal)",
  safari: "Projects",
  mail: "Contact",
  notes: "Case studies",
  photos: "Photos",
  settings: "Settings",
};

export default function MenuBarMenus() {
  const [open, setOpen] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const rootRef = useRef<HTMLElement>(null);
  const [mod, setMod] = useState("Ctrl ");

  const windows = useSystemStore((s) => s.windows);
  const topZ = useSystemStore((s) => s.topZ);
  const theme = useSystemStore((s) => s.theme);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const wallpapers = useWallpapers();
  const store = useSystemStore.getState;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- platform is only known on the client
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setMod("⌘");
  }, []);

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    function onDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(null);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(null);
    }
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  function restore(id: AppId) {
    store().focusApp(id);
    useSystemStore.setState((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], isMinimized: false } },
    }));
  }

  const openIds = appOrder.filter((id) => windows[id].isOpen);

  const menus: Menu[] = [
    {
      title: "File",
      items: [
        { label: "New message", action: () => store().openApp("mail") },
        { label: "Open resume (PDF)", action: () => window.open("/resume.pdf", "_blank") },
        "sep",
        { label: "Lock screen", action: () => store().lock() },
      ],
    },
    {
      title: "Edit",
      items: [
        {
          label: "Copy email address",
          action: () => {
            navigator.clipboard?.writeText(profile.email).then(
              () => setToast("Email copied"),
              () => setToast(profile.email)
            );
          },
        },
        { label: "Search…", shortcut: `${mod}K`, action: () => store().setSpotlightOpen(true) },
      ],
    },
    {
      title: "View",
      items: [
        { label: "Light mode", checked: theme === "light", action: () => store().toggleTheme() },
        {
          label: "Next wallpaper",
          action: () => {
            if (!wallpapers.length) return;
            const i = wallpapers.findIndex((w) => w.id === wallpaperId);
            store().setWallpaper(wallpapers[(i + 1) % wallpapers.length].id);
          },
        },
        { label: "Sound effects", checked: soundEnabled, action: () => store().toggleSound() },
      ],
    },
    {
      title: "Go",
      items: appOrder.map((id, i) => ({
        label: GO_LABELS[id],
        shortcut: `${mod}${i + 1}`,
        action: () => store().openApp(id),
      })),
    },
    {
      title: "Window",
      items: [
        { label: "Minimize all", action: () => openIds.forEach((id) => store().minimizeApp(id)) },
        { label: "Close all", action: () => openIds.forEach((id) => store().closeApp(id)) },
        ...(openIds.length ? (["sep"] as Item[]) : []),
        ...openIds.map((id) => ({
          label: getAppMeta(id).label + (windows[id].isMinimized ? " (minimized)" : ""),
          checked: !windows[id].isMinimized && windows[id].zIndex === topZ,
          action: () => restore(id),
        })),
      ],
    },
    {
      title: "Help",
      items: [
        { label: "Terminal commands", action: () => store().openApp("terminal") },
        { label: "Send feedback", action: () => store().openApp("mail") },
        {
          label: "Source code on GitHub",
          action: () => window.open("https://github.com/MuhammadIrsyadd", "_blank"),
        },
      ],
    },
  ];

  return (
    <nav ref={rootRef} className="relative hidden items-center gap-0.5 font-normal text-white/80 md:flex">
      {menus.map((m) => (
        <div key={m.title} className="relative">
          <button
            onClick={() => setOpen((o) => (o === m.title ? null : m.title))}
            onMouseEnter={() => open && setOpen(m.title)}
            className={`rounded px-2 py-0.5 transition-colors ${
              open === m.title ? "bg-white/15 text-white" : "hover:text-white"
            }`}
          >
            {m.title}
          </button>
          <AnimatePresence>
            {open === m.title && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                transition={{ duration: 0.12 }}
                className="glass-modal absolute left-0 top-9 min-w-[220px] rounded-lg p-1 text-[13px]"
              >
                {m.items.map((item, i) =>
                  item === "sep" ? (
                    <div key={`sep${i}`} className="mx-2 my-1 h-px bg-white/10" />
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setOpen(null);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1 text-left text-white/90 hover:bg-[var(--accent-500)] hover:text-black"
                    >
                      <span className="w-3 text-[11px]">{item.checked ? "✓" : ""}</span>
                      <span className="flex-1">{item.label}</span>
                      {item.shortcut && <span className="text-[12px] opacity-50">{item.shortcut}</span>}
                    </button>
                  )
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <AnimatePresence>
        {toast && (
          <motion.span
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-modal pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[12px] text-white"
          >
            {toast}
          </motion.span>
        )}
      </AnimatePresence>
    </nav>
  );
}
