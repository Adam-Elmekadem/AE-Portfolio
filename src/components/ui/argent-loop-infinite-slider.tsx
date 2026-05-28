"use client";

import * as React from "react";

/* ─── Types ───────────────────────────────────────────────── */
export interface SliderProject {
  title:       string;
  image:       string;
  category:    string;
  year:        string;
  description: string;
}

/* ─── Config ──────────────────────────────────────────────── */
const CFG = {
  SPEED:    0.75,
  LERP:     0.05,
  MAX_V:    150,
  SNAP_MS:  500,
  MM_H:     250,   // minimap item height (px) — must match CSS
} as const;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ─── Component ───────────────────────────────────────────── */
export function ArgentSlider({ projects }: { projects: SliderProject[] }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isActive     = React.useRef(false);
  const rafRef       = React.useRef(0);
  const aidxRef      = React.useRef(0);   // active index ref — no re-render on every frame

  const projectsRef  = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const minimapRef   = React.useRef<Map<number, HTMLDivElement>>(new Map());
  const infoRef      = React.useRef<Map<number, HTMLDivElement>>(new Map());

  const [activeIdx, setActiveIdx] = React.useState(0);

  /* all mutable animation state in one ref */
  const st = React.useRef({
    y:          0,
    target:     0,
    ph:         0,        // viewport height = one slide height
    drag:       false,
    snap:       false,
    snapStart:  { t: 0, y: 0, to: 0 },
    lastScroll: Date.now(),
    dragStart:  { my: 0, sy: 0 },
  });

  /* ── Parallax helper ──────────────────────────────────── */
  const updateParallax = (
    img: HTMLImageElement | null,
    scroll: number,
    idx: number,
    h: number,
  ) => {
    if (!img) return;
    if (!img.dataset.py) img.dataset.py = "0";
    let cur = parseFloat(img.dataset.py);
    const tgt = (-scroll - idx * h) * 0.2;
    cur = lerp(cur, tgt, 0.1);
    img.style.transform = `translateY(${cur}px) scale(1.5)`;
    img.dataset.py = String(cur);
  };

  /* ── Position updates ─────────────────────────────────── */
  const updatePositions = () => {
    const { y, ph } = st.current;
    if (!ph) return;
    const mmY = (y * CFG.MM_H) / ph;

    projectsRef.current.forEach((el, i) => {
      el.style.transform = `translateY(${i * ph + y}px)`;
      updateParallax(el.querySelector("img"), y, i, ph);
    });
    minimapRef.current.forEach((el, i) => {
      el.style.transform = `translateY(${i * CFG.MM_H + mmY}px)`;
      updateParallax(el.querySelector("img"), mmY, i, CFG.MM_H);
    });
    infoRef.current.forEach((el, i) => {
      el.style.transform = `translateY(${i * CFG.MM_H + mmY}px)`;
    });
  };

  /* ── Snap ─────────────────────────────────────────────── */
  const snapTo = () => {
    const s = st.current;
    const max = projects.length - 1;
    const clamped = Math.max(0, Math.min(Math.round(-s.target / s.ph), max));
    const to = -clamped * s.ph;
    s.snap = true;
    s.snapStart = { t: Date.now(), y: s.target, to };
  };

  /* ── Animation loop ───────────────────────────────────── */
  const loop = React.useCallback(() => {
    const s = st.current;
    const now = Date.now();

    if (!s.snap && !s.drag && now - s.lastScroll > 120) {
      const sp = -Math.round(-s.target / (s.ph || 1)) * (s.ph || 1);
      if (Math.abs(s.target - sp) > 1) snapTo();
    }

    if (s.snap) {
      const prog = Math.min((now - s.snapStart.t) / CFG.SNAP_MS, 1);
      const eased = 1 - Math.pow(1 - prog, 3);
      s.target = s.snapStart.y + (s.snapStart.to - s.snapStart.y) * eased;
      if (prog >= 1) s.snap = false;
    }

    if (!s.drag) s.y += (s.target - s.y) * CFG.LERP;

    updatePositions();

    const idx = !s.ph
      ? 0
      : Math.max(0, Math.min(Math.round(-s.target / s.ph), projects.length - 1));

    if (idx !== aidxRef.current) {
      aidxRef.current = idx;
      setActiveIdx(idx);
    }

    rafRef.current = requestAnimationFrame(loop);
  }, [projects.length]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Mount ────────────────────────────────────────────── */
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const max = projects.length - 1;

    st.current.ph = window.innerHeight;

    /* IntersectionObserver: stop Lenis when section enters view */
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        isActive.current = true;
        window.dispatchEvent(new Event("lenis:stop"));
      } else {
        isActive.current = false;
      }
    }, { threshold: 0.55 });
    observer.observe(el);

    /* Wheel */
    const onWheel = (e: WheelEvent) => {
      if (!isActive.current) return;
      const s = st.current;
      const idx = Math.round(-s.target / (s.ph || 1));

      if (e.deltaY > 0 && idx >= max && -s.target >= max * s.ph - 2) {
        isActive.current = false;
        window.dispatchEvent(new Event("lenis:start"));
        return;
      }
      if (e.deltaY < 0 && idx <= 0 && s.target >= -2) {
        isActive.current = false;
        window.dispatchEvent(new Event("lenis:start"));
        return;
      }

      e.preventDefault();
      s.snap = false;
      s.lastScroll = Date.now();
      const delta = Math.max(Math.min(e.deltaY * CFG.SPEED, CFG.MAX_V), -CFG.MAX_V);
      s.target = Math.max(-(max * s.ph), Math.min(0, s.target - delta));
    };

    /* Touch */
    const onTouchStart = (e: TouchEvent) => {
      if (!isActive.current) return;
      const s = st.current;
      s.drag = true; s.snap = false;
      s.dragStart = { my: e.touches[0].clientY, sy: s.target };
      s.lastScroll = Date.now();
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isActive.current || !st.current.drag) return;
      const s = st.current;
      s.target = Math.max(-(max * s.ph), Math.min(0,
        s.dragStart.sy + (e.touches[0].clientY - s.dragStart.my) * 1.5,
      ));
      s.lastScroll = Date.now();
    };
    const onTouchEnd = () => { st.current.drag = false; };

    /* Resize */
    const onResize = () => {
      st.current.ph = window.innerHeight;
      el.style.height = `${window.innerHeight}px`;
    };

    window.addEventListener("wheel",      onWheel,      { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchmove",  onTouchMove);
    window.addEventListener("touchend",   onTouchEnd);
    window.addEventListener("resize",     onResize);
    onResize();

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel",      onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
      window.removeEventListener("touchend",   onTouchEnd);
      window.removeEventListener("resize",     onResize);
      cancelAnimationFrame(rafRef.current);
      window.dispatchEvent(new Event("lenis:start"));
    };
  }, [loop, projects.length]);

  /* ── JSX ─────────────────────────────────────────────── */
  return (
    <div ref={containerRef} className="ps-container">

      {/* Full-screen slides */}
      <ul className="ps-list">
        {projects.map((p, i) => (
          <div
            key={i}
            className="ps-slide"
            ref={el => { if (el) projectsRef.current.set(i, el); else projectsRef.current.delete(i); }}
          >
            <img src={p.image} alt={p.title} />

            {/* Bottom-left overlay */}
            <div className="ps-overlay">
              <div className="ps-meta">
                <span className="ps-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="ps-cat">{p.category} — {p.year}</span>
              </div>
              <h2 className="ps-title">{p.title}</h2>
              <p className="ps-desc">{p.description}</p>
            </div>
          </div>
        ))}
      </ul>

      {/* Right minimap */}
      <aside className="ps-minimap">
        <div className="ps-mm-wrap">

          {/* Thumbnail column */}
          <div className="ps-mm-imgs">
            {projects.map((p, i) => (
              <div
                key={i}
                className="ps-mm-img"
                ref={el => { if (el) minimapRef.current.set(i, el); else minimapRef.current.delete(i); }}
              >
                <img src={p.image} alt={p.title} />
              </div>
            ))}
          </div>

          {/* Info column */}
          <div className="ps-mm-info-list">
            {projects.map((p, i) => (
              <div
                key={i}
                className="ps-mm-info"
                ref={el => { if (el) infoRef.current.set(i, el); else infoRef.current.delete(i); }}
              >
                <div className="ps-mm-row">
                  <p>{String(i + 1).padStart(2, "0")}</p>
                  <p>{p.title}</p>
                </div>
                <div className="ps-mm-row">
                  <p>{p.category}</p>
                  <p>{p.year}</p>
                </div>
                <div className="ps-mm-row">
                  <p>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counter */}
        <div className="ps-counter">
          <span className="ps-cur">{String(activeIdx + 1).padStart(2, "0")}</span>
          <span className="ps-sep">/</span>
          <span className="ps-tot">{String(projects.length).padStart(2, "0")}</span>
        </div>
      </aside>
    </div>
  );
}
