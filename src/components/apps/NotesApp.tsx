"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import { caseStudies, projects } from "@/lib/content";

export default function NotesApp() {
  const [activeId, setActiveId] = useState<string | null>(caseStudies[0]?.id ?? null);
  const active = caseStudies.find((c) => c.id === activeId) ?? null;

  return (
    <AppFrame
      id="notes"
      title="Notes — Case Studies"
      icon={<span className="material-symbols-outlined text-[15px] text-amber-300">sticky_note_2</span>}
      minWidth={480}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[220px_1fr]">
        {/* Note list */}
        <aside className="flex flex-col gap-1 overflow-y-auto border-r border-white/10 bg-black/20 p-3">
          <span className="mb-1 px-2 font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Semua Catatan
          </span>
          {caseStudies.map((c) => {
            const project = projects.find((p) => p.id === c.projectId);
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex flex-col gap-1 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  activeId === c.id
                    ? "border border-[var(--accent-400)]/30 bg-gradient-to-r from-[var(--accent-500)]/25 to-[var(--accent-500)]/5"
                    : "border border-transparent hover:bg-white/10"
                }`}
              >
                <span className="text-[12px] font-medium leading-snug text-white">{c.title}</span>
                {project && (
                  <span className="text-[10px] text-white/40">{project.name}</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Note detail */}
        <main className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            {active && (
              <motion.article
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 overflow-y-auto p-5 sm:p-7"
              >
                <div className="mx-auto flex max-w-xl flex-col gap-5">
                  <div>
                    <span className="font-mono-ui text-[11px] uppercase tracking-widest text-[var(--accent-400)]">
                      Case Study
                    </span>
                    <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">{active.title}</h1>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {active.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] text-white/70"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {[
                    { label: "Masalah", icon: "help", body: active.problem },
                    { label: "Pendekatan", icon: "route", body: active.approach },
                    { label: "Hasil", icon: "flag", body: active.result },
                  ].map((section) => (
                    <div key={section.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="mb-1.5 flex items-center gap-2 text-[var(--accent-300)]">
                        <span className="material-symbols-outlined text-[16px]">{section.icon}</span>
                        <span className="text-[11px] font-semibold uppercase tracking-wide">
                          {section.label}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-white/75">{section.body}</p>
                    </div>
                  ))}
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppFrame>
  );
}
