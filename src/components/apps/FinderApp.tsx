"use client";

import { useState } from "react";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import {
  awards,
  committees,
  educationHistory,
  journey,
  organizations,
  overviewHighlights,
  profile,
} from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const tabs = [
  { id: "overview", label: "Overview", icon: "badge" },
  { id: "education", label: "Education", icon: "school" },
  { id: "journey", label: "My Journey", icon: "work_history" },
  { id: "organization", label: "Organization", icon: "groups" },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function FinderApp() {
  const [tab, setTab] = useState<TabId>("overview");
  const openApp = useSystemStore((s) => s.openApp);
  const theme = useSystemStore((s) => s.theme);
  const isLight = theme === "light";

  return (
    <AppFrame
      id="finder"
      title="Finder — About Me & Resume"
      icon={
        <span
          className={`material-symbols-outlined icon-fill text-[15px] ${
            isLight ? "text-amber-600" : "text-amber-400"
          }`}
        >
          folder_shared
        </span>
      }
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside
          className={`flex flex-col justify-between border-r p-3 transition-colors ${
            isLight
              ? "border-black/10 bg-black/[0.03]"
              : "border-white/10 bg-black/20"
          }`}
        >
          <div className="flex flex-col gap-1">
            <span
              className={`mb-1 px-2 font-mono-ui text-[10px] font-semibold uppercase tracking-wider ${
                isLight ? "text-neutral-500" : "text-white/40"
              }`}
            >
              Navigation
            </span>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12px] transition-all ${
                  tab === t.id
                    ? isLight
                      ? "border border-amber-500/40 bg-amber-500/15 font-semibold text-amber-950 shadow-sm"
                      : "border border-[var(--accent-400)]/30 bg-gradient-to-r from-[var(--accent-500)]/25 to-[var(--accent-500)]/5 font-semibold text-[var(--accent-300)]"
                    : isLight
                    ? "text-neutral-700 hover:bg-black/5 hover:text-neutral-900"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <div
            className={`mt-4 flex items-center gap-2 rounded-xl border p-2.5 pt-3 transition-colors ${
              isLight
                ? "border-black/10 bg-black/[0.02]"
                : "border-white/10 bg-black/20"
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-terminal-green" />
            </span>
            <div className="flex flex-col leading-tight">
              <span
                className={`text-[10px] font-medium ${
                  isLight ? "text-neutral-800" : "text-white/90"
                }`}
              >
                {profile.availability}
              </span>
              <span
                className={`text-[9px] ${
                  isLight ? "text-neutral-500" : "text-white/50"
                }`}
              >
                Liquid Glass OS
              </span>
            </div>
          </div>
        </aside>

        <main className="flex flex-col gap-5 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: OVERVIEW */}
          {tab === "overview" && (
            <>
              {/* Profile Hero Card */}
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
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-medium text-emerald-300">
                        🎓 GPA 3.93/4.00
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{profile.name}</h1>
                    <span className="text-xs sm:text-sm font-medium tracking-tight text-[var(--accent-400)]">
                      {profile.role}
                    </span>
                    <p className="text-xs leading-relaxed text-white/75">{profile.tagline}</p>
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 sm:justify-start">
                      <Magnet padding={30} magnetStrength={6}>
                        <button
                          onClick={() => openApp("safari")}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] px-3.5 py-1.5 text-xs font-semibold text-black shadow-[0_4px_16px_var(--accent-glow)] transition-transform active:scale-95 hover:brightness-110"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">explore</span>
                          Lihat Proyek
                        </button>
                      </Magnet>
                      <Magnet padding={30} magnetStrength={6}>
                        <a
                          href="/resume.pdf"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-transform active:scale-95 hover:bg-white/15"
                        >
                          <span className="material-symbols-outlined text-sm font-bold">download</span>
                          Download CV
                        </a>
                      </Magnet>
                      <Magnet padding={30} magnetStrength={6}>
                        <button
                          onClick={() => openApp("mail")}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition-transform active:scale-95 hover:bg-white/15"
                        >
                          <span className="material-symbols-outlined text-sm">send</span>
                          Get in touch
                        </button>
                      </Magnet>
                      {profile.linkedin && (
                        <Magnet padding={30} magnetStrength={6}>
                          <a
                            href={profile.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300 transition-transform active:scale-95 hover:bg-blue-500/20"
                          >
                            <span className="material-symbols-outlined text-sm">link</span>
                            LinkedIn
                          </a>
                        </Magnet>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* Opsi A: Summary / About Me */}
              <section className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg text-[var(--accent-400)]">person</span>
                  <span className="font-mono-ui text-[11px] font-semibold uppercase tracking-wider text-[var(--accent-400)]/90">
                    About Me & Professional Summary
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-white/80">
                  {profile.summary}
                </p>
              </section>

              {/* Opsi A: Quick Highlights / Stats Grid */}
              <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {overviewHighlights.map((h) => (
                  <div
                    key={h.title}
                    className="flex items-start gap-3 rounded-xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-3.5 transition-all hover:border-[var(--accent-400)]/40 hover:bg-white/10"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${h.accent}`}
                    >
                      <span className="material-symbols-outlined text-xl">{h.icon}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/40">
                        {h.title}
                      </span>
                      <span className="text-xs font-semibold text-white">{h.value}</span>
                      <span className="text-[11px] leading-snug text-white/60">{h.sub}</span>
                    </div>
                  </div>
                ))}
              </section>
            </>
          )}

          {/* TAB 2: EDUCATION */}
          {tab === "education" && (
            <section className="flex flex-col gap-5">
              <div>
                <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                  Education & Academics
                </span>
                <h2 className="mt-1 text-base font-bold text-white">Riwayat Pendidikan Formal</h2>
              </div>

              {educationHistory.map((edu) => (
                <div
                  key={edu.institution}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-5 transition-colors hover:border-[var(--accent-400)]/30"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--accent-400)]/30 bg-[var(--accent-500)]/20 text-[var(--accent-400)]">
                        <span className="material-symbols-outlined text-2xl">school</span>
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm sm:text-base font-bold text-white">{edu.institution}</h3>
                        <span className="text-xs font-medium text-[var(--accent-300)]">{edu.degree}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono-ui text-[10px] text-white/70">
                        {edu.period}
                      </span>
                      <span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 px-2.5 py-0.5 font-mono-ui text-[11px] font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                        IPK: {edu.gpa} / {edu.maxGpa}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-white/75">{edu.description}</p>

                  <div className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[15px] text-[var(--accent-400)]">menu_book</span>
                      <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/50">
                        Topik Skripsi / Thesis:
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-white/90">{edu.thesis}</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/50">
                      Mata Kuliah Utama & Relevan:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {edu.coursework.map((course) => (
                        <span
                          key={course}
                          className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/80 transition-colors hover:border-white/20 hover:text-white"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {/* Honors & Awards */}
              <div className="mt-2 flex flex-col gap-3">
                <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                  Honors & Awards
                </span>
                {awards.map((award) => (
                  <div
                    key={award.title}
                    className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-4 transition-colors hover:border-amber-400/40"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-amber-400/30 bg-amber-400/10 text-amber-400">
                          <span className="material-symbols-outlined text-lg">emoji_events</span>
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-white">{award.title}</h4>
                          <span className="text-[11px] text-[var(--accent-300)]">{award.issuer}</span>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono-ui text-[10px] text-white/60">
                        {award.period}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-white/70">{award.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {award.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/70"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 3: MY JOURNEY (WORK & PROFESSIONAL EXPERIENCE) */}
          {tab === "journey" && (
            <section className="flex flex-col gap-4">
              <div>
                <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                  Professional Journey
                </span>
                <h2 className="mt-1 text-base font-bold text-white">Pengalaman Kerja & Magang</h2>
              </div>

              <div className="relative flex flex-col gap-5 pl-4">
                <div className="absolute bottom-2 left-[5px] top-2 w-px bg-gradient-to-b from-[var(--accent-400)] via-white/20 to-transparent" />
                {journey.map((j) => (
                  <div key={j.title + j.period} className="relative">
                    <span className="absolute -left-4 top-2 h-2.5 w-2.5 rounded-full border-2 border-black bg-[var(--accent-400)] shadow-[0_0_10px_var(--accent-glow)]" />
                    <div className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-4 sm:p-5 transition-colors hover:border-[var(--accent-400)]/30">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-white">{j.title}</h3>
                          <span className="text-xs font-semibold text-[var(--accent-300)]">{j.company}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono-ui text-[10px] text-white/70">
                            {j.period}
                          </span>
                          <span className="rounded-full border border-[var(--accent-400)]/30 bg-[var(--accent-400)]/10 px-2 py-0.5 font-mono-ui text-[9px] uppercase text-[var(--accent-300)]">
                            {j.type}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-white/80">{j.description}</p>

                      <ul className="flex flex-col gap-1.5 pt-1">
                        {j.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-white/70">
                            <span className="material-symbols-outlined mt-0.5 text-[13px] text-[var(--accent-400)]">
                              check_circle
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10">
                        {j.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-0.5 text-[10px] text-white/70"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TAB 4: ORGANIZATION */}
          {tab === "organization" && (
            <section className="flex flex-col gap-5">
              <div>
                <span className="px-1 font-mono-ui text-[11px] font-semibold uppercase tracking-widest text-[var(--accent-400)]/90">
                  Leadership & Extracurricular
                </span>
                <h2 className="mt-1 text-base font-bold text-white">Pengalaman Organisasi & Kepanitiaan</h2>
              </div>

              {/* Roles */}
              <div className="flex flex-col gap-3">
                <span className="px-1 font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Jabatan Struktural Organisasi
                </span>
                {organizations.map((org) => (
                  <div
                    key={org.role + org.period}
                    className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-4 transition-colors hover:border-[var(--accent-400)]/30"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <h3 className="text-sm font-bold text-white">{org.role}</h3>
                        <span className="text-xs font-medium text-[var(--accent-300)]">{org.organization}</span>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono-ui text-[10px] text-white/70 self-start sm:self-auto">
                        {org.period}
                      </span>
                    </div>

                    <ul className="flex flex-col gap-1 pt-1">
                      {org.bullets.map((b, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs leading-relaxed text-white/70">
                          <span className="material-symbols-outlined mt-0.5 text-[12px] text-[var(--accent-400)]">
                            arrow_right
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Committees & Event Highlights */}
              <div className="flex flex-col gap-3 pt-2">
                <span className="px-1 font-mono-ui text-[10px] font-semibold uppercase tracking-wider text-white/40">
                  Kepanitiaan & Event Terpilih
                </span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {committees.map((com) => (
                    <div
                      key={com.event + com.role}
                      className="flex flex-col justify-between gap-2.5 rounded-xl border border-white/10 bg-gradient-to-br from-white/8 to-black/20 p-3.5 transition-colors hover:border-white/20"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-white leading-tight">
                            {com.role}
                          </span>
                          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 font-mono-ui text-[9px] text-white/50">
                            {com.period}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold text-[var(--accent-300)]">{com.event}</span>
                        <span className="text-[10px] text-white/45">{com.organizer}</span>
                        <p className="mt-1 text-[11px] leading-snug text-white/70">{com.description}</p>
                      </div>

                      {com.impact && (
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2 text-[10px] font-medium text-emerald-300 leading-tight">
                          ✨ {com.impact}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </AppFrame>
  );
}
