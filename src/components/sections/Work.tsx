"use client";

import { ArgentSlider, type SliderProject } from "@/components/ui/argent-loop-infinite-slider";

const PROJECTS: SliderProject[] = [
  {
    title:       "A&K Store",
    image:       "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    category:    "Front End / React JS",
    year:        "2024",
    description: "E-commerce front-end with clean visuals and fast mobile UX.",
  },
  {
    title:       "Certif-Ease",
    image:       "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2011&auto=format&fit=crop",
    category:    "Front End / Back End",
    year:        "2024",
    description: "Certificate management platform built with Laravel.",
  },
  {
    title:       "Landing Page Studio",
    image:       "https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=2064&auto=format&fit=crop",
    category:    "Design / SEO",
    year:        "2023",
    description: "Lightweight landing pages with clear visual hierarchy.",
  },
  {
    title:       "Dashboard Admin",
    image:       "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
    category:    "UI / PHP",
    year:        "2023",
    description: "Admin interface for monitoring content and key actions.",
  },
  {
    title:       "Portfolio Web",
    image:       "https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1880&auto=format&fit=crop",
    category:    "Design / Motion",
    year:        "2022",
    description: "Personal portfolio focused on identity and motion.",
  },
];

export default function Work() {
  return (
    <section id="work">
      <ArgentSlider projects={PROJECTS} />
    </section>
  );
}
