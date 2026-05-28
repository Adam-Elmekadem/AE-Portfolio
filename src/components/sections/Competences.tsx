"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const categories = [
  {
    label: "Front End",
    skills: ["HTML5", "CSS3", "JavaScript", "React", "Next.js", "TailwindCSS", "Bootstrap", "Framer Motion"],
  },
  {
    label: "Back End",
    skills: ["PHP", "Laravel", "MySQL", "Python"],
  },
  {
    label: "Design & Outils",
    skills: ["Figma", "GSAP", "Git", "Vercel"],
  },
];

export default function Competences() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".comp-reveal", {
      yPercent: 105,
      duration: 0.9,
      stagger: 0.07,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".comp-heading",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".comp-cat", {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".comp-grid",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="competences" className="section">

      {/* Label bar */}
      <div
        className="container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">COMPÉTENCES</span>
        <span className="num-label">STACK TECHNIQUE</span>
      </div>

      {/* Heading */}
      <div
        className="comp-heading container-full"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["CE QUE", "JE MAÎTRISE."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              className="comp-reveal font-display"
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

      {/* Skills grid */}
      <div
        className="comp-grid container-full"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 0,
          borderBottom: "1px solid var(--line)",
        }}
      >
        {categories.map((cat, i) => (
          <div
            key={cat.label}
            className="comp-cat"
            style={{
              padding: "clamp(32px, 5vw, 60px) clamp(20px, 3vw, 40px)",
              borderRight: i < categories.length - 1 ? "1px solid var(--line)" : "none",
            }}
          >
            <span className="num-label" style={{ display: "block", marginBottom: 24 }}>
              {cat.label}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cat.skills.map((skill) => (
                <motion.div
                  key={skill}
                  style={{
                    fontFamily: "var(--font-syne), sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    color: "var(--dim)",
                    padding: "10px 0",
                    borderBottom: "1px solid var(--line)",
                    letterSpacing: "-0.01em",
                    cursor: "default",
                  }}
                  whileHover={{ color: "var(--paper)", x: 6 }}
                  transition={{ duration: 0.2 }}
                >
                  {skill}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}
