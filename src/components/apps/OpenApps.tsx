"use client";

import { memo } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import { appOrder, useSystemStore, type AppId } from "@/store/system-store";

// Every app lives in its own chunk and is only downloaded the first time
// it's opened (or hovered in the dock — see preloadApp), so the desktop
// itself boots with a much smaller bundle.
const loaders = {
  finder: () => import("@/components/apps/FinderApp"),
  terminal: () => import("@/components/apps/TerminalApp"),
  safari: () => import("@/components/apps/SafariApp"),
  mail: () => import("@/components/apps/MailApp"),
  notes: () => import("@/components/apps/NotesApp"),
  photos: () => import("@/components/apps/PhotosApp"),
  settings: () => import("@/components/apps/SettingsApp"),
} satisfies Record<AppId, () => Promise<unknown>>;

// memo: opening, focusing or minimizing one window changes the store's
// `windows` map, and without it every open app's whole tree would
// re-render on each of those changes. Each app's Window subscribes to its
// own slice of the store, so it still updates when it needs to.
const views: Record<AppId, React.ComponentType> = {
  finder: memo(dynamic(() => import("@/components/apps/FinderApp"), { ssr: false })),
  terminal: memo(dynamic(() => import("@/components/apps/TerminalApp"), { ssr: false })),
  safari: memo(dynamic(() => import("@/components/apps/SafariApp"), { ssr: false })),
  mail: memo(dynamic(() => import("@/components/apps/MailApp"), { ssr: false })),
  notes: memo(dynamic(() => import("@/components/apps/NotesApp"), { ssr: false })),
  photos: memo(dynamic(() => import("@/components/apps/PhotosApp"), { ssr: false })),
  settings: memo(dynamic(() => import("@/components/apps/SettingsApp"), { ssr: false })),
};

/** Warm an app's chunk ahead of the click (dock hover, spotlight, ...). */
export function preloadApp(id: AppId) {
  void loaders[id]();
}

export default function OpenApps() {
  const windows = useSystemStore((s) => s.windows);

  return (
    <AnimatePresence>
      {appOrder
        .filter((id) => windows[id].isOpen)
        .map((id) => {
          const View = views[id];
          return <View key={id} />;
        })}
    </AnimatePresence>
  );
}
