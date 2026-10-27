"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";
import { useSystemStore, type AppId } from "@/store/system-store";
import AppIcon from "@/components/icons/AppIcon";

const MENU_BAR_HEIGHT = 44;
const DOCK_CLEARANCE = 120;

export default function Window({
  id,
  title,
  children,
  headerExtra,
  minWidth = 340,
  minHeight = 260,
}: {
  id: AppId;
  title: string;
  children: ReactNode;
  headerExtra?: ReactNode;
  minWidth?: number;
  minHeight?: number;
}) {
  const w = useSystemStore((s) => s.windows[id]);
  const topZ = useSystemStore((s) => s.topZ);
  const closeApp = useSystemStore((s) => s.closeApp);
  const minimizeApp = useSystemStore((s) => s.minimizeApp);
  const toggleMaximizeApp = useSystemStore((s) => s.toggleMaximizeApp);
  const focusApp = useSystemStore((s) => s.focusApp);
  const moveWindow = useSystemStore((s) => s.moveWindow);

  const dragControls = useDragControls();
  const startRect = useRef(w.rect);
  const resizeStart = useRef({ width: 0, height: 0, pointerX: 0, pointerY: 0 });
  const [isResizing, setIsResizing] = useState(false);
  // True while the genie (minimize / restore) runs. Re-blurring a full
  // window's backdrop on every frame of that flight is what made it stutter,
  // so the glass turns solid for the duration and the blur comes back after.
  const [genieActive, setGenieActive] = useState(false);
  const [prevMinimized, setPrevMinimized] = useState(w.isMinimized);
  if (prevMinimized !== w.isMinimized) {
    setPrevMinimized(w.isMinimized);
    setGenieActive(true);
  }
  const isFocused = w.zIndex === topZ;

  function handleResizeStart(e: React.PointerEvent) {
    if (w.isMaximized) return;
    e.stopPropagation();
    focusApp(id);
    setIsResizing(true);
    resizeStart.current = {
      width: w.rect.width,
      height: w.rect.height,
      pointerX: e.clientX,
      pointerY: e.clientY,
    };
    function onMove(ev: PointerEvent) {
      const dx = ev.clientX - resizeStart.current.pointerX;
      const dy = ev.clientY - resizeStart.current.pointerY;
      moveWindow(id, {
        width: Math.max(minWidth, resizeStart.current.width + dx),
        height: Math.max(minHeight, resizeStart.current.height + dy),
      });
    }
    function onUp() {
      setIsResizing(false);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;

  const rect = w.isMaximized
    ? {
        x: 10,
        y: MENU_BAR_HEIGHT + 8,
        width: viewportW - 20,
        height: viewportH - MENU_BAR_HEIGHT - DOCK_CLEARANCE,
      }
    : w.rect;

  // Where this app's icon sits in the dock — the genie pours the window
  // into exactly that icon (falls back to the dock's centre).
  const icon =
    typeof document !== "undefined"
      ? document.querySelector(`[data-dock-id="${id}"]`)?.getBoundingClientRect()
      : undefined;
  const dock = icon
    ? { x: icon.left + icon.width / 2, y: icon.top + 6 }
    : { x: viewportW / 2, y: viewportH - 30 };
  // transformOrigin is bottom-centre, so put that point on the icon
  const target = { x: dock.x - rect.width / 2, y: dock.y - rect.height };

  // Genie: the window narrows into a funnel aimed at its icon while it is
  // pulled down, then pours in. The funnel neck starts over the icon's
  // horizontal position relative to the window and ends centred.
  const RECT = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";
  const neck = Math.max(12, Math.min(88, ((dock.x - rect.x) / rect.width) * 100));
  const genie = {
    x: [rect.x, rect.x + (target.x - rect.x) * 0.3, target.x],
    y: [rect.y, rect.y + (target.y - rect.y) * 0.55, target.y],
    scaleX: [1, 0.8, 0.1],
    scaleY: [1, 0.6, 0.05],
    clipPath: [
      RECT,
      `polygon(0% 0%, 100% 0%, ${neck + 14}% 100%, ${neck - 14}% 100%)`,
      "polygon(28% 0%, 72% 0%, 56% 100%, 44% 100%)",
    ],
    opacity: [1, 1, 0],
  };
  const genieTransition = { duration: 0.55, times: [0, 0.5, 1], ease: [0.5, 0, 0.9, 0.5] as const };
  // open / restore / maximize: a snappy, slightly over-springy pop
  const popTransition = { type: "spring" as const, stiffness: 360, damping: 24 };

  return (
    <motion.div
      key={id}
      drag
      dragListener={false}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => {
        startRect.current = w.rect;
      }}
      onDragEnd={(_e, info) => {
        moveWindow(id, {
          x: startRect.current.x + info.offset.x,
          y: Math.max(MENU_BAR_HEIGHT, startRect.current.y + info.offset.y),
        });
      }}
      onPointerDownCapture={() => focusApp(id)}
      onAnimationComplete={() => genieActive && setGenieActive(false)}
      initial={{
        opacity: 0,
        scale: 0.8,
        rotate: -3,
        x: rect.x,
        y: rect.y + 50,
        width: rect.width,
        height: rect.height,
        clipPath: RECT,
      }}
      animate={
        w.isMinimized
          ? { ...genie, rotate: 0, width: rect.width, height: rect.height, pointerEvents: "none" }
          : {
              opacity: 1,
              scale: 1,
              scaleX: 1,
              scaleY: 1,
              rotate: 0,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              clipPath: RECT,
              pointerEvents: "auto",
              // a clip-path would also clip the window's shadow, so drop it once settled
              transitionEnd: { clipPath: "none" },
            }
      }
      exit={{
        opacity: 0,
        scale: 0.08,
        x: target.x,
        y: target.y,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={
        w.isMinimized
          ? genieTransition
          : {
              default: popTransition,
              clipPath: { duration: 0.3, ease: "easeOut" },
              // While actively dragging the resize handle, width/height
              // should track the cursor 1:1 — springing them in on every
              // pointermove would feel laggy instead of direct.
              width: { duration: isResizing ? 0 : undefined },
              height: { duration: isResizing ? 0 : undefined },
            }
      }
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        minWidth,
        minHeight,
        zIndex: w.zIndex,
        transformOrigin: "bottom center",
      }}
      data-window-id={id}
      className={`glass-window pointer-events-auto flex flex-col overflow-hidden rounded-window ${
        isFocused ? "is-focused" : "opacity-95"
      } ${genieActive || w.isMinimized ? "is-genie" : ""}`}
    >
      {/* Title bar */}
      <div
        onPointerDown={(e) => {
          focusApp(id);
          if (!w.isMaximized) dragControls.start(e);
        }}
        onDoubleClick={() => toggleMaximizeApp(id)}
        className="relative flex h-[46px] shrink-0 cursor-default items-center justify-between border-b border-white/10 bg-gradient-to-b from-white/10 to-transparent px-4 select-none"
      >
        <div className="traffic-lights flex items-center gap-2.5">
          {[
            { label: "Close", onClick: () => closeApp(id), color: "bg-traffic-close shadow-[0_0_6px_rgba(255,95,86,0.6)]", glyph: "M4 4l6 6M10 4l-6 6" },
            { label: "Minimize", onClick: () => minimizeApp(id), color: "bg-traffic-minimize shadow-[0_0_6px_rgba(255,189,46,0.6)]", glyph: "M3.5 7h7" },
            {
              label: "Zoom",
              onClick: () => toggleMaximizeApp(id),
              color: "bg-traffic-maximize shadow-[0_0_6px_rgba(39,201,63,0.6)]",
              glyph: w.isMaximized ? "M7.5 2.5v4h4M6.5 11.5v-4h-4" : "M3 7h8M7 3v8",
            },
          ].map((b) => (
            <button
              key={b.label}
              aria-label={b.label}
              title={b.label}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={b.onClick}
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full transition-transform hover:brightness-110 active:scale-90 ${b.color} ${
                isFocused ? "" : "traffic-dim"
              }`}
            >
              <svg viewBox="0 0 14 14" className="traffic-glyph h-2.5 w-2.5 text-black/60" aria-hidden>
                <path d={b.glyph} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          ))}
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-white/90">
          <AppIcon id={id} className="h-4 w-4" />
          <span className="text-[14px] font-medium tracking-tight">{title}</span>
        </div>

        <div onPointerDown={(e) => e.stopPropagation()}>{headerExtra}</div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>

      {/* Resize handle */}
      {!w.isMaximized && (
        <div
          onPointerDown={handleResizeStart}
          title="Resize"
          className="group/resize absolute bottom-0 right-0 h-5 w-5 cursor-nwse-resize touch-none"
        >
          <svg
            viewBox="0 0 16 16"
            className="absolute bottom-1 right-1 h-2.5 w-2.5 text-white/25 transition-colors group-hover/resize:text-white/60"
          >
            <path
              d="M14 2 2 14M14 8 8 14M14 14h.01"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
