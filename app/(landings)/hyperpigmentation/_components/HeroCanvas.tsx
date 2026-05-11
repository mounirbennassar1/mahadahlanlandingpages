"use client";

import { useEffect, useRef } from "react";

/**
 * Drifting golden particles + soft warm sphere behind the hero.
 * Three.js is dynamically imported so it never enters the initial
 * JS bundle. The whole effect is skipped on mobile (where the WebGL
 * cost outweighs the visual benefit on a small screen).
 */
export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSmall = window.matchMedia("(max-width: 900px)").matches;
    if (isSmall) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      const THREE = await import("three");
      if (disposed || !mount) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        55,
        mount.clientWidth / mount.clientHeight,
        0.1,
        100
      );
      camera.position.z = 6;

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const glowGeo = new THREE.SphereGeometry(2.2, 48, 48);
      const glowMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color("#e8d4a8") },
          uColorB: { value: new THREE.Color("#c9a55a") },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPos;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPos;
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          void main() {
            float fres = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.4);
            float pulse = 0.5 + 0.5 * sin(uTime * 0.6 + vPos.y * 1.2);
            vec3 col = mix(uColorA, uColorB, pulse * 0.5);
            gl_FragColor = vec4(col, fres * 0.18);
          }
        `,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.position.set(2.4, 0.6, 0);
      scene.add(glow);

      const PARTICLE_COUNT = 700;
      const positions = new Float32Array(PARTICLE_COUNT * 3);
      const speeds = new Float32Array(PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 18;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
        speeds[i] = 0.05 + Math.random() * 0.15;
      }
      const partGeo = new THREE.BufferGeometry();
      partGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const tex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const ctx = c.getContext("2d")!;
        const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        g.addColorStop(0, "rgba(255, 235, 195, 1)");
        g.addColorStop(0.4, "rgba(232, 212, 168, 0.55)");
        g.addColorStop(1, "rgba(232, 212, 168, 0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
        const t = new THREE.CanvasTexture(c);
        t.colorSpace = THREE.SRGBColorSpace;
        return t;
      })();

      const partMat = new THREE.PointsMaterial({
        size: 0.09,
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: new THREE.Color("#d8b878"),
        opacity: 0.85,
      });
      const points = new THREE.Points(partGeo, partMat);
      scene.add(points);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 0.4;
      };
      window.addEventListener("mousemove", onMove);

      const onResize = () => {
        if (!mount) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      const timer = new THREE.Timer();
      let frame = 0;
      let visible = true;
      const onVisibility = () => {
        visible = document.visibilityState === "visible";
        if (visible && !reduce) frame = requestAnimationFrame(tick);
      };
      document.addEventListener("visibilitychange", onVisibility);

      const tick = () => {
        if (!visible) return;
        timer.update();
        const t = timer.getElapsed();
        glowMat.uniforms.uTime.value = t;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        camera.position.x = mouse.x * 0.8;
        camera.position.y = -mouse.y * 0.8;
        camera.lookAt(0, 0, 0);

        const arr = partGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          arr[i * 3 + 1] += speeds[i] * 0.005;
          arr[i * 3 + 0] += Math.sin(t * 0.4 + i) * 0.0008;
          if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
        }
        partGeo.attributes.position.needsUpdate = true;
        points.rotation.z = Math.sin(t * 0.05) * 0.06;

        renderer.render(scene, camera);
        if (!reduce) frame = requestAnimationFrame(tick);
      };
      if (reduce) {
        renderer.render(scene, camera);
      } else {
        frame = requestAnimationFrame(tick);
      }

      cleanup = () => {
        cancelAnimationFrame(frame);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        renderer.dispose();
        partGeo.dispose();
        partMat.dispose();
        glowGeo.dispose();
        glowMat.dispose();
        tex.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    const idle =
      "requestIdleCallback" in window
        ? (cb: () => void) =>
            (
              window as unknown as {
                requestIdleCallback: (cb: () => void) => number;
              }
            ).requestIdleCallback(cb)
        : (cb: () => void) => window.setTimeout(cb, 200);
    idle(() => {
      void init();
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return <div ref={mountRef} className="hero-canvas" aria-hidden="true" />;
}
