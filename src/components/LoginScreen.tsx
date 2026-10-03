"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import FadeIn from "@/components/lockscreen/FadeIn";
import Magnet from "@/components/Magnet";
import LiquidAuroraBackground from "@/components/lockscreen/LiquidAuroraBackground";
import { sound } from "@/lib/sound";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only clock, avoids SSR/CSR hydration mismatch
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function LoginScreen() {
  const unlock = useSystemStore((s) => s.unlock);
  const soundEnabled = useSystemStore((s) => s.soundEnabled);
  const [unlocking, setUnlocking] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [normMouse, setNormMouse] = useState({ x: 0, y: 0 });
  const now = useClock();

  // 3D Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 24, stiffness: 140, mass: 0.8 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Parallax layer transforms
  // 1. Giant Wordmark ("Hi, i'm irsyad")
  const titleX = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);
  const titleY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);

  // 2. Top bar (Date & Clock) and Bottom bar
  const barX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const barY = useTransform(smoothY, [-0.5, 0.5], [-6, 6]);

  // 3. Avatar foreground layer with optical 3D tilt
  const avatarX = useTransform(smoothX, [-0.5, 0.5], [36, -36]);
  const avatarY = useTransform(smoothY, [-0.5, 0.5], [20, -20]);
  const avatarRotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
  const avatarRotateX = useTransform(smoothY, [-0.5, 0.5], [8, -8]);

  function handlePointerMove(e: React.PointerEvent) {
    const { innerWidth, innerHeight } = window;
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    mouseX.set(nx);
    mouseY.set(ny);
    setNormMouse({ x: nx, y: ny });
  }

  // Device orientation / gyroscope support for mobile devices
  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.gamma !== null && e.beta !== null) {
        const nx = Math.max(-0.5, Math.min(0.5, e.gamma / 55));
        const ny = Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 55));
        mouseX.set(nx);
        mouseY.set(ny);
        setNormMouse({ x: nx, y: ny });
      }
    }

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, [mouseX, mouseY]);

  function handleUnlock(e: React.MouseEvent) {
    if (unlocking) return;
    const clickX = e.clientX || window.innerWidth / 2;
    const clickY = e.clientY || window.innerHeight / 2;
    setRipple({ x: clickX, y: clickY, id: Date.now() });

    if (soundEnabled) {
      sound.open();
    }

    try {
      sessionStorage.setItem("porto_has_booted", "true");
    } catch {
      // ignore
    }
    setUnlocking(true);
    setTimeout(unlock, 550);
  }

  const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? "";
  const date =
    now?.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) ?? "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
      transition={{ duration: 0.5 }}
      onPointerMove={handlePointerMove}
      onClick={handleUnlock}
      className="fixed inset-0 z-[9998] cursor-pointer select-none bg-[#07080c] overflow-hidden"
      style={{
        fontFamily: "var(--font-kanit), 'Kanit', sans-serif",
        perspective: 1200,
      }}
    >
      {/* Interactive Liquid Aurora Background */}
      <LiquidAuroraBackground
        mousePos={normMouse}
        isUnlocking={unlocking}
        ripple={ripple}
      />

      <motion.div
        animate={{
          filter: unlocking ? "blur(28px)" : "blur(0px)",
          scale: unlocking ? 1.09 : 1,
          opacity: unlocking ? 0 : 1,
        }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="relative flex h-screen flex-col px-6 md:px-10"
        style={{
          overflowX: "clip",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Top bar: date + live clock with Parallax */}
        <motion.div style={{ x: barX, y: barY }}>
          <FadeIn
            as="nav"
            delay={0}
            y={-20}
            className="flex justify-between pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:pt-8 md:text-lg lg:text-[1.4rem]"
          >
            <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{date}</span>
            <span className="tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{time}</span>
          </FadeIn>
        </motion.div>

        {/* Wordmark with Parallax */}
        <motion.div style={{ x: titleX, y: titleY }} className="overflow-hidden">
          <FadeIn as="h1" delay={0.15} y={40}>
            <span className="hero-heading mt-6 block w-full whitespace-nowrap text-[13vw] font-black uppercase leading-none tracking-tight drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:mt-4 sm:text-[13.5vw] md:-mt-5 md:text-[14vw] lg:text-[15vw]">
              Hi, i&rsquo;m irsyad
            </span>
          </FadeIn>
        </motion.div>

        <div className="flex-1" />

        {/* Bottom bar with Parallax */}
        <motion.div
          style={{ x: barX, y: barY }}
          className="relative z-20 flex items-end justify-between pb-7 sm:pb-8 md:pb-10"
        >
          <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
            <p
              className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
              style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
            >
              BUILDING WEB AND MOBILE EXPERIENCES WITH CODE AND CURIOSITY
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <motion.div
              animate={{ opacity: [0.65, 1, 0.65], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px] text-amber-400">touch_app</span>
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#D7E2EA] sm:text-sm">
                Klik untuk masuk
              </span>
            </motion.div>
          </FadeIn>
        </motion.div>

        {/* Portrait Avatar with 3D Spatial Tilt & Parallax */}
        <motion.div
          style={{
            x: avatarX,
            y: avatarY,
            rotateX: avatarRotateX,
            rotateY: avatarRotateY,
            transformStyle: "preserve-3d",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]"
        >
          <FadeIn delay={0.6} y={30}>
            <Magnet
              padding={150}
              magnetStrength={3}
              activeTransition="transform 0.3s ease-out"
              inactiveTransition="transform 0.6s ease-in-out"
              className="pointer-events-auto block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/avatar.png"
                alt="Muh Irsyad"
                draggable={false}
                className="block h-auto w-full select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.7)]"
              />
            </Magnet>
          </FadeIn>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
