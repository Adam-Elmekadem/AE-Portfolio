import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono, Bebas_Neue, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import { ThemeSplitter } from "@/components/ui/ThemeSplitter";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  weight: "400",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://adamelmekadem.dev";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Adam Elmekadem — Full Stack Developer & UI/UX Designer",
    template: "%s | Adam Elmekadem",
  },
  description:
    "Portfolio of Adam Elmekadem, a full-stack developer and graphic designer crafting high-performance web experiences with React, Next.js, GSAP, and Three.js.",
  keywords: [
    "Adam Elmekadem",
    "full stack developer",
    "frontend developer",
    "UI UX designer",
    "React developer",
    "Next.js",
    "GSAP animations",
    "Three.js",
    "web portfolio",
    "creative developer",
    "Morocco developer",
  ],
  authors: [{ name: "Adam Elmekadem", url: BASE_URL }],
  creator: "Adam Elmekadem",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Adam Elmekadem Portfolio",
    title: "Adam Elmekadem — Full Stack Developer & UI/UX Designer",
    description:
      "High-performance web experiences built with React, Next.js, GSAP, and Three.js.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Adam Elmekadem — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adam Elmekadem — Full Stack Developer & UI/UX Designer",
    description:
      "High-performance web experiences built with React, Next.js, GSAP, and Three.js.",
    images: ["/og-image.png"],
    creator: "@adamelmekadem",
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
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${spaceGrotesk.variable} ${spaceMono.variable} ${bebasNeue.variable} ${syne.variable}`}>
      <body>
        <ThemeProvider>
          <TransitionProvider>
            {children}
            <ThemeSplitter />
          </TransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
