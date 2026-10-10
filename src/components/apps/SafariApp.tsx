"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import { projects, type Project } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const accentMapDark: Record<
  Project["accent"],
  { text: string; ring: string; dot: string; heroBg: string; badgeBg: string }
> = {
  amber: {
    text: "text-amber-300",
    ring: "border-amber-400/40",
    dot: "bg-amber-400",
    heroBg: "from-amber-500/20 via-black/40 to-black/60",
    badgeBg: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  },
  violet: {
    text: "text-purple-300",
    ring: "border-purple-400/40",
    dot: "bg-purple-400",
    heroBg: "from-purple-500/20 via-black/40 to-black/60",
    badgeBg: "bg-purple-400/15 text-purple-300 border-purple-400/30",
  },
  cyan: {
    text: "text-cyan-300",
    ring: "border-cyan-400/40",
    dot: "bg-cyan-400",
    heroBg: "from-cyan-500/20 via-black/40 to-black/60",
    badgeBg: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
  },
  emerald: {
    text: "text-emerald-300",
    ring: "border-emerald-400/40",
    dot: "bg-emerald-400",
    heroBg: "from-emerald-500/20 via-black/40 to-black/60",
    badgeBg: "bg-emerald-400/15 text-emerald-300 border-emerald-400/30",
  },
  rose: {
    text: "text-rose-300",
    ring: "border-rose-400/40",
    dot: "bg-rose-400",
    heroBg: "from-rose-500/20 via-black/40 to-black/60",
    badgeBg: "bg-rose-400/15 text-rose-300 border-rose-400/30",
  },
};

const accentMapLight: Record<
  Project["accent"],
  { text: string; ring: string; dot: string; heroBg: string; badgeBg: string }
> = {
  amber: {
    text: "text-amber-800",
    ring: "border-amber-500/30",
    dot: "bg-amber-600",
    heroBg: "from-amber-500/15 to-amber-500/5",
    badgeBg: "bg-amber-500/10 text-amber-800 border-amber-500/20",
  },
  violet: {
    text: "text-purple-800",
    ring: "border-purple-500/30",
    dot: "bg-purple-600",
    heroBg: "from-purple-500/15 to-purple-500/5",
    badgeBg: "bg-purple-500/10 text-purple-800 border-purple-500/20",
  },
  cyan: {
    text: "text-cyan-800",
    ring: "border-cyan-500/30",
    dot: "bg-cyan-600",
    heroBg: "from-cyan-500/15 to-cyan-500/5",
    badgeBg: "bg-cyan-500/10 text-cyan-800 border-cyan-500/20",
  },
  emerald: {
    text: "text-emerald-800",
    ring: "border-emerald-500/30",
    dot: "bg-emerald-600",
    heroBg: "from-emerald-500/15 to-emerald-500/5",
    badgeBg: "bg-emerald-500/10 text-emerald-800 border-emerald-500/20",
  },
  rose: {
    text: "text-rose-800",
    ring: "border-rose-500/30",
    dot: "bg-rose-600",
    heroBg: "from-rose-500/15 to-rose-500/5",
    badgeBg: "bg-rose-500/10 text-rose-800 border-rose-500/20",
  },
};

function getCategoryIcon(category?: string) {
  const cat = (category || "").toLowerCase();
  if (cat.includes("game") || cat.includes("arcade")) return "sports_esports";
  if (cat.includes("health") || cat.includes("utility")) return "restaurant";
  if (cat.includes("mobile")) return "smartphone";
  if (cat.includes("enterprise") || cat.includes("erp")) return "domain";
  if (cat.includes("os") || cat.includes("portfolio")) return "desktop_mac";
  return "language";
}

export default function SafariApp() {
  const activeSafariProject = useSystemStore((s) => s.activeSafariProject);
  const setActiveSafariProject = useSystemStore((s) => s.setActiveSafariProject);
  const [activeId, setActiveId] = useState(
    () =>
      activeSafariProject && projects.some((p) => p.id === activeSafariProject)
        ? activeSafariProject
        : projects[0].id
  );
  const active = projects.find((p) => p.id === activeId) ?? projects[0];
  const [direction, setDirection] = useState(1);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const theme = useSystemStore((s) => s.theme);
  const isLight = theme === "light";

  const accentMap = isLight ? accentMapLight : accentMapDark;
  const hasImage = Boolean(active.image && !imageErrors[active.id]);

  useEffect(() => {
    if (
      activeSafariProject &&
      projects.some((p) => p.id === activeSafariProject) &&
      activeSafariProject !== activeId
    ) {
      const from = projects.findIndex((p) => p.id === activeId);
      const to = projects.findIndex((p) => p.id === activeSafariProject);
      setDirection(to > from ? 1 : -1);
      setActiveId(activeSafariProject);
    }
  }, [activeSafariProject, activeId]);

  function select(id: string) {
    const from = projects.findIndex((p) => p.id === activeId);
    const to = projects.findIndex((p) => p.id === id);
    setDirection(to > from ? 1 : -1);
    setActiveId(id);
    setActiveSafariProject(id);
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
      minWidth={540}
    >
      <div className="flex h-full flex-col">
        {/* Tab strip */}
        <div
          className={`flex items-center gap-1.5 overflow-x-auto border-b px-2 py-2 scrollbar-none transition-colors ${
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
                <span className="max-w-[130px] truncate">{p.name}</span>
                {p.url && (
                  <span className="h-1 w-1 rounded-full bg-emerald-400" title="Live Deploy" />
                )}
              </button>
            );
          })}
        </div>

        {/* Fake address bar with live link */}
        <div
          className={`flex items-center justify-between gap-2 border-b px-3 py-2 transition-colors ${
            isLight
              ? "border-black/10 bg-black/[0.02]"
              : "border-white/10 bg-black/20"
          }`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="material-symbols-outlined text-[13px] text-emerald-500">lock</span>
            <span
              className={`truncate font-mono-ui text-[11px] ${
                isLight ? "text-neutral-700" : "text-white/70"
              }`}
            >
              {active.url ? active.url : `portfolio.dev/projects/${active.id}`}
            </span>
          </div>

          {active.url && (
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              title="Buka website di tab baru"
              className={`flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono-ui text-[10px] font-semibold transition-all ${
                isLight
                  ? "border border-black/10 bg-white text-neutral-800 shadow-sm hover:bg-neutral-100"
                  : "border border-white/15 bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <span>Buka Situs</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          )}
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
              <div className="mx-auto flex max-w-2xl flex-col gap-5">
                {/* Hero / Preview Card (Clickable to visit site if url exists) */}
                {active.url ? (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`group relative flex h-48 sm:h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl border transition-all hover:scale-[1.01] hover:shadow-2xl ${accentMap[active.accent].ring} bg-gradient-to-br ${accentMap[active.accent].heroBg}`}
                  >
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={active.image}
                        alt={active.name}
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [active.id]: true }))
                        }
                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-4 text-center">
                        <span
                          className={`material-symbols-outlined text-6xl sm:text-7xl ${accentMap[active.accent].text}`}
                        >
                          {getCategoryIcon(active.category)}
                        </span>
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono-ui text-xs font-semibold tracking-wider text-white/90">
                            {active.url.replace(/^https?:\/\//, "")}
                          </span>
                          <span className="text-[11px] text-white/50">
                            Klik banner ini untuk mengunjungi website langsung
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Live Badge in top corner */}
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-black/70 px-2.5 py-1 shadow-md backdrop-blur-md">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="font-mono-ui text-[10px] font-medium text-emerald-300">
                        Live Deployed
                      </span>
                    </div>

                    {/* Hover Overlay indicating it's clickable */}
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                      <div className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-black/80 px-4 py-2 font-mono-ui text-xs font-semibold text-white shadow-2xl backdrop-blur-md">
                        <span>Kunjungi Website</span>
                        <span className="material-symbols-outlined text-sm">open_in_new</span>
                      </div>
                    </div>
                  </a>
                ) : (
                  <div
                    className={`relative flex h-48 sm:h-64 w-full items-center justify-center overflow-hidden rounded-2xl border ${accentMap[active.accent].ring} bg-gradient-to-br ${accentMap[active.accent].heroBg}`}
                  >
                    {hasImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={active.image}
                        alt={active.name}
                        onError={() =>
                          setImageErrors((prev) => ({ ...prev, [active.id]: true }))
                        }
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-4 text-center">
                        <span
                          className={`material-symbols-outlined text-6xl sm:text-7xl ${accentMap[active.accent].text}`}
                        >
                          {getCategoryIcon(active.category)}
                        </span>
                        <span className="font-mono-ui text-xs text-white/60">
                          {active.category || "Project Showcase"}
                        </span>
                      </div>
                    )}
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/70 px-2.5 py-1 backdrop-blur-md">
                      <span className="font-mono-ui text-[10px] font-medium text-white/70">
                        {active.category || "Case Study"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Project Title & Meta */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {active.category && (
                      <span
                        className={`rounded-md border px-2 py-0.5 font-mono-ui text-[10px] font-semibold ${accentMap[active.accent].badgeBg}`}
                      >
                        {active.category}
                      </span>
                    )}
                    <span
                      className={`font-mono-ui text-[11px] font-semibold uppercase tracking-widest ${accentMap[active.accent].text}`}
                    >
                      {active.tagline}
                    </span>
                  </div>
                  <h2
                    className={`mt-1.5 text-2xl font-bold tracking-tight ${
                      isLight ? "text-neutral-900" : "text-white"
                    }`}
                  >
                    {active.name}
                  </h2>
                </div>

                {/* Description */}
                <p
                  className={`text-[13px] leading-relaxed ${
                    isLight ? "text-neutral-700" : "text-white/75"
                  }`}
                >
                  {active.description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2">
                  {active.tech.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-3 py-1 text-[11px] font-medium transition-colors ${
                        isLight
                          ? "border-black/10 bg-black/5 text-neutral-800"
                          : "border-white/15 bg-white/10 text-white/80"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {active.url && (
                    <Magnet padding={30} magnetStrength={6}>
                      <a
                        href={active.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] px-4 py-2 text-xs font-semibold text-black shadow-lg shadow-[var(--accent-glow)] transition-all hover:brightness-110 active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">
                          rocket_launch
                        </span>
                        <span>Buka Website / Live Demo</span>
                        <span className="material-symbols-outlined text-sm font-bold">
                          open_in_new
                        </span>
                      </a>
                    </Magnet>
                  )}
                  {active.repo && (
                    <Magnet padding={30} magnetStrength={6}>
                      <a
                        href={active.repo}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-colors active:scale-95 ${
                          isLight
                            ? "border-black/15 bg-white text-neutral-800 shadow-sm hover:bg-neutral-50"
                            : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">code</span>
                        <span>Source Code</span>
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
