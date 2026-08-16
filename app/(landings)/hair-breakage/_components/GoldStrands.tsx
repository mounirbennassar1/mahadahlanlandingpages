"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js hero backdrop: flowing golden hair strands (shader-displaced
 * line strips) drifting over a field of shimmering gold dust. Additive
 * blending on pure black reads as liquid gold on silk. Skipped entirely
 * under prefers-reduced-motion; paused off-screen and in hidden tabs.
 */
export function GoldStrands({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.innerWidth < 768;
    const STRANDS = isMobile ? 9 : 16;
    const POINTS = 140;
    const DUST = isMobile ? 220 : 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      60,
    );
    camera.position.z = 14;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    const dpr = () => Math.min(window.devicePixelRatio, 2);
    renderer.setPixelRatio(dpr());
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    mount.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];

    // ——— strands: one line strip each, waved in the vertex shader ———
    const strandVertex = /* glsl */ `
      uniform float uTime;
      uniform float uPhase;
      uniform float uAmp;
      uniform float uSpeed;
      attribute float aT;
      varying float vT;

      void main() {
        vec3 pos = position;
        float t = uTime * uSpeed + uPhase;
        // layered sines: long lazy wave + finer ripple, both travelling
        pos.y += sin(pos.x * 0.42 + t) * uAmp;
        pos.y += sin(pos.x * 1.35 - t * 1.6) * uAmp * 0.28;
        pos.z += cos(pos.x * 0.5 + t * 0.7) * 0.7;
        vT = aT;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `;
    const strandFragment = /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uAlpha;
      varying float vT;

      void main() {
        // fade the strand out at both ends, glow at the crest
        float fade = sin(vT * 3.14159);
        vec3 color = mix(uColorB, uColorA, smoothstep(0.15, 0.85, vT));
        gl_FragColor = vec4(color, fade * uAlpha);
      }
    `;

    const strandGroup = new THREE.Group();
    for (let s = 0; s < STRANDS; s++) {
      const positions = new Float32Array(POINTS * 3);
      const aT = new Float32Array(POINTS);
      const y0 = (Math.random() - 0.5) * 14;
      for (let i = 0; i < POINTS; i++) {
        const t = i / (POINTS - 1);
        positions[i * 3] = (t - 0.5) * 40;
        positions[i * 3 + 1] = y0;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 0.2 - s * 0.12;
        aT[i] = t;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("aT", new THREE.BufferAttribute(aT, 1));

      const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uPhase: { value: Math.random() * Math.PI * 2 },
          uAmp: { value: 0.5 + Math.random() * 1.5 },
          uSpeed: { value: 0.14 + Math.random() * 0.3 },
          uAlpha: { value: 0.16 + Math.random() * 0.3 },
          uColorA: { value: new THREE.Color("#F0D48A") },
          uColorB: { value: new THREE.Color("#8A6430") },
        },
        vertexShader: strandVertex,
        fragmentShader: strandFragment,
      });

      strandGroup.add(new THREE.Line(geometry, material));
      disposables.push(geometry, material);
    }
    scene.add(strandGroup);

    // ——— gold dust: twinkling additive points ———
    const dustPositions = new Float32Array(DUST * 3);
    const dScale = new Float32Array(DUST);
    const dPhase = new Float32Array(DUST);
    const dSpeed = new Float32Array(DUST);
    const dTint = new Float32Array(DUST);
    for (let i = 0; i < DUST; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 32;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      dScale[i] = 0.35 + Math.random() * 1.1;
      dPhase[i] = Math.random() * Math.PI * 2;
      dSpeed[i] = 0.22 + Math.random() * 0.8;
      dTint[i] = Math.random();
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(dustPositions, 3),
    );
    dustGeometry.setAttribute("aScale", new THREE.BufferAttribute(dScale, 1));
    dustGeometry.setAttribute("aPhase", new THREE.BufferAttribute(dPhase, 1));
    dustGeometry.setAttribute("aSpeed", new THREE.BufferAttribute(dSpeed, 1));
    dustGeometry.setAttribute("aTint", new THREE.BufferAttribute(dTint, 1));

    const dustMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: dpr() },
        uColorA: { value: new THREE.Color("#F0D48A") },
        uColorB: { value: new THREE.Color("#8A6430") },
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
          gl_PointSize = aScale * uPixelRatio * 42.0 / -mv.z;

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
          gl_FragColor = vec4(color, glow * vAlpha * 0.8);
        }
      `,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    scene.add(dust);
    disposables.push(dustGeometry, dustMaterial);

    // pointer parallax
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

    // First frame synchronously, so the scene shows even without rAF ticks.
    renderer.render(scene, camera);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;
      const elapsed = clock.getElapsedTime();
      dustMaterial.uniforms.uTime.value = elapsed;
      strandGroup.children.forEach((line) => {
        const mat = (line as THREE.Line).material as THREE.ShaderMaterial;
        mat.uniforms.uTime.value = elapsed;
      });
      easedX += (targetX - easedX) * 0.04;
      easedY += (targetY - easedY) * 0.04;
      scene.rotation.y = easedX * 0.1;
      scene.rotation.x = easedY * 0.07;
      scene.position.y = window.scrollY * 0.0016;
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
      dustMaterial.uniforms.uPixelRatio.value = dpr();
    });
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden />;
}
