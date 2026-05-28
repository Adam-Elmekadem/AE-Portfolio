"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export function ThemeToggleSlider() {
  const { theme, setTheme } = useTheme();
  const [pos, setPos]       = useState(theme === "dark" ? 15 : 85);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Sync position when theme changes externally */
  useEffect(() => {
    setPos(theme === "dark" ? 15 : 85);
  }, [theme]);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!dragging || !ref.current) return;
      const box = ref.current.getBoundingClientRect();
      setPos(Math.max(2, Math.min(98, ((clientX - box.left) / box.width) * 100)));
    },
    [dragging]
  );

  const handleRelease = useCallback(() => {
    if (!dragging) return;
    setDragging(false);
    const next = pos >= 50 ? "light" : "dark";
    setTheme(next);
    setPos(next === "dark" ? 15 : 85);
  }, [dragging, pos, setTheme]);

  /* Global mouseup so release outside element still fires */
  useEffect(() => {
    window.addEventListener("mouseup", handleRelease);
    return () => window.removeEventListener("mouseup", handleRelease);
  }, [handleRelease]);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={handleRelease}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleRelease}
      style={{
        position: "relative",
        height: 52,
        width: "100%",
        overflow: "hidden",
        userSelect: "none",
        border: "1px solid var(--line)",
        cursor: "ew-resize",
      }}
    >
      {/* Dark side (base layer) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#0C0B08",
          display: "flex",
          alignItems: "center",
          paddingLeft: "clamp(12px, 2vw, 20px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "#55544F",
            textTransform: "uppercase",
          }}
        >
          Dark
        </span>
      </div>

      {/* Light side (clip-path layer) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#F2F0EB",
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          paddingRight: "clamp(12px, 2vw, 20px)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.14em",
            color: "#888580",
            textTransform: "uppercase",
          }}
        >
          Light
        </span>
      </div>

      {/* Divider + handle */}
      <div
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          transform: "translateX(-50%)",
          width: 2,
          background: "#C8FF2E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "ew-resize",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#C8FF2E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: dragging ? "scale(1.2)" : "scale(1)",
            transition: "transform 0.15s ease",
            flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 1 L1 5 L3 9" stroke="#0C0B08" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 1 L9 5 L7 9" stroke="#0C0B08" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>
    </div>
  );
}
