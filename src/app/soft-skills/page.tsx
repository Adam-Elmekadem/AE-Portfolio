import type { Metadata } from "next";
import SoftSkills from "@/components/sections/SoftSkills";

export const metadata: Metadata = {
  title: "Soft Skills",
  description:
    "Explore the interpersonal, leadership, and mindset skills Adam Elmekadem brings to every project — from communication and teamwork to critical thinking and adaptability.",
  alternates: {
    canonical: "/soft-skills",
  },
  openGraph: {
    url: "/soft-skills",
    title: "Soft Skills | Adam Elmekadem",
    description:
      "The human capabilities behind the code — interpersonal, leadership, and mindset skills.",
  },
};

export default function SoftSkillsPage() {
  return <SoftSkills />;
}
