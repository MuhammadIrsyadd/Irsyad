"use client";

import { useEffect } from "react";
import { useSystemStore, appOrder, type AppId } from "@/store/system-store";

/** Cmd/Ctrl+1..N opens (or toggles) the Nth dock app, in `appOrder`. */
export function useAppShortcuts() {
  const openApp = useSystemStore((s) => s.openApp);
  const minimizeApp = useSystemStore((s) => s.minimizeApp);
  const focusApp = useSystemStore((s) => s.focusApp);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!(e.metaKey || e.ctrlKey) || e.altKey || e.shiftKey) return;
      const n = Number(e.key);
      if (!Number.isInteger(n) || n < 1 || n > appOrder.length) return;

      e.preventDefault();
      const id: AppId = appOrder[n - 1];
      const w = useSystemStore.getState().windows[id];

      if (w.isOpen && !w.isMinimized) {
        minimizeApp(id);
      } else if (w.isOpen && w.isMinimized) {
        focusApp(id);
        useSystemStore.setState((s) => ({
          windows: { ...s.windows, [id]: { ...s.windows[id], isMinimized: false } },
        }));
      } else {
        openApp(id);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openApp, minimizeApp, focusApp]);
}
