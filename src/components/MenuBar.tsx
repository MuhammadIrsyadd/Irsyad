"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appOrder, useSystemStore } from "@/store/system-store";
import { getAppMeta } from "@/lib/apps";
import { profile } from "@/lib/content";
import ControlCenter from "@/components/ControlCenter";
import MenuBarMenus from "@/components/MenuBarMenus";
import { batteryIcon, useBattery, useOnline } from "@/hooks/use-device-status";

const appleMenuLinks = [
  { label: "About This Portfolio", target: "settings" as const },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Contact", target: "mail" as const },
  { label: "Source Code", href: "https://github.com/MuhammadIrsyadd", external: true },
];

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock, avoids SSR/CSR hydration mismatch
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MenuBar() {
  const now = useClock();
  const [appleMenuOpen, setAppleMenuOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);
  const openApp = useSystemStore((s) => s.openApp);
  const setSpotlightOpen = useSystemStore((s) => s.setSpotlightOpen);
  const theme = useSystemStore((s) => s.theme);
  const toggleTheme = useSystemStore((s) => s.toggleTheme);
  const lock = useSystemStore((s) => s.lock);
  const online = useOnline();
  const battery = useBattery();
  // Name of the frontmost window, shown bold next to the logo like macOS.
  const activeApp = useSystemStore((s) =>
    appOrder.find(
      (id) => s.windows[id].isOpen && !s.windows[id].isMinimized && s.windows[id].zIndex === s.topZ
    )
  );

  const dateLabel = now
    ? now.toLocaleString("id-ID", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: 0.15 }}
      className="glass-menubar fixed inset-x-0 top-0 z-[900] h-11 select-none"
    >
      <div className="flex h-full items-center justify-between px-5 text-[14px] text-white/90">
        <div className="flex items-center gap-5">
          <div className="relative">
            <button
              onClick={() => {
                setAppleMenuOpen((v) => !v);
                setControlCenterOpen(false);
              }}
              className="flex items-center gap-2 rounded px-2 py-1 font-semibold text-white transition-colors hover:bg-white/[0.1]"
            >
              <img
                src="/images/face.webp"
                alt="Logo"
                className="h-6 w-6 rounded-full object-cover"
              />
              <span className="hidden whitespace-nowrap sm:inline">{profile.name}</span>
            </button>
            <AnimatePresence>
              {appleMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  style={{ transformOrigin: "top left" }}
                  onMouseLeave={() => setAppleMenuOpen(false)}
                  className="glass-modal absolute left-0 top-12 w-60 rounded-xl p-2 shadow-2xl"
                >
                  {appleMenuLinks.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if ("target" in item && item.target) openApp(item.target);
                        else if (item.href) window.open(item.href, item.external ? "_blank" : "_self");
                        setAppleMenuOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] text-white/85 transition-colors hover:bg-white/[0.1] hover:text-white"
                    >
                      {item.label}
                    </button>
                  ))}
                  <div className="my-1.5 h-px bg-white/10" />
                  <button
                    onClick={() => {
                      setAppleMenuOpen(false);
                      lock();
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-white/85 transition-colors hover:bg-white/[0.1] hover:text-white"
                  >
                    <span className="material-symbols-outlined text-[16px]">lock</span>
                    Lock Screen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={activeApp ?? "desktop"}
              initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
              transition={{ duration: 0.18 }}
              className="hidden whitespace-nowrap font-semibold text-white xl:inline"
            >
              {activeApp ? getAppMeta(activeApp).label : "Desktop"}
            </motion.span>
          </AnimatePresence>
          <MenuBarMenus />
        </div>

        <div className="relative flex items-center gap-2.5 sm:gap-3.5">
          <button
            onClick={() => setSpotlightOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
            title="Spotlight (Cmd+K)"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="hidden font-mono-ui text-[11px] text-white/50 sm:inline">⌘K</span>
          </button>

          {/* Direct Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 backdrop-blur-md transition-all active:scale-95 ${
              theme === "light"
                ? "border-amber-500/30 bg-amber-400/20 text-neutral-900 hover:bg-amber-400/30"
                : "border-white/15 bg-white/10 text-white/90 hover:bg-white/20"
            }`}
            title={`Ganti ke ${theme === "dark" ? "Light Mode" : "Dark Mode"}`}
          >
            <span
              className={`material-symbols-outlined text-[17px] ${
                theme === "light" ? "text-amber-600" : "text-amber-300"
              }`}
            >
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
            <span className="hidden text-[11px] font-semibold sm:inline">
              {theme === "dark" ? "Light" : "Dark"}
            </span>
          </button>

          {/* Control Center Toggle */}
          <button
            onClick={() => {
              setControlCenterOpen((v) => !v);
              setAppleMenuOpen(false);
            }}
            className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-white/80 backdrop-blur-md transition-colors ${
              controlCenterOpen
                ? "border-[var(--accent-400)]/50 bg-[var(--accent-500)]/20 text-white"
                : "border-white/10 bg-white/10 hover:bg-white/15 hover:text-white"
            }`}
            title="Control Center (Pengaturan Cepat)"
          >
            <span className="material-symbols-outlined text-[17px]">instant_mix</span>
          </button>

          <span
            className="material-symbols-outlined hidden text-[18px] text-white/70 sm:inline"
            title={online ? "Terhubung ke internet" : "Offline"}
          >
            {online ? "wifi" : "wifi_off"}
          </span>

          {/* real battery where the browser exposes it; nothing fake otherwise */}
          {battery && (
            <div
              className="hidden items-center gap-1 sm:flex"
              title={battery.charging ? "Sedang mengisi daya" : "Baterai"}
            >
              <span
                className={`material-symbols-outlined icon-fill text-[18px] ${
                  battery.charging ? "text-emerald-400" : battery.level < 0.2 ? "text-red-400" : "text-white/80"
                }`}
              >
                {batteryIcon(battery)}
              </span>
              <span className="font-medium tabular-nums text-white/90">{Math.round(battery.level * 100)}%</span>
            </div>
          )}

          <span className="whitespace-nowrap font-medium tracking-wide text-white/90">
            {dateLabel}
          </span>

          <button
            onClick={lock}
            title="Shut down / Lock screen"
            aria-label="Lock screen"
            className="flex h-7 w-7 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-red-500/80 hover:text-white active:scale-90"
          >
            <span className="material-symbols-outlined text-[18px]">power_settings_new</span>
          </button>

          {/* Control Center Modal */}
          <AnimatePresence>
            {controlCenterOpen && (
              <ControlCenter />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
