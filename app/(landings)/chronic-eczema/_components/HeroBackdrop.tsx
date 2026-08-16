"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";

const VIDEO_SRC = "/chronic-eczema/hero-bg.mp4";
const POSTER_SRC = "/chronic-eczema/hero-bg.jpg";
const COUNT = 110;

const subscribeReducedMotion = (cb: () => void) => {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/**
 * Hero backdrop, layered bottom-up:
 *   1. the clinic video, crisp and untouched
 *   2. a cinematic overlay — even darkening, two slow-drifting aurora glows
 *      in the brand gold/plum, a vignette, and a bottom melt into the page
 *   3. a transparent WebGL layer of floating gold bokeh dust (drawn last,
 *      so the sparks live above the overlay)
 * Falls back to the plain video + overlay without WebGL, and to a static
 * poster under prefers-reduced-motion.
 */
export function HeroBackdrop({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  useEffect(() => {
    if (reduced) return;

    const mount = mountRef.current;
    const video = videoRef.current;
    if (!mount || !video) return;

    video.play().catch(() => {
      /* poster keeps covering if autoplay is blocked */
    });

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
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
    mount.appendChild(renderer.domElement); // last child → above the overlay

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Each particle is fully described by a seed; the vertex shader derives
    // position, drift, sway, size and depth from it. No per-frame CPU work.
    const seeds = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) seeds[i] = (i + 0.5) / COUNT;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3),
    );
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: dpr() },
        uMouse: { value: new THREE.Vector2(0, 0) },
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

    const points = new THREE.Points(geometry, material);
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
    const target = new THREE.Vector2(0, 0);
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
      if (video.paused && entry.isIntersecting) video.play().catch(() => {});
    });
    io.observe(mount);

    const ro = new ResizeObserver(setSize);
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      clock.getDelta();
      material.uniforms.uTime.value = clock.elapsedTime;
      const m = material.uniforms.uMouse.value as THREE.Vector2;
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
  }, [reduced]);

  return (
    <div ref={mountRef} className={`overflow-hidden ${className ?? ""}`} aria-hidden>
      {reduced ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={POSTER_SRC}
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 size-full object-cover"
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          autoPlay
          muted
          loop
          playsInline
        />
      )}

      {/* even cinematic darkening — text is readable anywhere on the frame */}
      <div className="absolute inset-0 bg-[rgba(14,7,25,0.58)]" />

      {/* aurora: two slow-drifting brand glows breathing over the footage */}
      <div
        className="che-aurora absolute -top-[18%] -right-[12%] size-[68vmax] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(201,164,92,0.32) 0%, rgba(201,164,92,0.1) 38%, transparent 68%)",
        }}
      />
      <div
        className="che-aurora-2 absolute -bottom-[22%] -left-[14%] size-[74vmax] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(92,59,142,0.4) 0%, rgba(92,59,142,0.14) 40%, transparent 68%)",
        }}
      />

      {/* vignette + melt the bottom into the page ground */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 50% 42%, transparent 55%, rgba(10,4,20,0.5) 100%), linear-gradient(to top, var(--color-che-bg) 0%, rgba(20,12,34,0.4) 14%, transparent 32%)",
        }}
      />
    </div>
  );
}
