import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Kanit } from "next/font/google";
import { ICON_FONT_URL } from "@/lib/icon-font";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  // Only used for small UI labels and the Terminal; no need to block first paint.
  preload: false,
});

// Display face for the lock screen hero (the "Hi, i'm irsyad" wordmark) and
// the desktop clock widget — only the weights actually used are shipped.
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "500", "600", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://muhirsyad.my.id"),
  title: "Muh Irsyad — Portfolio OS",
  description:
    "Hi, namaku Irsyad. Kenalan lebih dekat yuk sama aku! Simulasi desktop macOS Liquid Glass. Klik, jelajah, dan buka tiap 'app' untuk kenal aku lebih jauh.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Muh Irsyad — Portfolio OS",
    description:
      "Hi, namaku Irsyad. Kenalan lebih dekat yuk sama aku! Simulasi desktop macOS Liquid Glass. Klik, jelajah, dan buka tiap 'app' untuk kenal aku lebih jauh.",
    type: "website",
    images: ["/apple-touch-icon.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#111319",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${jetbrainsMono.variable} ${kanit.variable} h-full antialiased dark`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Icon font subset to just the glyphs used in src/ (~80KB instead of ~4MB) */}
        <link rel="stylesheet" href={ICON_FONT_URL} crossOrigin="anonymous" />
      </head>
      <body className="h-full min-h-full overflow-hidden bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
