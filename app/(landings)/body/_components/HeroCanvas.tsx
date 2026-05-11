"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const tooNarrow =
      typeof window !== "undefined" && window.innerWidth < 768;
    if (reduceMotion || tooNarrow) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf5f1ea, 0.06);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.1, 7.2);
    camera.lookAt(0, 0.1, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const columns = 70;
    const rows = 34;
    const spacingX = 0.16;
    const spacingZ = 0.16;
    const positions = new Float32Array(columns * rows * 3);
    const baseY = new Float32Array(columns * rows);

    let i = 0;
    for (let z = 0; z < rows; z++) {
      for (let x = 0; x < columns; x++) {
        const px = (x - columns / 2) * spacingX;
        const pz = (z - rows / 2) * spacingZ;
        positions[i * 3] = px;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = pz;
        baseY[i] = 0;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const pointMaterial = new THREE.PointsMaterial({
      size: 0.028,
      color: new THREE.Color("#c15f3c"),
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const pts = new THREE.Points(geometry, pointMaterial);
    group.add(pts);

    const ringGeo = new THREE.TorusGeometry(2.4, 0.008, 24, 200);
    const ringMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#8f3f23"),
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    ring.position.y = -0.1;
    group.add(ring);

    const ring2 = ring.clone();
    (ring2.material as THREE.MeshBasicMaterial) = ringMat.clone();
    (ring2.material as THREE.MeshBasicMaterial).opacity = 0.22;
    ring2.scale.setScalar(1.32);
    ring2.rotation.x = Math.PI / 2.6;
    group.add(ring2);

    group.rotation.x = -0.25;

    const pointer = new THREE.Vector2(0, 0);
    const targetRot = new THREE.Vector2(0, 0);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRot.x = pointer.y * 0.12;
      targetRot.y = pointer.x * 0.3;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute;

    const animate = () => {
      if (!running) return;
      const t = clock.getElapsedTime();

      for (let idx = 0; idx < columns * rows; idx++) {
        const px = posAttr.getX(idx);
        const pz = posAttr.getZ(idx);
        const d = Math.sqrt(px * px + pz * pz);
        const y =
          Math.sin(d * 2.1 - t * 1.1) * 0.24 +
          Math.sin(px * 0.9 + t * 0.7) * 0.08 +
          Math.cos(pz * 1.2 - t * 0.5) * 0.08;
        posAttr.setY(idx, baseY[idx] + y);
      }
      posAttr.needsUpdate = true;

      group.rotation.x += (targetRot.x - 0.25 - group.rotation.x) * 0.04;
      group.rotation.y += (targetRot.y - group.rotation.y) * 0.04;

      ring.rotation.z = t * 0.1;
      ring2.rotation.z = -t * 0.07;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    const handleVisibility = () => {
      running = !document.hidden;
      if (running) {
        clock.start();
        animate();
      } else {
        cancelAnimationFrame(raf);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("visibilitychange", handleVisibility);
      geometry.dispose();
      pointMaterial.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      (ring2.material as THREE.MeshBasicMaterial).dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
    />
  );
}
