"use client";

import AppFrame from "@/components/AppFrame";
import SuryaMajapahit from "@/components/icons/SuryaMajapahit";
import { useSystemStore, type AccentColor } from "@/store/system-store";
import { useCurrentWallpaper, useWallpapers } from "@/components/WallpaperProvider";

const accents: { id: AccentColor; label: string; className: string }[] = [
  { id: "amber", label: "Amber", className: "bg-amber-400" },
  { id: "violet", label: "Violet", className: "bg-purple-400" },
  { id: "cyan", label: "Cyan", className: "bg-cyan-400" },
  { id: "coral", label: "Coral", className: "bg-rose-400" },
];

const stack = ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS v4", "Framer Motion", "Zustand"];

// System Settings layout: quiet section titles over grouped, hairline-
// separated rows.
function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-1.5">
      <h2 className="px-1 text-[12px] font-semibold text-white/60">{title}</h2>
      <div className="hairline overflow-hidden rounded-xl border bg-white/5 [&>*+*]:border-t [&>*+*]:border-[rgba(127,127,127,0.2)]">
        {children}
      </div>
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`relative inline-flex h-6 w-11 shrink-0 appearance-none items-center rounded-full border-0 p-0 transition-colors ${
        checked ? "bg-[var(--accent-500)]" : "bg-white/15"
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
  const theme = useSystemStore((s) => s.theme);
  const toggleTheme = useSystemStore((s) => s.toggleTheme);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const toggleSound = useSystemStore((s) => s.toggleSound);
  const wallpaperId = useSystemStore((s) => s.wallpaperId);
  const wallpapers = useWallpapers();
  const currentWallpaper = useCurrentWallpaper(wallpaperId);
  const setWallpaper = useSystemStore((s) => s.setWallpaper);

  return (
    <AppFrame id="settings" title="Settings" minWidth={380}>
      <div className="flex flex-col gap-5 p-4 sm:p-5">
        <Group title="Tampilan">
          <div className="flex items-center justify-between px-3.5 py-3">
            <div className="flex flex-col">
              <span className="text-[13px] text-white">Mode terang</span>
              <span className="text-[11.5px] text-white/50">
                {theme === "dark" ? "Sekarang mode gelap (default)" : "Sekarang mode terang"}
              </span>
            </div>
            <Toggle checked={theme === "light"} onChange={toggleTheme} label="Ganti mode terang dan gelap" />
          </div>

          <div className="flex items-center justify-between px-3.5 py-3">
            <span className="text-[13px] text-white">Warna aksen</span>
            <div className="flex gap-2.5">
              {accents.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAccent(a.id)}
                  title={a.label}
                  aria-label={a.label}
                  className={`h-5 w-5 rounded-full ${a.className} ${
                    accent === a.id ? "ring-2 ring-white ring-offset-2 ring-offset-surface" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="px-3.5 py-3">
            <span className="mb-2.5 block text-[13px] text-white">Wallpaper</span>
            <div className="grid grid-cols-3 gap-2.5">
              {wallpapers.map((w) => (
                <button key={w.id} onClick={() => setWallpaper(w.id)} aria-label={w.label}>
                  <span
                    style={{ backgroundImage: `url(${w.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                    className={`block h-16 w-full rounded-lg border-2 transition-transform hover:scale-[1.03] ${
                      currentWallpaper?.id === w.id ? "border-[var(--accent-400)]" : "border-transparent"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </Group>

        <Group title="Suara">
          <div className="flex items-center justify-between px-3.5 py-3">
            <div className="flex flex-col">
              <span className="text-[13px] text-white">Efek suara UI</span>
              <span className="text-[11.5px] text-white/50">Klik pelan ala macOS saat buka jendela</span>
            </div>
            <Toggle checked={soundEnabled} onChange={toggleSound} label="Efek suara UI" />
          </div>
        </Group>

        <Group title="Tentang portfolio ini">
          <div className="flex gap-3.5 px-3.5 py-3.5">
            <SuryaMajapahit className="h-11 w-11 shrink-0" color="#f2a94e" title="Surya Majapahit" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[13px] font-semibold text-white">Portfolio OS</span>
              <p className="text-[12px] leading-relaxed text-white/70">
                Portofolio ini dibangun sebagai simulasi desktop macOS bermaterial Liquid Glass, lengkap dengan
                window system, dock magnify, dan boot sequence. Emblemnya Surya Majapahit, lambang kerajaan yang dulu berpusat di Mojokerto.
              </p>
              <p className="text-[11.5px] text-white/50">Dibangun dengan {stack.join(", ")}.</p>
            </div>
          </div>
        </Group>
      </div>
    </AppFrame>
  );
}
