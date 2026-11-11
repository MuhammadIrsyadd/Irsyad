"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import { caseStudies, projects } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

// Styled after Apple Notes: a note list with previews on the left and a
// plain page on the right — headings and paragraphs, tags as #hashtags,
// no cards.

const toHashtag = (t: string) => `#${t.toLowerCase().replace(/[^a-z0-9]+/g, "")}`;

export default function NotesApp() {
  const activeNoteId = useSystemStore((s) => s.activeNoteId);
  const setActiveNote = useSystemStore((s) => s.setActiveNote);
  const openSafariProject = useSystemStore((s) => s.openSafariProject);

  const [activeId, setActiveId] = useState<string | null>(
    () =>
      activeNoteId && caseStudies.some((c) => c.id === activeNoteId)
        ? activeNoteId
        : (caseStudies[0]?.id ?? null)
  );

  useEffect(() => {
    if (activeNoteId && caseStudies.some((c) => c.id === activeNoteId)) {
      /* eslint-disable react-hooks/set-state-in-effect -- sync external note jump requests */
      setActiveId(activeNoteId);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [activeNoteId]);

  function selectNote(id: string) {
    setActiveId(id);
    setActiveNote(id);
  }

  const active = caseStudies.find((c) => c.id === activeId) ?? null;
  const activeProject = active ? projects.find((p) => p.id === active.projectId) : undefined;

  return (
    <AppFrame id="notes" title="Notes — Case Studies" minWidth={480}>
      <div className="grid h-full grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hairline flex flex-col overflow-y-auto border-r bg-black/20">
          <div className="flex items-baseline justify-between px-4 pb-2 pt-3">
            <span className="text-[13px] font-semibold text-white">Notes</span>
            <span className="text-[11px] text-white/50">{caseStudies.length} notes</span>
          </div>
          <div className="flex flex-col px-2 pb-2">
            {caseStudies.map((c) => {
              const project = projects.find((p) => p.id === c.projectId);
              const isSelected = activeId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => selectNote(c.id)}
                  className="relative flex flex-col gap-0.5 rounded-lg px-3 py-2.5 text-left"
                >
                  {isSelected && (
                    <motion.span
                      layoutId="notes-selection"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      className="notes-selection absolute inset-0 rounded-lg"
                    />
                  )}
                  <span className="relative line-clamp-2 text-[12.5px] font-semibold leading-snug text-white">
                    {c.title}
                  </span>
                  <span className="relative line-clamp-1 text-[11.5px] text-white/50">
                    {project && <span className="text-white/70">{project.name.split(" — ")[0]} </span>}
                    {c.problem}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <main className="notes-paper relative overflow-hidden">
          <AnimatePresence mode="wait">
            {active && (
              <motion.article
                key={active.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 overflow-y-auto px-6 py-6 sm:px-10"
              >
                <div className="mx-auto max-w-[62ch]">
                  {activeProject && (
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11.5px]">
                      <span className="text-white/60">
                        Project: <strong className="font-medium text-white/90">{activeProject.name}</strong>
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openSafariProject(activeProject.id)}
                          className="inline-flex items-center gap-1 rounded-md bg-[var(--accent-500)] px-2.5 py-1 text-[11px] font-semibold text-black transition hover:brightness-110 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[13px]">explore</span>
                          View in Safari
                        </button>
                        {activeProject.url && (
                          <a
                            href={activeProject.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white transition hover:bg-white/15 active:scale-95"
                          >
                            Live Site
                            <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  <h1 className="text-[24px] font-bold leading-tight tracking-tight text-white">{active.title}</h1>

                  {[
                    { label: "Problem", body: active.problem },
                    { label: "Approach", body: active.approach },
                    { label: "Result", body: active.result },
                  ].map((section) => (
                    <section key={section.label} className="mt-6">
                      <h2 className="text-[15px] font-semibold text-white">{section.label}</h2>
                      <p className="mt-1.5 text-[13.5px] leading-[1.7] text-white/80">{section.body}</p>
                    </section>
                  ))}

                  <p className="mt-8 flex flex-wrap gap-x-2 gap-y-1 text-[12.5px] font-medium text-amber-500">
                    {active.tags.map((t) => (
                      <span key={t}>{toHashtag(t)}</span>
                    ))}
                  </p>
                </div>
              </motion.article>
            )}
          </AnimatePresence>
        </main>
      </div>
    </AppFrame>
  );
}
