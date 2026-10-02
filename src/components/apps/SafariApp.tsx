"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import { projects, type Project } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const accentMapDark: Record<Project["accent"], { text: string; ring: string; dot: string; heroBg: string }> = {
  amber: { text: "text-amber-300", ring: "border-amber-400/40", dot: "bg-amber-400", heroBg: "from-white/10 to-black/30" },
  violet: { text: "text-purple-300", ring: "border-purple-400/40", dot: "bg-purple-400", heroBg: "from-white/10 to-black/30" },
  cyan: { text: "text-cyan-300", ring: "border-cyan-400/40", dot: "bg-cyan-400", heroBg: "from-white/10 to-black/30" },
};

const accentMapLight: Record<Project["accent"], { text: string; ring: string; dot: string; heroBg: string }> = {
  amber: { text: "text-amber-800", ring: "border-amber-500/30", dot: "bg-amber-600", heroBg: "from-amber-500/15 to-amber-500/5" },
  violet: { text: "text-purple-800", ring: "border-purple-500/30", dot: "bg-purple-600", heroBg: "from-purple-500/15 to-purple-500/5" },
  cyan: { text: "text-cyan-800", ring: "border-cyan-500/30", dot: "bg-cyan-600", heroBg: "from-cyan-500/15 to-cyan-500/5" },
};

export default function SafariApp() {
  const [activeId, setActiveId] = useState(projects[0].id);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const [direction, setDirection] = useState(1);
  const theme = useSystemStore((s) => s.theme);
  const isLight = theme === "light";

  const accentMap = isLight ? accentMapLight : accentMapDark;

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
      icon={
        <span
          className={`material-symbols-outlined text-[15px] ${
            isLight ? "text-cyan-600" : "text-cyan-300"
          }`}
        >
          explore
        </span>
      }
      minWidth={520}
    >
      <div className="flex h-full flex-col">
        {/* Tab strip */}
        <div
          className={`flex items-center gap-1.5 overflow-x-auto border-b px-2 py-2 transition-colors ${
            isLight
              ? "border-black/10 bg-black/[0.03]"
              : "border-white/10 bg-black/30"
          }`}
        >
          {projects.map((p) => {
            const a = accentMap[p.accent];
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                onClick={() => select(p.id)}
                className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-1.5 font-mono-ui text-[11px] transition-all ${
                  isActive
                    ? isLight
                      ? "border-black/15 bg-white text-neutral-900 shadow-sm font-semibold"
                      : "border-white/15 bg-white/10 text-white font-medium"
                    : isLight
                    ? "border-transparent text-neutral-600 hover:bg-black/5 hover:text-neutral-900"
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
        <div
          className={`flex items-center gap-2 border-b px-3 py-2 transition-colors ${
            isLight
              ? "border-black/10 bg-black/[0.02]"
              : "border-white/10 bg-black/20"
          }`}
        >
          <span className="material-symbols-outlined text-[13px] text-emerald-600">lock</span>
          <span
            className={`truncate font-mono-ui text-[11px] ${
              isLight ? "text-neutral-600" : "text-white/60"
            }`}
          >
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
                  className={`flex h-40 w-full items-center justify-center rounded-2xl border ${accentMap[active.accent].ring} bg-gradient-to-br ${accentMap[active.accent].heroBg}`}
                >
                  <span className={`material-symbols-outlined text-6xl ${accentMap[active.accent].text}`}>
                    web_asset
                  </span>
                </div>
                <div>
                  <span className={`font-mono-ui text-[11px] font-semibold uppercase tracking-widest ${accentMap[active.accent].text}`}>
                    {active.tagline}
                  </span>
                  <h2
                    className={`mt-1 text-2xl font-bold ${
                      isLight ? "text-neutral-900" : "text-white"
                    }`}
                  >
                    {active.name}
                  </h2>
                </div>
                <p
                  className={`text-[13px] leading-relaxed ${
                    isLight ? "text-neutral-700" : "text-white/70"
                  }`}
                >
                  {active.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
                        isLight
                          ? "border-black/10 bg-black/5 text-neutral-800"
                          : "border-white/15 bg-white/10 text-white/80"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 pt-2">
                  {active.url && (
                    <Magnet padding={30} magnetStrength={6}>
                      <a
                        href={active.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                        Live Demo
                      </a>
                    </Magnet>
                  )}
                  {active.repo && (
                    <Magnet padding={30} magnetStrength={6}>
                      <a
                        href={active.repo}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                          isLight
                            ? "border-black/15 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50"
                            : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">code</span>
                        Source
                      </a>
                    </Magnet>
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
