"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/SocialIcons";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const socials = [
  { label: "GitHub", href: "https://github.com/Adam-Elmekadem", Icon: GithubIcon },
  { label: "LinkedIn", href: "https://linkedin.com/in/adam-elmekadem", Icon: LinkedinIcon },
  { label: "Twitter / X", href: "https://twitter.com", Icon: TwitterIcon },
];

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  useGSAP(
    () => {
      const lines = sectionRef.current?.querySelectorAll(".contact-line") ?? [];
      gsap.from(lines, {
        yPercent: 105,
        duration: 0.9,
        stagger: 0.07,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".contact-heading",
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(".contact-content > *", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-content",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1200));
    setStatus("sent");
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setStatus("idle"), 4000);
  };

  return (
    <section ref={sectionRef} id="contact" className="section">
      {/* Label bar */}
      <div
        className="container-full flex items-center justify-between"
        style={{ height: "clamp(56px, 7vw, 72px)", borderBottom: "1px solid var(--line)" }}
      >
        <span className="num-label">CONTACT</span>
        <span className="num-label">LET'S STAY IN TOUCH</span>
      </div>

      {/* Giant CTA heading */}
      <div
        className="contact-heading container-full"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(40px, 6vw, 80px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {["LET'S", "STAY IN", "TOUCH."].map((line, i) => (
          <div key={i} style={{ overflow: "hidden" }}>
            <div
              className="contact-line font-display"
              style={{
                fontSize: "clamp(52px, 12vw, 160px)",
                lineHeight: 0.87,
                letterSpacing: "-0.02em",
                color: i === 2 ? "var(--accent)" : "var(--paper)",
              }}
            >
              {line}
            </div>
          </div>
        ))}
      </div>

      {/* Form + Info */}
      <div
        className="contact-content container-full two-col"
        style={{
          paddingTop: "clamp(40px, 6vw, 80px)",
          paddingBottom: "clamp(60px, 8vw, 100px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Left: info */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div>
            <p
              style={{
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(14px, 1.6vw, 18px)",
                lineHeight: 1.7,
                color: "var(--dim)",
                maxWidth: 420,
              }}
            >
              Do you have a project in mind? I am always open to new ideas,
              collaborations, and interesting problems to solve. Send me a
              message - I usually reply within 24 hours.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="num-label">DIRECT EMAIL</span>
            <a
              href="mailto:adamelmekadem1@gmail.com"
              style={{
                fontFamily: "var(--font-syne), sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2vw, 1.4rem)",
                color: "var(--paper)",
                letterSpacing: "-0.01em",
                transition: "color 0.2s",
              }}
              className="hover-line"
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--paper)")}
            >
              adamelmekadem1@gmail.com ↗
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <span className="num-label">SOCIAL LINKS</span>
            <div style={{ display: "flex", gap: 16 }}>
              {socials.map(({ label, href, Icon }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontFamily: "var(--font-mono), monospace",
                    fontSize: 11,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--dim)",
                    transition: "color 0.2s",
                  }}
                  whileHover={{ color: "var(--paper)", x: 3 }}
                  data-cursor=""
                >
                  <Icon size={14} />
                  {label}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Right: form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Name */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="num-label">YOUR NAME</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Adam Elmekadem"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--line-light)",
                padding: "12px 0",
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 17px)",
                color: "var(--paper)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line-light)")}
            />
          </div>

          {/* Email */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="num-label">EMAIL</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="adamelmekadem1@gmail.com"
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--line-light)",
                padding: "12px 0",
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 17px)",
                color: "var(--paper)",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line-light)")}
            />
          </div>

          {/* Message */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span className="num-label">MESSAGE</span>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Tell me about your project..."
              style={{
                background: "transparent",
                border: "none",
                borderBottom: "1px solid var(--line-light)",
                padding: "12px 0",
                fontFamily: "var(--font-space), sans-serif",
                fontSize: "clamp(14px, 1.5vw, 17px)",
                color: "var(--paper)",
                outline: "none",
                resize: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--line-light)")}
            />
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={status !== "idle"}
            style={{
              alignSelf: "flex-start",
              background: status === "sent" ? "var(--accent)" : "var(--paper)",
              color: "var(--ink)",
              border: "none",
              padding: "14px 32px",
              fontFamily: "var(--font-mono), monospace",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 700,
              borderRadius: 2,
              transition: "all 0.25s",
            }}
            whileHover={status === "idle" ? { scale: 1.04, x: 4 } : {}}
            whileTap={{ scale: 0.97 }}
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.span key="sent" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Message sent ✓
                </motion.span>
              ) : status === "sending" ? (
                <motion.span key="sending" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Sending...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Send Message ↗
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>

      {/* Footer */}
      <div
        className="contact-foot container-full flex items-center justify-between"
        style={{ minHeight: "clamp(56px, 6vw, 64px)", paddingTop: 12, paddingBottom: 12 }}
      >
        <span className="num-label">© 2024 ADAM ELMEKADEM</span>
        <span className="num-label">DESIGNED AND BUILT BY AE.</span>
      </div>
    </section>
  );
}
