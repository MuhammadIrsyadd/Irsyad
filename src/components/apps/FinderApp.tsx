"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import TimeMachine from "@/components/apps/TimeMachine";
import {
  awards,
  committees,
  educationHistory,
  organizations,
  overviewHighlights,
  profile,
} from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

const tabs = [
  { id: "overview", label: "Overview", icon: "badge" },
  { id: "education", label: "Education", icon: "school" },
  { id: "journey", label: "My Journey", icon: "history" },
  { id: "organization", label: "Organization", icon: "groups" },
] as const;

type TabId = (typeof tabs)[number]["id"];

// Section heading in the macOS voice: sentence case, quiet, no tracking.
function Heading({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-2 text-[13px] font-semibold text-white/90">{children}</h2>;
}

const primaryButton =
  "inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-500)] px-3.5 py-1.5 text-xs font-semibold text-black transition active:scale-95 hover:brightness-110";
const secondaryButton =
  "inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white transition active:scale-95 hover:bg-white/15";

export default function FinderApp() {
  const [tab, setTab] = useState<TabId>("overview");
  const mainRef = useRef<HTMLElement>(null);
  const openApp = useSystemStore((s) => s.openApp);
  const theme = useSystemStore((s) => s.theme);
  const isLight = theme === "light";
  const tabLabel = tabs.find((t) => t.id === tab)?.label;

  return (
    <AppFrame id="finder" title="Finder — About Me & Resume">
      <div className="grid h-full grid-cols-1 md:grid-cols-[190px_1fr]">
        <aside
          className={`flex flex-col justify-between border-r p-3 ${
            isLight ? "border-black/10 bg-black/[0.03]" : "border-white/10 bg-black/20"
          }`}
        >
          <div className="flex flex-col gap-0.5">
            <span className="mb-1 px-2 text-[11px] font-semibold text-white/40">Favorit</span>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  mainRef.current?.scrollTo({ top: 0 });
                }}
                className={`relative flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-left text-[12.5px] transition-colors ${
                  tab === t.id ? "font-medium text-white" : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="finder-tab-pill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 rounded-lg bg-white/10"
                  />
                )}
                <span className={`material-symbols-outlined relative text-[17px] ${tab === t.id ? "text-accent-ink" : ""}`}>
                  {t.icon}
                </span>
                <span className="relative">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-2 px-2 text-[11px] leading-snug text-white/60">
            <span className="relative mt-1 flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-terminal-green opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-terminal-green" />
            </span>
            {profile.availability}
          </div>
        </aside>

        <div className="flex min-h-0 flex-col">
          <main ref={mainRef} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-7"
              >
                {tab === "overview" && (
                  <>
                    <section className="flex flex-col gap-5 sm:flex-row sm:items-start">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/avatar.webp"
                        alt={profile.name}
                        className="h-24 w-24 shrink-0 rounded-2xl bg-white/10 object-cover object-top"
                      />
                      <div className="flex flex-1 flex-col gap-1.5">
                        <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-white">
                          {profile.name}
                        </h1>
                        <p className="text-[13px] font-medium text-accent-ink">{profile.role}</p>
                        <p className="max-w-[60ch] text-[12.5px] leading-relaxed text-white/70">{profile.tagline}</p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <Magnet padding={30} magnetStrength={6}>
                            <button onClick={() => openApp("safari")} className={primaryButton}>
                              Lihat proyek
                            </button>
                          </Magnet>
                          <Magnet padding={30} magnetStrength={6}>
                            <a href="/resume.pdf" target="_blank" rel="noreferrer" className={secondaryButton}>
                              <span className="material-symbols-outlined text-[15px]">download</span>
                              Download CV
                            </a>
                          </Magnet>
                          <Magnet padding={30} magnetStrength={6}>
                            <button onClick={() => openApp("mail")} className={secondaryButton}>
                              Kirim pesan
                            </button>
                          </Magnet>
                          {profile.linkedin && (
                            <Magnet padding={30} magnetStrength={6}>
                              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={secondaryButton}>
                                LinkedIn
                              </a>
                            </Magnet>
                          )}
                        </div>
                      </div>
                    </section>

                    {/* "Get Info" panel instead of a pile of badges */}
                    <section>
                      <Heading>Info</Heading>
                      <dl className="hairline grid grid-cols-[96px_1fr] border-t text-[12.5px]">
                        {[
                          ["Status", profile.availability],
                          ["Lokasi", profile.location],
                          ["IPK", "3.93 / 4.00"],
                          ["Email", profile.email],
                        ].map(([k, v]) => (
                          <div key={k} className="hairline col-span-2 grid grid-cols-subgrid border-b py-2">
                            <dt className="pr-4 text-right text-white/50">{k}</dt>
                            <dd className="text-white/90">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>

                    <section>
                      <Heading>Ringkasan</Heading>
                      <p className="max-w-[68ch] text-[13px] leading-relaxed text-white/80">{profile.summary}</p>
                    </section>

                    <section>
                      <Heading>Sorotan</Heading>
                      <ul className="hairline border-t">
                        {overviewHighlights.map((h) => (
                          <li key={h.title} className="hairline flex items-start gap-3 border-b py-3">
                            <span className="material-symbols-outlined mt-0.5 text-[20px] text-white/50">{h.icon}</span>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[11.5px] text-white/50">{h.title}</span>
                              <span className="text-[13px] font-medium text-white">{h.value}</span>
                              <span className="text-[12px] leading-snug text-white/60">{h.sub}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                {tab === "education" && (
                  <>
                    {educationHistory.map((edu) => (
                      <section key={edu.institution} className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                          <div>
                            <h1 className="text-[18px] font-semibold tracking-tight text-white">{edu.institution}</h1>
                            <p className="text-[13px] text-accent-ink">{edu.degree}</p>
                          </div>
                          <div className="flex flex-col text-[12px] tabular-nums sm:items-end">
                            <span className="text-white/60">{edu.period}</span>
                            <span className="font-semibold text-emerald-500">
                              IPK {edu.gpa} / {edu.maxGpa}
                            </span>
                          </div>
                        </div>
                        <p className="max-w-[68ch] text-[13px] leading-relaxed text-white/75">{edu.description}</p>
                        <blockquote className="border-l-2 border-[var(--accent-500)] pl-3 text-[12.5px] leading-relaxed text-white/85">
                          <span className="font-semibold">Skripsi: </span>
                          {edu.thesis}
                        </blockquote>
                        <div>
                          <p className="mb-1.5 text-[12px] text-white/50">Mata kuliah utama</p>
                          <div className="flex flex-wrap gap-1.5">
                            {edu.coursework.map((course) => (
                              <span key={course} className="rounded-md bg-white/5 px-2 py-1 text-[11.5px] text-white/80">
                                {course}
                              </span>
                            ))}
                          </div>
                        </div>
                      </section>
                    ))}

                    <section>
                      <Heading>Penghargaan</Heading>
                      <ul className="hairline border-t">
                        {awards.map((award) => (
                          <li key={award.title} className="hairline flex gap-3 border-b py-3">
                            <span className="material-symbols-outlined mt-0.5 text-[20px] text-amber-500">emoji_events</span>
                            <div className="flex flex-1 flex-col gap-1">
                              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                                <span className="text-[13px] font-semibold text-white">{award.title}</span>
                                <span className="text-[11.5px] tabular-nums text-white/50">{award.period}</span>
                              </div>
                              <span className="text-[12px] text-accent-ink">{award.issuer}</span>
                              <p className="text-[12.5px] leading-relaxed text-white/70">{award.description}</p>
                              <p className="text-[11.5px] text-white/50">{award.skills.join(", ")}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>
                  </>
                )}

                {tab === "journey" && (
                  <section className="flex flex-col gap-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <h1 className="text-[18px] font-semibold tracking-tight text-white">Pengalaman kerja & magang</h1>
                      <span className="hidden text-[11.5px] text-white/50 sm:inline">Scroll untuk mundur ke masa lalu</span>
                    </div>
                    <TimeMachine />
                  </section>
                )}

                {tab === "organization" && (
                  <>
                    <section>
                      <Heading>Jabatan organisasi</Heading>
                      <ul className="hairline border-t">
                        {organizations.map((org) => (
                          <li key={org.role + org.period} className="hairline flex flex-col gap-1.5 border-b py-3">
                            <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                              <span className="text-[13.5px] font-semibold text-white">{org.role}</span>
                              <span className="text-[11.5px] tabular-nums text-white/50">{org.period}</span>
                            </div>
                            <span className="text-[12px] text-accent-ink">{org.organization}</span>
                            <ul className="flex flex-col gap-1">
                              {org.bullets.map((b) => (
                                <li key={b} className="flex gap-2 text-[12.5px] leading-relaxed text-white/70">
                                  <span className="mt-[8px] h-1 w-1 shrink-0 rounded-full bg-white/40" />
                                  {b}
                                </li>
                              ))}
                            </ul>
                            {org.highlights && <p className="text-[12px] italic text-white/50">{org.highlights}</p>}
                          </li>
                        ))}
                      </ul>
                    </section>

                    {/* Finder list view: column headers + rows */}
                    <section>
                      <Heading>Kepanitiaan & event</Heading>
                      <div className="hairline overflow-hidden rounded-lg border">
                        <div className="hairline hidden grid-cols-[1.1fr_1.2fr_1.2fr_0.9fr] gap-3 border-b bg-white/5 px-3 py-1.5 text-[11px] font-medium text-white/50 md:grid">
                          <span>Peran</span>
                          <span>Event</span>
                          <span>Penyelenggara</span>
                          <span className="text-right">Periode</span>
                        </div>
                        {committees.map((com, i) => (
                          <div
                            key={com.event + com.role}
                            className={`hairline px-3 py-2.5 ${i > 0 ? "border-t" : ""} ${i % 2 ? "bg-white/[0.02]" : ""}`}
                          >
                            <div className="grid grid-cols-1 gap-x-3 gap-y-0.5 text-[12.5px] md:grid-cols-[1.1fr_1.2fr_1.2fr_0.9fr]">
                              <span className="font-medium text-white">{com.role}</span>
                              <span className="text-accent-ink">{com.event}</span>
                              <span className="text-white/60">{com.organizer}</span>
                              <span className="tabular-nums text-white/50 md:text-right">{com.period}</span>
                            </div>
                            <p className="mt-1 text-[12px] leading-snug text-white/65">{com.description}</p>
                            {com.impact && (
                              <p className="mt-0.5 text-[12px] leading-snug text-emerald-500">{com.impact}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </section>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Finder path bar */}
          <footer className="hairline flex shrink-0 items-center gap-1 border-t px-4 py-1.5 text-[11px] text-white/50">
            <span className="material-symbols-outlined text-[13px]">hard_drive</span>
            Macintosh HD
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            irsyad
            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
            <span className="text-white/80">{tabLabel}</span>
          </footer>
        </div>
      </div>
    </AppFrame>
  );
}
