"use client";

import { useEffect, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";

/**
 * Floating gold-dust particle field (three.js) behind the hero.
 * Additive-blended shader points with per-particle drift, twinkle and depth,
 * plus a soft pointer parallax and a gentle scroll drift. Skipped entirely
 * under prefers-reduced-motion; paused off-screen and in hidden tabs.
 */
export function GoldDust({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const COUNT = window.innerWidth < 768 ? 340 : 900;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      55,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      60,
    );
    camera.position.z = 14;

    const renderer = new WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    const dpr = () => Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr());
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    mount.appendChild(renderer.domElement);

    const positions = new Float32Array(COUNT * 3);
    const aScale = new Float32Array(COUNT);
    const aPhase = new Float32Array(COUNT);
    const aSpeed = new Float32Array(COUNT);
    const aTint = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 32;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      aScale[i] = 0.35 + Math.random() * 1.2;
      aPhase[i] = Math.random() * Math.PI * 2;
      aSpeed[i] = 0.22 + Math.random() * 0.8;
      aTint[i] = Math.random();
    }

    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new BufferAttribute(positions, 3));
    geometry.setAttribute("aScale", new BufferAttribute(aScale, 1));
    geometry.setAttribute("aPhase", new BufferAttribute(aPhase, 1));
    geometry.setAttribute("aSpeed", new BufferAttribute(aSpeed, 1));
    geometry.setAttribute("aTint", new BufferAttribute(aTint, 1));

    const material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr() },
        uColorA: { value: new Color("#F0D48A") },
        uColorB: { value: new Color("#8A6430") },
      },
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aScale;
        attribute float aPhase;
        attribute float aSpeed;
        attribute float aTint;
        varying float vAlpha;
        varying float vTint;

        void main() {
          vec3 pos = position;
          float t = uTime * aSpeed;
          pos.y += sin(t + aPhase) * 0.65;
          pos.x += cos(t * 0.6 + aPhase * 1.7) * 0.5;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = aScale * uPixelRatio * 46.0 / -mv.z;

          vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(t * 1.7 + aPhase * 3.0));
          vTint = aTint;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vAlpha;
        varying float vTint;

        void main() {
          float d = distance(gl_PointCoord, vec2(0.5));
          float glow = pow(1.0 - smoothstep(0.0, 0.5, d), 2.2);
          if (glow < 0.01) discard;
          vec3 color = mix(uColorB, uColorA, vTint);
          gl_FragColor = vec4(color, glow * vAlpha * 0.85);
        }
      `,
    });

    const points = new Points(geometry, material);
    scene.add(points);

    let targetX = 0;
    let targetY = 0;
    let easedX = 0;
    let easedY = 0;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 1.6;
      targetY = (e.clientY / window.innerHeight - 0.5) * 1.0;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(mount);

    // First frame synchronously, so the dust shows even without rAF ticks.
    renderer.render(scene, camera);

    const clock = new Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      material.uniforms.uTime.value = clock.getElapsedTime();
      easedX += (targetX - easedX) * 0.04;
      easedY += (targetY - easedY) * 0.04;
      points.rotation.y = easedX * 0.14;
      points.rotation.x = easedY * 0.1;
      points.position.y = window.scrollY * 0.0018;
      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr());
      renderer.setSize(w, h);
      material.uniforms.uPixelRatio.value = dpr();
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
