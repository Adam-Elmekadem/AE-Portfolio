import type { Metadata } from "next";
import SocialsClient from "./SocialsClient";

export const metadata: Metadata = {
  title: "Socials",
  description:
    "Connect with Adam Elmekadem across GitHub, LinkedIn, Twitter, Instagram, Behance, and more.",
  alternates: { canonical: "/socials" },
  openGraph: {
    url: "/socials",
    title: "Socials | Adam Elmekadem",
    description: "All the places you can find Adam Elmekadem online.",
  },
};

export default function SocialsPage() {
  return <SocialsClient />;
}
