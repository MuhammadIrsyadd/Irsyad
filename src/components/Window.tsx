"use client";

import { useRef, useState, type ReactNode } from "react";
import { motion, useDragControls } from "framer-motion";
import { useSystemStore, type AppId } from "@/store/system-store";

const MENU_BAR_HEIGHT = 44;
const DOCK_CLEARANCE = 120;

export default function Window({
  id,
  title,
  icon,
  children,
  headerExtra,
  minWidth = 340,
  minHeight = 260,
}: {
  id: AppId;
  title: string;
  icon?: ReactNode;
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

  const dockTarget = { x: viewportW / 2 - 20, y: viewportH - 24 };

  // Distinct "genie" feel per action: minimize/close both suck the window
  // toward the dock (scale + travel + a slight wobble + a soft dissolve
  // blur), while open/restore/maximize use a snappier, slightly
  // over-springy pop so resizing reads as a deliberate, weighted motion
  // rather than a flat snap.
  const genieTransition = { type: "spring" as const, stiffness: 260, damping: 22 };
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
      initial={{
        opacity: 0,
        scale: 0.8,
        rotate: -3,
        x: rect.x,
        y: rect.y + 50,
        width: rect.width,
        height: rect.height,
        filter: "blur(0px)",
      }}
      animate={
        w.isMinimized
          ? {
              opacity: 0,
              scale: 0.1,
              rotate: -8,
              x: dockTarget.x,
              y: dockTarget.y,
              width: rect.width,
              height: rect.height,
              filter: "blur(4px)",
              pointerEvents: "none",
            }
          : {
              opacity: 1,
              scale: 1,
              rotate: 0,
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
              filter: "blur(0px)",
              pointerEvents: "auto",
            }
      }
      exit={{
        opacity: 0,
        scale: 0.08,
        rotate: 6,
        x: dockTarget.x,
        y: dockTarget.y,
        filter: "blur(5px)",
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
      }}
      transition={
        w.isMinimized
          ? genieTransition
          : {
              default: popTransition,
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
      }`}
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
        <div className="flex items-center gap-2.5">
          <button
            aria-label="Close"
            title="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeApp(id)}
            className="h-3.5 w-3.5 rounded-full bg-traffic-close shadow-[0_0_6px_rgba(255,95,86,0.6)] transition-transform hover:brightness-110 active:scale-90"
          />
          <button
            aria-label="Minimize"
            title="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeApp(id)}
            className="h-3.5 w-3.5 rounded-full bg-traffic-minimize shadow-[0_0_6px_rgba(255,189,46,0.6)] transition-transform hover:brightness-110 active:scale-90"
          />
          <button
            aria-label="Zoom"
            title="Zoom"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => toggleMaximizeApp(id)}
            className="h-3.5 w-3.5 rounded-full bg-traffic-maximize shadow-[0_0_6px_rgba(39,201,63,0.6)] transition-transform hover:brightness-110 active:scale-90"
          />
        </div>

        <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 text-white/90">
          {icon}
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
