"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import { projects, type Project } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const dotColor: Record<Project["accent"], string> = {
  amber: "bg-amber-400",
  violet: "bg-purple-400",
  cyan: "bg-cyan-400",
  emerald: "bg-emerald-400",
  rose: "bg-rose-400",
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

/** Project screenshot (or an icon placeholder). Shares a layoutId between
 *  the overview tile and the detail hero so it flies from one to the other. */
function Shot({ project, className }: { project: Project; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <motion.div
      layoutId={`shot-${project.id}`}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
      className={`relative overflow-hidden bg-white/5 ${className ?? ""}`}
    >
      {project.image && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.image}
          alt={project.name}
          decoding="async"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-white/40">{getCategoryIcon(project.category)}</span>
        </div>
      )}
    </motion.div>
  );
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
  // Opened from the dock: start in the overview. Opened for a specific
  // project (desktop widget, Terminal `open`, Spotlight): go straight to it.
  const [view, setView] = useState<"overview" | "detail">(activeSafariProject ? "detail" : "overview");
  const [direction, setDirection] = useState(1);
  const active = projects.find((p) => p.id === activeId) ?? projects[0];

  useEffect(() => {
    if (activeSafariProject && projects.some((p) => p.id === activeSafariProject)) {
      /* eslint-disable react-hooks/set-state-in-effect -- follow project requests coming from outside Safari */
      setActiveId((prev) => {
        const from = projects.findIndex((p) => p.id === prev);
        const to = projects.findIndex((p) => p.id === activeSafariProject);
        setDirection(to > from ? 1 : -1);
        return activeSafariProject;
      });
      setView("detail");
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [activeSafariProject]);

  function select(id: string) {
    const from = projects.findIndex((p) => p.id === activeId);
    const to = projects.findIndex((p) => p.id === id);
    setDirection(to > from ? 1 : -1);
    setActiveId(id);
    setActiveSafariProject(id);
    setView("detail");
  }

  function showOverview() {
    setView("overview");
    setActiveSafariProject(null);
  }

  const address = view === "overview" ? "muhirsyad.my.id/projects" : active.url ?? `portfolio.dev/projects/${active.id}`;

  return (
    <AppFrame id="safari" title="Safari — Projects" minWidth={540}>
      <div className="flex h-full flex-col">
        {/* Toolbar: tab overview button + address bar */}
        <div className="hairline flex items-center gap-2 border-b bg-black/20 px-3 py-2">
          <button
            onClick={view === "overview" ? () => select(activeId) : showOverview}
            aria-label={view === "overview" ? "Kembali ke proyek" : "Lihat semua proyek"}
            title={view === "overview" ? "Kembali ke proyek" : "Lihat semua proyek"}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors ${
              view === "overview" ? "bg-white/15 text-white" : "text-white/60 hover:bg-white/[0.1] hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">grid_view</span>
          </button>

          <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md bg-white/10 px-3 py-1">
            <span className="material-symbols-outlined text-[12px] text-white/50">lock</span>
            <span className="truncate text-[12px] text-white/80">{address}</span>
          </div>

          {view === "detail" && active.url ? (
            <a
              href={active.url}
              target="_blank"
              rel="noreferrer"
              title="Buka website di tab baru"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/60 transition-colors hover:bg-white/[0.1] hover:text-white"
            >
              <span className="material-symbols-outlined text-[17px]">open_in_new</span>
            </a>
          ) : (
            <span className="w-7 shrink-0" />
          )}
        </div>

        {view === "detail" && (
          <div className="hairline flex items-center gap-1 overflow-x-auto border-b bg-black/10 px-2 py-1.5">
            {projects.map((p) => {
              const isActive = p.id === activeId;
              return (
                <button
                  key={p.id}
                  onClick={() => select(p.id)}
                  className={`relative flex shrink-0 items-center gap-2 rounded-md px-3 py-1 text-[11.5px] transition-colors ${
                    isActive ? "font-medium text-white" : "text-white/50 hover:bg-white/[0.06] hover:text-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="safari-active-tab"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-md bg-white/10"
                    />
                  )}
                  <span className={`relative h-1.5 w-1.5 rounded-full ${dotColor[p.accent]}`} />
                  <span className="relative max-w-[130px] truncate">{p.name.split(" — ")[0]}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="relative flex-1 overflow-hidden">
          {view === "overview" ? (
            // Mission-Control style overview of every project
            <motion.div layoutScroll className="absolute inset-0 overflow-y-auto p-5 sm:p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <h1 className="text-[18px] font-semibold tracking-tight text-white">Proyek</h1>
                <span className="text-[11.5px] text-white/50">{projects.length} proyek, klik untuk membuka</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3">
                {projects.map((p, i) => (
                  <motion.button
                    key={p.id}
                    onClick={() => select(p.id)}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 28 }}
                    whileHover={{ y: -3 }}
                    className="group flex flex-col gap-2 text-left"
                  >
                    <Shot
                      project={p}
                      className="aspect-[16/10] w-full rounded-lg ring-1 ring-white/10 transition-shadow group-hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.6)] group-hover:ring-[var(--accent-400)]/60"
                    />
                    <div className="flex items-center gap-1.5 px-0.5">
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotColor[p.accent]}`} />
                      <span className="truncate text-[12px] font-medium text-white">{p.name.split(" — ")[0]}</span>
                    </div>
                    <span className="-mt-1.5 truncate px-0.5 text-[11px] text-white/50">{p.category}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout" initial={false} custom={direction}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -40 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute inset-0 overflow-y-auto p-5 sm:p-7"
              >
                <div className="mx-auto flex max-w-2xl flex-col gap-4">
                  {active.url ? (
                    <a href={active.url} target="_blank" rel="noreferrer" className="group block" title="Kunjungi website">
                      <Shot project={active} className="aspect-[16/9] w-full rounded-xl ring-1 ring-white/10" />
                    </a>
                  ) : (
                    <Shot project={active} className="aspect-[16/9] w-full rounded-xl ring-1 ring-white/10" />
                  )}

                  <div>
                    <p className="text-[12px] text-white/50">
                      {active.category}
                      {active.url && <span className="ml-2 font-medium text-emerald-500">Live</span>}
                    </p>
                    <h2 className="mt-0.5 text-[22px] font-semibold leading-tight tracking-tight text-white">
                      {active.name}
                    </h2>
                    <p className="mt-1 text-[13px] text-accent-ink">{active.tagline}</p>
                  </div>

                  <p className="max-w-[68ch] text-[13px] leading-relaxed text-white/75">{active.description}</p>

                  <p className="text-[12px] text-white/50">
                    <span className="text-white/70">Dibangun dengan </span>
                    {active.tech.join(", ")}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {active.url && (
                      <Magnet padding={30} magnetStrength={6}>
                        <a
                          href={active.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-500)] px-4 py-2 text-xs font-semibold text-black transition hover:brightness-110 active:scale-95"
                        >
                          Buka website
                          <span className="material-symbols-outlined text-[15px]">open_in_new</span>
                        </a>
                      </Magnet>
                    )}
                    {active.repo && (
                      <Magnet padding={30} magnetStrength={6}>
                        <a
                          href={active.repo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-white/15 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[15px]">code</span>
                          Source code
                        </a>
                      </Magnet>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </AppFrame>
  );
}
