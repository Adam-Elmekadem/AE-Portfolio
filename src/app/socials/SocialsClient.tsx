"use client";

import BurgerMenu from "@/components/ui/BurgerMenu";
import CustomCursor from "@/components/ui/CustomCursor";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { ClipPathLinks } from "@/components/ui/clip-path-links";

export default function SocialsClient() {
  return (
    <>
      <CustomCursor />
      <BurgerMenu />
      <SmoothScroll>
        <main style={{ background: "var(--ink)", minHeight: "100svh" }}>

          {/* Label bar */}
          <div
            className="container-full flex items-center justify-between"
            style={{
              height: "clamp(56px, 7vw, 72px)",
              borderBottom: "1px solid var(--line)",
              marginTop: "var(--nav-h)",
            }}
          >
            <span className="num-label">SOCIALS</span>
            <span className="num-label">LET&apos;S CONNECT</span>
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
            {["FIND ME", "ONLINE."].map((line, i) => (
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

          {/* Grid */}
          <div
            className="container-full"
            style={{
              paddingTop: "clamp(60px, 8vw, 120px)",
              paddingBottom: "clamp(60px, 8vw, 120px)",
              display: "flex",
              justifyContent: "center",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <ClipPathLinks />
          </div>

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
