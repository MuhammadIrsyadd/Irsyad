"use client";

import { useEffect, useRef, useState } from "react";
import AppFrame from "@/components/AppFrame";
import { profile, skills } from "@/lib/content";

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
  "  whoami          — siapa aku",
  "  ls skills/      — daftar kategori skill",
  "  cat <kategori>  — detail skill (contoh: cat frontend)",
  "  cat contact.txt — cara menghubungiku",
  "  sudo hire-me    — coba aja klik enter :)",
  "  coffee --brew   — bikin kopi virtual",
  "  clear           — bersihkan layar",
  "  help            — tampilkan pesan ini lagi",
];

function runCommand(raw: string): string[] {
  const cmd = raw.trim().toLowerCase();
  if (cmd === "whoami") return [profile.name.toLowerCase().replace(/\s+/g, "-")];
  if (cmd === "help") return HELP_TEXT;
  if (cmd === "ls skills/" || cmd === "ls skills")
    return [skills.map((s) => s.category.toLowerCase().replace(/\s+/g, "-")).join("   ")];
  if (cmd.startsWith("cat ")) {
    const target = cmd.replace("cat ", "").replace(".txt", "");
    if (target === "contact") return [`email: ${profile.email}`, `status: ${profile.availability}`];
    const found = skills.find((s) => s.category.toLowerCase().replace(/\s+/g, "-") === target);
    if (found) return [found.items.join(", ")];
    return [`cat: ${target}: No such file or directory`];
  }
  if (cmd === "sudo hire-me")
    return ["Permintaan diteruskan ke Mail app 📬 (coba buka Mail dari dock).", "[sudo] access granted — you seem trustworthy."];
  if (cmd === "coffee --brew")
    return ["☕ Brewing... done. Produktivitas +100%."];
  if (cmd === "") return [];
  return [`command not found: ${cmd}`, `ketik 'help' buat lihat daftar perintah.`];
}

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>([]);
  const [booted, setBooted] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    async function typeBoot() {
      for (const step of BOOT_SEQUENCE) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 260));
        setLines((prev) => [...prev, { type: "cmd", text: step.cmd }]);
        await new Promise((r) => setTimeout(r, 220));
        setLines((prev) => [...prev, ...step.output.map((o) => ({ type: "out" as const, text: o }))]);
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setLines((prev) => [...prev, { type: "cmd", text: cmd }]);
    if (cmd.trim().toLowerCase() === "clear") {
      setLines([]);
    } else {
      const out = runCommand(cmd);
      setLines((prev) => [...prev, ...out.map((o) => ({ type: "out" as const, text: o }))]);
    }
    setInput("");
  }

  return (
    <AppFrame
      id="terminal"
      title="Terminal — Skills"
      icon={<span className="material-symbols-outlined text-[15px] text-terminal-green">terminal</span>}
    >
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="h-full overflow-y-auto bg-terminal-canvas p-4 font-mono-ui text-[12px] leading-relaxed text-white/90"
      >
        <div className="mb-2 text-white/40">
          {profile.name} — Skills Shell v1.0. Ketik{" "}
          <span className="text-terminal-green">help</span> untuk daftar perintah.
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
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none"
              style={{ caretColor: "var(--accent-400)" }}
              spellCheck={false}
            />
          </form>
        )}
      </div>
    </AppFrame>
  );
}
