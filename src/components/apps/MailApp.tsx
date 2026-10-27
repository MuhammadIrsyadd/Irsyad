"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion } from "framer-motion";
import AppFrame from "@/components/AppFrame";
import SuryaMajapahit from "@/components/icons/SuryaMajapahit";
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
const EMAILJS_CONFIGURED = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

// Length of the envelope animation; the mailto fallback waits for it.
const ENVELOPE_MS = 2300;

/** Letter slides into an envelope, the flap folds shut, a Surya wax seal
 *  is pressed on, and the whole thing flies off. */
function EnvelopeSend({ subject }: { subject: string }) {
  return (
    <motion.div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative h-[150px] w-[230px]"
        style={{ perspective: 600 }}
        initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
        animate={{ x: 340, y: -260, rotate: -16, scale: 0.35, opacity: 0 }}
        transition={{ delay: 1.55, duration: 0.65, ease: [0.55, 0, 0.8, 0.4] }}
      >
        {/* envelope back */}
        <div className="absolute inset-0 rounded-md bg-[#e9e1d0]" />
        {/* letter */}
        <motion.div
          className="absolute inset-x-4 rounded-sm bg-white p-3 shadow-md"
          initial={{ top: -120, height: 150 }}
          animate={{ top: 18, height: 120 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.3, 0, 0.2, 1] }}
        >
          <p className="truncate text-[10px] font-semibold text-neutral-800">{subject || "Pesan baru"}</p>
          {[78, 92, 64, 85].map((w, i) => (
            <div key={i} className="mt-1.5 h-[3px] rounded bg-neutral-200" style={{ width: `${w}%` }} />
          ))}
        </motion.div>
        {/* front pocket */}
        <svg viewBox="0 0 230 150" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M0 0 L115 72 L230 0 L230 150 L0 150 Z" fill="#f4eee1" />
          <path d="M0 150 L100 82 M230 150 L130 82" stroke="#d8ccb4" strokeWidth="1.5" />
        </svg>
        {/* flap folding shut */}
        <motion.svg
          viewBox="0 0 230 80"
          className="absolute inset-x-0 top-0 h-[80px] w-full"
          style={{ transformOrigin: "50% 0%" }}
          initial={{ rotateX: 180 }}
          animate={{ rotateX: 0 }}
          transition={{ delay: 0.8, duration: 0.4, ease: "easeInOut" }}
          aria-hidden
        >
          <path d="M0 0 L115 72 L230 0 Z" fill="#e2d8c3" stroke="#d1c4a8" strokeWidth="1.5" />
        </motion.svg>
        {/* wax seal */}
        <motion.div
          className="absolute left-1/2 top-[52px] flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-[#b91c1c] shadow-[0_3px_8px_rgba(0,0,0,0.35)]"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: [0, 1.25, 1], rotate: 0 }}
          transition={{ delay: 1.2, duration: 0.35 }}
        >
          <SuryaMajapahit className="h-7 w-7" color="#fecaca" />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function MailApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [flying, setFlying] = useState(false);

  function validate() {
    if (!name.trim()) return "Nama belum diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid.";
    if (!subject.trim()) return "Subject belum diisi.";
    if (!body.trim() || body.trim().length < 10) return "Pesan terlalu pendek (min. 10 karakter).";
    return "";
  }

  function playEnvelope() {
    setFlying(true);
    return new Promise<void>((r) => setTimeout(() => {
      setFlying(false);
      r();
    }, ENVELOPE_MS));
  }

  function reset() {
    setName("");
    setEmail("");
    setSubject("");
    setBody("");
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
        // send and animate at the same time; the success state shows once both are done
        await Promise.all([
          emailjs.send(
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
          ),
          playEnvelope(),
        ]);
        setStatus("sent");
        reset();
      } catch {
        setFlying(false);
        setError("Gagal terkirim, coba lagi atau pakai email langsung.");
        setStatus("error");
      }
      return;
    }

    // Fallback: no EmailJS keys configured yet, open the visitor's own
    // email client with everything pre-filled once the envelope has flown.
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(
      `[Portfolio] ${subject}`
    )}&body=${encodeURIComponent(`${body}\n\n— ${name} (${email})`)}`;
    await playEnvelope();
    window.location.href = mailto;
    setStatus("sent");
  }

  const field =
    "flex-1 bg-transparent py-2 text-[13px] text-white outline-none placeholder:text-white/30";

  return (
    <AppFrame id="mail" title="Mail — Contact" minWidth={420}>
      <form onSubmit={handleSend} className="relative flex h-full flex-col">
        {/* toolbar */}
        <div className="hairline flex items-center justify-between border-b bg-black/20 px-4 py-2">
          <span className="text-[13px] font-semibold text-white">Pesan baru</span>
          <button
            type="submit"
            disabled={status === "sending"}
            title="Kirim"
            className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[12px] font-medium text-white/80 transition hover:bg-white/[0.1] hover:text-white disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px] text-[var(--accent-400)]">send</span>
            {status === "sending" ? "Mengirim…" : "Kirim"}
          </button>
        </div>

        {/* header rows */}
        <div className="px-4 text-[13px]">
          <div className="hairline flex items-center gap-3 border-b py-2">
            <span className="w-16 text-white/50">Ke:</span>
            <span className="rounded bg-[var(--accent-500)]/20 px-1.5 py-0.5 text-white/90">{profile.email}</span>
          </div>
          <label className="hairline flex items-center gap-3 border-b">
            <span className="w-16 text-white/50">Dari:</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="emailmu@contoh.com"
              type="email"
              className={field}
            />
          </label>
          <label className="hairline flex items-center gap-3 border-b">
            <span className="w-16 text-white/50">Nama:</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" className={field} />
          </label>
          <label className="hairline flex items-center gap-3 border-b">
            <span className="w-16 text-white/50">Subjek:</span>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Mau ngobrolin apa?"
              className={`${field} font-medium`}
            />
          </label>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Tulis pesanmu di sini…"
          className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 text-[13.5px] leading-relaxed text-white outline-none placeholder:text-white/30"
        />

        <div className="hairline border-t px-4 py-2 text-[11.5px] text-white/50">
          {error && status === "error" ? (
            <span className="text-red-400">{error}</span>
          ) : status === "sent" ? (
            <span className="text-emerald-500">
              {EMAILJS_CONFIGURED
                ? "Terkirim. Makasih sudah menghubungi, aku balas secepatnya."
                : "Aplikasi email kamu sudah dibuka dengan pesan ini, tinggal tekan kirim."}
            </span>
          ) : EMAILJS_CONFIGURED ? (
            "Pesan langsung masuk ke inbox-ku."
          ) : (
            "Pesan akan dibuka di aplikasi email kamu."
          )}
        </div>

        <AnimatePresence>{flying && <EnvelopeSend subject={subject} />}</AnimatePresence>
      </form>
    </AppFrame>
  );
}
