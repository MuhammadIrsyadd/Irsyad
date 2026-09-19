"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useSystemStore, type AppId } from "@/store/system-store";

export default function MobileAppSheet({
  id,
  title,
  icon,
  children,
}: {
  id: AppId;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  const w = useSystemStore((s) => s.windows[id]);
  const closeApp = useSystemStore((s) => s.closeApp);

  if (!w.isOpen) return null;

  return (
    <motion.div
      key={id}
      initial={{ y: "100%", opacity: 0.6 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "100%", opacity: 0.6, transition: { duration: 0.22 } }}
      transition={{ type: "spring", stiffness: 300, damping: 32 }}
      className="glass-sheet fixed inset-0 z-[1000] flex flex-col overflow-hidden rounded-none"
    >
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent px-3 pt-[env(safe-area-inset-top)]">
        <button
          onClick={() => closeApp(id)}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] text-primary active:bg-white/10"
        >
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          Home
        </button>
        <div className="flex items-center gap-1.5 text-white/90">
          {icon}
          <span className="text-[13px] font-medium">{title}</span>
        </div>
        <div className="w-[68px]" />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </motion.div>
  );
}
