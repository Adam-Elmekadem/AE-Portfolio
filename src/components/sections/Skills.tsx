"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform } from "framer-motion";
import { skills, techStack } from "@/lib/data";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

function SkillRing({
  name,
  level,
  color,
  size = 100,
  delay = 0,
}: {
  name: string;
  level: number;
  color: string;
  size?: number;
  delay?: number;
}) {
  const radius = (size - 16) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (level / 100) * circumference;

  return (
    <motion.div
      className="flex flex-col items-center gap-3 group"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -5 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="4"
          />
          {/* Progress ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            whileInView={{ strokeDashoffset }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: delay + 0.3, ease: "easeOut" }}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: `drop-shadow(0 0 6px ${color}80)`,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-lg font-black text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: delay + 0.5 }}
          >
            {level}%
          </motion.span>
        </div>

        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"
          style={{ background: color }}
        />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-white">{name}</p>
      </div>
    </motion.div>
  );
}

function SkillBar({
  name,
  level,
  category,
  color,
  delay,
}: {
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      className="group"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <span className="text-base">{}</span>
          <span className="text-sm font-semibold text-white">{name}</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: `${color}20`, color, border: `1px solid ${color}30` }}
          >
            {category}
          </span>
        </div>
        <span className="text-sm font-bold" style={{ color }}>
          {level}%
        </span>
      </div>

      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full relative"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}aa)` }}
          initial={{ width: "0%" }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: delay + 0.2, ease: "easeOut" }}
        >
          <div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
            style={{
              background: color,
              boxShadow: `0 0 8px ${color}`,
              transform: "translate(50%, -50%)",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 90]);

  useGSAP(
    () => {
      if (headingRef.current) {
        const split = SplitText.create(headingRef.current.querySelector("h2"), {
          type: "chars",
        });

        gsap.from(split.chars, {
          y: 60,
          opacity: 0,
          stagger: { amount: 0.4 },
          duration: 0.7,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      }
    },
    { scope: sectionRef }
  );

  const skillColors = ["#22d3ee", "#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981", "#22d3ee", "#6366f1"];

  return (
    <section ref={sectionRef} id="skills" className="relative section-padding overflow-hidden">
      {/* Animated background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ rotate: bgRotate }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-3"
        >
          <div
            className="w-full h-full rounded-full border"
            style={{ borderColor: "rgba(99,102,241,0.1)" }}
          />
          <div
            className="absolute inset-8 rounded-full border"
            style={{ borderColor: "rgba(34,211,238,0.08)" }}
          />
          <div
            className="absolute inset-16 rounded-full border"
            style={{ borderColor: "rgba(168,85,247,0.06)" }}
          />
        </motion.div>
        <div
          className="absolute top-1/4 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-cyan-500" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-cyan-400">
            Expertise
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="mb-20">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
            My{" "}
            <span className="gradient-text">Skills</span> &{" "}
            <br />
            <span className="gradient-text-warm">Expertise</span>
          </h2>
        </div>

        {/* Skills layout: bars + rings */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left: Skill bars */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Core Technologies
            </h3>
            {skills.map((skill, i) => (
              <SkillBar key={skill.name} name={skill.name} level={skill.level} category={skill.category} icon={skill.icon} color={skillColors[i]} delay={i * 0.08} />
            ))}
          </div>

          {/* Right: Circular rings */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8">
              Proficiency
            </h3>
            <div className="grid grid-cols-3 gap-6 lg:gap-8">
              {skills.slice(0, 6).map((skill, i) => (
                <SkillRing
                  key={skill.name}
                  name={skill.name.split(" ")[0]}
                  level={skill.level}
                  color={skillColors[i]}
                  size={90}
                  delay={i * 0.1}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Additional skills cloud */}
        <motion.div
          className="mt-20 pt-12 border-t border-white/5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-8 text-center">
            Also proficient with
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech, i) => (
              <motion.div
                key={tech}
                className="glass px-4 py-2 rounded-full text-sm text-slate-300 hover:text-white hover:glow-border-cyan transition-all cursor-default"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, type: "spring", stiffness: 400, damping: 25 }}
                whileHover={{ scale: 1.1, y: -3 }}
              >
                {tech}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
