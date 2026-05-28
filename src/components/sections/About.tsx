"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

const stats = [
  { value: "23", label: "Years" },
  { value: "2+", label: "Freelance Years" },
  { value: "10+", label: "Projects" },
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
    }, { scope: sectionRef });

  
  return (
    <section ref={sectionRef} id="about" className="section">

      {/* Big statement heading */}
      <div
        className="about-heading container-full"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["I CREATE", "PROJECTS", "THAT BLEND", "CREATIVITY AND FUNCTIONALITY."].map((line, i) => (
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
        className="container-full two-col"
        style={{
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
            I am Adam Elmekadem, 23 years old, a digital developer and graphic
            designer. I build web projects that combine creativity and
            functionality, with a strong drive to innovate.
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
            I am especially interested in performance, accessibility, and the
            details that make an interface clearer. When I am not coding, I
            explore new tools and refine visual ideas.
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
            Contact Me ↗
          </motion.a>
        </div>

        {/* Stats */}
        <div
          className="about-stats flex flex-col justify-between stat-col"
        >
          {stats.map((stat, i) => (
            <div key={stat.label} className="about-stat-item" style={{ paddingBottom: i < stats.length - 1 ? 32 : 0 }}>
              <div
                className="font-display about-stat-num"
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

    </section>
  );
}
