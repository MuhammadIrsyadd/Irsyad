"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { socials } from "@/lib/content";
import { brandIcon } from "@/components/BrandIcon";
import AppIcon, { type IconId } from "@/components/icons/AppIcon";

function DesktopIcon({
  iconId,
  label,
  onClick,
}: {
  iconId: IconId;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-24 flex-col items-center gap-1.5 rounded-xl p-2 transition-colors hover:bg-white/[0.1] active:scale-95"
    >
      <AppIcon
        id={iconId}
        className="h-16 w-16 drop-shadow-[0_8px_14px_rgba(0,0,0,0.45)] transition-transform group-hover:-translate-y-0.5"
      />
      <span className="desktop-icon-label rounded px-1.5 py-0.5 text-center text-[12px] tracking-tight text-white/90 drop-shadow-md group-hover:bg-[var(--accent-500)] group-hover:text-black">
        {label}
      </span>
    </button>
  );
}

export default function DesktopIcons() {
  const openApp = useSystemStore((s) => s.openApp);
  const [socialsOpen, setSocialsOpen] = useState(false);

  return (
    <>
      <div className="pointer-events-auto fixed left-4 top-16 z-10 hidden flex-col items-start gap-3 xl:flex">
        <DesktopIcon
          iconId="resume"
          label="Resume.pdf"
          onClick={() => window.open("/resume.pdf", "_blank")}
        />
        <DesktopIcon
          iconId="folder"
          label="Projects"
          onClick={() => openApp("safari")}
        />
        <DesktopIcon
          iconId="contact"
          label="Connect"
          onClick={() => setSocialsOpen(true)}
        />
      </div>

      <AnimatePresence>
        {socialsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSocialsOpen(false)}
            className="fixed inset-0 z-[9600] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-modal w-full max-w-md overflow-hidden rounded-2xl"
            >
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <span className="flex items-center gap-2 text-[13px] font-semibold text-white">
                  <span className="material-symbols-outlined text-base text-[var(--accent-400)]">
                    connect_without_contact
                  </span>
                  Connect
                </span>
                <button
                  onClick={() => setSocialsOpen(false)}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
                >
                  <span className="material-symbols-outlined text-[13px]">close</span>
                </button>
              </div>
              <div className="flex flex-col gap-2 p-3">
                {socials.map((s) => {
                  const Icon = brandIcon(s.id);
                  const filled = Boolean(s.url);
                  return (
                    <a
                      key={s.id}
                      href={filled ? s.url : undefined}
                      target={filled ? "_blank" : undefined}
                      rel={filled ? "noreferrer" : undefined}
                      aria-disabled={!filled}
                      className={`flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 transition-colors ${
                        filled ? "hover:border-[var(--accent-400)]/40 hover:bg-white/[0.1]" : "opacity-50"
                      }`}
                      onClick={(e) => {
                        if (!filled) e.preventDefault();
                      }}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="flex flex-1 flex-col">
                        <span className="text-[13px] font-medium text-white">{s.label}</span>
                        <span className="text-[11px] text-white/50">
                          {filled ? s.handle : "belum diisi"}
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[16px] text-white/40">
                        {filled ? "north_east" : "hourglass_empty"}
                      </span>
                    </a>
                  );
                })}
              </div>
              <div className="border-t border-white/10 px-4 py-2.5 text-center text-[10px] text-white/40">
                Mau ngobrol lebih personal? Email juga selalu terbuka.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
