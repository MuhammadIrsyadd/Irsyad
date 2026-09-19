"use client";

import { useState } from "react";
import AppFrame from "@/components/AppFrame";
import { journey, profile, values } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const tabs = [
  { id: "overview", label: "Overview", icon: "badge" },
  { id: "journey", label: "My Journey", icon: "auto_stories" },
  { id: "values", label: "Philosophy", icon: "psychology" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function FinderApp() {
  const [tab, setTab] = useState<TabId>("overview");
  const openApp = useSystemStore((s) => s.openApp);

  return (
    <AppFrame
      id="finder"
      title="Finder — About Me"
      icon={<span className="material-symbols-outlined icon-fill text-[15px] text-amber-400">folder_shared</span>}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside className="flex flex-col justify-between border-r border-white/10 bg-black/20 p-3">
          <div className="flex flex-col gap-1">
            <span className="mb-1 px-2 font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/40">
              Favorites
            </span>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12px] transition-all ${
                  tab === t.id
                    ? "border border-[var(--accent-400)]/30 bg-gradient-to-r from-[var(--accent-500)]/25 to-[var(--accent-500)]/5 font-semibold text-[var(--accent-300)]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border-t border-white/10 bg-black/20 p-2.5 pt-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-terminal-green" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-medium text-white/90">{profile.availability}</span>
              <span className="text-[9px] text-white/50">Liquid Glass OS</span>
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-5 overflow-y-auto p-4 sm:p-6">
          {tab === "overview" && (
            <>
              <section className="relative shrink-0 overflow-hidden rounded-2xl border border-[var(--accent-500)]/30 bg-gradient-to-br from-white/8 to-black/20 p-5">
                <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-gradient-to-bl from-[var(--accent-500)]/20 via-purple-600/15 to-transparent blur-2xl" />
                <div className="relative z-10 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-[var(--accent-400)]/40 via-purple-500/30 to-black/80 p-1 shadow-2xl">
                    <img
                      src="/images/avatar.png"
                      alt={profile.name}
                      className="h-full w-full rounded-xl object-cover object-top"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                      <span className="flex items-center gap-1.5 rounded-full border border-[var(--accent-500)]/40 bg-[var(--accent-500)]/20 px-2.5 py-0.5 text-[10px] text-[var(--accent-300)]">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-400)]" />
                        {profile.availability}
                      </span>
                      <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[10px] text-white/80">
                        📍 {profile.location}
                      </span>
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">{profile.name}</h1>
                    <span className="text-sm font-medium tracking-tight text-[var(--accent-400)]">{profile.role}</span>
                    <p className="text-xs leading-relaxed text-white/75">{profile.tagline}</p>
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1 sm:justify-start">
                      <a
                        href="/resume.pdf"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] px-3.5 py-1.5 text-xs font-semibold text-black shadow-[0_4px_16px_var(--accent-glow)] transition-transform active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm font-bold">download</span>
                        Download CV
                      </a>
                      <button
                        onClick={() => openApp("mail")}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-transform active:scale-95"
                      >
                        <span className="material-symbols-outlined text-sm">send</span>
                        Get in touch
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-3.5 transition-colors hover:border-[var(--accent-400)]/40"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--accent-400)]/30 bg-[var(--accent-500)]/20 text-[var(--accent-400)]">
                      <span className="material-symbols-outlined text-lg">{v.icon}</span>
                    </div>
                    <span className="text-xs font-semibold text-white">{v.title}</span>
                    <span className="text-[11px] leading-snug text-white/60">{v.description}</span>
                  </div>
                ))}
              </section>
            </>
          )}

          {tab === "journey" && (
            <section className="flex flex-col gap-3">
              <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                My Journey
              </span>
              <div className="relative flex flex-col gap-4 pl-4">
                <div className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />
                {journey.map((j) => (
                  <div key={j.title} className="relative">
                    <span className="absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-black bg-[var(--accent-400)] shadow-[0_0_8px_var(--accent-glow)]" />
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <span className="font-mono-ui text-[10px] uppercase tracking-wider text-[var(--accent-300)]/80">
                        {j.year}
                      </span>
                      <h3 className="mt-1 text-[13px] font-semibold text-white">{j.title}</h3>
                      <p className="mt-1 text-[11px] leading-relaxed text-white/60">{j.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {tab === "values" && (
            <section className="flex flex-col gap-3">
              <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                Philosophy
              </span>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {values.map((v) => (
                  <div
                    key={v.title}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4"
                  >
                    <span className="material-symbols-outlined text-2xl text-[var(--accent-400)]">{v.icon}</span>
                    <span className="text-sm font-semibold text-white">{v.title}</span>
                    <p className="text-[12px] leading-relaxed text-white/65">{v.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </AppFrame>
  );
}
