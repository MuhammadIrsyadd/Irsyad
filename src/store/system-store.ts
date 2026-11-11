import { create } from "zustand";
import { sound } from "@/lib/sound";

export type AppId = "finder" | "terminal" | "safari" | "mail" | "notes" | "photos" | "settings";

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
  dockOrder: AppId[];
  activeSafariProject: string | null;
  activeNoteId: string | null;

  setBootStage: (stage: BootStage) => void;
  unlock: () => void;
  lock: () => void;
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void;
  setAccent: (accent: AccentColor) => void;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  setSpotlightOpen: (open: boolean) => void;
  setHoveredApp: (id: AppId | null) => void;
  setWallpaper: (id: string) => void;
  setDockOrder: (order: AppId[]) => void;
  setActiveSafariProject: (id: string | null) => void;
  openSafariProject: (projectId: string) => void;
  setActiveNote: (id: string | null) => void;
  openNote: (noteId: string) => void;

  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  toggleMaximizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  moveWindow: (id: AppId, rect: Partial<Rect>) => void;
  snapWindow: (id: AppId, side: "left" | "right") => void;
};

const defaultRects: Record<AppId, Rect> = {
  finder: { x: 150, y: 70, width: 860, height: 560 },
  terminal: { x: 240, y: 120, width: 640, height: 420 },
  safari: { x: 190, y: 60, width: 920, height: 600 },
  mail: { x: 280, y: 100, width: 620, height: 520 },
  notes: { x: 210, y: 90, width: 700, height: 520 },
  photos: { x: 260, y: 80, width: 780, height: 560 },
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

const appOrder: AppId[] = ["finder", "terminal", "safari", "mail", "notes", "photos", "settings"];

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
  dockOrder: appOrder,
  activeSafariProject: null,
  activeNoteId: null,

  setBootStage: (stage) => set({ bootStage: stage }),
  unlock: () => set({ bootStage: "desktop" }),
  lock: () => {
    if (get().soundEnabled) sound.close();
    set({ bootStage: "login", spotlightOpen: false, hoveredApp: null });
  },
  setTheme: (theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", theme);
      if (theme === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      }
    }
    try {
      localStorage.setItem("porto_theme", theme);
    } catch {}
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    get().setTheme(next);
  },
  setAccent: (accent) => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-accent", accent);
    }
    try {
      localStorage.setItem("porto_accent", accent);
    } catch {}
    set({ accent });
  },
  setSoundEnabled: (enabled) => {
    try {
      localStorage.setItem("porto_sound", enabled ? "1" : "0");
    } catch {}
    set({ soundEnabled: enabled });
  },
  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      if (next) sound.toggle(); // audible confirmation the moment it's turned on
      try {
        localStorage.setItem("porto_sound", next ? "1" : "0");
      } catch {}
      return { soundEnabled: next };
    }),
  setSpotlightOpen: (open) => set({ spotlightOpen: open }),
  setHoveredApp: (id) => set({ hoveredApp: id }),
  setWallpaper: (id) => {
    try {
      localStorage.setItem("porto_wallpaper", id);
    } catch {}
    set({ wallpaperId: id });
  },
  setDockOrder: (order) => set({ dockOrder: order }),
  setActiveSafariProject: (id) => set({ activeSafariProject: id }),
  openSafariProject: (projectId) => {
    get().openApp("safari");
    set({ activeSafariProject: projectId });
  },
  setActiveNote: (id) => set({ activeNoteId: id }),
  openNote: (noteId) => {
    get().openApp("notes");
    set({ activeNoteId: noteId });
  },

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

  snapWindow: (id, side) => {
    if (get().soundEnabled) sound.maximize();
    const viewportW = typeof window !== "undefined" ? window.innerWidth : 1200;
    const viewportH = typeof window !== "undefined" ? window.innerHeight : 800;
    const menuBarH = 44;
    const dockClearance = 120;
    const gap = 10;
    const halfW = Math.floor((viewportW - gap * 3) / 2);
    const snapH = viewportH - menuBarH - dockClearance;
    const snapX = side === "left" ? gap : gap * 2 + halfW;
    const snapY = menuBarH + 8;

    set((s) => {
      const w = s.windows[id];
      return {
        windows: {
          ...s.windows,
          [id]: {
            ...w,
            isMaximized: false,
            preMaximizeRect: w.preMaximizeRect ?? w.rect,
            rect: { x: snapX, y: snapY, width: halfW, height: snapH },
          },
        },
      };
    });
  },
}));

export function isAnyWindowOpen(windows: Record<AppId, WindowState>) {
  return appOrder.some((id) => windows[id].isOpen && !windows[id].isMinimized);
}

export { appOrder };
