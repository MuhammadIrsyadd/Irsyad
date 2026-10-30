"use client";

import { memo, useId } from "react";
import type { AppId } from "@/store/system-store";
import SuryaMajapahit from "@/components/icons/SuryaMajapahit";

// Hand-drawn app icons for Portfolio OS. Each one is an object sitting on
// a macOS-style squircle (except the desktop items, which are
// free-standing objects like on a real Mac). All vector, ~1KB each,
// so they stay crisp through the dock magnification.

export type IconId = AppId | "resume" | "folder" | "contact";

const SQUIRCLE = "M50 0C88 0 100 12 100 50S88 100 50 100 0 88 0 50 12 0 50 0Z";

function useIds() {
  const base = useId().replace(/:/g, "");
  return (name: string) => `${base}-${name}`;
}

function Finder() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3f4b" />
          <stop offset="1" stopColor="#15171d" />
        </linearGradient>
        <linearGradient id={id("back")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f59e0b" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={id("front")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <clipPath id={id("face")}>
          <circle cx="66" cy="66" r="15" />
        </clipPath>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <path d="M18 30a5 5 0 0 1 5-5h17l6 6h31a5 5 0 0 1 5 5v36H18Z" fill={`url(#${id("back")})`} />
      <rect x="18" y="37" width="64" height="40" rx="5" fill={`url(#${id("front")})`} />
      <rect x="18" y="37" width="64" height="2" fill="#fff" opacity="0.45" />
      {/* personal folder: the owner's face on the cover */}
      <circle cx="66" cy="66" r="17" fill="#fff" />
      <image
        href="/images/face.webp"
        x="51"
        y="51"
        width="30"
        height="30"
        clipPath={`url(#${id("face")})`}
        preserveAspectRatio="xMidYMid slice"
      />
    </>
  );
}

function Terminal() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a2e37" />
          <stop offset="1" stopColor="#0b0d11" />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <rect x="14" y="18" width="72" height="64" rx="8" fill="#07090c" stroke="#ffffff" strokeOpacity="0.12" />
      <circle cx="23" cy="26" r="2.4" fill="#ff5f56" />
      <circle cx="31" cy="26" r="2.4" fill="#ffbd2e" />
      <circle cx="39" cy="26" r="2.4" fill="#27c93f" />
      <text x="22" y="58" fontFamily="ui-monospace, Menlo, monospace" fontSize="21" fontWeight="700" fill="#34d399">
        ~%
      </text>
      <rect x="55" y="42" width="11" height="19" rx="1.5" fill="#34d399" opacity="0.85" />
      <rect x="22" y="68" width="34" height="3" rx="1.5" fill="#34d399" opacity="0.3" />
    </>
  );
}

function Safari() {
  const id = useIds();
  const ticks = Array.from({ length: 24 }, (_, i) => i * 15);
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <circle cx="50" cy="50" r="34" fill="#fff" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#1e3a8a" strokeOpacity="0.15" strokeWidth="2" />
      {ticks.map((a) => (
        <line
          key={a}
          x1="50"
          y1={a % 90 === 0 ? 20 : 19}
          x2="50"
          y2={a % 90 === 0 ? 27 : 23}
          stroke="#1e3a8a"
          strokeOpacity={a % 90 === 0 ? 0.7 : 0.3}
          strokeWidth={a % 90 === 0 ? 2 : 1.2}
          transform={`rotate(${a} 50 50)`}
        />
      ))}
      {/* needle points north-east — towards the next project */}
      <g transform="rotate(40 50 50)">
        <path d="M50 22 L56 50 L44 50 Z" fill="#ef4444" />
        <path d="M50 78 L56 50 L44 50 Z" fill="#cbd5e1" />
        <circle cx="50" cy="50" r="3" fill="#1e3a8a" />
      </g>
    </>
  );
}

function Mail() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#5b21b6" />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <rect x="16" y="28" width="68" height="46" rx="5" fill="#fff" />
      <path d="M16 74 L42 50 M84 74 L58 50" stroke="#c4b5fd" strokeWidth="2" />
      <path d="M17 30 L50 55 L83 30" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="2" strokeLinejoin="round" />
      {/* wax seal with the Surya emblem */}
      <circle cx="50" cy="55" r="11" fill="#b91c1c" />
      <circle cx="50" cy="55" r="11" fill="none" stroke="#7f1d1d" strokeWidth="1.5" />
      <svg x="42" y="47" width="16" height="16" viewBox="-50 -50 100 100">
        <SuryaMajapahit color="#fecaca" />
      </svg>
    </>
  );
}

function Notes() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#ece8df" />
        </linearGradient>
        <clipPath id={id("clip")}>
          <path d={SQUIRCLE} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id("clip")})`}>
        <rect width="100" height="100" fill={`url(#${id("bg")})`} />
        <rect width="100" height="27" fill="#fbbf24" />
        <rect y="25" width="100" height="2" fill="#d97706" opacity="0.5" />
        {[42, 55, 68, 81].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#cbd5e1" strokeWidth="1.2" />
        ))}
        <line x1="22" y1="27" x2="22" y2="100" stroke="#fca5a5" strokeWidth="1.2" />
      </g>
      {/* a quick handwritten scribble */}
      <path
        d="M28 50c4-6 8-6 9 0s4 6 7 0 5-6 8 0 4 5 8-1M28 63c5-4 10-4 14 0s9 3 14-1"
        fill="none"
        stroke="#92400e"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </>
  );
}

function Photos() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fda4af" />
          <stop offset="1" stopColor="#be185d" />
        </linearGradient>
        <linearGradient id={id("sky")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdba74" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <g transform="rotate(-11 50 52)">
        <rect x="24" y="20" width="50" height="58" rx="2" fill="#fff" opacity="0.75" />
      </g>
      <g transform="rotate(7 50 52)">
        <rect x="25" y="22" width="52" height="60" rx="2" fill="#fff" />
        <rect x="30" y="27" width="42" height="38" fill={`url(#${id("sky")})`} />
        <circle cx="61" cy="37" r="5" fill="#fef3c7" />
        <path d="M30 65 L44 46 L53 57 L59 50 L72 65 Z" fill="#7c2d12" opacity="0.85" />
      </g>
    </>
  );
}

function Settings() {
  const id = useIds();
  const teeth = Array.from({ length: 10 }, (_, i) => i * 36);
  return (
    <>
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d1d5db" />
          <stop offset="1" stopColor="#4b5563" />
        </linearGradient>
        <linearGradient id={id("gear")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f3f4f6" />
          <stop offset="1" stopColor="#9ca3af" />
        </linearGradient>
      </defs>
      <path d={SQUIRCLE} fill={`url(#${id("bg")})`} />
      <g fill={`url(#${id("gear")})`} stroke="#374151" strokeOpacity="0.35" strokeWidth="1">
        {teeth.map((a) => (
          <rect key={a} x="44" y="12" width="12" height="16" rx="2.5" transform={`rotate(${a} 50 50)`} />
        ))}
        <circle cx="50" cy="50" r="27" />
      </g>
      <circle cx="50" cy="50" r="17" fill="#374151" />
      <circle cx="50" cy="50" r="10" fill={`url(#${id("gear")})`} />
    </>
  );
}

function Resume() {
  return (
    <>
      <path d="M22 6h40l18 18v70a4 4 0 0 1-4 4H22a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Z" fill="#fafafa" />
      <path d="M62 6v14a4 4 0 0 0 4 4h14Z" fill="#d4d4d8" />
      <rect x="18" y="58" width="62" height="18" fill="#dc2626" />
      <text x="49" y="72" textAnchor="middle" fontFamily="system-ui, sans-serif" fontWeight="800" fontSize="13" fill="#fff">
        CV
      </text>
      {[30, 37, 44].map((y) => (
        <rect key={y} x="28" y={y} width={y === 44 ? 26 : 40} height="3" rx="1.5" fill="#d4d4d8" />
      ))}
      {[84, 90].map((y) => (
        <rect key={y} x="28" y={y} width="40" height="2.5" rx="1.25" fill="#e4e4e7" />
      ))}
    </>
  );
}

function Folder() {
  const id = useIds();
  return (
    <>
      <defs>
        <linearGradient id={id("f")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fcd34d" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>
      <path d="M6 24a6 6 0 0 1 6-6h24l8 8h44a6 6 0 0 1 6 6v8H6Z" fill="#d97706" />
      <rect x="6" y="32" width="88" height="56" rx="6" fill={`url(#${id("f")})`} />
      <rect x="6" y="32" width="88" height="2.5" fill="#fff" opacity="0.5" />
      <path d="M38 62h24" stroke="#b45309" strokeOpacity="0.45" strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function Contact() {
  const id = useIds();
  return (
    <>
      <defs>
        <clipPath id={id("face")}>
          <circle cx="32" cy="46" r="13" />
        </clipPath>
      </defs>
      <rect x="6" y="18" width="88" height="64" rx="8" fill="#f8fafc" />
      <rect x="6" y="18" width="88" height="14" rx="8" fill="#e2e8f0" />
      <rect x="6" y="26" width="88" height="6" fill="#e2e8f0" />
      <circle cx="32" cy="46" r="14.5" fill="#cbd5e1" />
      <image href="/images/face.webp" x="19" y="33" width="26" height="26" clipPath={`url(#${id("face")})`} />
      {[42, 50, 58].map((y, i) => (
        <rect key={y} x="54" y={y} width={i === 0 ? 28 : 22} height="3.5" rx="1.75" fill={i === 0 ? "#64748b" : "#cbd5e1"} />
      ))}
      <rect x="18" y="68" width="64" height="4" rx="2" fill="#e2e8f0" />
    </>
  );
}

const ICONS: Record<IconId, () => React.JSX.Element> = {
  finder: Finder,
  terminal: Terminal,
  safari: Safari,
  mail: Mail,
  notes: Notes,
  photos: Photos,
  settings: Settings,
  resume: Resume,
  folder: Folder,
  contact: Contact,
};

// memo: icons only depend on their id, and the dock re-renders whenever any
// window changes — no reason to rebuild every SVG each time.
function AppIcon({ id, className }: { id: IconId; className?: string }) {
  const Icon = ICONS[id];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <Icon />
    </svg>
  );
}

export default memo(AppIcon);
