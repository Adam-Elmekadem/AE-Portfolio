import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Adam Elmekadem — Full Stack Developer & UI/UX Designer",
  description:
    "Welcome to the portfolio of Adam Elmekadem — a full-stack developer and UI/UX designer building fast, creative web experiences with React, Next.js, GSAP, and Three.js.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "/",
    title: "Adam Elmekadem — Full Stack Developer & UI/UX Designer",
    description:
      "Full-stack developer and UI/UX designer crafting high-performance, visually rich web experiences.",
  },
};

export default function Home() {
  return <HomeClient />;
}
