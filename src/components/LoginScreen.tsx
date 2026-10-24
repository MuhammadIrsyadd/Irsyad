"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useSystemStore } from "@/store/system-store";
import { useIsMobile } from "@/hooks/use-media-query";
import FadeIn from "@/components/lockscreen/FadeIn";
import DotFieldBackground from "@/components/lockscreen/DotFieldBackground";
import { sound } from "@/lib/sound";

// No input for this long → the avatar starts nudging the visitor to click.
const IDLE_HINT_MS = 7000;
// Where the portrait's face sits inside avatar.webp (fraction of its height)
// and roughly how wide the head is (fraction of its width). Used to aim the
// unlock flight so the face lands exactly on the menu bar's round avatar.
const FACE_Y = 0.25;
const HEAD_W = 0.52;
const AVATAR_ASPECT = 480 / 699; // avatar.webp width / height
// Centre of the small face image in the desktop menu bar (MenuBar.tsx:
// px-5 header + px-2 button + 24px image, h-11 bar).
const MENUBAR_FACE = { x: 40, y: 22, size: 24 };
// Portal reveal timing — the screen's own exit waits for it to finish.
const PORTAL_DELAY = 0.08;
const PORTAL_DURATION = 0.85;

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
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  const [unlocking, setUnlocking] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [portalOpen, setPortalOpen] = useState(false);
  const [flight, setFlight] = useState<{ x: number; y: number; scale: number } | null>(null);
  const [idle, setIdle] = useState(false);
  const normMouse = useRef({ x: 0, y: 0 });
  const lastActivity = useRef(0);
  const avatarRef = useRef<HTMLDivElement>(null);
  const now = useClock();

  // ── Portal mask ─────────────────────────────────────────────────────
  // A hole that grows from the click point and reveals the desktop, which
  // is already mounted underneath by then.
  const portalX = useMotionValue(0);
  const portalY = useMotionValue(0);
  const portalR = useMotionValue(0);
  const portalEdge = useTransform(portalR, (r) => (r === 0 ? 0 : r + 90));
  const portalMask = useMotionTemplate`radial-gradient(circle at ${portalX}px ${portalY}px, transparent ${portalR}px, #000 ${portalEdge}px)`;

  function track(nx: number, ny: number) {
    normMouse.current = { x: nx, y: ny };
  }

  function handlePointerMove(e: React.PointerEvent) {
    track(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5);
    lastActivity.current = performance.now();
    if (idle) setIdle(false);
  }

  // Device orientation / gyroscope on phones drives the background light.
  // (Hand tremor isn't "activity", so it doesn't reset the idle hint.)
  useEffect(() => {
    function handleOrientation(e: DeviceOrientationEvent) {
      if (e.gamma !== null && e.beta !== null) {
        track(
          Math.max(-0.5, Math.min(0.5, e.gamma / 55)),
          Math.max(-0.5, Math.min(0.5, (e.beta - 40) / 55))
        );
      }
    }

    if (typeof window !== "undefined" && window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }
  }, []);

  // Idle watcher: one cheap check per second, state only flips on change.
  useEffect(() => {
    lastActivity.current = performance.now();
    const t = setInterval(() => {
      if (performance.now() - lastActivity.current > IDLE_HINT_MS) setIdle(true);
    }, 1000);
    return () => clearInterval(t);
  }, []);

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
    setIdle(false);

    if (reduceMotion) {
      setTimeout(unlock, 300);
      return;
    }

    // Open the portal from the click point out to the farthest corner.
    const { innerWidth: w, innerHeight: h } = window;
    portalX.set(clickX);
    portalY.set(clickY);
    setPortalOpen(true);
    animate(portalR, Math.hypot(Math.max(clickX, w - clickX), Math.max(clickY, h - clickY)) + 40, {
      delay: PORTAL_DELAY,
      duration: PORTAL_DURATION,
      ease: [0.7, 0, 0.25, 1],
    });

    // Desktop: the portrait shrinks and flies into the menu bar avatar.
    const el = avatarRef.current;
    if (el && !isMobile) {
      const b = el.getBoundingClientRect();
      setFlight({
        x: MENUBAR_FACE.x - (b.left + b.width / 2),
        y: MENUBAR_FACE.y - (b.top + b.height * FACE_Y),
        // on short screens the image is height-capped and letterboxed, so
        // derive the drawn image width from the height, not the box width
        scale: MENUBAR_FACE.size / (Math.min(b.width, b.height * AVATAR_ASPECT) * HEAD_W),
      });
    }

    // Mount the desktop right away so the portal has something to reveal;
    // this screen keeps playing its exit on top of it.
    unlock();
  }

  const time = now?.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }) ?? "";
  const date =
    now?.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }) ?? "";

  const leaveEase = [0.55, 0, 0.75, 0.2] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: reduceMotion
          ? { duration: 0.35 }
          : { delay: PORTAL_DELAY + PORTAL_DURATION, duration: 0.2 },
      }}
      transition={{ duration: 0.5 }}
      onPointerMove={handlePointerMove}
      onClick={handleUnlock}
      className="fixed inset-0 z-[9998] cursor-pointer select-none overflow-hidden"
      style={{
        fontFamily: "var(--font-kanit), 'Kanit', sans-serif",
        pointerEvents: unlocking ? "none" : "auto",
      }}
    >
      {/* Everything except the avatar lives in the masked panel, so the
          portal cuts through background and text but the portrait stays
          whole while it flies to the menu bar. */}
      <motion.div
        className="absolute inset-0 overflow-hidden bg-[#07080c]"
        style={
          portalOpen ? { maskImage: portalMask, WebkitMaskImage: portalMask } : undefined
        }
      >
        <DotFieldBackground mouseRef={normMouse} ripple={ripple} />

        <div className="relative flex h-screen flex-col px-6 md:px-10" style={{ overflowX: "clip" }}>
          {/* Top bar: date + live clock */}
          <motion.div
            animate={unlocking ? { opacity: 0, y: -30 } : undefined}
            transition={{ duration: 0.4, ease: leaveEase }}
          >
            <div>
              <FadeIn
                as="nav"
                delay={0}
                y={-20}
                className="flex justify-between pt-6 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] md:pt-8 md:text-lg lg:text-[1.4rem]"
              >
                <span className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{date}</span>
                <span className="tabular-nums drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">{time}</span>
              </FadeIn>
            </div>
          </motion.div>

          {/* Wordmark — on unlock the letters spread apart and lift away.
              The negative letter-spacing also trims after the last letter, so
              pr/-mr widen the gradient paint box past the D without moving it. */}
          <div>
            <FadeIn as="h1" delay={0.15} y={40}>
              <motion.span
                animate={
                  unlocking
                    ? { letterSpacing: "0.22em", y: -70, opacity: 0 }
                    : { letterSpacing: "-0.025em", y: 0, opacity: 1 }
                }
                transition={{ duration: 0.6, ease: leaveEase }}
                className="hero-heading-shine mt-6 -mr-[0.08em] inline-block whitespace-nowrap pr-[0.08em] text-[13vw] font-black uppercase leading-none sm:mt-4 sm:text-[13.5vw] md:-mt-5 md:text-[14vw] lg:text-[15vw]"
              >
                Hi, i&rsquo;m irsyad
              </motion.span>
            </FadeIn>
          </div>

          <div className="flex-1" />

          {/* Bottom bar */}
          <motion.div
            animate={unlocking ? { opacity: 0, y: 40 } : undefined}
            transition={{ duration: 0.4, ease: leaveEase }}
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
        </div>
      </motion.div>

      {/* Portrait avatar — outside the mask (see above) */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 w-[220px] -translate-x-1/2 sm:w-[280px] md:w-[340px] lg:w-[400px]">
        {/* Idle nudge */}
        <AnimatePresence>
          {idle && !unlocking && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="absolute -top-14 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-2xl rounded-bl-md border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-medium text-[#E7EEF3] shadow-[0_10px_30px_rgba(0,0,0,0.45)] backdrop-blur-md sm:text-[15px]"
              style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}
            >
              Klik di mana saja untuk masuk 👋
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          ref={avatarRef}
          style={{ transformOrigin: `50% ${FACE_Y * 100}%` }}
          animate={
            flight
              ? { x: flight.x, y: flight.y, scale: flight.scale, opacity: [1, 1, 0] }
              : unlocking
                ? { y: 260, opacity: 0 }
                : undefined
          }
          transition={
            flight
              ? {
                  // different curves per axis → the portrait travels in an arc
                  x: { duration: 0.9, ease: [0.6, 0, 0.25, 1] },
                  y: { duration: 0.9, ease: [0.35, 0.1, 0.2, 1] },
                  // scale is perceived logarithmically: ease-out so the
                  // portrait visibly shrinks while it's still travelling
                  scale: { duration: 0.9, ease: [0.15, 0.65, 0.3, 1] },
                  opacity: { duration: 0.9, times: [0, 0.82, 1] },
                }
              : { duration: 0.55, ease: leaveEase }
          }
        >
          <div>
            <FadeIn delay={0.6} y={30}>
              <motion.img
                src="/images/avatar.webp"
                alt="Muh Irsyad"
                draggable={false}
                // slow, barely-there breathing — no sway or tilt
                animate={{ scaleY: [1, 1.01, 1] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ transformOrigin: "50% 100%" }}
                // the soft shadow is dropped for the flight: scaled down it
                // reads as a dark box, and filters on a moving layer are costly
                className={`block h-auto max-h-[58vh] w-full select-none object-contain sm:max-h-[calc(100vh-15vw-30px)] ${
                  unlocking ? "" : "drop-shadow-[0_16px_40px_rgba(0,0,0,0.7)]"
                }`}
              />
            </FadeIn>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
