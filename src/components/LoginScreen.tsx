"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import FadeIn from "@/components/lockscreen/FadeIn";
import Magnet from "@/components/lockscreen/Magnet";

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
  const [unlocking, setUnlocking] = useState(false);
  const now = useClock();

  function handleUnlock() {
    if (unlocking) return;
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
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
      transition={{ duration: 0.5 }}
      onClick={handleUnlock}
      className="fixed inset-0 z-[9998] cursor-pointer bg-[#0C0C0C]"
      style={{ fontFamily: "var(--font-kanit), 'Kanit', sans-serif" }}
    >
      <motion.div
        animate={{
          filter: unlocking ? "blur(24px)" : "blur(0px)",
          scale: unlocking ? 1.08 : 1,
          opacity: unlocking ? 0 : 1,
        }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
        className="relative flex h-screen flex-col px-6 md:px-10"
        style={{ overflowX: "clip" }}
      >
        {/* Top bar: date + live clock (where a nav would sit) */}
        <FadeIn
          as="nav"
          delay={0}
          y={-20}
          className="flex justify-between pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:pt-8 md:text-lg lg:text-[1.4rem]"
        >
          <span>{date}</span>
          <span className="tabular-nums">{time}</span>
        </FadeIn>

        {/* Wordmark */}
        <div className="overflow-hidden">
          <FadeIn as="h1" delay={0.15} y={40}>
            <span className="hero-heading mt-6 block w-full whitespace-nowrap text-[13vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[13.5vw] md:-mt-5 md:text-[14vw] lg:text-[15vw]">
              Hi, i&rsquo;m irsyad
            </span>
          </FadeIn>
        </div>

        <div className="flex-1" />

        {/* Bottom bar */}
        <div className="relative z-20 flex items-end justify-between pb-7 sm:pb-8 md:pb-10">
          <FadeIn delay={0.35} y={20} className="max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
            <p
              className="font-light uppercase leading-snug tracking-wide text-[#D7E2EA]"
              style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
            >
              a creative developer driven by crafting striking and unforgettable interfaces
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <motion.span
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block text-xs font-medium uppercase tracking-widest text-[#D7E2EA] sm:text-sm md:text-base"
            >
              Klik untuk masuk
            </motion.span>
          </FadeIn>
        </div>

        {/* Portrait */}
        <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
          <FadeIn delay={0.6} y={30}>
            <Magnet padding={150} magnetStrength={3} activeTransition="transform 0.3s ease-out" inactiveTransition="transform 0.6s ease-in-out" className="block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/avatar.png"
                alt="Muh Irsyad"
                draggable={false}
                className="block h-auto w-full select-none"
              />
            </Magnet>
          </FadeIn>
        </div>
      </motion.div>
    </motion.div>
  );
}
