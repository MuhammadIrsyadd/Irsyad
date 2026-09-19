"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import { projects, type Project } from "@/lib/content";

const accentMap: Record<Project["accent"], { text: string; ring: string; dot: string }> = {
  amber: { text: "text-amber-300", ring: "border-amber-400/40", dot: "bg-amber-400" },
  violet: { text: "text-purple-300", ring: "border-purple-400/40", dot: "bg-purple-400" },
  cyan: { text: "text-cyan-300", ring: "border-cyan-400/40", dot: "bg-cyan-400" },
};

export default function SafariApp() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const [direction, setDirection] = useState(1);

  function select(id: string) {
    const from = projects.findIndex((p) => p.id === activeId);
    const to = projects.findIndex((p) => p.id === id);
    setDirection(to > from ? 1 : -1);
    setActiveId(id);
  }

  return (
    <AppFrame
      id="safari"
      title="Safari — Projects"
      icon={<span className="material-symbols-outlined text-[15px] text-cyan-300">explore</span>}
      minWidth={520}
    >
      <div className="flex h-full flex-col">
        {/* Tab strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/10 bg-black/30 px-2 py-2">
          {projects.map((p) => {
            const a = accentMap[p.accent];
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => select(p.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 font-mono-ui text-[11px] transition-all ${
                  isActive
                    ? `border-white/15 bg-white/10 text-white`
                    : "border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
                <span className="max-w-[140px] truncate">{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Fake address bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-black/20 px-3 py-2">
          <span className="material-symbols-outlined text-[13px] text-emerald-400">lock</span>
          <span className="truncate font-mono-ui text-[11px] text-white/60">
            portfolio.dev/projects/{active.id}
          </span>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -40 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute inset-0 overflow-y-auto p-5 sm:p-7"
            >
              <div className="mx-auto flex max-w-2xl flex-col gap-4">
                <div
                  className={`flex h-40 w-full items-center justify-center rounded-2xl border ${accentMap[active.accent].ring} bg-gradient-to-br from-white/10 to-black/30`}
                >
                  <span className={`material-symbols-outlined text-6xl ${accentMap[active.accent].text}`}>
                    web
                  </span>
                </div>
                <div>
                  <span className={`font-mono-ui text-[11px] uppercase tracking-widest ${accentMap[active.accent].text}`}>
                    {active.tagline}
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-white">{active.name}</h2>
                </div>
                <p className="text-[13px] leading-relaxed text-white/70">{active.description}</p>
                <div className="flex flex-wrap gap-2">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/80"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  {active.url && (
                    <a
                      href={active.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-black"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Live Demo
                    </a>
                  )}
                  {active.repo && (
                    <a
                      href={active.repo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white"
                    >
                      <span className="material-symbols-outlined text-sm">code</span>
                      Source
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AppFrame>
  );
}
