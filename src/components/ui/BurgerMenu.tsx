"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextGlitch } from "@/components/ui/text-glitch-effect";
import { useNavigate } from "@/components/providers/TransitionProvider";

gsap.registerPlugin(useGSAP);

const NAV_LINKS = [
  { label: "Work",       num: "01", href: "#work"        },
  { label: "Profile",    num: "02", href: "#about"       },
  { label: "Skills",     num: "03", href: "#competences" },
  { label: "Experience", num: "04", href: "#experience"  },
  { label: "Guestbook",  num: "05", href: "#guestbook"   },
  { label: "Contact",    num: "06", href: "#contact"     },
  { label: "Gallery",    num: "07", href: "/gallery"     },
  { label: "Socials",    num: "08", href: "/socials"     },
];

export default function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const leftCurtainRef = useRef<HTMLDivElement>(null);
  const rightCurtainRef = useRef<HTMLDivElement>(null);
  const tlRef      = useRef<gsap.core.Timeline | null>(null);

  const { contextSafe } = useGSAP(() => {
    /* Default state is already set via inline style (visibility:hidden).
       Nothing to do here — GSAP only needs to animate open/close. */
  }, { scope: overlayRef });

  /* ── Wheel scroll handler ─────────────────────────────── */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!open || !scrollContainerRef.current) return;

      e.preventDefault();
      scrollContainerRef.current.scrollTop += e.deltaY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [open]);

  /* ── Open ─────────────────────────────────────────────── */
  const openMenu = contextSafe(() => {
    if (tlRef.current) tlRef.current.kill();
    setOpen(true);
    window.dispatchEvent(new Event("lenis:stop"));
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    /* Use y (pixels) not yPercent — avoids flex-height calculation bugs */
    gsap.set(".bmenu-item", { y: 80, opacity: 0 });
    gsap.set(".bmenu-foot", { y: 16, opacity: 0 });

    tlRef.current = gsap.timeline()
      .set(overlayRef.current, { visibility: "visible" })
      /* Curtains part from center */
      .fromTo(
        leftCurtainRef.current,
        { xPercent: 0 },
        { xPercent: -100, duration: 1.2, ease: "expo.inOut" },
        0
      )
      .fromTo(
        rightCurtainRef.current,
        { xPercent: 0 },
        { xPercent: 100, duration: 1.2, ease: "expo.inOut" },
        0
      )
      .to(".bmenu-item", {
        y: 0, opacity: 1,
        duration: 0.65,
        stagger: 0.06,
        ease: "power3.out",
      }, "-=0.8")
      .to(".bmenu-foot", {
        y: 0, opacity: 1,
        duration: 0.45, stagger: 0.04,
        ease: "power3.out",
      }, "-=0.3");
  });

  /* ── Close ────────────────────────────────────────────── */
  const closeMenu = contextSafe(() => {
    if (tlRef.current) tlRef.current.kill();
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    window.dispatchEvent(new Event("lenis:start"));

    tlRef.current = gsap.timeline({
      onComplete() {
        setOpen(false);
      }
    })
      /* Curtains close back to center */
      .to(leftCurtainRef.current, {
        xPercent: 0,
        duration: 1.1,
        ease: "expo.inOut",
      }, 0)
      .to(rightCurtainRef.current, {
        xPercent: 0,
        duration: 1.1,
        ease: "expo.inOut",
      }, 0)
      .set(overlayRef.current, { visibility: "hidden" }, "-=0.3");
  });

  const handleNavClick = (href: string) => {
    if (href.startsWith("/") && href !== "/") {
      /* AE. overlay covers everything (z-index 199999) instantly —
         menu closes underneath it, user never sees the old page.  */
      navigate(href);
      closeMenu();
    } else {
      closeMenu();
      if (href.startsWith("#")) {
        setTimeout(() => document.querySelector(href)?.scrollIntoView({ behavior: "smooth" }), 860);
      }
    }
  };

  const lineBase: React.CSSProperties = {
    display: "block", width: 24, height: 1.5,
    background: "var(--paper)",
    transition: "transform 0.4s cubic-bezier(0.76,0,0.24,1), opacity 0.25s, width 0.3s",
  };

  return (
    <>
      {/* ── Always-visible header strip ─────────────────── */}
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100000,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "var(--nav-h)",
        padding: "0 clamp(20px, 4vw, 80px)",
        background: open
          ? "var(--ink)"
          : "linear-gradient(to bottom, rgba(12,11,8,0.78) 0%, transparent 100%)",
        borderBottom: open ? "1px solid var(--line)" : "1px solid transparent",
        transition: "background 0.4s, border-color 0.4s",
      }}>
        <button
          onClick={() => open ? closeMenu() : document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth" })}
          style={{ fontFamily: "var(--font-syne),sans-serif", fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "var(--paper)" }}
        >
          AE.
        </button>

        <button
          onClick={open ? closeMenu : openMenu}
          aria-label={open ? "Close" : "Menu"}
          style={{ display: "flex", flexDirection: "column", gap: 6, padding: "10px 0" }}
        >
          <span style={{ ...lineBase, transform: open ? "translateY(7.5px) rotate(45deg)" : "none" }} />
          <span style={{ ...lineBase, width: open ? 0 : 24, opacity: open ? 0 : 1 }} />
          <span style={{ ...lineBase, transform: open ? "translateY(-7.5px) rotate(-45deg)" : "none" }} />
        </button>
      </header>

      {/* ── Full-screen curtain overlay ──────────────────── */}
      <div
        ref={overlayRef}
        className="bmenu-overlay"
      >
        {/* Left curtain */}
        <div
          ref={leftCurtainRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "50vw",
            height: "100vh",
            background: "var(--ink)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Right curtain */}
        <div
          ref={rightCurtainRef}
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "50vw",
            height: "100vh",
            background: "var(--ink)",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* Header spacer */}
        <div style={{ borderBottom: "1px solid var(--line)" }} />

        {/* Scrollable nav links */}
        <div ref={scrollContainerRef} className="bmenu-scroll" style={{
          padding: "clamp(16px, 2vw, 28px) clamp(24px, 5vw, 100px) clamp(8px, 1vw, 16px)",
          minHeight: 0,
        }}>
          {NAV_LINKS.map((link, i) => (
            <div
              key={link.href}
              className="bmenu-item"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <button
                onClick={() => handleNavClick(link.href)}
                style={{
                  display: "flex", alignItems: "center",
                  gap: "clamp(14px, 2vw, 40px)",
                  padding: "clamp(16px, 2.5vh, 32px) 0",
                  width: "100%", textAlign: "left",
                }}
              >
                <span style={{
                  fontFamily: "var(--font-mono),monospace",
                  fontSize: 11, color: "var(--accent)",
                  letterSpacing: "0.1em", minWidth: 26, flexShrink: 0,
                }}>
                  {link.num}
                </span>

                <TextGlitch
                  text={link.label}
                  className="bmenu-lbl"
                  style={{
                    fontFamily: "var(--font-syne),sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(28px, 7vw, 110px)",
                    letterSpacing: "-0.03em",
                    color: "var(--paper)",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                />

                <span style={{
                  marginLeft: "auto", flexShrink: 0,
                  fontFamily: "var(--font-mono),monospace",
                  fontSize: 11, color: "var(--dim)",
                }}>↗</span>
              </button>
            </div>
          ))}
        </div>

        {/* Footer — always pinned at bottom */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 10,
          padding: "clamp(12px, 2vw, 22px) clamp(24px, 5vw, 100px)",
          borderTop: "1px solid var(--line)",
        }}>
          {[
            { txt: "SALÉ, MOROCCO",          accent: false },
            { txt: "● AVAILABLE TO WORK",    accent: true  },
            { txt: "adamelmekadem61@gmail.com", accent: false },
          ].map(({ txt, accent }) => (
            <span key={txt} className="bmenu-foot" style={{
              fontFamily: "var(--font-mono),monospace",
              fontSize: 10, letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: accent ? "var(--accent)" : "var(--dim)",
            }}>
              {txt}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
