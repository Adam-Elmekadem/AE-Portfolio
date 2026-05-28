"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import BurgerMenu from "@/components/ui/BurgerMenu";
import CustomCursor from "@/components/ui/CustomCursor";

export default function NotFound() {
  return (
    <>
      <CustomCursor />
      <BurgerMenu />

      <main
        style={{
          minHeight: "100svh",
          background: "var(--ink)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingTop: "var(--nav-h)",
        }}
      >
        {/* Label bar */}
        <div
          className="container-full flex items-center justify-between"
          style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
        >
          <span className="num-label">404</span>
          <span className="num-label">PAGE NOT FOUND</span>
        </div>

        {/* Big 404 */}
        <div
          className="container-full"
          style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          <div style={{ overflow: "hidden" }}>
            <motion.div
              className="font-display"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              style={{
                fontSize: "clamp(100px, 22vw, 300px)",
                lineHeight: 0.85,
                letterSpacing: "-0.03em",
                color: "var(--line-light)",
              }}
            >
              404
            </motion.div>
          </div>

          <div style={{ overflow: "hidden" }}>
            <motion.div
              className="font-display"
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.08 }}
              style={{
                fontSize: "clamp(52px, 10vw, 130px)",
                lineHeight: 0.88,
                letterSpacing: "-0.02em",
                color: "var(--accent)",
              }}
            >
              LOST?
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{
              fontFamily: "var(--font-space), sans-serif",
              fontSize: "clamp(14px, 1.5vw, 17px)",
              color: "var(--dim)",
              lineHeight: 1.75,
              maxWidth: 420,
              marginTop: "clamp(24px, 4vw, 40px)",
            }}
          >
            This page doesn&apos;t exist or was moved. Head back home and keep exploring.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            style={{ marginTop: 32 }}
          >
            <Link href="/" style={{ textDecoration: "none" }}>
              <motion.span
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  fontFamily: "var(--font-mono), monospace",
                  fontSize: 12,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--paper)",
                }}
              >
                <span style={{ color: "var(--accent)" }}>←</span>
                Back to Home
              </motion.span>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <div
          className="container-full flex items-center justify-between"
          style={{ height: "clamp(56px, 6vw, 64px)", borderTop: "1px solid var(--line)" }}
        >
          <span className="num-label">© {new Date().getFullYear()} ADAM ELMEKADEM</span>
          <span className="num-label">DESIGNED AND BUILT BY AE.</span>
        </div>
      </main>
    </>
  );
}
