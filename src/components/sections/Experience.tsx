"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const experience = [
  {
    id: "01",
    role: "SNRT Internship",
    company: "SNRT",
    period: "1 month",
    type: "Internship",
    description: "Developed a Laravel application under the supervision of the head of the building and television archive service.",
    highlights: ["Video archives", "Laravel application", "Supervised work"],
  },
  {
    id: "02",
    role: "Graphic Designer Freelance",
    company: "Upwork & Fiverr",
    period: "2022 — 2024",
    type: "Freelance",
    description: "Graphic design experience for international clients, including visual identity development, creative project management, and collaboration.",
    highlights: ["Visual identities", "International clients", "Collaboration"],
  },
  {
    id: "03",
    role: "Personal Projects",
    company: "Continuous Learning",
    period: "2020 — 2022",
    type: "Independent",
    description: "Built web projects to improve front-end mastery, interface design, and content structure.",
    highlights: ["HTML / CSS", "React", "UI claire"],
  },
  {
    id: "04",
    role: "Technical Learning",
    company: "Web and digital design",
    period: "2018 — 2020",
    type: "Self-taught",
    description: "Learned web development fundamentals, graphic design, and the tools needed to build clean and effective interfaces.",
    highlights: ["Web fundamentals", "Design tools", "Autonomy"],
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Heading
      const lines = sectionRef.current?.querySelectorAll(".exp-line") ?? [];
      gsap.from(lines, {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".exp-heading",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      // Rows
      gsap.from(".exp-row", {
        opacity: 0,
        y: 16,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-list",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="experience" className="section">
      {/* Label bar */}
      <div
        className="container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">PROFESSIONAL EXPERIENCE</span>
        <span className="num-label">{experience.length} ENTRIES</span>
      </div>

      {/* Heading */}
      <div
        className="exp-heading container-full"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["WHERE I HAVE", "WORKED."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              className="exp-line font-display"
              style={{
                fontSize: "clamp(52px, 10vw, 130px)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: i === 1 ? "var(--accent)" : "var(--paper)",
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Experience list */}
      <div className="exp-list">
        {experience.map((item, i) => (
          <motion.div
            key={item.id}
            className="exp-row"
            style={{
              borderBottom: "1px solid var(--line)",
            }}
            whileHover={{ backgroundColor: "var(--line)" }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="container-full"
              style={{
                padding: "clamp(28px, 4vw, 48px) clamp(20px, 4vw, 80px)",
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap: "clamp(16px, 3vw, 40px)",
                alignItems: "start",
              }}
            >
              {/* Number */}
              <span
                className="num-label"
                style={{ paddingTop: 4 }}
              >
                {item.id}
              </span>

              {/* Main content */}
              <div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px 16px",
                    alignItems: "baseline",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-syne), sans-serif",
                      fontWeight: 700,
                      fontSize: "clamp(1rem, 2vw, 1.4rem)",
                      color: "var(--paper)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.role}
                  </span>
                  <span
                    className="num-label"
                    style={{ color: "var(--accent)" }}
                  >
                    @ {item.company}
                  </span>
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-space), sans-serif",
                    fontSize: "clamp(13px, 1.4vw, 15px)",
                    color: "var(--dim)",
                    lineHeight: 1.7,
                    maxWidth: 560,
                    marginBottom: 16,
                  }}
                >
                  {item.description}
                </p>

                {/* Highlights */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {item.highlights.map((h) => (
                    <span key={h} className="tag">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Period + type */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  alignItems: "flex-end",
                  flexShrink: 0,
                }}
              >
                <span className="num-label">{item.period}</span>
                <span
                  className="tag"
                  style={{ borderColor: "var(--line-light)" }}
                >
                  {item.type}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
