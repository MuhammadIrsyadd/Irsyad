"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { appRegistry } from "@/lib/apps";
import { useSystemStore } from "@/store/system-store";
import { profile } from "@/lib/content";
import FinderApp from "@/components/apps/FinderApp";
import TerminalApp from "@/components/apps/TerminalApp";
import SafariApp from "@/components/apps/SafariApp";
import MailApp from "@/components/apps/MailApp";
import NotesApp from "@/components/apps/NotesApp";
import PhotosApp from "@/components/apps/PhotosApp";
import SettingsApp from "@/components/apps/SettingsApp";
import Avatar from "@/components/Avatar";
import IdleScreensaver from "@/components/IdleScreensaver";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock, avoids SSR/CSR hydration mismatch
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MobileHome() {
  const now = useClock();
  const windows = useSystemStore((s) => s.windows);
  const openApp = useSystemStore((s) => s.openApp);
  const lock = useSystemStore((s) => s.lock);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Status bar */}
      <div className="glass-menubar fixed inset-x-0 top-0 z-[900] flex h-11 items-center justify-between px-5 pt-[env(safe-area-inset-top)] text-[14px] text-white/90">
        <span className="font-medium">
          {now?.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) ?? ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[17px]">wifi</span>
          <span className="material-symbols-outlined icon-fill text-[17px] text-emerald-400">
            battery_charging_80
          </span>
          <button onClick={lock} aria-label="Lock screen" className="ml-1 flex active:scale-90">
            <span className="material-symbols-outlined text-[17px]">power_settings_new</span>
          </button>
        </div>
      </div>

      {/* Home screen grid */}
      <div className="flex h-full flex-col items-center justify-center gap-8 px-8 pt-11">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img src="/images/avatar.png" alt="" className="h-full w-full object-cover object-top" />
          </div>
          <span className="text-xl font-semibold text-white">{profile.name}</span>
          <span className="text-[14px] text-[var(--accent-300)]">{profile.role}</span>
        </div>

        <div className="grid w-full max-w-xs grid-cols-3 gap-6">
          {appRegistry.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-2 active:scale-95"
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-b ${app.gradient} border border-white/25 shadow-[0_6px_18px_rgba(0,0,0,0.45)]`}
              >
                <span className={`material-symbols-outlined icon-fill text-3xl ${app.iconColor}`}>
                  {app.icon}
                </span>
              </span>
              <span className="text-[13px] text-white/85">{app.label}</span>
            </button>
          ))}
        </div>

        <span className="glass-pill rounded-full px-3 py-1 text-center text-[10px] text-white/50">
          Ketuk ikon untuk membuka aplikasi
        </span>
      </div>

      <Avatar />
      <IdleScreensaver />

      <AnimatePresence>
        {windows.finder.isOpen && <FinderApp key="finder" />}
        {windows.terminal.isOpen && <TerminalApp key="terminal" />}
        {windows.safari.isOpen && <SafariApp key="safari" />}
        {windows.mail.isOpen && <MailApp key="mail" />}
        {windows.notes.isOpen && <NotesApp key="notes" />}
        {windows.photos.isOpen && <PhotosApp key="photos" />}
        {windows.settings.isOpen && <SettingsApp key="settings" />}
      </AnimatePresence>
    </div>
  );
}
