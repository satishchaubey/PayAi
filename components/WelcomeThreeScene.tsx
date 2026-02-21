"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type WelcomeThreeSceneProps = {
  className?: string;
};

function buildLetter(pattern: string[], color: number) {
  const group = new THREE.Group();
  const block = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: 0x0d2f7d,
    emissiveIntensity: 0.65,
    metalness: 0.2,
    roughness: 0.34
  });

  const rows = pattern.length;
  const cols = pattern[0]?.length ?? 0;

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      if (pattern[y][x] !== "1") continue;
      const cube = new THREE.Mesh(block, material);
      cube.position.set(x * 0.13 - (cols * 0.13) / 2, -(y * 0.13) + (rows * 0.13) / 2, 0);
      group.add(cube);
    }
  }

  return group;
}

export default function WelcomeThreeScene({ className }: WelcomeThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0.2, 4.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const keyLight = new THREE.DirectionalLight(0xb9ddff, 2.1);
    keyLight.position.set(2.4, 2.1, 2.8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x2f8dff, 1.4);
    fillLight.position.set(-2.2, 1.2, 1.6);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x87c8ff, 1.8, 8);
    rimLight.position.set(0, -0.5, 2.2);
    scene.add(rimLight);

    const aiGroup = new THREE.Group();
    const letterA = buildLetter(
      ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
      0x94d9ff
    );
    const letterI = buildLetter(
      ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
      0x7cc0ff
    );

    letterA.position.x = -0.43;
    letterI.position.x = 0.43;
    aiGroup.add(letterA, letterI);
    aiGroup.position.set(0.08, 0.1, 0.56);
    aiGroup.rotation.set(0.18, -0.28, 0);
    scene.add(aiGroup);

    const aiHaloMaterial = new THREE.MeshBasicMaterial({
      color: 0x7ec8ff,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide
    });
    const aiHalo = new THREE.Mesh(new THREE.RingGeometry(0.58, 0.85, 90), aiHaloMaterial);
    aiHalo.position.set(0.08, 0.08, 0.34);
    scene.add(aiHalo);

    const aiLight = new THREE.PointLight(0x9ad9ff, 2.2, 9);
    aiLight.position.set(0.1, 0.2, 1.4);
    scene.add(aiLight);

    let frame = 0;
    let active = true;
    let rafId = 0;

    const resize = () => {
      if (!host) return;
      const w = host.clientWidth;
      const h = host.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / Math.max(h, 1);
      camera.updateProjectionMatrix();
    };

    const animate = () => {
      if (!active) return;
      frame += 1;
      const t = frame * 0.012;

      aiGroup.position.y = 0.12 + Math.sin(t * 1.25) * 0.08;
      aiGroup.rotation.y = -0.22 + Math.sin(t * 0.7) * 0.34;
      aiGroup.rotation.x = 0.16 + Math.cos(t * 0.65) * 0.1;
      const aiScale = 1 + Math.sin(t * 2.2) * 0.06;
      aiGroup.scale.set(aiScale, aiScale, aiScale);
      aiHalo.rotation.z += 0.012;
      aiHaloMaterial.opacity = 0.16 + (Math.sin(t * 1.6) + 1) * 0.08;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(animate);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          for (const material of object.material) material.dispose();
          return;
        }
        object.material.dispose();
      });
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
