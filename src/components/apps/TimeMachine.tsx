"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { journey } from "@/lib/content";

// "My Journey" as macOS Time Machine: every role is a window snapshot
// stacked into the distance, newest in front. Scroll, the arrows or the
// year ruler travel back and forth through time.

const STEP_Y = 38; // how far each older snapshot sits up the stack
const STEP_SCALE = 0.075;

export default function TimeMachine() {
  const [active, setActive] = useState(0);
  const lastWheel = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const last = journey.length - 1;

  const go = (i: number) => setActive(Math.max(0, Math.min(last, i)));

  // Wheel travels one snapshot per gesture (throttled like the real thing).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const now = performance.now();
      if (now - lastWheel.current < 450 || Math.abs(e.deltaY) < 8) return;
      lastWheel.current = now;
      setActive((a) => Math.max(0, Math.min(last, a + (e.deltaY > 0 ? 1 : -1))));
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [last]);

  const current = journey[active];

  return (
    <div
      ref={rootRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowUp") go(active + 1);
        if (e.key === "ArrowDown") go(active - 1);
      }}
      aria-label="Riwayat pengalaman, gunakan panah atas dan bawah untuk berpindah"
      className="timemachine-space relative flex h-[400px] select-none overflow-hidden rounded-xl outline-none"
    >
      {/* the snapshot stack */}
      <div className="relative flex-1" style={{ perspective: 1200 }}>
        {journey.map((j, i) => {
          const depth = i - active;
          const passed = depth < 0; // newer than the one we travelled back to
          return (
            <motion.article
              key={j.title + j.period}
              onClick={() => depth > 0 && go(i)}
              initial={false}
              animate={
                passed
                  ? { y: 90, scale: 1.12, opacity: 0 }
                  : {
                      y: -depth * STEP_Y,
                      scale: 1 - depth * STEP_SCALE,
                      // dim with brightness, not opacity — translucent
                      // cards would let the snapshots behind bleed through
                      opacity: depth > 3 ? 0 : 1,
                      filter: `brightness(${1 - depth * 0.22})`,
                    }
              }
              transition={{ type: "spring", stiffness: 210, damping: 26 }}
              style={{ zIndex: 20 - depth, transformOrigin: "50% 0%", pointerEvents: passed ? "none" : "auto" }}
              className={`timemachine-card absolute inset-x-[7%] top-[96px] bottom-[48px] flex flex-col overflow-hidden rounded-xl ${
                depth > 0 ? "cursor-pointer" : ""
              }`}
            >
              <header className="hairline flex h-8 shrink-0 items-center gap-1.5 border-b px-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="flex-1 truncate text-center text-[11px] font-medium text-white/60">{j.company}</span>
                <span className="w-9" />
              </header>
              <div className={`min-h-0 flex-1 p-4 sm:p-5 ${depth === 0 ? "overflow-y-auto" : "overflow-hidden"}`}>
                <h3 className="text-[16px] font-semibold leading-snug text-white">{j.title}</h3>
                <p className="mt-0.5 text-[12px] text-accent-ink">
                  {j.type}, {j.period}
                </p>
                <p className="mt-3 text-[12.5px] leading-relaxed text-white/80">{j.description}</p>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {j.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[12px] leading-relaxed text-white/70">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-white/40" />
                      {b}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-[11.5px] text-white/50">{j.skills.join(", ")}</p>
              </div>
            </motion.article>
          );
        })}

        {/* the date under the stack, like Time Machine's "Today" label */}
        <div className="absolute inset-x-0 bottom-3 z-30 text-center">
          <motion.span
            key={current.period}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-full bg-black/45 px-3 py-1 text-[12px] font-medium text-[#fff] backdrop-blur-sm"
          >
            {active === 0 ? "Sekarang" : current.period}
          </motion.span>
        </div>
      </div>

      {/* travel controls + year ruler */}
      <nav className="z-30 flex w-16 shrink-0 flex-col items-center justify-center gap-2 py-4 pr-2">
        <button
          onClick={() => go(active + 1)}
          disabled={active === last}
          aria-label="Lebih lama"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[20px]">keyboard_arrow_up</span>
        </button>
        <ol className="flex flex-1 flex-col-reverse items-end justify-center gap-3">
          {journey.map((j, i) => (
            <li key={j.period}>
              <button
                onClick={() => go(i)}
                className={`flex items-center gap-1.5 text-right text-[10px] leading-tight transition-colors ${
                  i === active ? "font-semibold text-white" : "text-white/50 hover:text-white/80"
                }`}
              >
                <span className="max-w-[44px]">{j.year}</span>
                <span
                  className={`h-px transition-all ${i === active ? "w-4 bg-[var(--accent-400)]" : "w-2 bg-white/40"}`}
                />
              </button>
            </li>
          ))}
        </ol>
        <button
          onClick={() => go(active - 1)}
          disabled={active === 0}
          aria-label="Lebih baru"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
        </button>
      </nav>
    </div>
  );
}
