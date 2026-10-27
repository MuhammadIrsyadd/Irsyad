"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { sound } from "@/lib/sound";
import AppIcon from "@/components/icons/AppIcon";

// The dock's Trash is a small easter egg: it holds the things that really
// were thrown out while this portfolio was being redesigned.
const TRASHED = [
  {
    file: "aurora-warna-warni.canvas",
    icon: "blur_on",
    note: "Background login lama. Diganti grid titik perak yang lebih tenang.",
  },
  {
    file: "parallax-goyang.tsx",
    icon: "vibration",
    note: "Teks dan avatar yang ikut bergoyang saat mouse digeser. Bikin pusing.",
  },
  {
    file: "spline-hello.iframe",
    icon: "view_in_ar",
    note: "Animasi 'hello' 3D dari server luar, beberapa MB. Diganti tulisan tangan SVG.",
  },
  {
    file: "ikon-template.material",
    icon: "apps",
    note: "Ikon dock bawaan. Diganti ikon yang digambar khusus.",
  },
  {
    file: "LABEL-HURUF-BESAR.txt",
    icon: "title",
    note: "23 label huruf kapital ala template yang ada di mana-mana.",
  },
  {
    file: "huruf-D-terpotong.bug",
    icon: "bug_report",
    note: "Ujung huruf D di 'IRSYAD' yang sempat terpotong.",
  },
];

export default function TrashPanel({ onClose }: { onClose: () => void }) {
  const [emptied, setEmptied] = useState(false);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);

  function emptyTrash() {
    if (soundEnabled) sound.close();
    setEmptied(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[9600] flex items-end justify-center bg-black/40 p-4 pb-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.94 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        style={{ transformOrigin: "50% 100%" }}
        onClick={(e) => e.stopPropagation()}
        className="glass-modal w-full max-w-md overflow-hidden rounded-2xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <button
            onClick={onClose}
            aria-label="Tutup Trash"
            className="h-3.5 w-3.5 rounded-full bg-traffic-close transition hover:brightness-110"
          />
          <span className="flex-1 text-center text-[13px] font-semibold text-white">Trash</span>
          <button
            onClick={emptyTrash}
            disabled={emptied}
            className="rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition-colors hover:bg-white/15 disabled:opacity-40"
          >
            Kosongkan
          </button>
        </div>

        <div className="relative min-h-[372px] p-2">
          <AnimatePresence>
            {!emptied &&
              TRASHED.map((t, i) => (
                <motion.div
                  key={t.file}
                  initial={false}
                  // crumple and drop into the bin, one after another
                  exit={{
                    opacity: 0,
                    scale: 0.15,
                    rotate: i % 2 ? 160 : -140,
                    y: 260 - i * 34,
                    transition: { delay: i * 0.07, duration: 0.45, ease: [0.55, 0, 1, 0.45] },
                  }}
                  className="flex items-start gap-3 rounded-lg px-3 py-2 hover:bg-white/[0.06]"
                >
                  <span className="material-symbols-outlined mt-0.5 text-[20px] text-white/50">{t.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-mono-ui text-[12px] text-white/90">{t.file}</div>
                    <div className="text-[11px] leading-snug text-white/50">{t.note}</div>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          <AnimatePresence>
            {emptied && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: TRASHED.length * 0.07 + 0.35 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
              >
                <motion.span
                  animate={{ rotate: [0, -6, 6, -3, 0] }}
                  transition={{ delay: TRASHED.length * 0.07 + 0.35, duration: 0.5 }}
                >
                  <AppIcon id="trash" className="h-16 w-16" />
                </motion.span>
                <span className="text-[13px] font-medium text-white/80">Trash kosong</span>
                <span className="max-w-[240px] text-[11px] text-white/45">
                  Semuanya sudah dibuang. Yang tersisa cuma versi yang lebih baik.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
