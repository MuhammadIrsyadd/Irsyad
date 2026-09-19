"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { profile } from "@/lib/content";

const appleMenuLinks = [
  { label: "About This Portfolio", target: "settings" as const },
  { label: "Resume", href: "/resume.pdf" },
  { label: "Contact", target: "mail" as const },
  { label: "Source Code", href: "https://github.com/", external: true },
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
  const openApp = useSystemStore((s) => s.openApp);
  const setSpotlightOpen = useSystemStore((s) => s.setSpotlightOpen);
  const lock = useSystemStore((s) => s.lock);

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
              onClick={() => setAppleMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded px-2 py-1 font-semibold text-white transition-colors hover:bg-white/10"
            >
              <img
                src="/images/avatar.png"
                alt=""
                className="h-6 w-6 rounded-full object-cover object-top"
              />
              <span className="hidden sm:inline">{profile.name}</span>
            </button>
            {appleMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                onMouseLeave={() => setAppleMenuOpen(false)}
                className="glass-modal absolute left-0 top-12 w-60 rounded-xl p-2"
              >
                {appleMenuLinks.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if ("target" in item && item.target) openApp(item.target);
                      else if (item.href) window.open(item.href, item.external ? "_blank" : "_self");
                      setAppleMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
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
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13px] text-white/85 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <span className="material-symbols-outlined text-[16px]">lock</span>
                  Lock Screen
                </button>
              </motion.div>
            )}
          </div>
          <nav className="hidden items-center gap-4 font-normal text-white/70 md:flex">
            {["File", "Edit", "View", "Go", "Window", "Help"].map((m) => (
              <span key={m} className="cursor-default transition-colors hover:text-white">
                {m}
              </span>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setSpotlightOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
            title="Spotlight (Cmd+K)"
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span className="hidden font-mono-ui text-[11px] text-white/50 sm:inline">⌘K</span>
          </button>
          <span className="material-symbols-outlined hidden text-[18px] text-white/70 sm:inline">
            wifi
          </span>
          <div className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 sm:flex">
            <span className="material-symbols-outlined icon-fill text-[17px] text-emerald-400">
              battery_charging_80
            </span>
            <span className="font-medium text-white/90">98%</span>
          </div>
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
        </div>
      </div>
    </motion.header>
  );
}
