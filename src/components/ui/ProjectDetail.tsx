"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import BurgerMenu from "@/components/ui/BurgerMenu";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { InfiniteSlider } from "@/components/ui/infinite-slider-horizontal";
import { type Project } from "@/lib/projects-data";
import { useNavigate } from "@/components/providers/TransitionProvider";
import { TextGlitch } from "@/components/ui/text-glitch-effect";

/* ─── Signature pad ──────────────────────────────────────────── */
function SignaturePad() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing   = useRef(false);
  const lastPt    = useRef<{ x: number; y: number } | null>(null);
  const [signed,  setSigned]  = useState(false);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.strokeStyle = "var(--paper)";
    ctx.lineWidth   = 1.6;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
  }, []);

  const pt = (e: React.MouseEvent | React.TouchEvent) => {
    const r   = canvasRef.current!.getBoundingClientRect();
    const src = "touches" in e ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const onStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    const p   = pt(e);
    lastPt.current  = p;
    const ctx = canvasRef.current!.getContext("2d")!;
    ctx.strokeStyle = "#F2F0EB";
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    setSigned(true);
    setCleared(false);
  }, []);

  const onMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current || !lastPt.current) return;
    const p   = pt(e);
    const ctx = canvasRef.current!.getContext("2d")!;
    const mx  = (lastPt.current.x + p.x) / 2;
    const my  = (lastPt.current.y + p.y) / 2;
    ctx.quadraticCurveTo(lastPt.current.x, lastPt.current.y, mx, my);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx, my);
    lastPt.current = p;
  }, []);

  const onEnd = useCallback(() => {
    drawing.current = false;
    lastPt.current  = null;
    canvasRef.current?.getContext("2d")?.beginPath();
  }, []);

  const clear = () => {
    const c = canvasRef.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setSigned(false);
    setCleared(true);
    setTimeout(() => setCleared(false), 1200);
  };

  return (
    <div>
      {/* Baseline label + clear */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span className="num-label" style={{ color: "var(--accent)" }}>SIGN HERE ↓</span>
        <button
          onClick={clear}
          className="num-label"
          style={{
            background: "none", border: "1px solid var(--line-light)",
            borderRadius: 2, padding: "4px 14px", cursor: "pointer",
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--paper)"; e.currentTarget.style.color = "var(--paper)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--line-light)"; e.currentTarget.style.color = ""; }}
        >
          Clear
        </button>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative", border: "1px solid var(--line-light)", cursor: "crosshair" }}>
        <canvas
          ref={canvasRef}
          style={{ display: "block", width: "100%", height: "clamp(90px, 12vw, 140px)", touchAction: "none" }}
          onMouseDown={onStart} onMouseMove={onMove} onMouseUp={onEnd} onMouseLeave={onEnd}
          onTouchStart={onStart} onTouchMove={onMove} onTouchEnd={onEnd}
        />
        {/* Guide line */}
        {!signed && (
          <div style={{
            position: "absolute", bottom: 24, left: "5%", right: "5%",
            height: 1, background: "var(--line-light)", pointerEvents: "none",
          }} />
        )}
        <AnimatePresence>
          {cleared && (
            <motion.span
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="num-label"
              style={{
                position: "absolute", top: "50%", left: "50%",
                transform: "translate(-50%,-50%)", pointerEvents: "none",
              }}
            >
              CLEARED
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <p
        className="num-label"
        style={{ marginTop: 10, color: "var(--dim)" }}
      >
        Your signature confirms you have reviewed this work.
      </p>
    </div>
  );
}

/* ─── Gallery ────────────────────────────────────────────────── */
function Gallery({ images, accent }: { images: string[]; accent: string }) {
  const mirroredImages = [...images].reverse();

  return (
    <div>
      <div className="container-full" style={{ ...detailSectionPadStyle, borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <DisplayHeading lines={["SELECTED", "FRAMES."]} accentIndex={1} />
          <p style={{ ...detailCopyStyle, maxWidth: 560, margin: 0 }}>
            A continuous gallery strip keeps the project readable while giving the screenshots a more editorial, immersive rhythm.
          </p>
        </div>
      </div>

      <div className="container-full" style={{ paddingTop: "clamp(32px, 5vw, 60px)", paddingBottom: "clamp(40px, 6vw, 80px)", borderBottom: "1px solid var(--line)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <InfiniteSlider direction="horizontal" gap={18} duration={32} className="w-full">
            {images.map((src, i) => (
              <div
                key={`${src}-${i}`}
                style={{ flexShrink: 0, width: "clamp(220px, 24vw, 360px)" }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    border: `1px solid ${accent}22`,
                    background: "var(--line)",
                  }}
                >
                  <img
                    src={src}
                    alt={`Screenshot ${i + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(12,11,8,0.05), rgba(12,11,8,0.38))",
                      pointerEvents: "none",
                    }}
                  />
                  <span className="num-label" style={{ position: "absolute", left: 16, bottom: 16, color: "var(--paper)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteSlider>

          <InfiniteSlider direction="horizontal" gap={18} duration={36} reverse className="w-full">
            {mirroredImages.map((src, i) => (
              <div
                key={`${src}-reverse-${i}`}
                style={{ flexShrink: 0, width: "clamp(220px, 24vw, 360px)" }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 3",
                    overflow: "hidden",
                    border: `1px solid ${accent}18`,
                    background: "var(--line)",
                  }}
                >
                  <img
                    src={src}
                    alt={`Screenshot ${images.length - i}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to bottom, rgba(12,11,8,0.08), rgba(12,11,8,0.46))",
                      pointerEvents: "none",
                    }}
                  />
                  <span className="num-label" style={{ position: "absolute", left: 16, bottom: 16, color: "var(--paper)" }}>
                    {String(images.length - i).padStart(2, "0")}
                  </span>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </div>
  );
}

const detailCopyStyle = {
  fontFamily: "var(--font-space), sans-serif",
  fontSize: "clamp(14px, 1.6vw, 18px)",
  lineHeight: 1.75,
  color: "var(--dim)",
} as const;

const detailSectionStyle = {
  borderBottom: "1px solid var(--line)",
} as const;

const detailSectionPadStyle = {
  paddingTop: "clamp(40px, 6vw, 80px)",
  paddingBottom: "clamp(40px, 6vw, 80px)",
} as const;

const detailHeadingStyle = {
  fontSize: "clamp(48px, 9vw, 120px)",
  lineHeight: 0.88,
  letterSpacing: "-0.02em",
  color: "var(--paper)",
  margin: 0,
} as const;

function DisplayHeading({
  lines,
  accentIndex = lines.length - 1,
  size = detailHeadingStyle.fontSize,
}: {
  lines: string[];
  accentIndex?: number;
  size?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, index) => (
        <div key={`${line}-${index}`} style={{ overflow: "hidden" }}>
          <motion.div
            className="font-display"
            variants={{
              hidden: { y: "110%" },
              visible: {
                y: 0,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.08 },
              },
            }}
            style={{
              ...detailHeadingStyle,
              fontSize: size,
              color: index === accentIndex ? "var(--accent)" : "var(--paper)",
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}

/* ─── Full project detail page ───────────────────────────────── */
export default function ProjectDetail({ project }: { project: Project }) {
  const ref      = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({ target: ref });
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  /* Scroll-reveal refs for each section */
  const storyRef  = useRef<HTMLDivElement>(null);
  const whyRef    = useRef<HTMLDivElement>(null);
  const toolsRef  = useRef<HTMLDivElement>(null);
  const sigRef    = useRef<HTMLDivElement>(null);

  const useReveal = (target: React.RefObject<HTMLDivElement | null>) => {
    const { scrollYProgress: sp } = useScroll({ target, offset: ["start end", "center center"] });
    return {
      opacity: useTransform(sp, [0, 0.5], [0, 1]),
      y:       useTransform(sp, [0, 0.6], [32, 0]),
    };
  };

  const story = useReveal(storyRef);
  const why   = useReveal(whyRef);
  const tools = useReveal(toolsRef);
  const sig   = useReveal(sigRef);

  return (
    <>
      <CustomCursor />
      <BurgerMenu />

      {/* Fixed SVG stroke — draws as you scroll */}
      <div aria-hidden style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <svg viewBox="0 0 800 1200" preserveAspectRatio="xMidYMid slice"
          style={{ width: "100%", height: "100%", opacity: 0.12 }} fill="none">
          <motion.path
            d="M 700 0 C 600 100, 200 80, 150 200 C 100 320, 650 350, 620 500
               C 590 640, 80 620, 100 760 C 120 880, 680 870, 650 1000
               C 620 1120, 150 1100, 100 1200"
            stroke="#C8FF2E" strokeWidth="3" strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
      </div>

      <div ref={ref}>
        <SmoothScroll>
          <main style={{ background: "var(--ink)", position: "relative", zIndex: 1 }}>

            {/* ── Top bar ─────────────────────────────────────── */}
            <div
              className="container-full flex items-center justify-between"
              style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)", marginTop: "var(--nav-h)" }}
            >
              <button
                onClick={() => navigate("/#work")}
                className="num-label"
                style={{ color: "var(--dim)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--paper)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}
              >
                ← Work
              </button>
              <span className="num-label">{project.category}</span>
            </div>

            {/* ── Hero ────────────────────────────────────────── */}
            <div className="container-full" style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 6vw, 80px)", borderBottom: "1px solid var(--line)" }}>
              {/* eyebrow */}
              <div style={{ display: "flex", gap: 24, marginBottom: "clamp(20px, 3vw, 32px)", flexWrap: "wrap" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>{project.id}</span>
                <span className="num-label">{project.year}</span>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="num-label"
                    style={{
                      color: project.accentColor,
                      textDecoration: "none",
                      borderBottom: `1px solid ${project.accentColor}`,
                      transition: "opacity 0.2s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.6")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    Live ↗
                  </a>
                )}
              </div>

              <div style={{ marginBottom: "clamp(24px, 4vw, 48px)" }}>
                <DisplayHeading
                  lines={[project.title, "CASE STUDY."]}
                  accentIndex={1}
                  size="clamp(64px, 12vw, 160px)"
                />
              </div>

              <p style={{ ...detailCopyStyle, maxWidth: 560, margin: 0 }}>
                {project.description}
              </p>
            </div>

            {/* ── 01 GALLERY ──────────────────────────────────── */}
            <div style={detailSectionStyle}>
              <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>01 — GALLERY</span>
                <span className="num-label">{project.images.length} SCREENSHOTS</span>
              </div>

              <Gallery images={project.images} accent={project.accentColor} />
            </div>

            {/* ── 02 THE STORY ────────────────────────────────── */}
            <div style={detailSectionStyle}>
              <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>02 — THE STORY</span>
                <span className="num-label">PROJECT NARRATIVE</span>
              </div>

              <div className="container-full" style={{ ...detailSectionPadStyle, borderBottom: "1px solid var(--line)" }}>
                <DisplayHeading lines={["THE", "STORY."]} accentIndex={1} />
              </div>

              <div ref={storyRef} className="container-full two-col" style={detailSectionPadStyle}>
                <motion.div style={{ opacity: story.opacity, y: story.y }}>
                  <span className="num-label" style={{ display: "block", marginBottom: 20, color: "var(--accent)" }}>
                    PROJECT NOTE
                  </span>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <div style={{ overflow: "hidden" }}>
                      <motion.h3 className="font-display" style={{ fontSize: "clamp(34px, 4.2vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--paper)", marginBottom: 0 }} variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}>
                        {project.story.headline}
                      </motion.h3>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div style={{ opacity: story.opacity, y: story.y }}>
                  {project.story.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        ...detailCopyStyle,
                        marginBottom: i < project.story.paragraphs.length - 1 ? 20 : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ── 03 WHY I BUILT IT ───────────────────────────── */}
            <div style={detailSectionStyle}>
              <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>03 — WHY I BUILT IT</span>
                <span className="num-label">CONCEPT &amp; INTENT</span>
              </div>

              <div className="container-full" style={{ ...detailSectionPadStyle, borderBottom: "1px solid var(--line)" }}>
                <DisplayHeading lines={["WHY I", "BUILT IT."]} accentIndex={1} />
              </div>

              <div ref={whyRef} className="container-full two-col" style={detailSectionPadStyle}>
                <motion.div style={{ opacity: why.opacity, y: why.y }}>
                  <span className="num-label" style={{ display: "block", marginBottom: 20, color: "var(--accent)" }}>
                    PROJECT RATIONALE
                  </span>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <div style={{ overflow: "hidden" }}>
                      <motion.h3 className="font-display" style={{ fontSize: "clamp(34px, 4.2vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--paper)", marginBottom: 0 }} variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}>
                        {project.whyBuilt.headline}
                      </motion.h3>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div style={{ opacity: why.opacity, y: why.y }}>
                  {project.whyBuilt.paragraphs.map((p, i) => (
                    <p
                      key={i}
                      style={{
                        ...detailCopyStyle,
                        marginBottom: i < project.whyBuilt.paragraphs.length - 1 ? 20 : 0,
                      }}
                    >
                      {p}
                    </p>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* ── 04 TOOLS & COLLABORATORS ────────────────────── */}
            <div style={detailSectionStyle}>
              <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>04 — TOOLS &amp; COLLABORATORS</span>
                <span className="num-label">STACK / TEAM</span>
              </div>

              <div className="container-full" style={{ ...detailSectionPadStyle, borderBottom: "1px solid var(--line)" }}>
                <DisplayHeading lines={["STACK &", "PEOPLE."]} accentIndex={1} />
              </div>

              <div ref={toolsRef} className="container-full two-col" style={detailSectionPadStyle}>
                <motion.div style={{ opacity: tools.opacity, y: tools.y }}>
                  <span className="num-label" style={{ display: "block", marginBottom: 20, color: "var(--accent)" }}>
                    BUILT TOGETHER
                  </span>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <div style={{ overflow: "hidden" }}>
                      <motion.h3 className="font-display" style={{ fontSize: "clamp(34px, 4.2vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--paper)", marginBottom: 0 }} variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}>
                        {project.tags.length} tools, one focused system.
                      </motion.h3>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div style={{ opacity: tools.opacity, y: tools.y, display: "flex", flexDirection: "column", gap: 40 }}>
                  <div>
                    <span className="num-label" style={{ display: "block", marginBottom: 14 }}>BUILT WITH</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag" style={{ color: project.accentColor, borderColor: `${project.accentColor}44` }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="num-label" style={{ display: "block", marginBottom: 14 }}>COLLABORATORS</span>
                    {project.collaborators.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, marginBottom: 14, borderBottom: "1px solid var(--line)" }}>
                        <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "clamp(15px, 1.5vw, 18px)", color: "var(--paper)" }}>
                          {c.name}
                        </span>
                        <span className="num-label">{c.role}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* ── 05 SIGNATURE ────────────────────────────────── */}
            <div style={detailSectionStyle}>
              <div className="container-full flex items-center justify-between" style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}>
                <span className="num-label" style={{ color: "var(--accent)" }}>05 — LEAVE YOUR MARK</span>
                <span className="num-label">SIGNATURE</span>
              </div>

              <div className="container-full" style={{ ...detailSectionPadStyle, borderBottom: "1px solid var(--line)" }}>
                <DisplayHeading lines={["LEAVE", "YOUR MARK."]} accentIndex={1} />
              </div>

              <div ref={sigRef} className="container-full two-col" style={detailSectionPadStyle}>
                <motion.div style={{ opacity: sig.opacity, y: sig.y }}>
                  <span className="num-label" style={{ display: "block", marginBottom: 20, color: "var(--accent)" }}>
                    PROJECT FEEDBACK
                  </span>
                  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }}>
                    <div style={{ overflow: "hidden" }}>
                      <motion.h3 className="font-display" style={{ fontSize: "clamp(34px, 4.2vw, 64px)", lineHeight: 0.92, letterSpacing: "-0.02em", color: "var(--paper)", marginBottom: 0 }} variants={{ hidden: { y: "110%" }, visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } } }}>
                        Reviewed this project?
                      </motion.h3>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div style={{ opacity: sig.opacity, y: sig.y }}>
                  <SignaturePad />
                </motion.div>
              </div>
            </div>

            {/* ── LIVE PROJECT ─────────────────────────────────── */}
            {project.live && (
              <div style={{ borderBottom: "1px solid var(--line)" }}>
                {/* outer div is visible → whileInView fires; inner div clips the slide */}
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: "block", textDecoration: "none" }}
                  >
                    <div className="container-full" style={{ paddingTop: "clamp(40px, 6vw, 80px)", paddingBottom: "clamp(40px, 6vw, 80px)", overflow: "hidden" }}>
                      <motion.div
                        variants={{
                          hidden:  { y: "110%" },
                          visible: { y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
                        }}
                      >
                        <TextGlitch
                          text="VISIT PROJECT ↗"
                          className="font-display"
                          style={{
                            fontSize: "clamp(52px, 10vw, 130px)",
                            lineHeight: 0.88,
                            letterSpacing: "-0.02em",
                            color: "var(--paper)",
                          }}
                        />
                      </motion.div>
                    </div>
                  </a>
                </motion.div>
              </div>
            )}

            {/* ── Footer ──────────────────────────────────────── */}
            <div
              className="container-full flex items-center justify-between"
              style={{ height: "clamp(56px, 6vw, 72px)" }}
            >
              <button
                onClick={() => navigate("/#work")}
                className="num-label"
                style={{ color: "var(--dim)", background: "none", border: "none", cursor: "pointer", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--paper)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--dim)")}
              >
                ← All Work
              </button>
              <span className="num-label">© {new Date().getFullYear()} ADAM ELMEKADEM</span>
            </div>

          </main>
        </SmoothScroll>
      </div>
    </>
  );
}
