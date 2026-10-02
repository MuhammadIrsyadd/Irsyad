"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSystemStore, isAnyWindowOpen, appOrder } from "@/store/system-store";
import { getAppMeta } from "@/lib/apps";
import { profile } from "@/lib/content";
import { sound } from "@/lib/sound";

const INTRO_MESSAGE = `Hai, aku ${profile.name} 👋`;

const IDLE_MESSAGES = [
  INTRO_MESSAGE,
  "Coba klik dock di bawah ✨",
  "Psst, buka Mail kalau mau say hi 📬",
  "Liquid glass, bukan sekadar blur biasa loh.",
];

const CLICK_MESSAGES = [
  "Hai! Mau diskusi atau kerja sama? Buka Mail app ya 📬",
  "Psst, coba ketik 'neofetch' atau 'sudo hire-me' di Terminal 😉",
  "Klik dock di bawah buat jelajah project dan resume Irsyad ✨",
  "Kamu menemukan easter egg klik maskot! 🚀",
  "Portofolio ini dibangun dengan Next.js & Framer Motion loh 🍏",
  "Lulusan UPN Veteran Jatim (IPK 3.93) siap berkontribusi! 🎓",
];

export default function Avatar() {
  const ref = useRef<HTMLDivElement>(null);
  const [bubble, setBubble] = useState(IDLE_MESSAGES[0]);
  const [clickSpeech, setClickSpeech] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);
  const [blink, setBlink] = useState(false);

  const windows = useSystemStore((s) => s.windows);
  const hoveredApp = useSystemStore((s) => s.hoveredApp);
  const topZ = useSystemStore((s) => s.topZ);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);

  const anyOpen = isAnyWindowOpen(windows);
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

  // idle bubble rotation
  useEffect(() => {
    const t = setInterval(() => {
      setBubble((prev) => {
        const choices = IDLE_MESSAGES.filter((m) => m !== prev);
        return choices[Math.floor(Math.random() * choices.length)];
      });
    }, 7000);
    return () => clearInterval(t);
  }, []);

  function handleAvatarClick() {
    if (soundEnabled) sound.open();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 600);

    const randomMsg = CLICK_MESSAGES[Math.floor(Math.random() * CLICK_MESSAGES.length)];
    setClickSpeech(randomMsg);

    setTimeout(() => {
      setClickSpeech(null);
    }, 5500);
  }

  // Priority: clicked avatar > hovering dock icon > focused window > idle rotation
  const mood = clickSpeech
    ? clickSpeech
    : hoveredApp
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
            className="glass-modal mb-2 mr-2 max-w-[260px] rounded-2xl rounded-br-none border border-white/20 px-4 py-2.5 text-[13px] leading-snug text-white shadow-2xl backdrop-blur-xl"
          >
            {mood}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        ref={ref}
        onClick={handleAvatarClick}
        animate={
          isJumping
            ? { y: [0, -32, 0], scale: [1, 1.12, 0.94, 1] }
            : { y: [0, -10, 0], rotate: [0, 1, 0] }
        }
        transition={
          isJumping
            ? { duration: 0.5, ease: "easeOut" }
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
        }
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92 }}
        className="pointer-events-auto relative h-48 w-36 cursor-pointer select-none sm:h-80 sm:w-56 lg:h-[26rem] lg:w-72"
        style={{ perspective: 400 }}
        title="Klik aku untuk interaksi!"
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
      </motion.div>
    </div>
  );
}
