import type { Metadata } from "next";
import DemoOne from "@/components/ui/demo";

export const metadata: Metadata = {
  title: "Demo",
  description: "Interactive UI demo showcasing creative components and animations by Adam Elmekadem.",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    url: "/demo",
    title: "Demo | Adam Elmekadem",
    description: "Interactive UI demo showcasing creative components and animations.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function DemoPage() {
  return <DemoOne />;
}