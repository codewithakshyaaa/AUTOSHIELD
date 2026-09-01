import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 24);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for 3D elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Holographic City Wireframe Sphere / Globe
    const globeGeo = new THREE.IcosahedronGeometry(7.5, 3);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    mainGroup.add(globe);

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(6.8, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerSphere);

    // 2. City Grid Ring Plane at the base
    const ringGeo = new THREE.RingGeometry(8.5, 12, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    mainGroup.add(ring);

    // 3. Floating Incident Threat Nodes in 3D Space (Pothole, Water Leak, Guardrail)
    const hazardColors = [0xef4444, 0x38bdf8, 0xf59e0b, 0x10b981];
    const hazardNodes: THREE.Mesh[] = [];

    for (let i = 0; i < 8; i++) {
      const nodeGeo = new THREE.SphereGeometry(0.35, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: hazardColors[i % hazardColors.length],
      });
      const node = new THREE.Mesh(nodeGeo, nodeMat);

      const phi = Math.acos(-1 + (2 * i) / 8);
      const theta = Math.sqrt(8 * Math.PI) * phi;
      const radius = 7.8;

      node.position.x = radius * Math.cos(theta) * Math.sin(phi);
      node.position.y = radius * Math.sin(theta) * Math.sin(phi);
      node.position.z = radius * Math.cos(phi);

      // Add a glowing halo ring around each hazard node
      const haloGeo = new THREE.RingGeometry(0.5, 0.7, 16);
      const haloMat = new THREE.MeshBasicMaterial({
        color: hazardColors[i % hazardColors.length],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.lookAt(camera.position);
      node.add(halo);

      mainGroup.add(node);
      hazardNodes.push(node);
    }

    // 4. Scanning Radar Wave (3D Arc)
    const radarGeo = new THREE.TorusGeometry(8.2, 0.05, 8, 50, Math.PI / 2);
    const radarMat = new THREE.MeshBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.8,
    });
    const radar = new THREE.Mesh(radarGeo, radarMat);
    radar.rotation.x = Math.PI / 2;
    mainGroup.add(radar);

    // 5. Star / Data Particle Field
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 30;
      particlePositions[i + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i + 2] = (Math.random() - 0.5) * 30;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xc084fc,
      size: 0.12,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Interactive Mouse Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x * 2;
      mouseY = y * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Observer for fluid responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth Parallax tilt
      targetRotationY = mouseX * 0.4;
      targetRotationX = -mouseY * 0.3;

      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05 + 0.003;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      // Pulse and rotate elements
      globe.rotation.y += 0.002;
      innerSphere.rotation.y -= 0.003;
      ring.rotation.z += 0.004;
      radar.rotation.z = elapsedTime * 1.5;

      // Pulse hazard nodes
      hazardNodes.forEach((node, idx) => {
        const scale = 1 + Math.sin(elapsedTime * 3 + idx) * 0.25;
        node.scale.set(scale, scale, scale);
      });

      // Gently float particle field
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      radarGeo.dispose();
      radarMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] flex items-center justify-center">
      {/* Three.js Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D HUD Badges Over Canvas */}
      <div className="absolute top-4 left-4 pointer-events-none px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-purple-500/30 text-[11px] font-mono-code text-purple-300 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>3D CITY INCIDENT RADAR</span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono-code text-slate-300 shadow-lg">
        <span>INTERACTIVE 3D SPACE • MOVE MOUSE</span>
      </div>

      <div className="absolute bottom-4 left-4 pointer-events-none flex items-center gap-2 text-[10px] font-mono-code text-slate-400 bg-black/60 px-2.5 py-1 rounded-lg border border-white/5">
        <span className="w-2 h-2 rounded-full bg-rose-500" /> Potholes
        <span className="w-2 h-2 rounded-full bg-sky-400 ml-1" /> Water Leaks
        <span className="w-2 h-2 rounded-full bg-amber-400 ml-1" /> Barriers
      </div>
    </div>
  );
};
