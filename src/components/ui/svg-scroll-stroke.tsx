"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import BurgerMenu from "@/components/ui/BurgerMenu";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { type GalleryItemData } from "@/lib/gallery-data";

/* ── Animated SVG stroke that draws with page scroll ─────── */
function StrokeBackground({ scrollYProgress }: { scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const pathLength = useTransform(scrollYProgress, [0, 0.95], [0, 1]);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        overflow: "hidden",
      }}
    >
      <svg
        viewBox="0 0 800 1200"
        preserveAspectRatio="xMidYMid slice"
        style={{ width: "100%", height: "100%", opacity: 0.18 }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M 700 0
             C 600 100, 200 80, 150 200
             C 100 320, 650 350, 620 500
             C 590 640, 80 620, 100 760
             C 120 880, 680 870, 650 1000
             C 620 1120, 150 1100, 100 1200"
          stroke="#C8FF2E"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ pathLength }}
        />
      </svg>
    </div>
  );
}

/* ── Story section row ────────────────────────────────────── */
function StorySection({
  section,
  index,
}: {
  section: GalleryItemData["story"]["sections"][number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y       = useTransform(scrollYProgress, [0, 0.6], [40, 0]);
  const imgClip = useTransform(
    scrollYProgress,
    [0, 0.6],
    [index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)", "inset(0 0% 0 0%)"]
  );

  const isImageLeft = index % 2 !== 0;

  return (
    <div
      ref={ref}
      style={{
        borderBottom: "1px solid var(--line)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <div
        className={`container-full flex flex-col ${isImageLeft ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-[clamp(32px,6vw,100px)]`}
        style={{
          paddingTop: "clamp(80px, 10vw, 140px)",
          paddingBottom: "clamp(80px, 10vw, 140px)",
        }}
      >
        {/* Text */}
        <motion.div style={{ opacity, y }} className="flex-1">
          <span className="num-label" style={{ display: "block", marginBottom: 20, color: "var(--accent)" }}>
            0{index + 1}
          </span>
          <h3
            className="font-display"
            style={{
              fontSize: "clamp(36px, 5vw, 72px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--paper)",
              marginBottom: "clamp(20px, 3vw, 32px)",
            }}
          >
            {section.heading}
          </h3>
          <p
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              lineHeight: 1.8,
              color: "var(--dim)",
              maxWidth: 480,
            }}
          >
            {section.body}
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          style={{ clipPath: imgClip, flexShrink: 0 }}
        >
          <img
            src={section.imageUrl}
            alt={section.heading}
            style={{
              width: "clamp(260px, 30vw, 480px)",
              height: "clamp(300px, 36vw, 560px)",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}

/* ── Full detail page ─────────────────────────────────────── */
export default function GalleryDetail({ item }: { item: GalleryItemData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  return (
    <>
      <CustomCursor />
      <BurgerMenu />
      <div ref={containerRef}>
        <StrokeBackground scrollYProgress={scrollYProgress} />
        <SmoothScroll>
          <main style={{ background: "transparent", position: "relative", zIndex: 1 }}>

            {/* Back link bar */}
            <div
              className="container-full flex items-center justify-between"
              style={{
                height: "clamp(56px, 7vw, 72px)",
                borderBottom: "1px solid var(--line)",
                marginTop: "var(--nav-h)",
              }}
            >
              <Link
                href="/gallery"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                  transition: "color 0.2s",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--paper)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
              >
                ← Back to Gallery
              </Link>
              <span className="num-label">{item.category}</span>
            </div>

            {/* Hero */}
            <div
              className="container-full"
              style={{
                paddingTop: "clamp(60px, 8vw, 120px)",
                paddingBottom: "clamp(60px, 8vw, 120px)",
                borderBottom: "1px solid var(--line)",
                minHeight: "60vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
              }}
            >
              <span className="num-label" style={{ color: "var(--accent)", display: "block", marginBottom: 20 }}>
                {item.year} — {item.tags.join(" / ")}
              </span>
              <h1
                className="font-display"
                style={{
                  fontSize: "clamp(72px, 14vw, 180px)",
                  lineHeight: 0.85,
                  letterSpacing: "-0.02em",
                  color: "var(--paper)",
                  marginBottom: "clamp(32px, 5vw, 60px)",
                }}
              >
                {item.title}
              </h1>
              {/* Lead quote */}
              <p
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(18px, 2.5vw, 30px)",
                  color: "var(--paper)",
                  maxWidth: 700,
                  lineHeight: 1.4,
                  opacity: 0.7,
                }}
              >
                &ldquo;{item.story.lead}&rdquo;
              </p>
            </div>

            {/* Story sections */}
            {item.story.sections.map((section, i) => (
              <StorySection key={section.heading} section={section} index={i} />
            ))}

            {/* Tools row */}
            <div
              className="container-full"
              style={{
                paddingTop: "clamp(60px, 8vw, 100px)",
                paddingBottom: "clamp(60px, 8vw, 100px)",
                borderBottom: "1px solid var(--line)",
              }}
            >
              <span className="num-label" style={{ display: "block", marginBottom: 32 }}>TOOLS USED</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {item.story.tools.map((tool) => (
                  <span
                    key={tool}
                    className="tag"
                    style={{
                      fontSize: 13,
                      padding: "8px 16px",
                      borderColor: "var(--line-light)",
                      color: "var(--paper)",
                    }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer nav — next / back */}
            <div
              className="container-full flex items-center justify-between"
              style={{ height: "clamp(56px, 6vw, 72px)" }}
            >
              <Link
                href="/gallery"
                style={{
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--dim)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--paper)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--dim)")}
              >
                ← All Work
              </Link>
              <span className="num-label">© 2024 ADAM ELMEKADEM</span>
            </div>

          </main>
        </SmoothScroll>
      </div>
    </>
  );
}
