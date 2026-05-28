"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/SocialIcons";
import { projects, personalInfo } from "@/lib/data";

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger);

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const glareX = useTransform(springX, [-0.5, 0.5], ["-20%", "120%"]);
  const glareY = useTransform(springY, [-0.5, 0.5], ["-20%", "120%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className="project-card relative perspective-1000 group"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor="Explore"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative glass rounded-2xl overflow-hidden h-full"
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        {/* Card background gradient */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${project.color}20, transparent 70%)`,
          }}
        />

        {/* Glare effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.08), transparent 50%)`,
          }}
        />

        {/* Top accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-px opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`,
          }}
        />

        <div className="relative p-6 flex flex-col gap-5 h-full z-10">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse-glow"
                  style={{ background: project.color, boxShadow: `0 0 8px ${project.color}` }}
                />
                <span className="text-xs text-slate-500 font-medium tracking-wider">{project.year}</span>
              </div>
              <h3 className="text-xl font-bold text-white group-hover:gradient-text transition-all duration-500">
                {project.title}
              </h3>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <motion.a
                href={project.github}
                className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <GithubIcon size={14} />
              </motion.a>
              <motion.a
                href={project.link}
                className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={14} />
              </motion.a>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-400 leading-relaxed flex-1">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-xs rounded-full font-medium"
                style={{
                  background: `${project.color}15`,
                  border: `1px solid ${project.color}30`,
                  color: project.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Hover CTA */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-xs font-semibold"
                style={{ color: project.color }}
              >
                <span>View Project</span>
                <ArrowUpRight size={14} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (headingRef.current) {
        const split = SplitText.create(headingRef.current.querySelector("h2"), {
          type: "chars",
          charsClass: "char",
        });

        gsap.from(split.chars, {
          y: 80,
          opacity: 0,
          rotationX: -60,
          stagger: { amount: 0.5 },
          duration: 0.8,
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

  return (
    <section ref={sectionRef} id="projects" className="relative section-padding overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px opacity-30"
          style={{ background: "linear-gradient(90deg, transparent, #6366f1, transparent)" }}
        />
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px flex-1 max-w-12 bg-gradient-to-r from-transparent to-purple-500" />
          <span className="text-xs font-medium tracking-[0.3em] uppercase text-purple-400">
            Selected Work
          </span>
        </div>

        {/* Heading */}
        <div ref={headingRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
            Projects that{" "}
            <span className="gradient-text-warm">Matter</span>
          </h2>
          <p className="text-slate-400 max-w-xs text-sm leading-relaxed">
            A selection of work that showcases the intersection of technology, design and impact.
          </p>
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* View more */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.a
            href={personalInfo?.github ?? "#"}
            target="_blank"
            className="group flex items-center gap-3 glass px-8 py-4 rounded-full text-sm font-semibold text-slate-300 hover:text-white glow-border-purple transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <GithubIcon size={16} />
            <span>View All on GitHub</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
