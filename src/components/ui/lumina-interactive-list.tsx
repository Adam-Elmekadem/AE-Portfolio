"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

/* ─── Types ───────────────────────────────────────────────── */
export interface LuminaSlide {
  title:       string;
  description: string;
  src:         string;
}

/* ─── Shaders ─────────────────────────────────────────────── */
const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float     uProgress;
  uniform vec2      uResolution;
  uniform vec2      uTexture1Size;
  uniform vec2      uTexture2Size;
  varying vec2      vUv;

  vec2 cover(vec2 uv, vec2 texSize) {
    vec2  s      = uResolution / texSize;
    float scale  = max(s.x, s.y);
    vec2  offset = (uResolution - texSize * scale) * 0.5;
    return (uv * uResolution - offset) / (texSize * scale);
  }

  void main() {
    float time  = uProgress * 5.0;
    float maxR  = length(uResolution) * 0.85;
    float br    = uProgress * maxR;
    vec2  p     = vUv * uResolution;
    vec2  c     = uResolution * 0.5;
    float d     = length(p - c);
    float nd    = d / max(br, 0.001);
    float inside = smoothstep(br + 3.0, br - 3.0, d);

    vec2 uv1 = cover(vUv, uTexture1Size);
    vec2 uv2 = cover(vUv, uTexture2Size);

    vec4 col;
    if (inside > 0.0) {
      float ro     = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
      vec2  dir    = d > 0.0 ? (p - c) / d : vec2(0.0);
      vec2  distUV = uv2 - dir * ro;
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.012 * nd * inside;
      float ca = 0.018 * pow(smoothstep(0.3, 1.0, nd), 1.2);
      col = vec4(
        texture2D(uTexture2, distUV + dir * ca * 1.2).r,
        texture2D(uTexture2, distUV + dir * ca * 0.2).g,
        texture2D(uTexture2, distUV - dir * ca * 0.8).b,
        1.0
      );
      float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
      col.rgb += rim * 0.06;
    } else {
      col = texture2D(uTexture2, uv2);
    }

    vec4 old = texture2D(uTexture1, uv1);
    if (uProgress > 0.95)
      col = mix(col, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);

    gl_FragColor = mix(old, col, inside);
  }
`;

/* ─── Constants ───────────────────────────────────────────── */
const TRANSITION_S  = 2.5;
const AUTO_SLIDE_MS = 5000;
const TICK_MS       = 50;

const DEFAULT_SLIDES: LuminaSlide[] = [
  { title: "Ethereal Glow",    description: "A soft, radiant light that illuminates the soul.",            src: "https://assets.codepen.io/7558/orange-portrait-001.jpg" },
  { title: "Rose Mirage",      description: "Lost in a desert of blooming dreams and endless horizons.",   src: "https://assets.codepen.io/7558/orange-portrait-002.jpg" },
  { title: "Velvet Mystique",  description: "Wrapped in the deep, luxurious embrace of the night.",       src: "https://assets.codepen.io/7558/orange-portrait-003.jpg" },
  { title: "Golden Hour",      description: "That fleeting moment when the world is dipped in gold.",     src: "https://assets.codepen.io/7558/orange-portrait-004.jpg" },
  { title: "Midnight Dreams",  description: "Where reality fades and imagination takes flight.",           src: "https://assets.codepen.io/7558/orange-portrait-005.jpg" },
  { title: "Silver Light",     description: "A cool, metallic shimmer reflecting the urban pulse.",       src: "https://assets.codepen.io/7558/orange-portrait-006.jpg" },
];

/* ─── Component ───────────────────────────────────────────── */
export function LuminaSlider({ slides = DEFAULT_SLIDES }: { slides?: LuminaSlide[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const descRef   = useRef<HTMLParagraphElement>(null);
  const fillRefs  = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(0);

  /* mutable WebGL / timer state — never triggers re-render */
  const g = useRef({
    renderer:  null as THREE.WebGLRenderer | null,
    material:  null as THREE.ShaderMaterial | null,
    scene:     null as THREE.Scene | null,
    camera:    null as THREE.OrthographicCamera | null,
    textures:  [] as THREE.Texture[],
    rafId:     0,
    prev:      0,
    busy:      false,
    enabled:   false,
    pInterval: null as ReturnType<typeof setInterval> | null,
    pTimer:    null as ReturnType<typeof setTimeout> | null,
    pVal:      0,
  });

  /* ── Helpers ─────────────────────────────────────────── */
  const setFill = useCallback((idx: number, pct: number, opacity = "1") => {
    const el = fillRefs.current[idx];
    if (el) { el.style.width = `${pct}%`; el.style.opacity = opacity; }
  }, []);

  const resetFill = useCallback((idx: number) => {
    const el = fillRefs.current[idx];
    if (!el) return;
    el.style.transition = "width 0.2s ease-out, opacity 0.3s";
    el.style.width   = "0%";
    el.style.opacity = "0";
    setTimeout(() => { if (el) el.style.transition = "width 0.1s linear, opacity 0.3s"; }, 220);
  }, []);

  const stopTimer = useCallback(() => {
    const s = g.current;
    if (s.pInterval) clearInterval(s.pInterval);
    if (s.pTimer)    clearTimeout(s.pTimer);
    s.pInterval = s.pTimer = null;
    s.pVal = 0;
  }, []);

  const animText = useCallback((idx: number, delay = 0) => {
    const title = titleRef.current;
    const desc  = descRef.current;
    if (!title || !desc) return;

    gsap.to(Array.from(title.children), { y: -18, opacity: 0, duration: 0.35, stagger: 0.015, ease: "power2.in" });
    gsap.to(desc, { y: -8, opacity: 0, duration: 0.3, ease: "power2.in" });

    setTimeout(() => {
      title.innerHTML = slides[idx].title
        .split("")
        .map(ch => `<span style="display:inline-block;opacity:0">${ch === " " ? "&nbsp;" : ch}</span>`)
        .join("");
      desc.textContent = slides[idx].description;
      gsap.fromTo(Array.from(title.children), { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.03, ease: "power3.out" });
      gsap.fromTo(desc, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.18, ease: "power3.out" });
    }, delay + 380);
  }, [slides]);

  /* forward-declared via ref so startAuto can call navigateTo */
  const navigateRef = useRef<(target: number) => void>(() => {});

  const startAuto = useCallback(() => {
    const s = g.current;
    if (!s.enabled) return;
    stopTimer();
    const inc = (100 / AUTO_SLIDE_MS) * TICK_MS;
    s.pVal = 0;
    s.pInterval = setInterval(() => {
      s.pVal += inc;
      setFill(s.prev, s.pVal);
      if (s.pVal >= 100) {
        stopTimer();
        setFill(s.prev, 100, "0");
        setTimeout(() => setFill(s.prev, 0), 320);
        navigateRef.current((s.prev + 1) % slides.length);
      }
    }, TICK_MS);
  }, [setFill, slides.length, stopTimer]);

  const navigateTo = useCallback((target: number) => {
    const s = g.current;
    if (s.busy || target === s.prev || !s.enabled || !s.material) return;

    stopTimer();
    resetFill(s.prev);

    const from = s.textures[s.prev % s.textures.length];
    const to   = s.textures[target % s.textures.length];
    if (!from || !to) return;

    s.busy = true;
    s.material.uniforms.uTexture1.value     = from;
    s.material.uniforms.uTexture2.value     = to;
    s.material.uniforms.uTexture1Size.value = from.userData.size;
    s.material.uniforms.uTexture2Size.value = to.userData.size;

    setActive(target);
    animText(target);

    gsap.fromTo(
      s.material.uniforms.uProgress,
      { value: 0 },
      {
        value: 1, duration: TRANSITION_S, ease: "power2.inOut",
        onComplete() {
          if (!s.material) return;
          s.material.uniforms.uProgress.value     = 0;
          s.material.uniforms.uTexture1.value     = to;
          s.material.uniforms.uTexture1Size.value = to.userData.size;
          s.prev = target;
          s.busy = false;
          startAuto();
        },
      }
    );
  }, [animText, resetFill, startAuto, stopTimer]);

  /* keep navigateRef in sync */
  useEffect(() => { navigateRef.current = navigateTo; }, [navigateTo]);

  /* ── WebGL init ──────────────────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const s = g.current;
    let mounted = true;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch { return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.offsetWidth || window.innerWidth, canvas.offsetHeight || window.innerHeight);

    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1:     { value: null },
        uTexture2:     { value: null },
        uProgress:     { value: 0 },
        uResolution:   { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) },
        uTexture2Size: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader, fragmentShader,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    s.renderer = renderer; s.scene = scene; s.camera = camera; s.material = material;

    const tick = () => { s.rafId = requestAnimationFrame(tick); renderer.render(scene, camera); };
    tick();

    /* textures */
    const loader = new THREE.TextureLoader();
    Promise.allSettled(
      slides.map(sl => new Promise<THREE.Texture>((res, rej) =>
        loader.load(sl.src, tex => {
          tex.minFilter = tex.magFilter = THREE.LinearFilter;
          tex.userData  = { size: new THREE.Vector2(tex.image.width, tex.image.height) };
          res(tex);
        }, undefined, rej)
      ))
    ).then(results => {
      if (!mounted) return;
      const loaded = results
        .filter((r): r is PromiseFulfilledResult<THREE.Texture> => r.status === "fulfilled")
        .map(r => r.value);
      if (loaded.length < 2) return;

      s.textures = loaded;
      material.uniforms.uTexture1.value     = loaded[0];
      material.uniforms.uTexture2.value     = loaded[0];
      material.uniforms.uTexture1Size.value = loaded[0].userData.size;
      material.uniforms.uTexture2Size.value = loaded[0].userData.size;
      s.enabled = true;

      /* init first slide text */
      if (titleRef.current && descRef.current) {
        titleRef.current.innerHTML = slides[0].title
          .split("").map(ch => `<span style="display:inline-block;opacity:0">${ch === " " ? "&nbsp;" : ch}</span>`).join("");
        descRef.current.textContent = slides[0].description;
        gsap.fromTo(Array.from(titleRef.current.children),
          { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.04, ease: "power3.out", delay: 0.4 });
        gsap.fromTo(descRef.current,
          { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.7 });
      }

      startAuto();
    });

    /* resize */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* visibility */
    const onVis = () => { if (document.hidden) stopTimer(); else if (!s.busy) startAuto(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      mounted = false;
      stopTimer();
      cancelAnimationFrame(s.rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      s.textures.forEach(t => t.dispose());
      material.dispose();
      renderer.dispose();
      s.renderer = s.material = s.scene = s.camera = null;
      s.textures = []; s.enabled = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── JSX ─────────────────────────────────────────────── */
  return (
    <div style={{ position: "relative", width: "100%", height: "100dvh", overflow: "hidden", background: "#000" }}>
      {/* WebGL canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
      />

      {/* Current slide number — left */}
      <span style={{
        position: "absolute", top: "50%", left: "clamp(20px,4vw,64px)",
        transform: "translateY(-50%)",
        fontFamily: "var(--font-mono),monospace",
        fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.14em",
        color: "rgba(255,255,255,0.45)",
      }}>
        {String(active + 1).padStart(2, "0")}
      </span>

      {/* Total + next button — right */}
      <div style={{
        position: "absolute", top: "50%", right: "clamp(20px,4vw,64px)",
        transform: "translateY(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
      }}>
        <span style={{
          fontFamily: "var(--font-mono),monospace",
          fontSize: "clamp(11px,1.2vw,13px)", letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.45)",
        }}>
          {String(slides.length).padStart(2, "0")}
        </span>
        <button
          onClick={() => navigateTo((active + 1) % slides.length)}
          style={{
            width: 42, height: 42, borderRadius: 10,
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            color: "#fff", fontSize: 20, display: "flex",
            alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}
        >
          ›
        </button>
      </div>

      {/* Center text */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
        padding: "0 clamp(80px,14vw,180px)",
        pointerEvents: "none",
      }}>
        <h2
          ref={titleRef}
          style={{
            fontFamily: "var(--font-syne),sans-serif",
            fontWeight: 700,
            fontSize: "clamp(36px,6.5vw,96px)",
            color: "#fff",
            lineHeight: 1.08,
            letterSpacing: "-0.02em",
            marginBottom: "clamp(10px,1.8vh,22px)",
          }}
        />
        <p
          ref={descRef}
          style={{
            fontFamily: "var(--font-space),sans-serif",
            fontSize: "clamp(13px,1.3vw,16px)",
            color: "rgba(255,255,255,0.65)",
            maxWidth: 480,
            lineHeight: 1.75,
          }}
        />
      </div>

      {/* Bottom navigation tabs */}
      <nav style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        display: "flex",
        padding: "0 clamp(20px,4vw,64px) clamp(20px,3vh,36px)",
      }}>
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => navigateTo(i)}
            style={{
              flex: 1, textAlign: "center",
              padding: "0 clamp(6px,1.2vw,16px)",
              cursor: "pointer",
              opacity: active === i ? 1 : 0.4,
              transition: "opacity 0.3s",
            }}
          >
            {/* Progress line */}
            <div style={{
              height: 1, marginBottom: 10,
              background: "rgba(255,255,255,0.2)",
              overflow: "hidden",
            }}>
              <div
                ref={el => { fillRefs.current[i] = el; }}
                style={{
                  height: "100%", width: "0%", opacity: 1,
                  background: "#fff",
                  transition: "width 0.1s linear, opacity 0.3s",
                }}
              />
            </div>
            <span style={{
              fontFamily: "var(--font-mono),monospace",
              fontSize: "clamp(8px,0.85vw,10px)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#fff",
              display: "block",
            }}>
              {slide.title}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ─── Legacy export (kept for backward compat) ────────────── */
export interface LuminaBackgroundProps {
  images:       string[];
  currentSlide: number;
  onReady?:     () => void;
}

export function LuminaBackground({ images, currentSlide, onReady }: LuminaBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gl = useRef({
    renderer:  null as THREE.WebGLRenderer | null,
    material:  null as THREE.ShaderMaterial | null,
    scene:     null as THREE.Scene | null,
    camera:    null as THREE.OrthographicCamera | null,
    textures:  [] as THREE.Texture[],
    prevSlide: 0,
    busy:      false,
    rafId:     0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const g = gl.current;
    let mounted = true;
    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false }); }
    catch { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    const scene    = new THREE.Scene();
    const camera   = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture1: { value: null }, uTexture2: { value: null }, uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uTexture1Size: { value: new THREE.Vector2(1, 1) }, uTexture2Size: { value: new THREE.Vector2(1, 1) },
      },
      vertexShader, fragmentShader,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    g.renderer = renderer; g.scene = scene; g.camera = camera; g.material = material;
    const tick = () => { g.rafId = requestAnimationFrame(tick); renderer.render(scene, camera); };
    tick();
    const loader = new THREE.TextureLoader();
    Promise.allSettled(images.map(src => new Promise<THREE.Texture>((res, rej) =>
      loader.load(src, tex => { tex.minFilter = tex.magFilter = THREE.LinearFilter; tex.userData = { size: new THREE.Vector2(tex.image.width, tex.image.height) }; res(tex); }, undefined, rej)
    ))).then(results => {
      if (!mounted) return;
      const loaded = results.filter((r): r is PromiseFulfilledResult<THREE.Texture> => r.status === "fulfilled").map(r => r.value);
      if (!loaded.length) return;
      g.textures = loaded;
      material.uniforms.uTexture1.value = loaded[0]; material.uniforms.uTexture2.value = loaded[0];
      material.uniforms.uTexture1Size.value = loaded[0].userData.size; material.uniforms.uTexture2Size.value = loaded[0].userData.size;
      onReady?.();
    });
    const onResize = () => { renderer.setSize(window.innerWidth, window.innerHeight); material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", onResize);
    return () => {
      mounted = false; cancelAnimationFrame(g.rafId); window.removeEventListener("resize", onResize);
      g.textures.forEach(t => t.dispose()); material.dispose(); renderer.dispose();
      g.renderer = g.material = g.scene = g.camera = null; g.textures = [];
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const g = gl.current;
    if (!g.material || !g.textures.length || currentSlide === g.prevSlide || g.busy) return;
    const from = g.textures[g.prevSlide % g.textures.length];
    const to   = g.textures[currentSlide % g.textures.length];
    if (!from || !to) return;
    g.busy = true;
    g.material.uniforms.uTexture1.value = from; g.material.uniforms.uTexture2.value = to;
    g.material.uniforms.uTexture1Size.value = from.userData.size; g.material.uniforms.uTexture2Size.value = to.userData.size;
    gsap.fromTo(g.material.uniforms.uProgress, { value: 0 }, { value: 1, duration: 2.5, ease: "power2.inOut",
      onComplete() {
        if (!g.material) return;
        g.material.uniforms.uProgress.value = 0; g.material.uniforms.uTexture1.value = to;
        g.material.uniforms.uTexture1Size.value = to.userData.size; g.prevSlide = currentSlide; g.busy = false;
      },
    });
  }, [currentSlide]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }} />;
}
