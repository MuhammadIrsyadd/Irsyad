"use client";

import { AnimatePresence } from "framer-motion";
import MenuBar from "@/components/MenuBar";
import Dock from "@/components/Dock";
import Avatar from "@/components/Avatar";
import Spotlight from "@/components/Spotlight";
import DesktopIcons from "@/components/DesktopIcons";
import IdleScreensaver from "@/components/IdleScreensaver";
import FinderApp from "@/components/apps/FinderApp";
import TerminalApp from "@/components/apps/TerminalApp";
import SafariApp from "@/components/apps/SafariApp";
import MailApp from "@/components/apps/MailApp";
import NotesApp from "@/components/apps/NotesApp";
import PhotosApp from "@/components/apps/PhotosApp";
import SettingsApp from "@/components/apps/SettingsApp";
import { useSystemStore } from "@/store/system-store";
import { useAppShortcuts } from "@/hooks/use-app-shortcuts";

export default function Desktop() {
  const windows = useSystemStore((s) => s.windows);
  useAppShortcuts();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MenuBar />
      <DesktopIcons />

      <div className="absolute inset-0">
        <AnimatePresence>
          {windows.finder.isOpen && <FinderApp key="finder" />}
          {windows.terminal.isOpen && <TerminalApp key="terminal" />}
          {windows.safari.isOpen && <SafariApp key="safari" />}
          {windows.mail.isOpen && <MailApp key="mail" />}
          {windows.notes.isOpen && <NotesApp key="notes" />}
          {windows.photos.isOpen && <PhotosApp key="photos" />}
          {windows.settings.isOpen && <SettingsApp key="settings" />}
        </AnimatePresence>
      </div>

      <Avatar />
      <Dock />
      <Spotlight />
      <IdleScreensaver />
    </div>
  );
}
