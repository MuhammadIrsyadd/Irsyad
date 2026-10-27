"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import { caseStudies, projects } from "@/lib/content";

// Styled after Apple Notes: a note list with previews on the left and a
// plain page on the right — headings and paragraphs, tags as #hashtags,
// no cards.

const toHashtag = (t: string) => `#${t.toLowerCase().replace(/[^a-z0-9]+/g, "")}`;

export default function NotesApp() {
  const [activeId, setActiveId] = useState<string | null>(caseStudies[0]?.id ?? null);
  const active = caseStudies.find((c) => c.id === activeId) ?? null;
  const activeProject = active ? projects.find((p) => p.id === active.projectId) : undefined;

  return (
    <AppFrame id="notes" title="Notes — Case Studies" minWidth={480}>
      <div className="grid h-full grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="hairline flex flex-col overflow-y-auto border-r bg-black/20">
          <div className="flex items-baseline justify-between px-4 pb-2 pt-3">
            <span className="text-[13px] font-semibold text-white">Catatan</span>
            <span className="text-[11px] text-white/50">{caseStudies.length} catatan</span>
          </div>
          <div className="flex flex-col px-2 pb-2">
            {caseStudies.map((c) => {
              const project = projects.find((p) => p.id === c.projectId);
              const isSelected = activeId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
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
                    <p className="mb-4 text-center text-[11px] text-white/50">Catatan untuk {activeProject.name}</p>
                  )}
                  <h1 className="text-[24px] font-bold leading-tight tracking-tight text-white">{active.title}</h1>

                  {[
                    { label: "Masalah", body: active.problem },
                    { label: "Pendekatan", body: active.approach },
                    { label: "Hasil", body: active.result },
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
