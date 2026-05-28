"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const projects = [
  {
    id: "01",
    title: "A&K Store",
    category: "Front End / React JS",
    year: "2024",
    description: "Front-end e-commerce application designed for clear navigation, clean visuals, and a fast mobile experience.",
    tags: ["React JS", "Front End", "UI"],
    color: "#0D1F0D",
    accentColor: "#C8FF2E",
  },
  {
    id: "02",
    title: "Certif-Ease",
    category: "Front End / Back End",
    year: "2024",
    description: "Certificate management platform with a simple interface for editing, tracking, and reviewing documents.",
    tags: ["Laravel", "HTML", "CSS"],
    color: "#0D0D1F",
    accentColor: "#8B8BFF",
  },
  {
    id: "03",
    title: "Landing Page Studio",
    category: "Design / SEO",
    year: "2023",
    description: "Lightweight, structured landing pages to present a service or brand with clear visual hierarchy.",
    tags: ["HTML5", "CSS3", "Responsive"],
    color: "#1F0D1F",
    accentColor: "#FF8BE8",
  },
  {
    id: "04",
    title: "Dashboard Admin",
    category: "UI / PHP",
    year: "2023",
    description: "Admin interface built to monitor content, users, and key actions at a glance.",
    tags: ["React", "PHP", "MySQL"],
    color: "#1F0D0D",
    accentColor: "#FF8B8B",
  },
  {
    id: "05",
    title: "Portfolio Web",
    category: "Design / Motion",
    year: "2022",
    description: "Personal website focused on content clarity, readability, and visual identity.",
    tags: ["Next.js", "Design", "Motion"],
    color: "#0D1F1F",
    accentColor: "#8BFFF0",
  },
];

export default function Work() {
  const sectionRef  = useRef<HTMLElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  /* Mouse tracking for the floating card */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cardX  = useSpring(mouseX, { stiffness: 200, damping: 25 });
  const cardY  = useSpring(mouseY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX + 24);
    mouseY.set(e.clientY - 80);
  };

  /* Scroll-triggered entrance */
  useGSAP(() => {
    gsap.from(".work-row", {
      y: 40, opacity: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
    });
    gsap.from(".work-heading", {
      y: 30, opacity: 0, duration: 0.8, ease: "power3.out",
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
    });
  }, { scope: sectionRef });

  const hovered = projects.find(p => p.id === hoveredId) ?? null;

  return (
    <section
      ref={sectionRef}
      id="work"
      onMouseMove={handleMouseMove}
      style={{
        borderBottom: "1px solid var(--line)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
      }}
    >
      {/* ── Top bar ────────────────────────────────────────── */}
      <div
        className="work-heading container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">SELECTED WORK</span>
        <span className="num-label">2022 — 2024</span>
      </div>

      {/* ── Section title ──────────────────────────────────── */}
      <div
        className="work-heading"
        style={{
          padding: "clamp(40px, 6vw, 80px) clamp(24px, 5.5vw, 100px)",
          borderBottom: "1px solid var(--line)",
          overflow: "hidden",
        }}
      >
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(56px, 11.5vw, 160px)",
            lineHeight: 0.92,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: "var(--paper)",
            margin: 0,
          }}
        >
          I Create<br />
          Projects<br />
          That Blend<br />
          <span style={{ color: "var(--accent)" }}>Creativity And Functionality.</span>
        </h2>
      </div>

      {/* ── Project rows ───────────────────────────────────── */}
      {projects.map((project) => {
        const isHovered = hoveredId === project.id;
        return (
          <div
            key={project.id}
            className="work-row container-full"
            onMouseEnter={() => setHoveredId(project.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderBottom: "1px solid var(--line)",
              cursor: "pointer",
              transition: "background 0.3s",
              background: isHovered ? "rgba(255,255,255,0.025)" : "transparent",
            }}
          >
            <div style={{
              display: "flex", alignItems: "center",
              gap: "clamp(16px, 3vw, 48px)",
              padding: "clamp(20px, 3vw, 36px) 0",
            }}>
              {/* Number */}
              <span
                className="num-label"
                style={{ color: isHovered ? "var(--accent)" : "var(--dim)", transition: "color 0.2s", flexShrink: 0 }}
              >
                {project.id}
              </span>

              {/* Title */}
              <h3 style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontWeight: 800,
                fontSize: "clamp(18px, 2vw, 28px)",
                letterSpacing: "-0.01em",
                color: isHovered ? "var(--paper)" : "var(--dim)",
                transition: "color 0.25s",
                lineHeight: 1,
                flex: 1,
              }}>
                {project.title}
              </h3>

              {/* Category + year — hide on small screens */}
              <div className="hidden md:flex items-center gap-8" style={{ flexShrink: 0 }}>
                <span className="num-label" style={{ color: isHovered ? "var(--paper)" : "var(--dim)", transition: "color 0.2s" }}>
                  {project.category}
                </span>
                <span className="num-label">{project.year}</span>
              </div>

              {/* Arrow */}
              <span style={{
                fontSize: "1.2rem",
                color: isHovered ? "var(--accent)" : "transparent",
                transform: isHovered ? "translate(2px,-2px)" : "none",
                transition: "all 0.2s",
                flexShrink: 0,
              }}>
                ↗
              </span>
            </div>
          </div>
        );
      })}

      {/* ── Floating hover card ────────────────────────────── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key={hovered.id}
            style={{
              x: cardX, y: cardY,
              position: "fixed", top: 0, left: 0,
              zIndex: 200, pointerEvents: "none",
              width: "clamp(240px, 22vw, 320px)",
            }}
            initial={{ opacity: 0, scale: 0.88, rotate: -2 }}
            animate={{ opacity: 1, scale: 1,    rotate: 0 }}
            exit={{    opacity: 0, scale: 0.88, rotate: 2 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div style={{
              background: hovered.color,
              border: `1px solid ${hovered.accentColor}22`,
              borderRadius: 4,
              padding: "clamp(20px, 2.5vw, 32px)",
              display: "flex", flexDirection: "column", gap: 16,
            }}>
              {/* Accent bar */}
              <div style={{ width: 32, height: 2, background: hovered.accentColor }} />

              <p style={{
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(12px, 1.1vw, 14px)",
                color: "rgba(242,240,235,0.75)",
                lineHeight: 1.65,
              }}>
                {hovered.description}
              </p>

              {/* Tags */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {hovered.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "var(--font-mono), monospace",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: hovered.accentColor,
                      border: `1px solid ${hovered.accentColor}44`,
                      borderRadius: 2,
                      padding: "3px 8px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
