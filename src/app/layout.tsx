import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Kanit } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

// Display face for the lock screen hero (the "Hi, i'm irsyad" wordmark).
const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Muh Irsyad — Portfolio OS",
  description:
    "Portofolio interaktif Muh Irsyad, dibungkus sebagai simulasi desktop macOS bermaterial Liquid Glass. Buka Finder, Terminal, Safari, dan Mail untuk menjelajah.",
  icons: {
    icon: "/images/avatar.png",
  },
  openGraph: {
    title: "Muh Irsyad — Portfolio OS",
    description:
      "Portofolio interaktif bergaya desktop macOS Liquid Glass. Klik, jelajah, dan buka tiap 'app' untuk kenal saya lebih jauh.",
    type: "website",
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
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="h-full min-h-full overflow-hidden bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
