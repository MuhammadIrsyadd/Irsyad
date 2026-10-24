"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Wallpaper from "@/components/Wallpaper";
import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import { useSystemStore } from "@/store/system-store";
import { useIsMobile } from "@/hooks/use-media-query";

// The desktop shell is only needed after unlocking, and phones never need
// it at all (nor desktops the mobile home), so each lives in its own chunk.
// They are warmed up while the boot/lock screen is showing.
const loadDesktop = () => import("@/components/Desktop");
const loadMobileHome = () => import("@/components/MobileHome");
const Desktop = dynamic(loadDesktop, { ssr: false });
const MobileHome = dynamic(loadMobileHome, { ssr: false });

export default function HomeClient() {
  const bootStage = useSystemStore((s) => s.bootStage);
  const isMobile = useIsMobile();

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("porto_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        useSystemStore.getState().setTheme(savedTheme);
      }
    } catch {}
  }, []);

  useEffect(() => {
    void (isMobile ? loadMobileHome() : loadDesktop());
  }, [isMobile]);

  return (
    // reducedMotion="user": springs/slides collapse to fades for people
    // who asked their OS for less motion.
    <MotionConfig reducedMotion="user">
      <main className="relative h-full w-full">
        <Wallpaper />

        <AnimatePresence>
          {bootStage === "boot" && <BootScreen key="boot" />}
          {bootStage === "login" && <LoginScreen key="login" />}
          {bootStage === "desktop" && (
            // Lock / shut down: the whole desktop dims, blurs and shrinks
            // away while the lock screen fades in over it.
            <motion.div
              key="desktop"
              className="absolute inset-0"
              initial={false}
              exit={{
                opacity: 0,
                scale: 0.94,
                filter: "blur(18px) brightness(0.4)",
                transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              {isMobile ? <MobileHome /> : <Desktop />}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </MotionConfig>
  );
}
