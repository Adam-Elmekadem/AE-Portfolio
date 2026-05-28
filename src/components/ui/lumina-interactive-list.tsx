"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

/* ─── Shaders ─────────────────────────────────────────────────── */
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
    vec2 uv1 = cover(vUv, uTexture1Size);
    vec2 uv2 = cover(vUv, uTexture2Size);

    /* Glass-bubble expand from centre */
    float time   = uProgress * 5.0;
    float maxR   = length(uResolution) * 0.85;
    float br     = uProgress * maxR;
    vec2  p      = vUv * uResolution;
    vec2  c      = uResolution * 0.5;
    float d      = length(p - c);
    float nd     = d / max(br, 0.001);
    float inside = smoothstep(br + 3.0, br - 3.0, d);

    vec4 col;
    if (inside > 0.0) {
      float ro     = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
      vec2  dir    = d > 0.0 ? (p - c) / d : vec2(0.0);
      vec2  distUV = uv2 - dir * ro;
      distUV += vec2(sin(time + nd * 10.0), cos(time * 0.8 + nd * 8.0)) * 0.012 * nd * inside;
      float ca     = 0.018 * pow(smoothstep(0.3, 1.0, nd), 1.2);
      col = vec4(
        texture2D(uTexture2, distUV + dir * ca * 1.2).r,
        texture2D(uTexture2, distUV + dir * ca * 0.2).g,
        texture2D(uTexture2, distUV - dir * ca * 0.8).b,
        1.0
      );
      float rim  = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
      col.rgb   += rim * 0.06;
    } else {
      col = texture2D(uTexture2, uv2);
    }

    vec4 old = texture2D(uTexture1, uv1);
    if (uProgress > 0.95)
      col = mix(col, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);

    gl_FragColor = mix(old, col, inside);
  }
`;

/* ─── Props ───────────────────────────────────────────────────── */
export interface LuminaBackgroundProps {
  images:       string[];
  currentSlide: number;
  onReady?:     () => void;
}

/* ─── Component ───────────────────────────────────────────────── */
export function LuminaBackground({ images, currentSlide, onReady }: LuminaBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  /* All mutable WebGL state in a plain ref — no re-renders */
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

  /* ── Init WebGL (runs once after mount) ───────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const g = gl.current;
    let mounted = true; /* guard against post-unmount state writes */

    /* --- renderer ------------------------------------------- */
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
    } catch {
      console.warn("[LuminaBackground] WebGL unavailable");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    /* --- scene ---------------------------------------------- */
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
      vertexShader,
      fragmentShader,
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    g.renderer = renderer;
    g.scene    = scene;
    g.camera   = camera;
    g.material = material;

    /* --- render loop --------------------------------------- */
    const tick = () => {
      g.rafId = requestAnimationFrame(tick);
      renderer.render(scene, camera);
    };
    tick();

    /* --- textures ------------------------------------------ */
    const loader = new THREE.TextureLoader();
    Promise.allSettled(
      images.map(
        src => new Promise<THREE.Texture>((resolve, reject) =>
          loader.load(
            src,
            tex => {
              tex.minFilter = tex.magFilter = THREE.LinearFilter;
              tex.userData  = { size: new THREE.Vector2(tex.image.width, tex.image.height) };
              resolve(tex);
            },
            undefined,
            reject,
          )
        )
      )
    ).then(results => {
      if (!mounted) return;

      const loaded = results
        .filter((r): r is PromiseFulfilledResult<THREE.Texture> => r.status === "fulfilled")
        .map(r => r.value);

      if (loaded.length === 0) {
        console.warn("[LuminaBackground] No images loaded — check paths in public/");
        return;
      }

      g.textures = loaded;
      material.uniforms.uTexture1.value     = loaded[0];
      material.uniforms.uTexture2.value     = loaded[0];
      material.uniforms.uTexture1Size.value = loaded[0].userData.size;
      material.uniforms.uTexture2Size.value = loaded[0].userData.size;

      onReady?.();
    });

    /* --- resize -------------------------------------------- */
    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    /* --- cleanup ------------------------------------------- */
    return () => {
      mounted = false;
      cancelAnimationFrame(g.rafId);
      window.removeEventListener("resize", onResize);
      g.textures.forEach(t => t.dispose());
      material.dispose();
      renderer.dispose();
      /* NO forceContextLoss — it permanently invalidates the canvas
         context and breaks HMR / StrictMode double-mount */
      g.renderer  = null;
      g.material  = null;
      g.scene     = null;
      g.camera    = null;
      g.textures  = [];
      g.prevSlide = 0;
      g.busy      = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Slide transition ─────────────────────────────────────── */
  useEffect(() => {
    const g = gl.current;
    if (!g.material || g.textures.length === 0) return;
    if (currentSlide === g.prevSlide || g.busy)  return;

    const from = g.textures[g.prevSlide % g.textures.length];
    const to   = g.textures[currentSlide % g.textures.length];
    if (!from || !to) return;

    g.busy = true;
    g.material.uniforms.uTexture1.value     = from;
    g.material.uniforms.uTexture2.value     = to;
    g.material.uniforms.uTexture1Size.value = from.userData.size;
    g.material.uniforms.uTexture2Size.value = to.userData.size;

    gsap.fromTo(
      g.material.uniforms.uProgress,
      { value: 0 },
      {
        value:    1,
        duration: 2.5,
        ease:     "power2.inOut",
        onComplete() {
          if (!g.material) return;
          g.material.uniforms.uProgress.value     = 0;
          g.material.uniforms.uTexture1.value     = to;
          g.material.uniforms.uTexture1Size.value = to.userData.size;
          g.prevSlide = currentSlide;
          g.busy      = false;
        },
      }
    );
  }, [currentSlide]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block" }}
    />
  );
}
