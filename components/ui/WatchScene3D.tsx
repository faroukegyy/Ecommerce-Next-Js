"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface WatchScene3DProps {
  className?: string;
}

export default function WatchScene3D({ className = "" }: WatchScene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 520;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Lighting for brushed steel & dark obsidian contrast
    const ambientLight = new THREE.AmbientLight(0xd4d4d8, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa1a1aa, 1.4);
    rimLight.position.set(-5, -3, -4);
    scene.add(rimLight);

    const watchGroup = new THREE.Group();
    scene.add(watchGroup);

    const caseMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.88,
      roughness: 0.24,
    });

    const darkDialMaterial = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.35,
      roughness: 0.6,
    });

    const accentMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      metalness: 0.95,
      roughness: 0.16,
    });

    // Outer watch case
    const caseGeometry = new THREE.CylinderGeometry(1.75, 1.82, 0.46, 64);
    caseGeometry.rotateX(Math.PI / 2);
    const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
    watchGroup.add(caseMesh);

    // Inner dark dial
    const dialGeometry = new THREE.CylinderGeometry(1.52, 1.52, 0.48, 64);
    dialGeometry.rotateX(Math.PI / 2);
    const dialMesh = new THREE.Mesh(dialGeometry, darkDialMaterial);
    watchGroup.add(dialMesh);

    // Bezel ring
    const bezelGeometry = new THREE.TorusGeometry(1.62, 0.075, 24, 72);
    const bezelMesh = new THREE.Mesh(bezelGeometry, accentMetalMaterial);
    bezelMesh.position.z = 0.22;
    watchGroup.add(bezelMesh);

    // Crown on the right side
    const crownGeometry = new THREE.CylinderGeometry(0.18, 0.18, 0.36, 24);
    crownGeometry.rotateZ(Math.PI / 2);
    const crownMesh = new THREE.Mesh(crownGeometry, caseMaterial);
    crownMesh.position.set(1.98, 0, 0);
    watchGroup.add(crownMesh);

    // Rotating internal gears
    const createGear = (radius: number, teeth: number, thickness: number) => {
      const gearGroup = new THREE.Group();
      const ringGeo = new THREE.TorusGeometry(radius, thickness, 12, 36);
      const ringMesh = new THREE.Mesh(ringGeo, accentMetalMaterial);
      gearGroup.add(ringMesh);

      const toothGeo = new THREE.BoxGeometry(0.08, 0.16, thickness * 1.6);
      for (let i = 0; i < teeth; i++) {
        const angle = (i / teeth) * Math.PI * 2;
        const tooth = new THREE.Mesh(toothGeo, caseMaterial);
        tooth.position.set(
          Math.cos(angle) * (radius + 0.06),
          Math.sin(angle) * (radius + 0.06),
          0
        );
        tooth.rotation.z = angle - Math.PI / 2;
        gearGroup.add(tooth);
      }
      return gearGroup;
    };

    const mainGear = createGear(0.75, 18, 0.035);
    mainGear.position.z = 0.25;
    watchGroup.add(mainGear);

    const subGear = createGear(0.38, 12, 0.03);
    subGear.position.set(-0.45, 0.35, 0.27);
    watchGroup.add(subGear);

    // Hands
    const hourHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.07, 0.68, 0.03),
      accentMetalMaterial
    );
    hourHand.position.set(0, 0.24, 0.3);
    const hourPivot = new THREE.Group();
    hourPivot.position.z = 0.3;
    hourPivot.add(hourHand);
    watchGroup.add(hourPivot);

    const minuteHand = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 1.02, 0.03),
      caseMaterial
    );
    minuteHand.position.set(0, 0.38, 0.32);
    const minutePivot = new THREE.Group();
    minutePivot.position.z = 0.32;
    minutePivot.add(minuteHand);
    watchGroup.add(minutePivot);

    // Pointer & drag interaction
    let targetRotX = -0.18;
    let targetRotY = 0.32;
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        targetRotY += dx * 0.01;
        targetRotX += dy * 0.01;
        prevX = e.clientX;
        prevY = e.clientY;
        return;
      }
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRotY = 0.32 + nx * 0.55;
      targetRotX = -0.18 - ny * 0.35;
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("pointermove", handlePointerMove);
    domEl.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      watchGroup.rotation.x += (targetRotX - watchGroup.rotation.x) * 0.07;
      watchGroup.rotation.y += (targetRotY - watchGroup.rotation.y) * 0.07;
      watchGroup.position.y = Math.sin(elapsed * 1.4) * 0.08;

      mainGear.rotation.z = elapsed * 0.45;
      subGear.rotation.z = -elapsed * 0.9;
      hourPivot.rotation.z = -elapsed * 0.08;
      minutePivot.rotation.z = -elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerup", handlePointerUp);
      domEl.removeEventListener("pointermove", handlePointerMove);
      domEl.removeEventListener("pointerdown", handlePointerDown);
      renderer.dispose();
      if (domEl.parentNode === container) {
        container.removeChild(domEl);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Interactive 3D mechanical watch animation"
      className={`h-[440px] w-full cursor-grab active:cursor-grabbing sm:h-[520px] ${className}`}
    />
  );
}