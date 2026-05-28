"use client";

import React, { useEffect, useRef, useState } from "react";

interface TextGlitchProps {
  text:       string;
  hoverText?: string;
  className?: string;
  style?:     React.CSSProperties;
}

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function TextGlitch({ text, hoverText, className = "", style }: TextGlitchProps) {
  const spanRef    = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const target     = hoverText || text;

  const [scrambled, setScrambled] = useState(target);

  const handleEnter = () => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setScrambled(
        target.split("").map((ch, i) => {
          if (ch === " ") return " ";
          if (i < iteration) return target[i];
          return LETTERS[Math.floor(Math.random() * 26)];
        }).join("")
      );
      if (iteration >= target.length) clearInterval(intervalRef.current!);
      iteration += 1 / 3;
    }, 30);

    if (spanRef.current)
      spanRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
  };

  const handleLeave = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScrambled(target);
    if (spanRef.current)
      spanRef.current.style.clipPath = "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)";
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <span
      className={`relative overflow-hidden inline-block select-none ${className}`}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {text}

      {/* Accent reveal panel */}
      <span
        ref={spanRef}
        aria-hidden
        style={{
          position:    "absolute",
          inset:       0,
          display:     "flex",
          alignItems:  "center",
          overflow:    "hidden",
          clipPath:    "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          transition:  "clip-path 0.45s cubic-bezier(0.76, 0, 0.24, 1)",
          background:  "var(--accent)",
          color:       "var(--ink)",
          fontFamily:  "inherit",
          fontWeight:  "inherit",
          fontSize:    "inherit",
          letterSpacing: "inherit",
          lineHeight:  "inherit",
          whiteSpace:  "nowrap",
          pointerEvents: "none",
        }}
      >
        {scrambled}
      </span>
    </span>
  );
}
