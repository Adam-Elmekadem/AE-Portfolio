"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export function ThemeSplitter() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos]         = useState(0);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);

  /* ── Enable / disable ───────────────────────────────────── */
  const enable = () => {
    setEnabled(true);
    setPos(0); // starts at left edge — user drags to reveal
  };

  const disable = () => {
    setEnabled(false);
    setPos(0);
    document.documentElement.style.setProperty("--img-inv", "0");
  };

  /* ── Image re-inversion ─────────────────────────────────── */
  useEffect(() => {
    document.documentElement.style.setProperty("--img-inv", enabled && pos > 0 ? "1" : "0");
  }, [pos, enabled]);

  /* ── Drag ───────────────────────────────────────────────── */
  const handleMove = useCallback((clientX: number) => {
    if (!draggingRef.current) return;
    setPos(Math.max(0, Math.min(100, (clientX / window.innerWidth) * 100)));
  }, []);

  const startDrag = () => { draggingRef.current = true; setDragging(true); };
  const stopDrag  = useCallback(() => { draggingRef.current = false; setDragging(false); }, []);

  useEffect(() => {
    const onMove  = (e: MouseEvent)  => handleMove(e.clientX);
    const onTouch = (e: TouchEvent)  => handleMove(e.touches[0].clientX);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   stopDrag);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend",  stopDrag);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   stopDrag);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend",  stopDrag);
    };
  }, [handleMove, stopDrag]);

  return (
    <>
      {/* ── Activation button (always visible) ──────────────── */}
      <button
        onClick={enabled ? disable : enable}
        aria-label={enabled ? "Disable split view" : "Enable split view"}
        style={{
          position:   "fixed",
          bottom:     "clamp(20px, 3vw, 32px)",
          right:      "clamp(20px, 3vw, 32px)",
          zIndex:     99992,
          display:    "flex",
          alignItems: "center",
          gap:        8,
          padding:    "8px 14px 8px 10px",
          background: enabled ? "#C8FF2E" : "var(--ink)",
          border:     "1px solid var(--line-light)",
          borderRadius: 100,
          cursor:     "pointer",
          userSelect: "none",
          transition: "background 0.25s, border-color 0.25s",
        }}
      >
        {/* Half-circle icon */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke={enabled ? "#0C0B08" : "var(--dim)"} strokeWidth="1.5" />
          <path d="M9 1 A8 8 0 0 1 9 17 Z" fill={enabled ? "#0C0B08" : "var(--dim)"} />
          <line x1="9" y1="1" x2="9" y2="17" stroke={enabled ? "#0C0B08" : "var(--dim)"} strokeWidth="1.5" />
        </svg>
        <span style={{
          fontFamily:    "var(--font-mono), monospace",
          fontSize:      10,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color:         enabled ? "#0C0B08" : "var(--dim)",
          whiteSpace:    "nowrap",
        }}>
          {enabled ? "EXIT SPLIT" : "SPLIT VIEW"}
        </span>
      </button>

      {/* ── Splitter elements (only when enabled) ───────────── */}
      {enabled && (
        <>
          {/* Inversion overlay */}
          <div
            aria-hidden
            style={{
              position:          "fixed",
              inset:             0,
              right:             `${100 - pos}%`,
              backdropFilter:    "invert(1)",
              WebkitBackdropFilter: "invert(1)",
              pointerEvents:     "none",
              zIndex:            99988,
              willChange:        "right",
            }}
          />

          {/* Vertical line */}
          <div
            aria-hidden
            style={{
              position:  "fixed",
              top:       0,
              bottom:    0,
              left:      `${pos}%`,
              width:     2,
              background: "#C8FF2E",
              transform: "translateX(-1px)",
              pointerEvents: "none",
              zIndex:    99989,
            }}
          />

          {/* Drag handle */}
          <div
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            style={{
              position:   "fixed",
              top:        "50%",
              left:       `${pos}%`,
              transform:  "translate(-50%, -50%)",
              zIndex:     99990,
              cursor:     "ew-resize",
              userSelect: "none",
              touchAction: "none",
            }}
          >
            <div style={{
              width:        44,
              height:       44,
              borderRadius: "50%",
              background:   "#C8FF2E",
              display:      "flex",
              alignItems:   "center",
              justifyContent: "center",
              boxShadow:    "0 0 0 1px rgba(0,0,0,0.15), 0 4px 24px rgba(0,0,0,0.4)",
              transform:    dragging ? "scale(1.2)" : "scale(1)",
              transition:   dragging ? "none" : "transform 0.18s ease",
            }}>
              <svg width="22" height="10" viewBox="0 0 22 10" fill="none">
                <path
                  d="M1 5H21M1 5L5 1M1 5L5 9M21 5L17 1M21 5L17 9"
                  stroke="#0C0B08"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </>
      )}
    </>
  );
}
