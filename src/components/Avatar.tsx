"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSystemStore, isAnyWindowOpen, appOrder } from "@/store/system-store";
import { getAppMeta } from "@/lib/apps";
import { profile } from "@/lib/content";

const INTRO_MESSAGE = `Hai, aku ${profile.name} 👋`;

const IDLE_MESSAGES = [
  INTRO_MESSAGE,
  "Coba klik dock di bawah ✨",
  "Psst, buka Mail kalau mau say hi 📬",
  "Liquid glass, bukan sekadar blur biasa loh.",
];

export default function Avatar() {
  const ref = useRef<HTMLDivElement>(null);
  const [bubble, setBubble] = useState(IDLE_MESSAGES[0]);
  const [blink, setBlink] = useState(false);
  const windows = useSystemStore((s) => s.windows);
  const hoveredApp = useSystemStore((s) => s.hoveredApp);
  const topZ = useSystemStore((s) => s.topZ);
  const anyOpen = isAnyWindowOpen(windows);
  // Whichever open, non-minimized window currently has focus (topmost z-index).
  const focusedAppId = appOrder.find(
    (id) => windows[id].isOpen && !windows[id].isMinimized && windows[id].zIndex === topZ
  );

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 120, damping: 14 });
  const springY = useSpring(rotateY, { stiffness: 120, damping: 14 });

  const eyeX = useTransform(springY, [-14, 14], [-3, 3]);
  const eyeY = useTransform(springX, [-14, 14], [2, -2]);

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const angleY = Math.max(-14, Math.min(14, dx / 22));
      const angleX = Math.max(-14, Math.min(14, -dy / 30));
      rotateY.set(angleY);
      rotateX.set(angleX);
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [rotateX, rotateY]);

  // idle blink
  useEffect(() => {
    const t = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180);
    }, 4200 + Math.random() * 2000);
    return () => clearInterval(t);
  }, []);

  // idle bubble rotation — AnimatePresence (keyed by message text) handles
  // the crossfade, so this just needs to swap the text periodically.
  useEffect(() => {
    const t = setInterval(() => {
      setBubble((prev) => {
        const choices = IDLE_MESSAGES.filter((m) => m !== prev);
        return choices[Math.floor(Math.random() * choices.length)];
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  // Priority: hovering a dock icon > whichever app is focused & open >
  // idle rotation. Hover reacts instantly since it's the most useful
  // moment to explain what that app does; once a window has focus, the
  // avatar comments on that app specifically instead of going quiet.
  const mood = hoveredApp
    ? getAppMeta(hoveredApp).hint
    : focusedAppId
      ? getAppMeta(focusedAppId).openHint
      : anyOpen
        ? null
        : bubble;

  return (
    <div className="pointer-events-none fixed bottom-[-12px] right-2 z-40 flex flex-col items-end sm:right-8">
      <AnimatePresence>
        {mood && (
          <motion.div
            key={mood}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="glass-modal mb-2 mr-2 max-w-[260px] rounded-2xl rounded-br-none px-4 py-2.5 text-[13px] leading-snug text-white shadow-xl"
          >
            {mood}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        animate={{ y: [0, -10, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-auto relative h-60 w-44 cursor-pointer sm:h-80 sm:w-56 lg:h-[26rem] lg:w-72"
        style={{ perspective: 400 }}
      >
        <div className="absolute inset-0 rounded-full bg-primary-container/30 blur-2xl" />
        <motion.div
          style={{ rotateX: springX, rotateY: springY }}
          className="relative h-full w-full"
        >
          <motion.img
            src="/images/avatar.png"
            alt="Avatar 3D karakter developer, memakai kacamata hitam"
            className="h-full w-full object-contain drop-shadow-[0_16px_24px_rgba(0,0,0,0.6)]"
            style={{ scaleY: blink ? 0.96 : 1 }}
          />
          {/* subtle glint that reads as an eye-glance on the sunglasses lens */}
          <motion.div
            style={{ x: eyeX, y: eyeY }}
            className="pointer-events-none absolute left-[38%] top-[27%] h-2 w-3 rounded-full bg-white/50 blur-[2px]"
          />
        </motion.div>
        <span className="absolute bottom-16 right-5 h-3.5 w-3.5 rounded-full bg-terminal-green ring-2 ring-black/40 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
      </motion.div>
    </div>
  );
}
