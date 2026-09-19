"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemStore, type AppId } from "@/store/system-store";
import { projects, skills } from "@/lib/content";

type Hit = { label: string; hint: string; icon: string; onSelect: () => void };

export default function Spotlight() {
  const open = useSystemStore((s) => s.spotlightOpen);
  const setOpen = useSystemStore((s) => s.setSpotlightOpen);
  const openApp = useSystemStore((s) => s.openApp);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset transient UI state when the palette closes
    if (!open) setQuery("");
  }, [open]);

  const hits = useMemo<Hit[]>(() => {
    const openAppHit = (id: AppId, label: string, icon: string): Hit => ({
      label,
      hint: "Buka app",
      icon,
      onSelect: () => {
        openApp(id);
        setOpen(false);
      },
    });

    const base: Hit[] = [
      openAppHit("finder", "Finder — About Me", "folder_open"),
      openAppHit("terminal", "Terminal — Skills", "terminal"),
      openAppHit("safari", "Safari — Projects", "explore"),
      openAppHit("mail", "Mail — Contact", "mail"),
      openAppHit("settings", "Settings", "settings"),
      ...projects.map((p) =>
        openAppHit("safari", `Project: ${p.name}`, "web")
      ),
      ...skills.map((s) => openAppHit("terminal", `Skill: ${s.category}`, "code")),
    ];

    if (!query.trim()) return base.slice(0, 6);
    const q = query.toLowerCase();
    return base.filter((h) => h.label.toLowerCase().includes(q)).slice(0, 8);
  }, [query, openApp, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[9500] flex items-start justify-center bg-black/40 pt-[18vh]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-modal w-[90vw] max-w-lg overflow-hidden rounded-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
              <span className="material-symbols-outlined text-xl text-white/70">search</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari project, skill, atau app..."
                className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/40 focus:outline-none"
              />
              <span className="glass-pill rounded-md px-1.5 py-0.5 font-mono-ui text-[10px] text-white/60">
                Esc
              </span>
            </div>
            <div className="max-h-72 overflow-y-auto p-1.5">
              {hits.length === 0 && (
                <div className="px-3 py-6 text-center text-[12px] text-white/40">
                  Tidak ada hasil.
                </div>
              )}
              {hits.map((h) => (
                <button
                  key={h.label}
                  onClick={h.onSelect}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-white/10"
                >
                  <span className="material-symbols-outlined text-[18px] text-primary">
                    {h.icon}
                  </span>
                  <span className="flex-1 text-[13px] text-white/90">{h.label}</span>
                  <span className="text-[11px] text-white/40">{h.hint}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
