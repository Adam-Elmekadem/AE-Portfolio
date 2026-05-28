"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    // Dot follows instantly
    const moveDot = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(dotRef.current, {
        x: mouseX,
        y: mouseY,
        duration: 0,
        ease: "none",
      });
    };

    // Ring follows with spring lag
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;

      if (ringRef.current) {
        gsap.set(ringRef.current, { x: ringX, y: ringY });
      }

      requestAnimationFrame(animateRing);
    };

    const raf = requestAnimationFrame(animateRing);

    const handleOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest(
        "[data-cursor], a, button, [role='button']"
      ) as HTMLElement | null;

      if (el) {
        const text = el.dataset.cursor ?? "";
        setLabel(text);
        gsap.to(ringRef.current, {
          scale: text ? 2.5 : 1.8,
          borderColor: "var(--accent)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dotRef.current, {
          scale: 2.5,
          background: "var(--accent)",
          duration: 0.2,
        });
      } else {
        setLabel("");
        gsap.to(ringRef.current, {
          scale: 1,
          borderColor: "rgba(242,240,235,0.5)",
          duration: 0.35,
          ease: "power3.out",
        });
        gsap.to(dotRef.current, {
          scale: 1,
          background: "var(--paper)",
          duration: 0.2
        });
      }
    };

    const handleDown = () => {
      gsap.to(ringRef.current, { scale: 0.85, duration: 0.1 });
      gsap.to(dotRef.current, { scale: 2.5, duration: 0.1 });
    };

    const handleUp = () => {
      gsap.to(ringRef.current, { scale: 1, duration: 0.3, ease: "back.out(2)" });
      gsap.to(dotRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", moveDot);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);

    return () => {
      window.removeEventListener("mousemove", moveDot);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[100000] flex items-center justify-center"
        style={{
          width: 36,
          height: 36,
          marginLeft: -18,
          marginTop: -18,
          borderRadius: "50%",
          border: "1px solid rgba(242,240,235,0.5)",
          willChange: "transform",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "var(--ink)",
            textTransform: "uppercase",
            display: label ? "block" : "none",
            background: "var(--accent)",
            padding: "2px 4px",
            borderRadius: 2,
          }}
        >
          {label}
        </span>
      </div>

      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[100001]"
        style={{
          width: 6,
          height: 6,
          marginLeft: -3,
          marginTop: -3,
          borderRadius: "50%",
          background: "var(--paper)",
          willChange: "transform",
        }}
      />
    </>
  );
}
