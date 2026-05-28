"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

gsap.registerPlugin(useGSAP);

const links = [
  { label: "Travaux", href: "#work" },
  { label: "Profil", href: "#about" },
  { label: "Expérience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      gsap.from(".nav-el", {
        y: -24,
        opacity: 0,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
        delay: 2.4,
      });
    },
    { scope: navRef }
  );

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[990]"
        style={{
          borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
          background: scrolled
            ? "rgba(12,11,8,0.95)"
            : "linear-gradient(to bottom, rgba(12,11,8,0.72) 0%, transparent 100%)",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          transition: "all 0.4s ease",
        }}
      >
        <div
          className="container-full flex items-center justify-between"
          style={{ height: "clamp(56px, 7vw, 72px)" }}
        >
          {/* Logo */}
          <button
            onClick={() => scrollTo("#hero")}
            className="nav-el"
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
              color: "var(--paper)",
            }}
          >
            AE.
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link, i) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="nav-el hover-line"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                  transition: "color 0.2s",
                  opacity: 0.75,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--paper)"; e.currentTarget.style.opacity = "1"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--paper)"; e.currentTarget.style.opacity = "0.75"; }}
              >
                <span style={{ color: "var(--accent)", marginRight: 6, fontSize: 9 }}>0{i + 1}</span>
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-6">
            <div
              className="nav-el"
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--accent)",
                boxShadow: "0 0 0 3px rgba(200,255,46,0.2)",
              }}
            />
            <button
              onClick={() => scrollTo("#contact")}
              className="nav-el"
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--paper)",
                border: "1px solid var(--line-light)",
                padding: "8px 18px",
                borderRadius: 2,
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "var(--ink)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--paper)";
                e.currentTarget.style.borderColor = "var(--line-light)";
              }}
            >
              Lancer un projet ↗
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden nav-el"
            style={{ color: "var(--paper)" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.span key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }}><X size={18} /></motion.span>
              ) : (
                <motion.span key="m" initial={{ rotate: 90 }} animate={{ rotate: 0 }}><Menu size={18} /></motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 z-[989]"
            style={{
              top: "clamp(56px, 7vw, 72px)",
              background: "var(--ink)",
              borderBottom: "1px solid var(--line)",
              padding: "24px clamp(20px, 4vw, 80px)",
            }}
          >
            {links.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => scrollTo(link.href)}
                className="block w-full text-left py-4 border-b"
                style={{
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  fontSize: "1.8rem",
                  color: "var(--paper)",
                  borderColor: "var(--line)",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
