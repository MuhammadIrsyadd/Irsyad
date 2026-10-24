"use client";

import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";
import Avatar from "@/components/Avatar";
import Spotlight from "@/components/Spotlight";
import DesktopIcons from "@/components/DesktopIcons";
import IdleScreensaver from "@/components/IdleScreensaver";
import HomeLogo from "@/components/HomeLogo";
import DesktopWidgets from "@/components/DesktopWidgets";
import OpenApps from "@/components/apps/OpenApps";
import { useAppShortcuts } from "@/hooks/use-app-shortcuts";

export default function Desktop() {
  useAppShortcuts();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MenuBar />
      <DesktopIcons />

      <DesktopWidgets />

      <div className="absolute inset-0">
        <OpenApps />
      </div>

      <HomeLogo />
      <Avatar />
      <Dock />
      <Spotlight />
      <IdleScreensaver />
    </div>
  );
}
