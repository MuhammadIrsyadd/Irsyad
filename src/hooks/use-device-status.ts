"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

// Real device status for the menu bar instead of hard-coded numbers.

function subscribeOnline(cb: () => void) {
  window.addEventListener("online", cb);
  window.addEventListener("offline", cb);
  return () => {
    window.removeEventListener("online", cb);
    window.removeEventListener("offline", cb);
  };
}

/** navigator.onLine, kept in sync with online/offline events. */
export function useOnline() {
  return useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true
  );
}

type BatteryManager = EventTarget & { level: number; charging: boolean };
export type BatteryState = { level: number; charging: boolean } | null;

/** Battery level (0-1) and charging state from the Battery Status API.
 *  null where the browser doesn't expose it (Firefox, Safari) — callers
 *  should then simply not show a battery. */
export function useBattery(): BatteryState {
  const [state, setState] = useState<BatteryState>(null);

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> };
    if (!nav.getBattery) return;
    let battery: BatteryManager | null = null;
    const update = () => battery && setState({ level: battery.level, charging: battery.charging });
    nav
      .getBattery()
      .then((b) => {
        battery = b;
        update();
        b.addEventListener("levelchange", update);
        b.addEventListener("chargingchange", update);
      })
      .catch(() => {});
    return () => {
      battery?.removeEventListener("levelchange", update);
      battery?.removeEventListener("chargingchange", update);
    };
  }, []);

  return state;
}

/** Material Symbols name for a battery state. */
export function batteryIcon(b: { level: number; charging: boolean }) {
  if (b.charging) return b.level >= 0.95 ? "battery_charging_full" : "battery_charging_80";
  if (b.level >= 0.95) return "battery_full";
  if (b.level >= 0.8) return "battery_6_bar";
  if (b.level >= 0.6) return "battery_5_bar";
  if (b.level >= 0.45) return "battery_4_bar";
  if (b.level >= 0.3) return "battery_3_bar";
  if (b.level >= 0.15) return "battery_2_bar";
  return "battery_1_bar";
}
