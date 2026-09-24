"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import AppFrame from "@/components/AppFrame";
import Magnet from "@/components/Magnet";
import { profile } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

// EmailJS (client-side, free tier) sends the message straight to your
// inbox without a backend. Create a free account at emailjs.com, add an
// Email Service + Template, then put the 3 IDs in .env.local (see
// .env.local.example). Until those are set, the form falls back to
// opening the visitor's own email client via `mailto:` — same as before.
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const EMAILJS_CONFIGURED = Boolean(
  EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY
);

export default function MailApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  function validate() {
    if (!name.trim()) return "Nama belum diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid.";
    if (!subject.trim()) return "Subject belum diisi.";
    if (!body.trim() || body.trim().length < 10) return "Pesan terlalu pendek (min. 10 karakter).";
    return "";
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setStatus("error");
      return;
    }
    setError("");
    setStatus("sending");

    if (EMAILJS_CONFIGURED) {
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID!,
          EMAILJS_TEMPLATE_ID!,
          {
            from_name: name,
            from_email: email,
            subject: `[Portfolio] ${subject}`,
            message: body,
            to_email: profile.email,
          },
          { publicKey: EMAILJS_PUBLIC_KEY! }
        );
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setBody("");
      } catch {
        setError("Gagal terkirim, coba lagi atau pakai email langsung.");
        setStatus("error");
      }
      return;
    }

    // Fallback: no EmailJS keys configured yet, open the visitor's own
    // email client with everything pre-filled.
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      `[Portfolio] ${subject}`
    )}&body=${encodeURIComponent(`${body}\n\n— ${name} (${email})`)}`;
    setTimeout(() => {
      window.location.href = mailto;
      setStatus("sent");
    }, 400);
  }

  return (
    <AppFrame
      id="mail"
      title="Mail — Contact"
      icon={<span className="material-symbols-outlined text-[15px] text-purple-300">mail</span>}
      minWidth={420}
    >
      <form onSubmit={handleSend} className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/20 px-4 py-2.5">
          <span className="text-[13px] font-semibold text-white">New Message</span>
          <span className="text-[10px] text-white/40">Draft</span>
        </div>

        <div className="flex flex-col gap-2.5 border-b border-white/10 px-4 py-3 text-[12px]">
          <div className="flex items-center gap-3">
            <span className="w-14 text-white/40">To:</span>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-white/80">
              {profile.email}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-white/40">From:</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailmu@contoh.com"
              type="email"
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-white outline-none placeholder:text-white/30 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-white/40">Name:</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-white outline-none placeholder:text-white/30 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-14 text-white/40">Subject:</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mau ngobrolin apa?"
              className="flex-1 rounded-md border border-white/10 bg-black/30 px-2.5 py-1.5 text-white outline-none placeholder:text-white/30 focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
            />
          </div>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis pesanmu di sini..."
          className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 text-[13px] text-white outline-none placeholder:text-white/30"
        />

        <div className="flex items-center justify-between border-t border-white/10 bg-black/20 px-4 py-3">
          <span className="text-[11px] text-white/40">
            {error && status === "error" ? (
              <span className="text-red-400">{error}</span>
            ) : status === "sent" ? (
              <span className="text-emerald-400">
                {EMAILJS_CONFIGURED
                  ? "Terkirim! Makasih sudah menghubungi 🙌"
                  : "Terkirim! Aplikasi email default kamu akan terbuka."}
              </span>
            ) : EMAILJS_CONFIGURED ? (
              "Langsung masuk ke inbox-ku."
            ) : (
              "Terkirim via klien email defaultmu."
            )}
          </span>
          <Magnet padding={26} magnetStrength={7}>
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--accent-500)] to-[var(--accent-600)] px-4 py-1.5 text-xs font-semibold text-black shadow-[0_4px_16px_var(--accent-glow)] transition-transform active:scale-95 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-sm">send</span>
              {status === "sending" ? "Mengirim..." : "Send"}
            </button>
          </Magnet>
        </div>
      </form>
    </AppFrame>
  );
}
