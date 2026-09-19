"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { appRegistry } from "@/lib/apps";
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
}: {
  id: AppId;
  label: string;
  icon: string;
  gradient: string;
  iconColor: string;
  mouseX: MotionValue<number>;
  isOpen: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const openApp = useSystemStore((s) => s.openApp);
  const focusApp = useSystemStore((s) => s.focusApp);
  const windows = useSystemStore((s) => s.windows);
  const minimizeApp = useSystemStore((s) => s.minimizeApp);
  const setHoveredApp = useSystemStore((s) => s.setHoveredApp);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);

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
          className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover/dockitem:opacity-100`}
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

  return (
    <motion.footer
      initial={{ y: 90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.35 }}
      className="fixed inset-x-0 bottom-3 z-[950] flex justify-center"
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="glass-dock flex items-end gap-3 rounded-[22px] px-4 py-3"
      >
        {appRegistry.map((app, i) => (
          <motion.div
            key={app.id}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.06, type: "spring", stiffness: 260, damping: 20 }}
          >
            <DockIcon
              id={app.id}
              label={app.label}
              icon={app.icon}
              gradient={app.gradient}
              iconColor={app.iconColor}
              mouseX={mouseX}
              isOpen={windows[app.id].isOpen}
            />
          </motion.div>
        ))}
      </motion.div>
    </motion.footer>
  );
}
