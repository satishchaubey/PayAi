"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type WelcomeThreeSceneProps = {
  className?: string;
};

export default function WelcomeThreeScene({ className }: WelcomeThreeSceneProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a2f73, 2.5, 8);

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

    const mat = new THREE.MeshPhysicalMaterial({
      color: 0x66b7ff,
      roughness: 0.1,
      metalness: 0.08,
      transmission: 0.45,
      thickness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.15
    });

    const torus = new THREE.Mesh(new THREE.TorusKnotGeometry(0.95, 0.26, 220, 28), mat);
    torus.position.set(-0.35, 0.1, 0);
    torus.rotation.set(0.3, -0.6, 0.2);
    scene.add(torus);

    const blobA = new THREE.Mesh(new THREE.IcosahedronGeometry(0.56, 4), mat);
    blobA.position.set(1.35, -0.42, 0.35);
    scene.add(blobA);

    const blobB = new THREE.Mesh(new THREE.IcosahedronGeometry(0.38, 3), mat);
    blobB.position.set(1.72, 0.52, -0.25);
    scene.add(blobB);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(8, 8),
      new THREE.MeshBasicMaterial({ color: 0x1f57ad, transparent: true, opacity: 0.22 })
    );
    plane.position.z = -2.2;
    scene.add(plane);

    let frame = 0;
    let active = true;

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

      torus.rotation.x += 0.003;
      torus.rotation.y += 0.006;
      torus.position.y = 0.1 + Math.sin(t * 0.8) * 0.1;

      blobA.rotation.x += 0.004;
      blobA.rotation.y -= 0.005;
      blobA.position.x = 1.35 + Math.sin(t * 1.1) * 0.12;
      blobA.position.y = -0.42 + Math.cos(t * 0.9) * 0.08;

      blobB.rotation.x -= 0.005;
      blobB.rotation.z += 0.004;
      blobB.position.y = 0.52 + Math.sin(t * 1.3) * 0.08;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(animate);

    return () => {
      active = false;
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.clear();
      if (renderer.domElement.parentElement === host) {
        host.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={hostRef} className={className} />;
}
