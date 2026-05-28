"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function FloatingNav() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);

      const scrollPos = window.scrollY + window.innerHeight / 2;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const bottom = top + el.offsetHeight;
          if (scrollPos >= top && scrollPos < bottom) {
            setActiveSection(section.id);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Side dots navigation */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[990] hidden lg:flex flex-col gap-3">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => scrollTo(section.id)}
            className="group relative flex items-center justify-end gap-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {/* Label tooltip */}
            <motion.span
              initial={{ opacity: 0, x: 10 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="text-xs font-medium text-white glass px-2 py-1 rounded-md pointer-events-none"
            >
              {section.label}
            </motion.span>

            {/* Dot */}
            <div className="relative w-2.5 h-2.5 flex items-center justify-center">
              <div
                className={`rounded-full transition-all duration-300 ${
                  activeSection === section.id
                    ? "w-2.5 h-2.5 bg-cyan-400"
                    : "w-1.5 h-1.5 bg-slate-600 group-hover:bg-slate-400"
                }`}
                style={
                  activeSection === section.id
                    ? { boxShadow: "0 0 8px rgba(34,211,238,0.8)" }
                    : undefined
                }
              />
              {activeSection === section.id && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30"
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Back to top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => scrollTo("hero")}
            className="fixed bottom-8 right-8 z-[990] w-12 h-12 glass rounded-full flex items-center justify-center text-slate-400 hover:text-white glow-border-cyan transition-all"
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
