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
  title: "Muh Irsyad — Full-Stack & Mobile Developer",
  description:
    "Portfolio resmi Muh. Irsyad Dwi Kurniawan (Muh Irsyad). Full-Stack & Mobile Developer (Next.js, Laravel, Kotlin). Simulasi desktop macOS Liquid Glass interaktif.",
  keywords: [
    "Muh Irsyad",
    "Muh. Irsyad Dwi Kurniawan",
    "Muhammad Irsyad",
    "Irsyad",
    "muhirsyad",
    "muhirsyad.my.id",
    "Portfolio Muh Irsyad",
    "Web Developer Indonesia",
    "Full-Stack Developer",
    "Mobile Developer",
    "Laravel",
    "Next.js",
    "Kotlin",
    "Mojokerto",
    "Surabaya",
  ],
  authors: [{ name: "Muh. Irsyad Dwi Kurniawan", url: "https://muhirsyad.my.id" }],
  creator: "Muh. Irsyad Dwi Kurniawan",
  publisher: "Muh. Irsyad Dwi Kurniawan",
  alternates: {
    canonical: "https://muhirsyad.my.id",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    title: "Muh Irsyad — Full-Stack & Mobile Developer | Portfolio OS",
    description:
      "Portfolio resmi Muh. Irsyad Dwi Kurniawan. Jelajahi pengalaman, proyek, dan keahlian web & mobile development dalam antarmuka desktop macOS interaktif.",
    url: "https://muhirsyad.my.id",
    siteName: "Muh Irsyad Portofolio",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/apple-touch-icon.png",
        width: 180,
        height: 180,
        alt: "Muh Irsyad Portofolio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Muh Irsyad — Full-Stack & Mobile Developer | Portfolio OS",
    description:
      "Portfolio resmi Muh. Irsyad Dwi Kurniawan. Full-Stack & Mobile Developer (Next.js, Laravel, Kotlin).",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://muhirsyad.my.id/#person",
      name: "Muh. Irsyad Dwi Kurniawan",
      alternateName: ["Muh Irsyad", "Irsyad", "muhirsyad"],
      url: "https://muhirsyad.my.id",
      jobTitle: "Full-Stack & Mobile Developer",
      sameAs: [
        "https://github.com/MuhammadIrsyadd",
        "https://www.linkedin.com/in/muh-irsyad-dwi-kurniawan/",
        "https://www.instagram.com/irsyad_dwi/",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mojokerto",
        addressRegion: "Jawa Timur",
        addressCountry: "ID",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "UPN 'Veteran' Jawa Timur",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://muhirsyad.my.id/#website",
      url: "https://muhirsyad.my.id",
      name: "Muh Irsyad Portfolio OS",
      description:
        "Portfolio resmi Muh. Irsyad Dwi Kurniawan (Muh Irsyad) berbasis desktop macOS Liquid Glass interaktif.",
      publisher: {
        "@id": "https://muhirsyad.my.id/#person",
      },
      inLanguage: "id-ID",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="h-full min-h-full overflow-hidden bg-background text-on-surface">
        {children}
      </body>
    </html>
  );
}
