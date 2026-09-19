import { create } from "zustand";
import { sound } from "@/lib/sound";

export type AppId = "finder" | "terminal" | "safari" | "mail" | "settings";

export type BootStage = "boot" | "login" | "desktop";

export type Rect = { x: number; y: number; width: number; height: number };

export type WindowState = {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  rect: Rect;
  preMaximizeRect: Rect | null;
};

export type AccentColor = "amber" | "violet" | "cyan" | "coral";

type SystemState = {
  bootStage: BootStage;
  theme: "dark" | "light";
  accent: AccentColor;
  soundEnabled: boolean;
  spotlightOpen: boolean;
  topZ: number;
  windows: Record<AppId, WindowState>;
  hoveredApp: AppId | null;
  wallpaperId: string;

  setBootStage: (stage: BootStage) => void;
  unlock: () => void;
  lock: () => void;
  toggleTheme: () => void;
  setAccent: (accent: AccentColor) => void;
  toggleSound: () => void;
  setSpotlightOpen: (open: boolean) => void;
  setHoveredApp: (id: AppId | null) => void;
  setWallpaper: (id: string) => void;

  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  moveWindow: (id: AppId, rect: Partial<Rect>) => void;
};

const defaultRects: Record<AppId, Rect> = {
  finder: { x: 150, y: 70, width: 860, height: 560 },
  terminal: { x: 240, y: 120, width: 640, height: 420 },
  safari: { x: 190, y: 60, width: 920, height: 600 },
  mail: { x: 280, y: 100, width: 620, height: 520 },
  settings: { x: 320, y: 140, width: 560, height: 460 },
};

function makeWindow(id: AppId): WindowState {
  return {
    id,
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    rect: defaultRects[id],
    preMaximizeRect: null,
  };
}

const appOrder: AppId[] = ["finder", "terminal", "safari", "mail", "settings"];

export const useSystemStore = create<SystemState>((set, get) => ({
  bootStage: "boot",
  theme: "dark",
  accent: "amber",
  soundEnabled: false,
  spotlightOpen: false,
  topZ: 10,
  windows: Object.fromEntries(appOrder.map((id) => [id, makeWindow(id)])) as Record<
    AppId,
    WindowState
  >,
  hoveredApp: null,
  wallpaperId: "wallpaper1", // default; falls back to the first discovered wallpaper if missing

  setBootStage: (stage) => set({ bootStage: stage }),
  unlock: () => set({ bootStage: "desktop" }),
  lock: () => {
    if (get().soundEnabled) sound.close();
    set({ bootStage: "login", spotlightOpen: false, hoveredApp: null });
  },
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === "dark" ? "light" : "dark";
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
      }
      return { theme: next };
    }),
  setAccent: (accent) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-accent", accent);
    }
    set({ accent });
  },
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      if (next) sound.toggle(); // audible confirmation the moment it's turned on
      return { soundEnabled: next };
    }),
  setSpotlightOpen: (open) => set({ spotlightOpen: open }),
  setHoveredApp: (id) => set({ hoveredApp: id }),
  setWallpaper: (id) => set({ wallpaperId: id }),

  openApp: (id) => {
    const nextZ = get().topZ + 1;
    if (get().soundEnabled) sound.open();
    set((s) => ({
      topZ: nextZ,
      windows: {
        ...s.windows,
        [id]: {
          ...s.windows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
        },
      },
    }));
  },

  closeApp: (id) => {
    if (get().soundEnabled) sound.close();
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], isOpen: false, isMinimized: false },
      },
    }));
  },

  minimizeApp: (id) => {
    if (get().soundEnabled) sound.minimize();
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], isMinimized: true } },
    }));
  },

  toggleMaximizeApp: (id) => {
    if (get().soundEnabled) sound.maximize();
    set((s) => {
      const w = s.windows[id];
      if (!w.isMaximized) {
        return {
          windows: {
            ...s.windows,
            [id]: { ...w, isMaximized: true, preMaximizeRect: w.rect },
          },
        };
      }
      return {
        windows: {
          ...s.windows,
          [id]: {
            ...w,
            isMaximized: false,
            rect: w.preMaximizeRect ?? w.rect,
            preMaximizeRect: null,
          },
        },
      };
    });
  },

  focusApp: (id) => {
    const nextZ = get().topZ + 1;
    set((s) => ({
      topZ: nextZ,
      windows: { ...s.windows, [id]: { ...s.windows[id], zIndex: nextZ } },
    }));
  },

  moveWindow: (id, rect) =>
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], rect: { ...s.windows[id].rect, ...rect } },
      },
    })),
}));

export function isAnyWindowOpen(windows: Record<AppId, WindowState>) {
  return appOrder.some((id) => windows[id].isOpen && !windows[id].isMinimized);
}

export { appOrder };
