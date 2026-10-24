"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";
import { preloadApp } from "@/components/apps/OpenApps";

// macOS-style desktop widgets: a live clock and a rotating showcase of
// deployed projects. They sit under every window, so they only ever cost
// anything while the desktop is actually visible.

const ROTATE_MS = 6500;
const showcase = projects.filter((p) => p.url && p.image);

function useMinuteClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    function tick() {
      const d = new Date();
      setNow(d);
      // re-render exactly on the next minute boundary instead of every second
      t = setTimeout(tick, 60_000 - d.getSeconds() * 1000 - d.getMilliseconds() + 20);
    }
    tick();
    return () => clearTimeout(t);
  }, []);
  return now;
}

function ClockWidget() {
  const now = useMinuteClock();
  const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? "--:--";
  const weekday = now?.toLocaleDateString("id-ID", { weekday: "long" }) ?? "";
  const date = now?.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) ?? "";

  return (
    <div className="glass-widget flex h-full w-[208px] flex-col justify-between rounded-[22px] p-4">
      <span className="widget-day text-[12px] font-medium capitalize text-[var(--accent-300)]">{weekday}</span>
      <span
        className="widget-time block text-[58px] leading-[0.9] tabular-nums tracking-tight"
        style={{ fontFamily: "var(--font-kanit), 'Kanit', sans-serif", fontWeight: 900 }}
        suppressHydrationWarning
      >
        {time}
      </span>
      <div className="flex flex-col gap-2">
        <span className="text-[12px] text-white/60">{date}</span>
        {/* Seconds sweep: pure CSS, restarts every minute, no re-renders */}
        <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
          <div
            key={time}
            className="widget-sweep h-full rounded-full bg-[var(--accent-400)]"
            style={{ animationDelay: `-${now ? now.getSeconds() : 0}s` }}
          />
        </div>
      </div>
    </div>
  );
}

function ShowcaseWidget() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const openSafariProject = useSystemStore((s) => s.openSafariProject);
  const project = showcase[index];

  useEffect(() => {
    if (paused || showcase.length < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % showcase.length), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, paused]);

  if (!project) return null;

  return (
    <div
      onMouseEnter={() => {
        setPaused(true);
        preloadApp("safari");
      }}
      onMouseLeave={() => setPaused(false)}
      className="glass-widget group relative h-full w-[300px] overflow-hidden rounded-[22px]"
    >
      <button
        onClick={() => openSafariProject(project.id)}
        className="absolute inset-0 text-left"
        aria-label={`Buka project ${project.name} di Safari`}
      >
        <AnimatePresence initial={false}>
          <motion.img
            key={project.id}
            src={project.image}
            alt=""
            decoding="async"
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.04]"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.94)_0%,rgba(0,0,0,0.82)_38%,rgba(0,0,0,0.25)_68%,rgba(0,0,0,0.05)_100%)]" />

        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2 py-0.5 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-medium text-emerald-200">Live</span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-x-3 bottom-7 flex flex-col gap-0.5"
          >
            <span className="text-[10px] font-medium text-[var(--accent-300)]">{project.category}</span>
            <span className="line-clamp-1 text-[14px] font-semibold leading-tight text-white">
              {project.name}
            </span>
            <span className="line-clamp-1 text-[11px] text-white/65">{project.tagline}</span>
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Progress dots — also manual navigation */}
      <div className="absolute inset-x-3 bottom-2.5 flex gap-1">
        {showcase.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            aria-label={`Tampilkan ${p.name}`}
            className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/20"
          >
            {i === index && (
              <span
                key={`${p.id}-${paused}`}
                className="widget-progress absolute inset-0 rounded-full bg-white"
                style={{
                  animationDuration: `${ROTATE_MS}ms`,
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
            {i < index && <span className="absolute inset-0 rounded-full bg-white/70" />}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DesktopWidgets() {
  return (
    <motion.aside
      aria-label="Widget"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } } }}
      className="pointer-events-auto fixed right-6 top-[60px] z-[5] hidden h-[172px] gap-3 lg:flex [@media(max-height:680px)]:hidden"
    >
      {[ClockWidget, ShowcaseWidget].map((W, i) => (
        <motion.div
          key={i}
          variants={{
            hidden: { opacity: 0, y: -14, scale: 0.96, filter: "blur(6px)" },
            show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="h-full"
        >
          <W />
        </motion.div>
      ))}
    </motion.aside>
  );
}
