"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const projects = [
  {
    id: "01",
    title: "A&K Store",
    category: "Front End / React JS",
    year: "2024",
    description: "Front-end e-commerce application designed for clear navigation, clean visuals, and a fast mobile experience.",
    tags: ["React JS", "Front End", "UI"],
    color: "#1A2A1A",
    accentColor: "#C8FF2E",
  },
  {
    id: "02",
    title: "Certif-Ease",
    category: "Front End / Back End",
    year: "2024",
    description: "Certificate management platform with a simple interface for editing, tracking, and reviewing documents.",
    tags: ["Laravel", "HTML", "CSS"],
    color: "#1A1A2A",
    accentColor: "#8B8BFF",
  },
  {
    id: "03",
    title: "Landing Page Studio",
    category: "Design / SEO",
    year: "2023",
    description: "Lightweight, structured landing pages to present a service or brand with clear visual hierarchy.",
    tags: ["HTML5", "CSS3", "Responsive"],
    color: "#2A1A2A",
    accentColor: "#FF8BE8",
  },
  {
    id: "04",
    title: "Dashboard Admin",
    category: "UI / PHP",
    year: "2023",
    description: "Admin interface built to monitor content, users, and key actions at a glance.",
    tags: ["React", "PHP", "MySQL"],
    color: "#2A1A1A",
    accentColor: "#FF8B8B",
  },
  {
    id: "05",
    title: "Portfolio Web",
    category: "Design / Motion",
    year: "2022",
    description: "Personal website focused on content clarity, readability, and visual identity.",
    tags: ["Next.js", "Design", "Motion"],
    color: "#1A2A2A",
    accentColor: "#8BFFF0",
  },
];

function ProjectThumb({ color, accentColor, title }: { color: string; accentColor: string; title: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: color, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 24, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "30%", right: "20%", width: 80, height: 80, border: `1px solid ${accentColor}40`, borderRadius: "50%" }} />
      <div style={{ position: "absolute", top: "20%", left: "15%", width: 40, height: 40, background: `${accentColor}20`, transform: "rotate(45deg)" }} />
      <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.1em", color: accentColor, textTransform: "uppercase", position: "relative", zIndex: 1 }}>{title}</span>
    </div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useGSAP(() => {
    const lines = sectionRef.current?.querySelectorAll(".work-reveal") ?? [];
    gsap.from(lines, {
      yPercent: 100,
      duration: 0.9,
      stagger: 0.08,
      ease: "power4.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%", toggleActions: "play none none reverse" },
    });
    gsap.from(".work-row", {
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: ".work-list", start: "top 80%", toggleActions: "play none none reverse" },
    });
  }, { scope: sectionRef });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY - 140);
  };

  return (
    <section ref={sectionRef} id="work" className="section" onMouseMove={handleMouseMove}>
      {/* Header bar */}
      <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ overflow: "hidden" }}><span className="work-reveal num-label block">SELECTED WORK</span></div>
        <div style={{ overflow: "hidden" }}><span className="work-reveal num-label block">{projects.length} PROJECTS</span></div>
      </div>

      {/* Heading */}
      <div className="container-full" style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 6vw, 80px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ overflow: "hidden" }}>
          <div className="work-reveal font-display" style={{ fontSize: "clamp(52px, 10vw, 130px)", lineHeight: 0.88, letterSpacing: "-0.02em", color: "var(--paper)" }}>WHAT I HAVE</div>
        </div>
        <div style={{ overflow: "hidden" }}>
          <div className="work-reveal font-display" style={{ fontSize: "clamp(52px, 10vw, 130px)", lineHeight: 0.88, letterSpacing: "-0.02em", color: "var(--accent)" }}>BUILT.</div>
        </div>
      </div>

      {/* List */}
      <div className="work-list">
        {projects.map((project, i) => (
          <div key={project.id} className="work-row" onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
            style={{ borderBottom: "1px solid var(--line)", cursor: "pointer", position: "relative", transition: "background 0.3s ease", background: hoveredIdx === i ? "var(--line)" : "transparent" }}>
            <div className="container-full grid items-center gap-4" style={{ gridTemplateColumns: "60px 1fr auto auto", padding: "clamp(20px, 3vw, 36px) clamp(20px, 4vw, 80px)" }}>
              <span className="num-label" style={{ color: hoveredIdx === i ? "var(--accent)" : "var(--dim)", transition: "color 0.2s", fontSize: 12 }}>{project.id}</span>
              <div>
                <div style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)", color: "var(--paper)", letterSpacing: "-0.02em", marginBottom: 4 }}>{project.title}</div>
                <div style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, letterSpacing: "0.08em", color: "var(--dim)", textTransform: "uppercase" }}>{project.category}</div>
              </div>
              <div className="hidden md:flex gap-2">
                {project.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
              </div>
              <div className="flex items-center gap-4">
                <span className="num-label hidden sm:block">{project.year}</span>
                <motion.span animate={{ x: hoveredIdx === i ? 6 : 0, y: hoveredIdx === i ? -6 : 0, color: hoveredIdx === i ? "var(--accent)" : "var(--dim)" }} transition={{ duration: 0.25 }} style={{ fontSize: "1.2rem", display: "inline-block" }}>↗</motion.span>
              </div>
            </div>
            <AnimatePresence>
              {hoveredIdx === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} style={{ overflow: "hidden" }}>
                  <div className="container-full" style={{ paddingTop: 0, paddingBottom: "clamp(16px, 2vw, 24px)", paddingLeft: "clamp(20px, 4vw, 80px)", paddingRight: "clamp(20px, 4vw, 80px)", display: "grid", gridTemplateColumns: "60px 1fr", gap: 16 }}>
                    <div />
                    <p style={{ fontFamily: "var(--font-space), sans-serif", fontSize: "clamp(13px, 1.5vw, 15px)", color: "var(--dim)", lineHeight: 1.7, maxWidth: 520 }}>{project.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Floating thumbnail */}
      <AnimatePresence>
        {hoveredIdx !== null && (
          <motion.div key={hoveredIdx} initial={{ opacity: 0, scale: 0.9, clipPath: "inset(100% 0 0 0)" }} animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0 0 0)" }} exit={{ opacity: 0, scale: 0.95, clipPath: "inset(0 0 100% 0)" }} transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "fixed" as const, left: 0, top: 0, x: springX, y: springY, width: "clamp(200px, 20vw, 300px)", height: "clamp(130px, 14vw, 200px)", pointerEvents: "none", zIndex: 500, borderRadius: 4, overflow: "hidden", border: "1px solid var(--line-light)" }}>
            <ProjectThumb color={projects[hoveredIdx].color} accentColor={projects[hoveredIdx].accentColor} title={projects[hoveredIdx].title} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
