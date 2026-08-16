"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

const COUNT = 110;

/**
 * The hero's floating gold bokeh layer: fine dust in the distance, large
 * out-of-focus discs up close, drifting up with a gentle sway and twinkle
 * and parallaxing against the pointer. Split out of HeroBackdrop so three.js
 * loads as its own async chunk — the video and overlay paint immediately
 * while this arrives after hydration. Renders nothing without WebGL.
 */
export default function HeroDust({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: WebGLRenderer;
    try {
      renderer = new WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch {
      return; // WebGL unavailable — video + CSS overlay carry the hero
    }

    renderer.setClearColor(0x000000, 0);
    const dpr = () => Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr());
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    renderer.domElement.style.pointerEvents = "none";
    mount.appendChild(renderer.domElement);

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Each particle is fully described by a seed; the vertex shader derives
    // position, drift, sway, size and depth from it. No per-frame CPU work.
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = (i + 0.5) / COUNT;
    const geometry = new BufferGeometry();
    geometry.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(COUNT * 3), 3),
    );
    geometry.setAttribute("aSeed", new BufferAttribute(seeds, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: dpr() },
        uMouse: { value: new Vector2(0, 0) },
      },
      vertexShader: /* glsl */ `
        attribute float aSeed;
        uniform float uTime;
        uniform float uDpr;
        uniform vec2 uMouse;
        varying float vSeed;
        varying float vTwinkle;
        varying float vDepth;

        float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

        void main() {
          vSeed = aSeed;
          float h1 = hash(aSeed);
          float h2 = hash(aSeed + 1.7);
          float h3 = hash(aSeed + 3.1);
          float h4 = hash(aSeed + 5.9);

          // depth: 0 = far fine dust, 1 = near bokeh disc
          float depth = h3 * h3;
          vDepth = depth;

          // slow upward drift, wrapping; near particles move a touch faster
          float speed = mix(0.012, 0.035, depth) * (0.7 + 0.6 * h4);
          float y = fract(h2 + uTime * speed) * 2.4 - 1.2;
          float x = (h1 * 2.0 - 1.0)
            + sin(uTime * (0.12 + 0.25 * h4) + aSeed * 40.0) * (0.02 + 0.05 * depth);

          // pointer parallax — near layer sways more
          x += uMouse.x * (0.008 + 0.05 * depth);
          y += uMouse.y * (0.006 + 0.035 * depth);

          vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + 1.8 * h4) + aSeed * 90.0);

          gl_Position = vec4(x, y, 0.0, 1.0);
          gl_PointSize = mix(2.0, 24.0, depth * depth) * (0.6 + 0.8 * h2) * uDpr;
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying float vSeed;
        varying float vTwinkle;
        varying float vDepth;

        float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }

        void main() {
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;

          // soft radial glow — near bokeh discs are softer and dimmer,
          // far dust is small and bright
          float core = smoothstep(0.5, 0.0, d);
          float glow = pow(core, mix(1.4, 2.6, vDepth));
          float alpha = glow * mix(0.55, 0.18, vDepth) * vTwinkle;

          // clinic golds with the odd near-white spark
          vec3 gold = mix(
            vec3(0.79, 0.64, 0.36),   // #C9A45C
            vec3(0.90, 0.78, 0.50),   // #E5C77F
            hash(vSeed + 9.4)
          );
          vec3 col = mix(gold, vec3(0.96, 0.93, 0.86), step(0.92, hash(vSeed + 2.2)));

          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const points = new Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    const setSize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(dpr());
      renderer.setSize(w, h);
      material.uniforms.uDpr.value = dpr();
    };
    setSize();

    // eased pointer parallax
    const target = new Vector2(0, 0);
    const onMove = (e: PointerEvent) => {
      target.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(mount);

    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    const clock = new Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      const m = material.uniforms.uMouse.value as Vector2;
      m.lerp(target, 0.045);
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
