"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface LoaderProps {
  onComplete?: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const loaderRef  = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const labelRef   = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.to(counterRef.current, {
      innerHTML: 100,
      duration: 1.6,
      ease: "power2.inOut",
      snap: { innerHTML: 1 },
    })
      .to(lineRef.current, { scaleX: 1, duration: 1.6, ease: "power2.inOut", transformOrigin: "left center" }, "<")
      .to(labelRef.current, { opacity: 0, duration: 0.2 }, "-=0.2")
      .to(loaderRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: "power4.inOut",
        delay: 0.1,
        onComplete: onComplete ?? (() => {}),
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={loaderRef} className="loader-screen">
      <div className="font-display overflow-hidden"
        style={{ fontSize: "clamp(80px, 20vw, 240px)", lineHeight: 1, color: "var(--paper)" }}>
        <span ref={counterRef}>0</span>
      </div>

      <div style={{ width: "clamp(200px, 30vw, 400px)", height: "1px", background: "var(--line-light)", overflow: "hidden" }}>
        <div ref={lineRef} style={{ width: "100%", height: "100%", background: "var(--paper)", transform: "scaleX(0)" }} />
      </div>

      <p ref={labelRef} style={{
        fontFamily: "var(--font-mono), monospace", fontSize: "11px",
        letterSpacing: "0.15em", color: "var(--dim)", textTransform: "uppercase",
      }}>
        Loading
      </p>
    </div>
  );
}
