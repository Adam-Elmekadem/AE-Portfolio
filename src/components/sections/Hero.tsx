"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin);

/* ─── Data ─────────────────────────────────────────────────────── */
const SLIDES = [
  { img: "/images_inspi/378372806200200270.jpg" },
  { img: "/images_inspi/843862048972875266.jpg" },
  { img: "/images_inspi/Idyllic Greek Island View with Yachts.jpg" },
  { img: "/images_inspi/téléchargement.jpg" },
  { img: "/images_inspi/378372806200200270.jpg" },
  { img: "/images_inspi/843862048972875266.jpg" },
];

const NAV_ITEMS = [
  { label: "TRAVAUX",     num: "01", section: "#work",        slide: 1 },
  { label: "PROFIL",      num: "02", section: "#about",       slide: 2 },
  { label: "COMPÉTENCES", num: "03", section: "#competences", slide: 3 },
  { label: "EXPÉRIENCE",  num: "04", section: "#experience",  slide: 4 },
  { label: "CONTACT",     num: "05", section: "#contact",     slide: 5 },
];

const services = [
  "Développement Web", "Design Digital", "React", "Laravel",
  "HTML / CSS", "JavaScript", "Figma", "Freelance",
];

export default function Hero() {
  const sectionRef  = useRef<HTMLElement>(null);
  const subtitleRef = useRef<HTMLSpanElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredNav,   setHoveredNav]   = useState<number | null>(null);

  /* ── Auto-cycle ───────────────────────────────────────────── */
  const startCycle = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(
      () => setCurrentSlide(p => (p + 1) % SLIDES.length),
      5000,
    );
  }, []);

  useEffect(() => {
    startCycle();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [startCycle]);

  /* ── Nav handlers ─────────────────────────────────────────── */
  const handleNavClick = (section: string, slide: number) => {
    setCurrentSlide(slide);
    startCycle();
    setTimeout(() => document.querySelector(section)?.scrollIntoView({ behavior: "smooth" }), 500);
  };
  const handleNavEnter = (slide: number) => { setHoveredNav(slide); setCurrentSlide(slide); };
  const handleNavLeave = () => setHoveredNav(null);

  /* ── GSAP entrance ────────────────────────────────────────── */
  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(".hero-top > *", { y: -16, opacity: 0, stagger: 0.08, duration: 0.6, ease: "power3.out" });

    const lines = heroTextRef.current?.querySelectorAll(".hero-line") ?? [];
    tl.from(lines, { yPercent: 110, duration: 0.9, stagger: 0.08, ease: "power4.out" }, "-=0.3");

    if (subtitleRef.current) {
      tl.to(subtitleRef.current, {
        duration: 1.2,
        scrambleText: { text: "Développeur Full Stack Jr", chars: "upperCase", speed: 0.6 },
        ease: "none",
      }, "-=0.4");
    }

    tl.from(".hero-bottom > *", { y: 16, opacity: 0, stagger: 0.06, duration: 0.6, ease: "power3.out" }, "-=0.6");
    tl.from(".hero-sidenav > *", { x: 30, opacity: 0, stagger: 0.06, duration: 0.5, ease: "power3.out" }, "-=0.4");

    /* Parallax on scroll */
    gsap.to(heroTextRef.current, {
      yPercent: 18, ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }, { scope: sectionRef });

  const displaySlide = hoveredNav !== null ? hoveredNav : currentSlide;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex flex-col"
      style={{ minHeight: "100svh", paddingTop: "var(--nav-h)", borderBottom: "1px solid var(--line)" }}
    >
      {/* ── Background images ──────────────────────────────── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        {SLIDES.map((slide, i) => (
          <img
            key={i}
            src={slide.img}
            alt=""
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 20%",
              opacity: i === displaySlide ? 1 : 0,
              transition: "opacity 1.6s ease",
            }}
          />
        ))}
        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "linear-gradient(to bottom, rgba(12,11,8,0.55) 0%, rgba(12,11,8,0.15) 50%, rgba(12,11,8,0.65) 100%)",
        }} />
      </div>

      {/* ── Hero content ───────────────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Top info bar */}
        <div
          className="hero-top container-full flex items-center justify-between"
          style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
        >
          <span className="num-label">ADAM ELMEKADEM — 2024</span>
          <div className="flex items-center gap-3">
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--accent)", display: "inline-block" }} />
            <span className="num-label">DISPONIBLE POUR TRAVAILLER</span>
          </div>
          <span className="num-label">SALÉ, MAROC</span>
        </div>

        {/* Big name headline */}
        <div
          className="flex-1 container-full flex flex-col justify-center"
          style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 6vw, 80px)" }}
        >
          <div ref={heroTextRef}>
            {["ADAM", "ELMEKADEM"].map((word, i) => (
              <div key={i} style={{ overflow: "hidden", lineHeight: 0.85 }}>
                <div
                  className="hero-line font-display"
                  style={{
                    fontSize: "clamp(80px, 18vw, 220px)",
                    letterSpacing: "-0.02em",
                    color: i === 1 ? "var(--accent)" : "var(--paper)",
                    display: "block",
                  }}
                >
                  {word}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "clamp(20px, 3vw, 40px)", display: "flex", alignItems: "flex-start", gap: "clamp(16px, 3vw, 40px)" }}>
              <div style={{ width: 1, minHeight: 40, background: "var(--line-light)", flexShrink: 0 }} />
              <span
                ref={subtitleRef}
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: "clamp(11px, 1.5vw, 15px)",
                  letterSpacing: "0.06em", color: "var(--dim)",
                  textTransform: "uppercase", display: "block", minHeight: 20,
                }}
              >
                &nbsp;
              </span>
            </div>
          </div>
        </div>

        {/* Marquee strip */}
        <div
          className="hero-bottom overflow-hidden"
          style={{ height: "clamp(44px, 5vw, 56px)", borderTop: "1px solid var(--line)" }}
        >
          <div className="marquee-track h-full flex items-center">
            {[...services, ...services].map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-mono), monospace", fontSize: 11,
                  letterSpacing: "0.12em", textTransform: "uppercase",
                  color: "var(--dim)", whiteSpace: "nowrap",
                  padding: "0 clamp(20px, 3vw, 40px)",
                  display: "flex", alignItems: "center", gap: "clamp(20px, 3vw, 40px)",
                }}
              >
                {s}<span style={{ color: "var(--accent)", fontSize: 16 }}>✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right-side section navigation ─────────────────── */}
      <nav
        className="hero-sidenav absolute right-0 hidden lg:flex flex-col"
        style={{ top: "50%", transform: "translateY(-50%)", zIndex: 2 }}
      >
        {NAV_ITEMS.map((item) => {
          const active = displaySlide === item.slide;
          return (
            <button
              key={item.section}
              onClick={() => handleNavClick(item.section, item.slide)}
              onMouseEnter={() => handleNavEnter(item.slide)}
              onMouseLeave={handleNavLeave}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "clamp(10px, 1.4vw, 14px) clamp(14px, 2vw, 24px)",
                borderLeft:   "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                borderTop:    item.num === "01" ? "1px solid var(--line)" : "none",
                background:   active ? "rgba(200,255,46,0.06)" : "transparent",
                transition:   "background 0.25s ease",
                cursor: "pointer", textAlign: "left",
              }}
            >
              <span className="num-label" style={{ color: active ? "var(--accent)" : "var(--dim)", transition: "color 0.2s", fontSize: 10 }}>
                {item.num}
              </span>
              <span style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: "clamp(9px, 1vw, 11px)", letterSpacing: "0.12em",
                textTransform: "uppercase", whiteSpace: "nowrap",
                color: active ? "var(--paper)" : "var(--dim)", transition: "color 0.2s",
              }}>
                {item.label}
              </span>
              <span style={{
                fontSize: "0.65rem",
                color: active ? "var(--accent)" : "transparent",
                transition: "all 0.2s",
                transform: active ? "translateX(2px) translateY(-2px)" : "none",
                display: "inline-block",
              }}>
                ↗
              </span>
            </button>
          );
        })}
      </nav>
    </section>
  );
}
