"use client";

import { useEffect, useRef } from "react";
import {
  Clock,
  Color,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";

/**
 * Full-bleed gold-silk cloth (three.js). A GPU take on the canvasui "cloth"
 * effect: a subdivided plane pinned at the top edge, driven by layered wind
 * waves, with a Gaussian pointer brush that imprints damped ripples, and
 * fold-aware lighting (diffuse + sheen specular) in champagne gold.
 * Scrolling deepens the folds (uScroll). Skipped under prefers-reduced-motion;
 * paused off-screen and in hidden tabs.
 */
export function SilkCloth({ className }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const scene = new Scene();
    const camera = new PerspectiveCamera(
      45,
      Math.max(1, mount.clientWidth) / Math.max(1, mount.clientHeight),
      0.1,
      50,
    );
    camera.position.z = 10;

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

    // Plane sized to overfill the camera frustum at z=0.
    const sizeFor = () => {
      const h = 2 * Math.tan(MathUtils.degToRad(45 / 2)) * 10;
      const w = h * camera.aspect;
      return { w: w * 1.5, h: h * 1.6 };
    };
    const { w, h } = sizeFor();
    const isMobile = window.innerWidth < 768;
    const geometry = new PlaneGeometry(
      w,
      h,
      isMobile ? 90 : 150,
      isMobile ? 60 : 100,
    );

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPointer: { value: new Vector2(0.5, 0.5) },
      uBrush: { value: 0 },
      uColorDeep: { value: new Color("#0E0A05") },
      uColorGold: { value: new Color("#A6793B") },
      uColorSheen: { value: new Color("#F0D48A") },
    };

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uPointer;
        uniform float uBrush;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vH;

        // Layered wind waves + pointer brush, pinned toward the top edge.
        float height(vec2 uv) {
          float t = uTime;
          float pin = smoothstep(1.0, 0.25, uv.y);
          float amp = (0.5 + uScroll * 1.1) * pin;

          float wave = 0.0;
          wave += sin(uv.x * 6.0 + t * 0.9) * 0.36;
          wave += sin(uv.x * 11.0 - t * 1.25 + uv.y * 4.0) * 0.2;
          wave += sin(uv.y * 7.0 + t * 0.7 + uv.x * 3.0) * 0.24;
          wave += sin((uv.x + uv.y) * 15.0 - t * 1.6) * 0.07;

          float d = distance(uv, uPointer);
          float brush = uBrush * exp(-d * d * 46.0) * sin(d * 30.0 - t * 5.0);

          return wave * amp + brush * 0.6 * pin;
        }

        void main() {
          vUv = uv;
          float e = 0.012;
          float hC = height(uv);
          float hX = height(uv + vec2(e, 0.0));
          float hY = height(uv + vec2(0.0, e));
          vH = hC;

          vec3 pos = position;
          pos.z += hC;

          // Normal from the height field slope; the scale exaggerates the
          // folds so the lighting carves deep silk creases.
          vNormal = normalize(vec3(-(hX - hC) / e * 0.55, -(hY - hC) / e * 0.55, 1.0));

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorDeep;
        uniform vec3 uColorGold;
        uniform vec3 uColorSheen;
        varying vec2 vUv;
        varying vec3 vNormal;
        varying float vH;

        void main() {
          vec3 n = normalize(vNormal);
          vec3 L = normalize(vec3(0.35, 0.55, 1.0));

          float diffuse = clamp(dot(n, L), 0.0, 1.0);
          float spec = pow(clamp(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 14.0);

          vec3 color = mix(uColorDeep, uColorGold, pow(diffuse, 1.6));
          // fold shadows sink into black; crests catch champagne sheen
          color *= 0.55 + 0.75 * smoothstep(-0.6, 0.7, vH);
          color += uColorSheen * spec * 0.85;

          // melt the edges into the page's black ground
          float vig = smoothstep(0.0, 0.18, vUv.x) * smoothstep(1.0, 0.82, vUv.x)
                    * smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.84, vUv.y);
          color *= mix(0.1, 1.0, vig);

          gl_FragColor = vec4(color, 1.0);
        }
      `,
    });

    const cloth = new Mesh(geometry, material);
    cloth.rotation.x = -0.22;
    scene.add(cloth);

    // Pointer brush: eased position, strength ramps on move and damps out.
    const target = new Vector2(0.5, 0.5);
    let brushTarget = 0;
    const onPointer = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      if (!r.width || !r.height) return;
      target.set(
        MathUtils.clamp((e.clientX - r.left) / r.width, 0, 1),
        MathUtils.clamp(1 - (e.clientY - r.top) / r.height, 0, 1),
      );
      brushTarget = 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    });
    io.observe(mount);

    // First frame synchronously: the silk must be visible even before (or
    // without) rAF ticks — occluded windows, screenshots, paused renderers.
    renderer.render(scene, camera);

    const clock = new Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!onScreen || document.hidden) return;

      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uPointer.value.lerp(target, 0.07);
      brushTarget *= 0.955; // damping: ripples settle when the cursor rests
      uniforms.uBrush.value += (brushTarget - uniforms.uBrush.value) * 0.1;
      uniforms.uScroll.value = MathUtils.clamp(
        window.scrollY / Math.max(1, window.innerHeight),
        0,
        1,
      );

      renderer.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    const ro = new ResizeObserver(() => {
      const cw = mount.clientWidth;
      const ch = mount.clientHeight;
      if (!cw || !ch) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(dpr());
      renderer.setSize(cw, ch);
      const s = sizeFor();
      cloth.scale.set(s.w / w, s.h / h, 1);
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
