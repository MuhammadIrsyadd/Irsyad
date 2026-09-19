"use client";

import AppFrame from "@/components/AppFrame";
import { useSystemStore, type AccentColor } from "@/store/system-store";
import { useCurrentWallpaper, useWallpapers } from "@/components/WallpaperProvider";

const accents: { id: AccentColor; label: string; className: string }[] = [
  { id: "amber", label: "Amber", className: "bg-amber-400" },
  { id: "violet", label: "Violet", className: "bg-purple-400" },
  { id: "cyan", label: "Cyan", className: "bg-cyan-400" },
  { id: "coral", label: "Coral", className: "bg-rose-400" },
];

const stack = [
  "Next.js 16 (App Router)",
  "TypeScript",
  "Tailwind CSS v4",
  "Framer Motion",
  "Zustand",
];

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative inline-flex h-6 w-11 shrink-0 appearance-none items-center rounded-full border-0 p-0 transition-colors ${
        checked ? "bg-primary-container" : "bg-white/15"
      }`}
    >
      <span
        className={`absolute left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[22px]" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function SettingsApp() {
  const accent = useSystemStore((s) => s.accent);
  const setAccent = useSystemStore((s) => s.setAccent);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const toggleSound = useSystemStore((s) => s.toggleSound);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const wallpapers = useWallpapers();
  const currentWallpaper = useCurrentWallpaper(wallpaperId);
  const setWallpaper = useSystemStore((s) => s.setWallpaper);

  return (
    <AppFrame
      id="settings"
      title="Settings"
      icon={<span className="material-symbols-outlined text-[15px] text-white/70">settings</span>}
      minWidth={380}
    >
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <section className="flex flex-col gap-2.5">
          <span className="px-1 font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-white/40">
            Appearance
          </span>
          <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
            <span className="mb-2.5 block text-[13px] text-white">Accent Color</span>
            <div className="flex gap-3">
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  className="flex flex-col items-center gap-1.5"
                  title={a.label}
                >
                  <span
                    className={`h-7 w-7 rounded-full ${a.className} ${
                      accent === a.id ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-3">
            <span className="mb-2.5 block text-[13px] text-white">Wallpaper</span>
            <div className="grid grid-cols-3 gap-2.5">
              {wallpapers.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setWallpaper(w.id)}
                  className="flex flex-col items-center gap-1"
                  aria-label={w.label}
                >
                  <span
                    style={{
                      backgroundImage: `url(${w.src})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    className={`h-16 w-full rounded-lg border-2 transition-transform hover:scale-[1.03] ${
                      currentWallpaper?.id === w.id
                        ? "border-white shadow-[0_0_0_2px_var(--accent-500)]"
                        : "border-white/15"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <span className="px-1 font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-white/40">
            System
          </span>
          <Row>
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-white/70">volume_up</span>
              <div className="flex flex-col">
                <span className="text-[13px] text-white">UI Sound Effects</span>
                <span className="text-[11px] text-white/40">Klik pelan ala macOS saat buka window</span>
              </div>
            </div>
            <Toggle checked={soundEnabled} onChange={toggleSound} label="Toggle UI sound effects" />
          </Row>
        </section>

        <section className="flex flex-col gap-2.5">
          <span className="px-1 font-mono-ui text-[10px] font-semibold uppercase tracking-widest text-white/40">
            About This Portfolio
          </span>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
            <p className="mb-3 text-[12px] leading-relaxed text-white/70">
              Portofolio ini dibangun sebagai simulasi desktop macOS bermaterial Liquid Glass —
              lengkap dengan window system, dock magnify, dan boot sequence.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/70"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}
