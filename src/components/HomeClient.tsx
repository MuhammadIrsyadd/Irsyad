"use client";

import { AnimatePresence, motion } from "framer-motion";
import Wallpaper from "@/components/Wallpaper";
import BootScreen from "@/components/BootScreen";
import LoginScreen from "@/components/LoginScreen";
import Desktop from "@/components/Desktop";
import MobileHome from "@/components/MobileHome";
import { useSystemStore } from "@/store/system-store";
import { useIsMobile } from "@/hooks/use-media-query";

export default function HomeClient() {
  const bootStage = useSystemStore((s) => s.bootStage);
  const isMobile = useIsMobile();

  return (
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
  );
}
