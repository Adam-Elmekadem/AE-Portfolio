import type { Metadata } from "next";
import ParallaxGallery from "@/components/ui/parallax-gallery";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual showcase of Adam Elmekadem's creative disciplines — web design, front-end development, branding, and full-stack engineering.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    url: "/gallery",
    title: "Gallery | Adam Elmekadem",
    description: "Creative disciplines — web design, motion, branding, and full-stack engineering.",
  },
};

export default function GalleryPage() {
  return <ParallaxGallery />;
}
