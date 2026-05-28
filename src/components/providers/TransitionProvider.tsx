"use client";

import {
  createContext, useContext,
  useCallback, useEffect, useRef,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextValue {
  navigate: (url: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
});

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router        = useRouter();
  const pathname      = usePathname();
  const overlayRef    = useRef<HTMLDivElement>(null);
  const labelRef      = useRef<HTMLSpanElement>(null);
  const barRef        = useRef<HTMLDivElement>(null);
  const isNavigating  = useRef(false);
  const prevPathname  = useRef(pathname);

  /* ── Navigate ───────────────────────────────────────────────
     Direct DOM manipulation — zero React re-render delay.
     The overlay covers the page in the SAME paint frame as the
     click, before React even schedules a reconciliation.      */
  const navigate = useCallback((url: string) => {
    if (isNavigating.current) return;
    if (url === pathname) return;          /* already here — do nothing */
    isNavigating.current = true;

    const overlay = overlayRef.current;
    const label   = labelRef.current;
    const bar     = barRef.current;
    if (!overlay) return;

    /* 1. Position overlay off-screen to the right, make it visible */
    overlay.style.transition = "none";
    overlay.style.clipPath   = "inset(0 100% 0 0)";
    overlay.style.visibility = "visible";

    /* Label always fully visible — revealed naturally by the swipe */
    if (label) {
      label.style.transition = "none";
      label.style.opacity    = "1";
      label.style.transform  = "translateY(0)";
    }

    /* 2. Swipe in left → right (printing effect) */
    overlay.getBoundingClientRect(); /* force reflow so initial state applies */
    overlay.style.transition = "clip-path 0.55s cubic-bezier(0.76,0,0.24,1)";
    overlay.style.clipPath   = "inset(0 0% 0 0)";

    /* 3. Progress bar starts with the swipe */
    if (bar) {
      bar.style.transition = "none";
      bar.style.width      = "0%";
      requestAnimationFrame(() => {
        bar.style.transition = "width 0.6s ease";
        bar.style.width      = "55%";
      });
    }

    /* 4. Navigate immediately — new page loads behind the sweeping overlay */
    router.push(url);
  }, [router, pathname]);

  /* ── Reveal new page when pathname changes ──────────────── */
  useEffect(() => {
    if (!isNavigating.current)          return;
    if (pathname === prevPathname.current) return;

    prevPathname.current = pathname;

    const overlay = overlayRef.current;
    const label   = labelRef.current;
    const bar     = barRef.current;
    if (!overlay) return;

    /* Let new page paint one full frame, then wipe out */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        /* Complete the progress bar first */
        if (bar) {
          bar.style.transition = "width 0.3s ease";
          bar.style.width      = "100%";
        }

        /* Hold AE. visible for a beat, then swipe out left → right */
        setTimeout(() => {
          if (!overlay) return;
          overlay.style.transition = "clip-path 0.75s cubic-bezier(0.76,0,0.24,1)";
          overlay.style.clipPath   = "inset(0 0 0 100%)";

          setTimeout(() => {
            overlay.style.visibility = "hidden";
            isNavigating.current     = false;
          }, 780);
        }, 300); /* ← how long AE. stays fully visible */
      });
    });
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Always in DOM — visibility:hidden until needed */}
      <div
        ref={overlayRef}
        style={{
          position:   "fixed",
          inset:      0,
          background: "var(--ink)",
          visibility: "hidden",
          clipPath:   "inset(0 0 0 0)",
          zIndex:     199999,
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "all",
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily:    "var(--font-syne), sans-serif",
            fontWeight:    800,
            fontSize:      "clamp(40px, 6vw, 72px)",
            letterSpacing: "-0.02em",
            color:         "var(--paper)",
            opacity:       0,
          }}
        >
          AE.
        </span>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: "var(--line)",
        }}>
          <div
            ref={barRef}
            style={{ height: "100%", width: "0%", background: "var(--accent)" }}
          />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}

export const useNavigate = () => useContext(TransitionContext).navigate;
