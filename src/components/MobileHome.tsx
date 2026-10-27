"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { appRegistry } from "@/lib/apps";
import { useSystemStore } from "@/store/system-store";
import { profile } from "@/lib/content";
import OpenApps, { preloadApp } from "@/components/apps/OpenApps";
import AppIcon from "@/components/icons/AppIcon";
import { batteryIcon, useBattery, useOnline } from "@/hooks/use-device-status";
import Avatar from "@/components/Avatar";
import IdleScreensaver from "@/components/IdleScreensaver";
import HomeLogo from "@/components/HomeLogo";

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
  const openApp = useSystemStore((s) => s.openApp);
  const lock = useSystemStore((s) => s.lock);
  const online = useOnline();
  const battery = useBattery();

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* dim the wallpaper a little so the profile and labels stay readable */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />
      {/* Status bar */}
      <div className="glass-menubar fixed inset-x-0 top-0 z-[900] flex h-11 items-center justify-between px-5 pt-[env(safe-area-inset-top)] text-[14px] text-white/90">
        <span className="font-medium">
          {now?.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) ?? ""}
        </span>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[17px]">{online ? "wifi" : "wifi_off"}</span>
          {battery && (
            <span className="flex items-center gap-0.5 text-[12px] tabular-nums">
              <span
                className={`material-symbols-outlined icon-fill text-[17px] ${battery.charging ? "text-emerald-400" : ""}`}
              >
                {batteryIcon(battery)}
              </span>
              {Math.round(battery.level * 100)}%
            </span>
          )}
          <button onClick={lock} aria-label="Lock screen" className="ml-1 flex active:scale-90">
            <span className="material-symbols-outlined text-[17px]">power_settings_new</span>
          </button>
        </div>
      </div>

      {/* Home screen grid */}
      <div className="relative flex h-full flex-col items-center justify-center gap-8 px-8 pt-11">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="h-24 w-24 overflow-hidden rounded-2xl border border-white/20 shadow-2xl">
            <img src="/images/avatar.webp" alt="" className="h-full w-full object-cover object-top" />
          </div>
          <span className="text-xl font-semibold text-white">{profile.name}</span>
          <span className="text-[14px] text-[var(--accent-300)]">{profile.role}</span>
        </div>

        <div className="grid w-full max-w-xs grid-cols-3 gap-6">
          {appRegistry.map((app, i) => (
            <motion.button
              key={app.id}
              initial={{ opacity: 0, y: 18, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 + i * 0.045 }}
              whileTap={{ scale: 0.9 }}
              onPointerDown={() => preloadApp(app.id)}
              onClick={() => openApp(app.id)}
              className="flex flex-col items-center gap-2"
            >
              <AppIcon id={app.id} className="h-16 w-16 drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]" />
              <span className="text-[13px] text-white/85">{app.label}</span>
            </motion.button>
          ))}
        </div>

        <span className="glass-pill rounded-full px-3 py-1 text-center text-[10px] text-white/50">
          Ketuk ikon untuk membuka aplikasi
        </span>
      </div>

      <HomeLogo />
      <Avatar />
      <IdleScreensaver />

      <OpenApps />
    </div>
  );
}
