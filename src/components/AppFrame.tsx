"use client";

import type { ReactNode } from "react";
import Window from "@/components/Window";
import MobileAppSheet from "@/components/MobileAppSheet";
import { useIsMobile } from "@/hooks/use-media-query";
import type { AppId } from "@/store/system-store";

export default function AppFrame({
  id,
  title,
  icon,
  children,
  headerExtra,
  minWidth,
  minHeight,
}: {
  id: AppId;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  headerExtra?: ReactNode;
  minWidth?: number;
  minHeight?: number;
}) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <MobileAppSheet id={id} title={title} icon={icon}>
        {children}
      </MobileAppSheet>
    );
  }

  return (
    <Window
      id={id}
      title={title}
      icon={icon}
      headerExtra={headerExtra}
      minWidth={minWidth}
      minHeight={minHeight}
    >
      {children}
    </Window>
  );
}
