"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  Reorder,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { toPng } from "html-to-image";
import { getAppMeta } from "@/lib/apps";
import { sound } from "@/lib/sound";
import { useSystemStore, type AppId } from "@/store/system-store";

const ICON_BASE = 58;
const ICON_MAX = 88;
const MAGNIFY_RANGE = 120;

function DockIcon({
  id,
  label,
  icon,
  gradient,
  iconColor,
  mouseX,
  isOpen,
  isMinimized,
}: {
  id: AppId;
  label: string;
  icon: string;
  gradient: string;
  iconColor: string;
  mouseX: MotionValue<number>;
  isOpen: boolean;
  isMinimized: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const openApp = useSystemStore((s) => s.openApp);
  const focusApp = useSystemStore((s) => s.focusApp);
  const windows = useSystemStore((s) => s.windows);
  const minimizeApp = useSystemStore((s) => s.minimizeApp);
  const setHoveredApp = useSystemStore((s) => s.setHoveredApp);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const hoveredApp = useSystemStore((s) => s.hoveredApp);
  const isPeeking = hoveredApp === id && isOpen && !isMinimized;
  const [preview, setPreview] = useState<string | null>(null);

  // Grab a real live snapshot of the actual window's DOM while peeking —
  // not a literal screen-capture API (that needs a permission prompt),
  // but html-to-image serializes the window node into a PNG, which is
  // close enough for a hover preview and needs no dependencies beyond
  // the one small library.
  useEffect(() => {
    if (!isPeeking) return;
    let cancelled = false;
    const node = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
    if (!node) return;
    toPng(node, { pixelRatio: 0.35, cacheBust: false })
      .then((url) => {
        if (!cancelled) setPreview(url);
      })
      .catch(() => {
        if (!cancelled) setPreview(null);
      });
    return () => {
      cancelled = true;
    };
  }, [isPeeking, id]);

  const distance = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return MAGNIFY_RANGE + 1;
    return x - (rect.left + rect.width / 2);
  });

  const widthSync = useTransform(
    distance,
    [-MAGNIFY_RANGE, 0, MAGNIFY_RANGE],
    [ICON_BASE, ICON_MAX, ICON_BASE]
  );
  const width = useSpring(widthSync, { mass: 0.15, stiffness: 220, damping: 16 });

  function handleClick() {
    const w = windows[id];
    if (w.isOpen && !w.isMinimized) {
      minimizeApp(id);
    } else if (w.isOpen && w.isMinimized) {
      if (soundEnabled) sound.open();
      focusApp(id);
      useSystemStore.setState((s) => ({
        windows: { ...s.windows, [id]: { ...s.windows[id], isMinimized: false } },
      }));
    } else {
      openApp(id);
    }
  }

  return (
    <div className="group/dockitem relative flex flex-col items-center">
      {/* Peek preview — a real live snapshot of the window's own DOM
          (captured via html-to-image) once it's ready, falling back to a
          decorative icon card while it's capturing or if capture fails
          (e.g. the browser blocks canvas export for some reason). */}
      {isPeeking && (
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 26 }}
          className="pointer-events-none absolute -top-[132px] left-1/2 z-10 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-white/15 bg-black/80 shadow-2xl backdrop-blur-md"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-32 w-full bg-black object-cover object-top" />
          ) : (
            <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${gradient} opacity-80`}>
              <span className={`material-symbols-outlined icon-fill text-3xl ${iconColor}`}>{icon}</span>
            </div>
          )}
          <div className="flex items-center gap-1 border-t border-white/10 px-2.5 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="truncate text-[10px] font-medium text-white/80">{label} — dibuka</span>
          </div>
        </motion.div>
      )}

      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={handleClick}
        onHoverStart={() => setHoveredApp(id)}
        onHoverEnd={() => setHoveredApp(null)}
        title={label}
        whileTap={{ scale: 0.88 }}
        className="relative flex items-center justify-center overflow-visible"
      >
        <span
          className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover/dockitem:opacity-100 ${
            isPeeking ? "!opacity-0" : ""
          }`}
        >
          {label}
        </span>
        <span
          className={`flex h-full w-full items-center justify-center rounded-[16px] bg-gradient-to-b ${gradient} border border-white/25 shadow-[0_6px_18px_rgba(0,0,0,0.45)]`}
        >
          <span
            className={`material-symbols-outlined icon-fill ${iconColor}`}
            style={{ fontSize: "min(60%, 40px)" }}
          >
            {icon}
          </span>
        </span>
      </motion.button>
      <span
        className={`mt-1.5 h-1.5 w-1.5 rounded-full transition-opacity ${
          isOpen ? "bg-primary opacity-100 shadow-[0_0_6px_var(--accent-glow)]" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const windows = useSystemStore((s) => s.windows);
  const dockOrder = useSystemStore((s) => s.dockOrder);
  const setDockOrder = useSystemStore((s) => s.setDockOrder);

  return (
    <motion.footer
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.35 }}
      className="fixed inset-x-0 bottom-3 z-[950] flex justify-center"
    >
      <Reorder.Group
        as="div"
        axis="x"
        values={dockOrder}
        onReorder={setDockOrder}
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass-dock flex items-end gap-3 rounded-[22px] px-4 py-3"
      >
        {dockOrder.map((id, i) => {
          const app = getAppMeta(id);
          return (
            <Reorder.Item
              key={id}
              value={id}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 + i * 0.06, type: "spring", stiffness: 260, damping: 20 }}
              whileDrag={{ scale: 1.1, zIndex: 1 }}
              className="cursor-grab active:cursor-grabbing"
            >
              <DockIcon
                id={app.id}
                label={app.label}
                icon={app.icon}
                gradient={app.gradient}
                iconColor={app.iconColor}
                mouseX={mouseX}
                isOpen={windows[app.id].isOpen}
                isMinimized={windows[app.id].isMinimized}
              />
            </Reorder.Item>
          );
        })}
      </Reorder.Group>
    </motion.footer>
  );
}
