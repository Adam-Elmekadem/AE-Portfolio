"use client";

import React from "react";
import { SiGmail, SiGithub, SiX, SiBehance, SiFreelancer } from "react-icons/si";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { Globe } from "lucide-react";
import { useAnimate } from "framer-motion";
import type { IconType } from "react-icons";

/* ── Clip-path keyframes ─────────────────────────────────── */
const NO_CLIP           = "polygon(0 0, 100% 0, 100% 100%, 0% 100%)";
const BOTTOM_RIGHT_CLIP = "polygon(0 0, 100% 0, 0 0, 0% 100%)";
const TOP_RIGHT_CLIP    = "polygon(0 0, 0 100%, 100% 100%, 0% 100%)";
const BOTTOM_LEFT_CLIP  = "polygon(100% 100%, 100% 0, 100% 100%, 0 100%)";
const TOP_LEFT_CLIP     = "polygon(0 0, 100% 0, 100% 100%, 100% 0)";

type Side = "left" | "right" | "top" | "bottom";

const ENTRANCE: Record<Side, string[]> = {
  left:   [BOTTOM_RIGHT_CLIP, NO_CLIP],
  bottom: [BOTTOM_RIGHT_CLIP, NO_CLIP],
  top:    [BOTTOM_RIGHT_CLIP, NO_CLIP],
  right:  [TOP_LEFT_CLIP,     NO_CLIP],
};

const EXIT: Record<Side, string[]> = {
  left:   [NO_CLIP, TOP_RIGHT_CLIP],
  bottom: [NO_CLIP, TOP_RIGHT_CLIP],
  top:    [NO_CLIP, TOP_RIGHT_CLIP],
  right:  [NO_CLIP, BOTTOM_LEFT_CLIP],
};

/* ── LinkBox ─────────────────────────────────────────────── */
interface LinkBoxProps {
  href: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon?: any;
}

const ICON_SIZE = 28;

const LinkBox = ({ href, label, Icon }: LinkBoxProps) => {
  const [scope, animate] = useAnimate();

  const getNearestSide = (e: React.MouseEvent<HTMLAnchorElement>): Side => {
    const box = e.currentTarget.getBoundingClientRect();
    return ([
      { proximity: Math.abs(box.left   - e.clientX), side: "left"   as Side },
      { proximity: Math.abs(box.right  - e.clientX), side: "right"  as Side },
      { proximity: Math.abs(box.top    - e.clientY), side: "top"    as Side },
      { proximity: Math.abs(box.bottom - e.clientY), side: "bottom" as Side },
    ].sort((a, b) => a.proximity - b.proximity)[0].side);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) =>
    animate(scope.current, { clipPath: ENTRANCE[getNearestSide(e)] });

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) =>
    animate(scope.current, { clipPath: EXIT[getNearestSide(e)] });

  return (
    <a
      href={href}
      target={href.startsWith("mailto") || href.startsWith("/") ? "_self" : "_blank"}
      rel="noopener noreferrer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={label}
      style={{
        position: "relative",
        display: "grid",
        placeContent: "center",
        height: "clamp(72px, 10vw, 140px)",
        background: "var(--ink)",
        overflow: "hidden",
        textDecoration: "none",
      }}
    >
      {/* Default state */}
      {Icon && <Icon size={ICON_SIZE} style={{ color: "var(--dim)" }} />}

      {/* Accent hover overlay */}
      <div
        ref={scope}
        style={{
          clipPath: BOTTOM_RIGHT_CLIP,
          position: "absolute",
          inset: 0,
          display: "grid",
          placeContent: "center",
          background: "var(--accent)",
        }}
      >
        {Icon && <Icon size={ICON_SIZE} style={{ color: "var(--ink)" }} />}
      </div>
    </a>
  );
};

/* ── Grid rows ───────────────────────────────────────────── */
const BORDER = "1px solid var(--line)";

export const ClipPathLinks = () => (
  <div style={{ border: BORDER, width: "100%", maxWidth: 900 }}>

    {/* Row 1 — 2 cols: Email · GitHub */}
    <div className="grid grid-cols-2" style={{ borderBottom: BORDER }}>
      <div style={{ borderRight: BORDER }}>
        <LinkBox Icon={SiGmail}  href="mailto:adamelmekadem61@gmail.com" label="Email"  />
      </div>
      <LinkBox   Icon={SiGithub} href="https://github.com/Adam-Elmekadem"  label="GitHub" />
    </div>

    {/* Row 2 — 4 cols: Twitter · LinkedIn · Instagram · Behance */}
    <div className="grid grid-cols-4" style={{ borderBottom: BORDER }}>
      {([
        { Icon: SiX,           href: "https://twitter.com",                    label: "Twitter"   },
        { Icon: FaLinkedinIn,  href: "https://linkedin.com/in/adam-elmekadem", label: "LinkedIn"  },
        { Icon: FaInstagram,   href: "https://instagram.com",                  label: "Instagram" },
        { Icon: SiBehance,     href: "https://behance.net",                    label: "Behance"   },
      ] as const).map(({ Icon, href, label }, i) => (
        <div key={label} style={{ borderRight: i < 3 ? BORDER : "none" }}>
          <LinkBox Icon={Icon} href={href} label={label} />
        </div>
      ))}
    </div>

    {/* Row 3 — 3 cols: Portfolio · Freelancer · Globe */}
    <div className="grid grid-cols-3">
      {([
        { Icon: Globe,         href: "/",                           label: "Portfolio"  },
        { Icon: SiFreelancer,  href: "https://www.freelancer.com", label: "Freelancer" },
        { Icon: SiBehance,     href: "https://behance.net",        label: "Behance Alt"},
      ] as const).map(({ Icon, href, label }, i) => (
        <div key={label} style={{ borderRight: i < 2 ? BORDER : "none" }}>
          <LinkBox Icon={Icon} href={href} label={label} />
        </div>
      ))}
    </div>

  </div>
);
