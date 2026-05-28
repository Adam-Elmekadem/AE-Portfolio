"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const stack = [
  "HTML5", "CSS3", "JavaScript", "React",
  "PHP", "Laravel", "TailwindCSS", "Bootstrap",
  "Figma", "Python", "Git", "MySQL",
  "Next.js", "GSAP", "Framer", "Vercel",
];

const stats = [
  { value: "23", label: "Ans" },
  { value: "2+", label: "Années Freelance" },
  { value: "10+", label: "Projets" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statRefs = useRef<HTMLSpanElement[]>([]);

  useGSAP(
    () => {
      const lines = sectionRef.current?.querySelectorAll(".about-line") ?? [];
      gsap.from(lines, {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".about-heading",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      const bioSplit = SplitText.create(".about-bio", { type: "lines", linesClass: "overflow-hidden" });
      gsap.from(bioSplit.lines, {
        y: 28,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".about-bio",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      statRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.from(el, {
          innerHTML: 0,
          duration: 1.4,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.15,
        });
      });

      gsap.from(".stack-item", {
        opacity: 0,
        y: 12,
        stagger: { amount: 0.6, from: "start" },
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".stack-grid",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="about" className="section">
      {/* Label bar */}
      <div
        className="container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">ABOUT</span>
        <span className="num-label">PROFIL</span>
        <span className="num-label">SIDI MOUSSA, SALÉ</span>
      </div>

      {/* Big statement heading */}
      <div
        className="about-heading container-full"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["JE CRÉE", "DES PROJETS", "ALLIANT", "CRÉATIVITÉ ET FONCTIONNALITÉ."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              className="about-line font-display"
              style={{
                fontSize: "clamp(52px, 10vw, 130px)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: i === 3 ? "var(--accent)" : "var(--paper)",
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Bio + Stats */}
      <div
        className="container-full grid"
        style={{
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(40px, 6vw, 80px)",
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Bio */}
        <div>
          <p
            className="about-bio"
            style={{
              fontSize: "clamp(14px, 1.6vw, 18px)",
              lineHeight: 1.75,
              color: "var(--dim)",
              maxWidth: 480,
            }}
          >
            Je suis Adam Elmekadem, j&apos;ai 23 ans, développeur digital et designer
            graphique. Je crée des projets web alliant créativité et fonctionnalité,
            avec une forte volonté d&apos;innover.
          </p>
          <p
            className="about-bio"
            style={{
              fontSize: "clamp(14px, 1.6vw, 18px)",
              lineHeight: 1.75,
              color: "var(--dim)",
              maxWidth: 480,
              marginTop: 20,
            }}
          >
            Je m&apos;intéresse particulièrement à la performance, à l&apos;accessibilité et
            aux détails qui rendent une interface plus claire. Quand je ne code pas,
            j&apos;explore de nouveaux outils et j&apos;affine mes idées visuelles.
          </p>

          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-3"
            style={{
              marginTop: 32,
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--paper)",
            }}
            whileHover={{ x: 6 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            Me contacter ↗
          </motion.a>
        </div>

        {/* Stats */}
        <div
          className="about-stats flex flex-col justify-between"
          style={{ paddingLeft: "clamp(20px, 4vw, 60px)", borderLeft: "1px solid var(--line)" }}
        >
          {stats.map((stat, i) => (
            <div key={stat.label} style={{ paddingBottom: i < stats.length - 1 ? 32 : 0 }}>
              <div
                className="font-display"
                style={{
                  fontSize: "clamp(52px, 7vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "var(--paper)",
                  marginBottom: 4,
                }}
              >
                {stat.value.replace(/\d+/, "")}
                <span
                  ref={(el) => { if (el) statRefs.current[i] = el; }}
                  data-target={stat.value.match(/\d+/)?.[0] ?? "0"}
                >
                  {stat.value.match(/\d+/)?.[0] ?? "0"}
                </span>
                {stat.value.includes("+") ? "+" : stat.value.includes("%") ? "%" : ""}
              </div>
              <span className="num-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack grid */}
      <div
        className="container-full"
        style={{
          paddingTop: "clamp(32px, 5vw, 60px)",
          paddingBottom: "clamp(32px, 5vw, 60px)",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <span className="num-label">COMPÉTENCES TECHNIQUES</span>
        </div>
        <div
          className="stack-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            gap: 0,
          }}
        >
          {stack.map((tech) => (
            <motion.div
              key={tech}
              className="stack-item"
              style={{
                padding: "clamp(12px, 2vw, 20px)",
                borderRight: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                fontFamily: "var(--font-mono), monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--dim)",
                cursor: "default",
                transition: "all 0.2s",
              }}
              whileHover={{
                color: "var(--paper)",
                backgroundColor: "var(--line)",
              }}
            >
              {tech}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
