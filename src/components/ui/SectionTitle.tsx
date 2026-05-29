"use client";

import { motion } from "framer-motion";

/**
 * Standard animated display heading used across every section.
 * Default size matches the landing-page sections (About, Experience, etc.)
 */

const PRESET_SIZES = {
  /** Matches About / Experience / Guestbook — the site standard */
  xl:  "clamp(52px, 10vw, 130px)",
  /** Sub-heading inside two-col sections */
  lg:  "clamp(36px, 5vw, 68px)",
  /** Compact variant */
  md:  "clamp(28px, 3.5vw, 52px)",
} as const;

type PresetSize = keyof typeof PRESET_SIZES;

interface SectionTitleProps {
  lines: string[];
  /** Which line index gets the accent color. Defaults to the last line. */
  accentIndex?: number;
  /** Named preset or a raw clamp() string. Defaults to "xl". */
  size?: PresetSize | (string & {});
  className?: string;
}

export function SectionTitle({
  lines,
  accentIndex,
  size = "xl",
  className,
}: SectionTitleProps) {
  const accent   = accentIndex ?? lines.length - 1;
  const fontSize = size in PRESET_SIZES
    ? PRESET_SIZES[size as PresetSize]
    : size;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {lines.map((line, i) => (
        <div key={`${line}-${i}`} style={{ overflow: "hidden" }}>
          <motion.div
            className="font-display"
            variants={{
              hidden:  { y: "110%" },
              visible: {
                y: 0,
                transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 },
              },
            }}
            style={{
              fontSize,
              lineHeight:    0.88,
              letterSpacing: "-0.02em",
              color: i === accent ? "var(--accent)" : "var(--paper)",
              display: "block",
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </motion.div>
  );
}
