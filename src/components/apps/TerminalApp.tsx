"use client";

import { useEffect, useRef, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { profile, skills, projects } from "@/lib/content";
import { useSystemStore } from "@/store/system-store";

type Line = { type: "cmd" | "out"; text: string };

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
  "Perintah tersedia:",
  "  whoami               — siapa aku & informasi profil",
  "  projects             — daftar semua proyek & deploy",
  "  cat projects/<id>    — info lengkap proyek (contoh: cat projects/gigizi)",
  "  open <id>            — arahkan & buka proyek di Safari (contoh: open 2048)",
  "  ls skills/           — daftar kategori skill teknis",
  "  cat <kategori>       — detail skill (contoh: cat frontend)",
  "  cv                   — buka Resume / CV (PDF)",
  "  cat contact.txt      — info kontak, email & status",
  "  sudo hire-me         — kirim undangan kerja",
  "  coffee --brew        — bikin kopi virtual",
  "  clear                — bersihkan layar terminal",
  "  help                 — tampilkan pesan panduan ini",
];

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const openApp = useSystemStore((s) => s.openApp);
  const openSafariProject = useSystemStore((s) => s.openSafariProject);

  useEffect(() => {
    let cancelled = false;
    async function typeBoot() {
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
        "DAFTAR PROYEK DEPLOY & KARYA:",
        ...projects.map(
          (p) =>
            `  • ${p.id.padEnd(16)} : ${p.name} [${p.category || "Project"}]${
              p.url ? " (LIVE DEPLOY)" : ""
            }`
        ),
        "",
        "Tips: Ketik 'cat projects/<id>' untuk baca info, atau 'open <id>' untuk arahkan ke Safari.",
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
        return [`[Safari] Membuka tab proyek "${found.name}" di Safari...`];
      }

      if (target === "safari") {
        openApp("safari");
        return ["[Safari] Membuka Safari..."];
      }
      if (target === "finder") {
        openApp("finder");
        return ["[Finder] Membuka Finder..."];
      }
      if (target === "mail") {
        openApp("mail");
        return ["[Mail] Membuka Mail..."];
      }
      if (target === "notes") {
        openApp("notes");
        return ["[Notes] Membuka Notes..."];
      }
      if (target === "photos") {
        openApp("photos");
        return ["[Photos] Membuka Photos..."];
      }
      if (target === "settings") {
        openApp("settings");
        return ["[Settings] Membuka Settings..."];
      }

      return [
        `Target '${target}' tidak ditemukan.`,
        "Ketik 'projects' untuk melihat ID proyek yang valid.",
      ];
    }

    if (cmd === "cv" || cmd === "resume" || cmd === "cat resume") {
      window.open("/resume.pdf", "_blank");
      return ["[CV] Membuka resume.pdf di tab baru..."];
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
          `Nama     : ${p.name}`,
          `Kategori : ${p.category || "-"}`,
          `Tagline  : ${p.tagline}`,
          `Tech     : ${p.tech.join(", ")}`,
          `URL      : ${p.url || "(Internal / Confidential)"}`,
          `Deskripsi: ${p.description}`,
          "",
          `Tips: Ketik 'open ${p.id}' untuk melihat proyek ini di Safari.`,
        ];
      }
      return [`cat: projects/${target}: No such project. Ketik 'projects' untuk daftar lengkap.`];
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
        (s) => s.category.toLowerCase().replace(/\s+/g, "-") === target
      );
      if (foundSkill) return [`${foundSkill.category}: ${foundSkill.items.join(", ")}`];

      return [`cat: ${target}: No such file or directory. Ketik 'help' untuk panduan.`];
    }

    if (cmd === "sudo hire-me") {
      openApp("mail");
      return [
        "[sudo] access granted — you seem trustworthy.",
        "Membuka aplikasi Mail untuk mengirim pesan langsung 📬...",
      ];
    }

    if (cmd === "coffee --brew") {
      return ["☕ Brewing... done. Produktivitas +100%."];
    }

    return [`command not found: ${cmd}`, `ketik 'help' untuk melihat daftar perintah yang tersedia.`];
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setLines((prev) => [...prev, { type: "cmd", text: cmd }]);
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      const out = executeCommand(cmd);
      setLines((prev) => [
        ...prev,
        ...out.map((o) => ({ type: "out" as const, text: o })),
      ]);
    }
    setInput("");
  }

  return (
    <AppFrame
      id="terminal"
      title="Terminal — Skills & CLI"
      icon={<span className="material-symbols-outlined text-[15px] text-terminal-green">terminal</span>}
    >
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-full overflow-y-auto bg-terminal-canvas p-4 font-mono-ui text-[12px] leading-relaxed text-white/90"
      >
        <div className="mb-2 text-white/40">
          {profile.name} — Interactive Shell v1.2. Ketik{" "}
          <span className="text-terminal-green font-semibold">help</span> untuk melihat daftar perintah.
        </div>
        {lines.map((l, i) =>
          l.type === "cmd" ? (
            <div key={i} className="flex gap-2">
              <span className="text-terminal-green">➜</span>
              <span className="text-[var(--accent-300)]">~</span>
              <span>{l.text}</span>
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
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              autoFocus
              spellCheck={false}
            />
          </form>
        )}
      </div>
    </AppFrame>
  );
}
