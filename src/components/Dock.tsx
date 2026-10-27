"use client";

import { memo, useEffect, useRef, useState, type RefObject } from "react";
import {
  AnimatePresence,
  motion,
  Reorder,
  useAnimate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { getAppMeta } from "@/lib/apps";
import { sound } from "@/lib/sound";
import { useSystemStore, type AppId } from "@/store/system-store";
import { preloadApp } from "@/components/apps/OpenApps";
import AppIcon from "@/components/icons/AppIcon";
import TrashPanel from "@/components/TrashPanel";

const ICON_BASE = 58;
const ICON_MAX = 88;
const MAGNIFY_RANGE = 120;

/** macOS magnification: icon size follows the cursor's distance along the dock. */
function useMagnify(ref: RefObject<HTMLElement | null>, mouseX: MotionValue<number>) {
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
  return useSpring(widthSync, { mass: 0.15, stiffness: 220, damping: 16 });
}

function Tooltip({ label, hidden }: { label: string; hidden?: boolean }) {
  return (
    <span
      className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2.5 py-1.5 text-[12px] font-medium text-white opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover/dockitem:opacity-100 ${
        hidden ? "!opacity-0" : ""
      }`}
    >
      {label}
    </span>
  );
}

const DockIcon = memo(function DockIcon({
  id,
  label,
  mouseX,
  isOpen,
  isMinimized,
}: {
  id: AppId;
  label: string;
  mouseX: MotionValue<number>;
  isOpen: boolean;
  isMinimized: boolean;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const openApp = useSystemStore((s) => s.openApp);
  const focusApp = useSystemStore((s) => s.focusApp);
  const minimizeApp = useSystemStore((s) => s.minimizeApp);
  const setHoveredApp = useSystemStore((s) => s.setHoveredApp);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const hoveredApp = useSystemStore((s) => s.hoveredApp);
  const isPeeking = hoveredApp === id && isOpen && !isMinimized;
  const [preview, setPreview] = useState<string | null>(null);
  const width = useMagnify(ref, mouseX);

  // Grab a real live snapshot of the actual window's DOM while peeking —
  // not a literal screen-capture API (that needs a permission prompt),
  // but html-to-image serializes the window node into a PNG, which is
  // close enough for a hover preview.
  useEffect(() => {
    if (!isPeeking) return;
    let cancelled = false;
    const node = document.querySelector<HTMLElement>(`[data-window-id="${id}"]`);
    if (!node) return;
    // html-to-image is only needed for this hover preview, so it is fetched
    // the first time someone peeks instead of shipping with the dock.
    import("html-to-image")
      .then(({ toPng }) => toPng(node, { pixelRatio: 0.35, cacheBust: false, skipFonts: true }))
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

  // macOS launch bounce: the icon hops when its app goes from closed to open.
  const [bounceScope, animateBounce] = useAnimate<HTMLSpanElement>();
  const wasOpen = useRef(isOpen);
  useEffect(() => {
    if (isOpen && !wasOpen.current && bounceScope.current) {
      animateBounce(
        bounceScope.current,
        { y: [0, -20, 0, -8, 0] },
        { duration: 0.85, times: [0, 0.3, 0.55, 0.75, 1], ease: "easeOut" }
      );
    }
    wasOpen.current = isOpen;
  }, [isOpen, animateBounce, bounceScope]);

  function handleClick() {
    // read at click time instead of subscribing every icon to all windows
    const w = useSystemStore.getState().windows[id];
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
      {/* Peek preview — a live snapshot of the window's own DOM once it's
          ready, falling back to the app icon while it's capturing. */}
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
            <div className="flex h-32 items-center justify-center bg-white/5">
              <AppIcon id={id} className="h-14 w-14" />
            </div>
          )}
          <div className="border-t border-white/10 px-2.5 py-1.5 text-[10px] font-medium text-white/80">
            {label}
          </div>
        </motion.div>
      )}

      <motion.button
        ref={ref}
        data-dock-id={id}
        style={{ width, height: width }}
        onClick={handleClick}
        onHoverStart={() => {
          setHoveredApp(id);
          preloadApp(id);
        }}
        onHoverEnd={() => setHoveredApp(null)}
        aria-label={label}
        whileTap={{ scale: 0.88 }}
        className="relative flex items-center justify-center overflow-visible"
      >
        <Tooltip label={label} hidden={isPeeking} />
        <span ref={bounceScope} className="relative block h-full w-full">
          <AppIcon id={id} className="h-full w-full drop-shadow-[0_5px_10px_rgba(0,0,0,0.4)]" />
        </span>
      </motion.button>
      <span
        className={`mt-1.5 h-1.5 w-1.5 rounded-full transition-opacity ${
          isOpen ? "bg-white/85 opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
});

function TrashIcon({ mouseX, onOpen }: { mouseX: MotionValue<number>; onOpen: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const width = useMagnify(ref, mouseX);
  return (
    <div className="group/dockitem relative flex flex-col items-center">
      <motion.button
        ref={ref}
        style={{ width, height: width }}
        onClick={onOpen}
        aria-label="Trash"
        whileTap={{ scale: 0.88 }}
        className="relative flex items-center justify-center"
      >
        <Tooltip label="Trash" />
        <AppIcon id="trash" className="h-full w-full drop-shadow-[0_5px_10px_rgba(0,0,0,0.35)]" />
      </motion.button>
      <span className="mt-1.5 h-1.5 w-1.5" />
    </div>
  );
}

export default function Dock() {
  const mouseX = useMotionValue(Infinity);
  const windows = useSystemStore((s) => s.windows);
  const dockOrder = useSystemStore((s) => s.dockOrder);
  const setDockOrder = useSystemStore((s) => s.setDockOrder);
  const [trashOpen, setTrashOpen] = useState(false);

  return (
    <>
      <motion.footer
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.35 }}
        className="fixed inset-x-0 bottom-3 z-[950] flex justify-center"
      >
        <div
          onMouseMove={(e) => mouseX.set(e.clientX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          className="glass-dock flex items-end gap-3 rounded-[22px] px-4 pb-1.5 pt-3"
        >
          <Reorder.Group as="div" axis="x" values={dockOrder} onReorder={setDockOrder} className="flex items-end gap-3">
            {dockOrder.map((id, i) => {
              const app = getAppMeta(id);
              return (
                <Reorder.Item
                  as="div"
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
                    mouseX={mouseX}
                    isOpen={windows[app.id].isOpen}
                    isMinimized={windows[app.id].isMinimized}
                  />
                </Reorder.Item>
              );
            })}
          </Reorder.Group>

          {/* separator between apps and the Trash, like the real dock */}
          <span className="mb-4 h-12 w-px self-end bg-white/25" aria-hidden />

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 + dockOrder.length * 0.06, type: "spring", stiffness: 260, damping: 20 }}
          >
            <TrashIcon mouseX={mouseX} onOpen={() => setTrashOpen(true)} />
          </motion.div>
        </div>
      </motion.footer>

      <AnimatePresence>{trashOpen && <TrashPanel onClose={() => setTrashOpen(false)} />}</AnimatePresence>
    </>
  );
}
