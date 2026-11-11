"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { awards, caseStudies, educationHistory, journey, profile, skills, projects } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";
import { ASCII_FACE } from "@/lib/ascii-face";

const ART_WIDTH = Math.max(...ASCII_FACE.map((r) => r.length)) + 3;

function neofetch(theme: string): Line[] {
  const minutes = Math.max(1, Math.round(performance.now() / 60000));
  const info: [string | undefined, string][] = [
    [undefined, "irsyad@portfolio-os"],
    [undefined, "-------------------"],
    ["OS", "Portfolio OS (Liquid Glass)"],
    ["Host", profile.location],
    ["Kernel", "Next.js 16 + React 19"],
    ["Uptime", `${minutes} min`],
    ["Packages", `${projects.length} projects, ${skills.length} skill categories`],
    ["Shell", "irsh 1.2"],
    ["Resolution", `${window.innerWidth}x${window.innerHeight}`],
    ["Theme", theme === "light" ? "Light" : "Dark"],
    ["Role", profile.role],
    ["Status", profile.availability],
  ];
  const rows = Math.max(ASCII_FACE.length, info.length);
  return Array.from({ length: rows }, (_, i) => ({
    type: "fetch" as const,
    art: (ASCII_FACE[i] ?? "").padEnd(ART_WIDTH),
    key: info[i]?.[0],
    value: info[i]?.[1],
  }));
}

type Line =
  | { type: "cmd" | "out"; text: string }
  // neofetch row: ASCII portrait on the left, "Key: value" on the right
  | { type: "fetch"; art: string; key?: string; value?: string };

const BOOT_SEQUENCE: { cmd: string; output: string[] }[] = [
  { cmd: "whoami", output: [profile.name.toLowerCase().replace(/\s+/g, "-")] },
  {
    cmd: "cat role.txt",
    output: [`${profile.role} — ${profile.tagline}`],
  },
  {
    cmd: "ls skills/",
    output: [skills.map((s) => s.category.toLowerCase().replace(/\s+/g, "-")).join("   ")],
  },
  {
    cmd: "cat skills/frontend.txt",
    output: [skills[0].items.join(", ")],
  },
];

const HELP_TEXT = [
  "Available commands (Tab to autocomplete, ↑/↓ for history):",
  "  neofetch             — system info + ASCII portrait",
  "  whoami               — who I am & profile info",
  "  education            — degree, GPA & awards",
  "  experience           — PT. INKA, Bangkit & work history",
  "  projects             — list all projects & deployments",
  "  cat projects/<id>    — full project info (e.g. cat projects/gigizi)",
  "  open <id>            — open a project in Safari (e.g. open 2048)",
  "  notes                — list all engineering case studies",
  "  note <id>            — open a case study in Notes (e.g. note inka-erp)",
  "  ls skills/           — list technical skill categories",
  "  cat <category>       — skill details (e.g. cat backend-&-erp)",
  "  theme [dark|light]   — toggle or set desktop theme",
  "  cv                   — open Resume / CV (PDF)",
  "  cat contact.txt      — contact info, email & status",
  "  sudo hire-me         — send a job invitation",
  "  coffee --brew        — brew a virtual coffee",
  "  clear                — clear the terminal (or Ctrl+L)",
  "  help                 — show this help message",
];

const AUTOCOMPLETE_COMMANDS = [
  "help",
  "neofetch",
  "whoami",
  "education",
  "experience",
  "projects",
  "notes",
  "ls skills/",
  ...skills.map((s) => `cat ${s.category.toLowerCase().replace(/\s+/g, "-")}`),
  ...projects.map((p) => `cat projects/${p.id}`),
  ...projects.map((p) => `open ${p.id}`),
  ...caseStudies.map((c) => `note ${c.projectId}`),
  "cat contact.txt",
  "cat role.txt",
  "theme",
  "theme dark",
  "theme light",
  "cv",
  "sudo hire-me",
  "coffee --brew",
  "clear",
];

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openApp = useSystemStore((s) => s.openApp);
  const openSafariProject = useSystemStore((s) => s.openSafariProject);
  const openNote = useSystemStore((s) => s.openNote);
  const setTheme = useSystemStore((s) => s.setTheme);
  const toggleTheme = useSystemStore((s) => s.toggleTheme);

  const suggestion = useMemo(() => {
    if (!input.trim()) return "";
    const lower = input.toLowerCase();
    const match = AUTOCOMPLETE_COMMANDS.find(
      (c) => c.toLowerCase().startsWith(lower) && c.toLowerCase() !== lower
    );
    return match ? input + match.slice(input.length) : "";
  }, [input]);

  useEffect(() => {
    let cancelled = false;
    async function typeBoot() {
      // greet with neofetch first, the way a dev's shell opens
      await new Promise((r) => setTimeout(r, 260));
      if (cancelled) return;
      setLines([{ type: "cmd", text: "neofetch" }, ...neofetch(useSystemStore.getState().theme)]);
      for (const step of BOOT_SEQUENCE) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 260));
        setLines((prev) => [...prev, { type: "cmd", text: step.cmd }]);
        await new Promise((r) => setTimeout(r, 220));
        setLines((prev) => [
          ...prev,
          ...step.output.map((o) => ({ type: "out" as const, text: o })),
        ]);
      }
      if (!cancelled) setBooted(true);
    }
    typeBoot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function executeCommand(raw: string): string[] {
    const cmd = raw.trim().toLowerCase();

    if (cmd === "") return [];
    if (cmd === "help") return HELP_TEXT;

    if (cmd === "whoami") {
      return [
        profile.name.toLowerCase().replace(/\s+/g, "-"),
        `Role     : ${profile.role}`,
        `Location : ${profile.location}`,
        `GPA      : 3.93/4.00 (Cumlaude)`,
      ];
    }

    if (cmd === "projects" || cmd === "ls projects" || cmd === "ls projects/") {
      return [
        "PROJECTS & DEPLOYMENTS:",
        ...projects.map(
          (p) =>
            `  • ${p.id.padEnd(16)} : ${p.name} [${p.category || "Project"}]${
              p.url ? " (LIVE DEPLOY)" : ""
            }`
        ),
        "",
        "Tip: type 'cat projects/<id>' to read more, or 'open <id>' to open it in Safari.",
      ];
    }

    if (cmd.startsWith("open ")) {
      const target = cmd.replace("open ", "").trim();
      const found = projects.find(
        (p) =>
          p.id.toLowerCase() === target ||
          p.id.toLowerCase().replace(/-/g, "") === target.replace(/-/g, "") ||
          p.name.toLowerCase().includes(target)
      );

      if (found) {
        openSafariProject(found.id);
        return [`[Safari] Opening "${found.name}" in Safari...`];
      }

      if (target === "safari") {
        openApp("safari");
        return ["[Safari] Opening Safari..."];
      }
      if (target === "finder") {
        openApp("finder");
        return ["[Finder] Opening Finder..."];
      }
      if (target === "mail") {
        openApp("mail");
        return ["[Mail] Opening Mail..."];
      }
      if (target === "notes") {
        openApp("notes");
        return ["[Notes] Opening Notes..."];
      }
      if (target === "photos") {
        openApp("photos");
        return ["[Photos] Opening Photos..."];
      }
      if (target === "settings") {
        openApp("settings");
        return ["[Settings] Opening Settings..."];
      }

      return [
        `Target '${target}' not found.`,
        "Type 'projects' to see valid project IDs.",
      ];
    }

    if (cmd === "cv" || cmd === "resume" || cmd === "cat resume") {
      window.open("/resume.pdf", "_blank");
      return ["[CV] Opening resume.pdf in a new tab..."];
    }

    if (cmd === "ls skills/" || cmd === "ls skills") {
      return [skills.map((s) => s.category.toLowerCase().replace(/\s+/g, "-")).join("   ")];
    }

    if (cmd.startsWith("cat projects/") || cmd.startsWith("cat project/")) {
      const target = cmd
        .replace("cat projects/", "")
        .replace("cat project/", "")
        .replace(".txt", "")
        .trim();

      const p = projects.find(
        (x) =>
          x.id.toLowerCase() === target ||
          x.id.toLowerCase().replace(/-/g, "") === target.replace(/-/g, "") ||
          x.name.toLowerCase().includes(target)
      );

      if (p) {
        return [
          `Name     : ${p.name}`,
          `Category : ${p.category || "-"}`,
          `Tagline  : ${p.tagline}`,
          `Tech     : ${p.tech.join(", ")}`,
          `URL      : ${p.url || "(Internal / Confidential)"}`,
          `About    : ${p.description}`,
          "",
          `Tip: type 'open ${p.id}' to view this project in Safari.`,
        ];
      }
      return [`cat: projects/${target}: No such project. Type 'projects' for the full list.`];
    }

    if (cmd.startsWith("cat ")) {
      const target = cmd.replace("cat ", "").replace(".txt", "").trim();

      if (target === "contact") {
        return [
          `Email    : ${profile.email}`,
          `Phone    : ${profile.phone}`,
          `LinkedIn : ${profile.linkedin}`,
          `Status   : ${profile.availability}`,
        ];
      }

      if (target === "role") {
        return [`${profile.role} — ${profile.tagline}`];
      }

      const foundSkill = skills.find(
        (s) =>
          s.category.toLowerCase().replace(/\s+/g, "-") === target ||
          s.category.toLowerCase().includes(target)
      );
      if (foundSkill) return [`${foundSkill.category}: ${foundSkill.items.join(", ")}`];

      return [`cat: ${target}: No such file or directory. Type 'help' for guidance.`];
    }

    if (cmd === "education" || cmd === "edu") {
      const edu = educationHistory[0];
      return [
        `${edu.institution} (${edu.period})`,
        `  Degree : ${edu.degree}`,
        `  GPA    : ${edu.gpa} / ${edu.maxGpa} (Cum Laude)`,
        `  Thesis : ${edu.thesis}`,
        "",
        "Awards:",
        ...awards.map((a) => `  • ${a.title} — ${a.issuer} (${a.period})`),
      ];
    }

    if (cmd === "experience" || cmd === "journey" || cmd === "work") {
      return [
        "WORK & INDUSTRY EXPERIENCE:",
        ...journey.flatMap((j) => [
          `  • [${j.period}] ${j.title} @ ${j.company}`,
          `    ${j.description}`,
          `    Skills: ${j.skills.join(", ")}`,
        ]),
      ];
    }

    if (cmd === "notes" || cmd === "casestudies" || cmd === "ls notes") {
      return [
        "CASE STUDIES (Notes App):",
        ...caseStudies.map(
          (c) => `  • ${c.projectId.padEnd(16)} : ${c.title}`
        ),
        "",
        "Tip: type 'note <id>' to open a case study in the Notes app.",
      ];
    }

    if (cmd.startsWith("note ")) {
      const target = cmd.replace("note ", "").trim();
      const found = caseStudies.find(
        (c) =>
          c.id.toLowerCase() === target ||
          c.projectId.toLowerCase() === target ||
          c.title.toLowerCase().includes(target)
      );
      if (found) {
        openNote(found.id);
        return [`[Notes] Opening case study: "${found.title}"...`];
      }
      return [`Case study '${target}' not found. Type 'notes' to list all.`];
    }

    if (cmd === "theme" || cmd.startsWith("theme ")) {
      const arg = cmd.replace("theme", "").trim();
      if (arg === "light" || arg === "dark") {
        setTheme(arg);
        return [`[System] Theme set to ${arg}.`];
      }
      toggleTheme();
      const current = useSystemStore.getState().theme;
      return [`[System] Theme toggled to ${current}.`];
    }

    if (cmd === "sudo hire-me") {
      openApp("mail");
      return [
        "[sudo] access granted — you seem trustworthy.",
        "Opening Mail so you can send a message directly...",
      ];
    }

    if (cmd === "coffee --brew" || cmd === "coffee") {
      return ["☕ Brewing Mojokerto specialty roast... done. Productivity +100%."];
    }

    return [`command not found: ${cmd}`, `type 'help' to see the available commands.`];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    if (cmd.trim()) {
      setHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);
    }
    setLines((prev) => [...prev, { type: "cmd", text: cmd }]);
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
    } else if (cmd.trim().toLowerCase() === "neofetch") {
      setLines((prev) => [...prev, ...neofetch(useSystemStore.getState().theme)]);
    } else {
      const out = executeCommand(cmd);
      setLines((prev) => [
        ...prev,
        ...out.map((o) => ({ type: "out" as const, text: o })),
      ]);
    }
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if ((e.key === "Tab" || (e.key === "ArrowRight" && e.currentTarget.selectionStart === input.length)) && suggestion) {
      e.preventDefault();
      setInput(suggestion);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx === -1) return;
      if (historyIdx + 1 >= history.length) {
        setHistoryIdx(-1);
        setInput("");
      } else {
        setHistoryIdx(historyIdx + 1);
        setInput(history[historyIdx + 1]);
      }
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      setLines([]);
    }
  }

  return (
    <AppFrame
      id="terminal"
      title="Terminal — Skills & CLI"
    >
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-full overflow-y-auto bg-terminal-canvas p-4 font-mono-ui text-[12px] leading-relaxed text-white/90"
      >
        <div className="mb-2 text-white/40">
          {profile.name} — Interactive Shell v1.3. Type{" "}
          <span className="text-terminal-green font-semibold">help</span> or press{" "}
          <span className="text-white/60">Tab</span> to autocomplete.
        </div>
        {lines.map((l, i) =>
          l.type === "cmd" ? (
            <div key={i} className="flex gap-2">
              <span className="text-terminal-green">➜</span>
              <span className="text-[var(--accent-300)]">~</span>
              <span>{l.text}</span>
            </div>
          ) : l.type === "fetch" ? (
            <div key={i} className="whitespace-pre leading-[1.35]">
              <span className="text-[var(--accent-300)]">{l.art}</span>
              {l.key ? (
                <>
                  <span className="font-semibold text-terminal-green">{l.key}</span>
                  <span className="text-white/80">: {l.value}</span>
                </>
              ) : (
                <span className="font-semibold text-white">{l.value}</span>
              )}
            </div>
          ) : (
            <div key={i} className="whitespace-pre-wrap pl-5 text-white/70">
              {l.text}
            </div>
          )
        )}
        {booted && (
          <form onSubmit={handleSubmit} className="mt-1 flex items-center gap-2">
            <span className="text-terminal-green">➜</span>
            <span className="text-[var(--accent-300)]">~</span>
            <div className="relative flex-1">
              {suggestion && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 select-none whitespace-pre text-white/30"
                >
                  {suggestion}
                </span>
              )}
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHistoryIdx(-1);
                }}
                onKeyDown={handleKeyDown}
                className="relative w-full bg-transparent text-white outline-none"
                autoFocus
                spellCheck={false}
              />
            </div>
          </form>
        )}
      </div>
    </AppFrame>
  );
}
