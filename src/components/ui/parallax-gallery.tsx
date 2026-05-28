"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import BurgerMenu from "@/components/ui/BurgerMenu";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { galleryItems, type GalleryItemData } from "@/lib/gallery-data";

/* ── Single row — owns its own hooks ─────────────────────── */
function GalleryRow({ item }: { item: GalleryItemData }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center start"],
  });

  const opacity  = useTransform(scrollYProgress, [0, 0.55], [0, 1]);
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.55],
    [
      item.reverse ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      "inset(0 0% 0 0%)",
    ]
  );
  const y = useTransform(scrollYProgress, [0, 1], [-40, 0]);

  const isReverse = item.reverse;

  return (
    <Link href={`/gallery/${item.id}`} style={{ display: "block", textDecoration: "none" }}>
      <motion.div
        ref={ref}
        className={`min-h-screen flex items-center justify-center px-[clamp(24px,5.5vw,100px)] gap-[clamp(32px,6vw,120px)] flex-col ${
          isReverse ? "md:flex-row-reverse" : "md:flex-row"
        }`}
        style={{ borderBottom: "1px solid var(--line)", cursor: "pointer" }}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.015)" }}
        transition={{ duration: 0.3 }}
      >
        {/* Text */}
        <motion.div style={{ y }} className="flex-1 max-w-md">
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span className="num-label" style={{ color: "var(--accent)" }}>
              {item.id.replace("-", " ").toUpperCase()}
            </span>
            <span className="num-label">/ {item.year}</span>
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(52px, 8vw, 100px)",
              lineHeight: 0.9,
              letterSpacing: "-0.02em",
              color: "var(--paper)",
              marginBottom: "clamp(16px, 2.5vw, 28px)",
            }}
          >
            {item.title}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(13px, 1.3vw, 15px)",
              lineHeight: 1.75,
              color: "var(--dim)",
              maxWidth: 380,
              marginBottom: 24,
            }}
          >
            {item.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
            {item.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            View Story ↗
          </span>
        </motion.div>

        {/* Image — wipes in from the side it sits on */}
        <motion.div style={{ opacity, clipPath }} className="flex-shrink-0">
          <img
            src={item.imageUrl}
            alt={item.title}
            style={{
              width: "clamp(240px, 28vw, 420px)",
              height: "clamp(280px, 34vw, 520px)",
              objectFit: "cover",
              display: "block",
            }}
          />
        </motion.div>
      </motion.div>
    </Link>
  );
}

/* ── Full gallery list page ───────────────────────────────── */
export default function ParallaxGallery() {
  return (
    <>
      <CustomCursor />
      <BurgerMenu />
      <SmoothScroll>
        <main style={{ background: "var(--ink)" }}>

          {/* Label bar */}
          <div
            className="container-full flex items-center justify-between"
            style={{
              height: "clamp(56px, 7vw, 72px)",
              borderBottom: "1px solid var(--line)",
              marginTop: "var(--nav-h)",
            }}
          >
            <span className="num-label">GALLERY</span>
            <span className="num-label">{galleryItems.length} DISCIPLINES</span>
          </div>

          {/* Heading */}
          <div
            className="container-full"
            style={{
              paddingTop: "clamp(40px, 6vw, 80px)",
              paddingBottom: "clamp(40px, 6vw, 80px)",
              borderBottom: "1px solid var(--line)",
            }}
          >
            {["CREATIVE", "WORK."].map((line, i) => (
              <div key={i} style={{ overflow: "hidden" }}>
                <div
                  className="font-display"
                  style={{
                    fontSize: "clamp(64px, 12vw, 160px)",
                    lineHeight: 0.88,
                    letterSpacing: "-0.02em",
                    color: i === 1 ? "var(--accent)" : "var(--paper)",
                  }}
                >
                  {line}
                </div>
              </div>
            ))}
          </div>

          {/* Parallax rows */}
          {galleryItems.map((item) => (
            <GalleryRow key={item.id} item={item} />
          ))}

          {/* Footer */}
          <div
            className="container-full flex items-center justify-between"
            style={{ height: "clamp(56px, 6vw, 64px)" }}
          >
            <span className="num-label">© 2024 ADAM ELMEKADEM</span>
            <span className="num-label">DESIGNED AND BUILT BY AE.</span>
          </div>

        </main>
      </SmoothScroll>
    </>
  );
}
