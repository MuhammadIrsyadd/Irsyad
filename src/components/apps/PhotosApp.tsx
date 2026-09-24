"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import { usePhotos } from "@/components/PhotosProvider";

export default function PhotosApp() {
  const photos = usePhotos();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const opened = openIndex !== null ? photos[openIndex] : null;

  return (
    <AppFrame
      id="photos"
      title="Photos"
      icon={<span className="material-symbols-outlined text-[15px] text-rose-300">photo_library</span>}
      minWidth={480}
    >
      <div className="relative h-full overflow-y-auto p-4 sm:p-6">
        {photos.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-white/40">
            <span className="material-symbols-outlined text-4xl">add_photo_alternate</span>
            <p className="max-w-xs text-[12px] leading-relaxed">
              Belum ada foto. Taruh sertifikat, dokumentasi event, atau behind-the-scenes di{" "}
              <code className="font-mono-ui text-white/60">public/images/photos/</code> — muncul
              otomatis di sini, nggak perlu ubah kode.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((p, i) => (
              <motion.button
                key={p.id}
                onClick={() => setOpenIndex(i)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-white/5"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/70 to-transparent px-2 py-1.5 text-left text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {p.label}
                </span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {opened && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenIndex(null)}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black/85 p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-full max-w-full flex-col items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={opened.src}
                alt={opened.label}
                className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
              <span className="text-[12px] text-white/70">{opened.label}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppFrame>
  );
}
