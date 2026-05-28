"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { supabase, type Signature } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type Tool = "pen" | "eraser";

const COLORS = [
  { value: "#F2F0EB", label: "White"  },
  { value: "#C8FF2E", label: "Accent" },
  { value: "#a78bfa", label: "Purple" },
  { value: "#60a5fa", label: "Blue"   },
  { value: "#34d399", label: "Green"  },
  { value: "#f87171", label: "Red"    },
  { value: "#fbbf24", label: "Yellow" },
];

export default function Guestbook() {
  const sectionRef  = useRef<HTMLElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const lastPos     = useRef<{ x: number; y: number } | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [tool,      setTool]      = useState<Tool>("pen");
  const [color,     setColor]     = useState("#F2F0EB");
  const [brushSize, setBrushSize] = useState(3);
  const [name,      setName]      = useState("");
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [saving,    setSaving]    = useState(false);
  const [loading,   setLoading]   = useState(true);
  const [isEmpty,   setIsEmpty]   = useState(true);

  /* ── GSAP heading ───────────────────────────────────────── */
  useGSAP(() => {
    gsap.from(".guest-reveal", {
      yPercent: 105,
      duration: 0.9,
      stagger: 0.07,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".guest-heading",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.from(".guest-canvas-wrap", {
      opacity: 0,
      y: 24,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".guest-canvas-wrap",
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  }, { scope: sectionRef });

  /* ── Load signatures ────────────────────────────────────── */
  useEffect(() => {
    supabase
      .from("signatures")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSignatures(data);
        setLoading(false);
      });
  }, []);

  /* ── Init canvas ────────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0C0B08";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  /* ── Drawing helpers ────────────────────────────────────── */
  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect   = canvas.getBoundingClientRect();
    const scaleX = canvas.width  / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top)  * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top)  * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    setIsDrawing(true);
    setIsEmpty(false);
    lastPos.current = getPos(e, canvas);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = tool === "eraser" ? "#0C0B08" : color;
    ctx.lineWidth   = tool === "eraser" ? brushSize * 5 : brushSize;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDrawing = () => { setIsDrawing(false); lastPos.current = null; };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#0C0B08";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  }, []);

  /* ── Save ───────────────────────────────────────────────── */
  const saveSignature = async () => {
    if (!name.trim() || isEmpty) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    setSaving(true);
    const { data, error } = await supabase
      .from("signatures")
      .insert({ name: name.trim(), signature_data: canvas.toDataURL("image/png") })
      .select()
      .single();
    if (!error && data) {
      setSignatures(prev => [data, ...prev]);
      clearCanvas();
      setName("");
    }
    setSaving(false);
  };

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <section ref={sectionRef} id="guestbook" className="section">

      {/* Label bar */}
      <div
        className="container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">GUESTBOOK</span>
        <span className="num-label">SIGN THE WALL</span>
      </div>

      {/* Heading */}
      <div
        className="guest-heading container-full"
        style={{
          paddingTop:    "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom:  "1px solid var(--line)",
        }}
      >
        {["LEAVE YOUR", "MARK."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              className="guest-reveal font-display"
              style={{
                fontSize:      "clamp(52px, 10vw, 130px)",
                lineHeight:    0.88,
                letterSpacing: "-0.02em",
                color: i === 1 ? "var(--accent)" : "var(--paper)",
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Drawing area */}
      <div
        className="guest-canvas-wrap container-full"
        style={{
          paddingTop:    "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom:  "1px solid var(--line)",
        }}
      >
        <div style={{ border: "1px solid var(--line)" }}>

          {/* Toolbar */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={{
              padding:      "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)",
              borderBottom: "1px solid var(--line)",
              background:   "var(--ink)",
            }}
          >
            {/* Pen / Eraser */}
            <div style={{ display: "flex", gap: 0 }}>
              {(["pen", "eraser"] as Tool[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTool(t)}
                  style={{
                    padding:      "6px 14px",
                    fontFamily:   "var(--font-mono), monospace",
                    fontSize:     10,
                    letterSpacing:"0.12em",
                    textTransform:"uppercase",
                    color:        tool === t ? "var(--ink)" : "var(--dim)",
                    background:   tool === t ? "var(--accent)" : "transparent",
                    border:       "1px solid var(--line-light)",
                    borderRight:  t === "pen" ? "none" : "1px solid var(--line-light)",
                    cursor:       "pointer",
                    transition:   "all 0.18s",
                  }}
                >
                  {t === "pen" ? "✦ Pen" : "◻ Eraser"}
                </button>
              ))}
            </div>

            {/* Color swatches */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {COLORS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => { setColor(value); setTool("pen"); }}
                  title={label}
                  style={{
                    width:        22,
                    height:       22,
                    borderRadius: "50%",
                    background:   value,
                    border:       `2px solid ${color === value && tool === "pen" ? "var(--paper)" : "transparent"}`,
                    outline:      color === value && tool === "pen" ? "1px solid var(--line-light)" : "none",
                    outlineOffset: 2,
                    cursor:       "pointer",
                    transition:   "transform 0.15s",
                    transform:    color === value && tool === "pen" ? "scale(1.2)" : "scale(1)",
                    flexShrink:   0,
                  }}
                />
              ))}
            </div>

            {/* Brush size */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: "auto" }}>
              <span className="num-label">SIZE</span>
              <input
                type="range"
                min={1}
                max={12}
                value={brushSize}
                onChange={e => setBrushSize(Number(e.target.value))}
                style={{ width: 80, accentColor: "var(--accent)" }}
              />
              <span className="num-label">{brushSize}px</span>
            </div>

            {/* Clear */}
            <button
              onClick={clearCanvas}
              style={{
                fontFamily:    "var(--font-mono), monospace",
                fontSize:      10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color:         "var(--dim)",
                background:    "transparent",
                border:        "none",
                cursor:        "pointer",
                transition:    "color 0.18s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--paper)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}
            >
              CLEAR ✕
            </button>
          </div>

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={800}
            height={220}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{
              display:    "block",
              width:      "100%",
              cursor:     "crosshair",
              touchAction:"none",
              background: "var(--ink)",
            }}
          />

          {/* Name + save row */}
          <div
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          16,
              padding:      "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)",
              borderTop:    "1px solid var(--line)",
            }}
          >
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && saveSignature()}
              placeholder="Your name"
              maxLength={40}
              style={{
                flex:        1,
                background:  "transparent",
                border:      "none",
                borderBottom:"1px solid var(--line-light)",
                padding:     "8px 0",
                fontFamily:  "var(--font-syne), sans-serif",
                fontWeight:  600,
                fontSize:    "clamp(14px, 1.5vw, 17px)",
                color:       "var(--paper)",
                outline:     "none",
                transition:  "border-color 0.2s",
              }}
              onFocus={e  => (e.target.style.borderColor = "var(--accent)")}
              onBlur={e   => (e.target.style.borderColor = "var(--line-light)")}
            />
            <motion.button
              onClick={saveSignature}
              disabled={saving || !name.trim() || isEmpty}
              whileHover={!saving && name.trim() && !isEmpty ? { x: 4 } : {}}
              whileTap={{ scale: 0.97 }}
              style={{
                padding:       "10px 28px",
                background:    saving ? "var(--line)" : "var(--accent)",
                color:         "var(--ink)",
                border:        "none",
                fontFamily:    "var(--font-mono), monospace",
                fontSize:      11,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight:    700,
                cursor:        saving || !name.trim() || isEmpty ? "not-allowed" : "pointer",
                opacity:       saving || !name.trim() || isEmpty ? 0.4 : 1,
                transition:    "background 0.2s, opacity 0.2s",
                flexShrink:    0,
              }}
            >
              {saving ? "SAVING…" : "SIGN ✦"}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Signature wall */}
      <div
        className="container-full"
        style={{
          paddingTop:    "clamp(32px, 5vw, 60px)",
          paddingBottom: "clamp(60px, 8vw, 100px)",
        }}
      >
        <div
          style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            marginBottom:   "clamp(24px, 4vw, 40px)",
          }}
        >
          <span className="num-label">
            {loading ? "LOADING…" : `${signatures.length} SIGNATURE${signatures.length !== 1 ? "S" : ""}`}
          </span>
          <span className="num-label">THE WALL</span>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="three-col" style={{ border: "1px solid var(--line)" }}>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="cat-cell"
                style={{
                  height:      160,
                  borderBottom:"1px solid var(--line)",
                  background:  "var(--ink)",
                  opacity:     0.4,
                }}
              />
            ))}
          </div>
        ) : signatures.length === 0 ? (
          <div
            style={{
              padding:     "clamp(60px, 10vw, 100px)",
              textAlign:   "center",
              border:      "1px solid var(--line)",
              color:       "var(--dim)",
              fontFamily:  "var(--font-mono), monospace",
              fontSize:    11,
              letterSpacing:"0.12em",
              textTransform:"uppercase",
            }}
          >
            Be the first to sign.
          </div>
        ) : (
          <div className="three-col" style={{ border: "1px solid var(--line)" }}>
            <AnimatePresence>
              {signatures.map((sig, i) => (
                <motion.div
                  key={sig.id}
                  className="cat-cell"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: i < 9 ? i * 0.04 : 0 }}
                  style={{
                    borderBottom: "1px solid var(--line)",
                    background:   "var(--ink)",
                    transition:   "background 0.2s",
                  }}
                  whileHover={{ backgroundColor: "var(--line)" } as never}
                >
                  {/* Signature image */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sig.signature_data}
                    alt={`${sig.name}'s signature`}
                    style={{
                      width:      "100%",
                      height:     "clamp(80px, 10vw, 120px)",
                      objectFit:  "contain",
                      display:    "block",
                      padding:    "12px",
                      filter:     "none",  /* exclude from theme-splitter inversion */
                    }}
                  />
                  {/* Card footer */}
                  <div
                    style={{
                      display:       "flex",
                      alignItems:    "center",
                      justifyContent:"space-between",
                      padding:       "8px 14px",
                      borderTop:     "1px solid var(--line)",
                    }}
                  >
                    <span
                      style={{
                        fontFamily:    "var(--font-syne), sans-serif",
                        fontWeight:    700,
                        fontSize:      "clamp(12px, 1.2vw, 14px)",
                        color:         "var(--paper)",
                        letterSpacing: "-0.01em",
                        overflow:      "hidden",
                        textOverflow:  "ellipsis",
                        whiteSpace:    "nowrap",
                      }}
                    >
                      {sig.name}
                    </span>
                    <span className="num-label">
                      {new Date(sig.created_at).toLocaleDateString("en", {
                        month: "short",
                        day:   "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

    </section>
  );
}
