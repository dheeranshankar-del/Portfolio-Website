import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Rocket3DCanvas({ telemetry }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x06080e);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;

    container.appendChild(renderer.domElement);

    // 3D Perspective Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x00F2FE, 0x1E293B);
    gridHelper.position.y = -2;
    scene.add(gridHelper);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00F2FE, 2.0);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x4FACFE, 1.5);
    dirLight2.position.set(-10, 10, -10);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(0, -1.5, 0);
    scene.add(pointLight);

    // Rocket Group Assembly
    const rocketGroup = new THREE.Group();

    // Fuselage (Body Cylinder)
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, 4, 32);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xFAFAFA,
      metalness: 0.6,
      roughness: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1;
    rocketGroup.add(bodyMesh);

    // Blue Stripe Accent
    const stripeGeo = new THREE.CylinderGeometry(0.355, 0.355, 2.5, 32);
    const stripeMat = new THREE.MeshStandardMaterial({
      color: 0x00F2FE,
      metalness: 0.8,
      roughness: 0.3
    });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = 1;
    stripeMesh.scale.set(1, 1, 0.15); // Side stripe
    rocketGroup.add(stripeMesh);

    // Nose Cone
    const noseGeo = new THREE.ConeGeometry(0.35, 1.2, 32);
    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xE2E8F0,
      metalness: 0.7,
      roughness: 0.2
    });
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.y = 3.6;
    rocketGroup.add(noseMesh);

    // Rocket Engine Nozzle
    const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.5, 32);
    const nozzleMat = new THREE.MeshStandardMaterial({
      color: 0x1E293B,
      metalness: 0.9,
      roughness: 0.1
    });
    const nozzleMesh = new THREE.Mesh(nozzleGeo, nozzleMat);
    nozzleMesh.position.y = -1.25;
    rocketGroup.add(nozzleMesh);

    // Rocket Fins (4 fins)
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.7, -0.6);
    finShape.lineTo(0.7, -1.2);
    finShape.lineTo(0, -0.8);
    finShape.closePath();

    const extrudeSettings = { depth: 0.05, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const finGeo = new THREE.ExtrudeGeometry(finShape, extrudeSettings);
    const finMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8, roughness: 0.3 });

    for (let i = 0; i < 4; i++) {
      const finMesh = new THREE.Mesh(finGeo, finMat);
      finMesh.rotation.y = (Math.PI / 2) * i;
      finMesh.position.y = -0.3;
      rocketGroup.add(finMesh);
    }

    scene.add(rocketGroup);

    // Animation & Resize Logic
    let animationFrameId;

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      // Smoothly interpolate rocket orientation based on telemetry values
      if (telemetry) {
        // Convert degrees to radians
        const targetPitch = THREE.MathUtils.degToRad(telemetry.pitch);
        const targetRoll = THREE.MathUtils.degToRad(telemetry.roll);
        const targetYaw = THREE.MathUtils.degToRad(telemetry.yaw);

        // Smooth Lerp
        rocketGroup.rotation.x = THREE.MathUtils.lerp(rocketGroup.rotation.x, targetPitch, 0.1);
        rocketGroup.rotation.z = THREE.MathUtils.lerp(rocketGroup.rotation.z, -targetRoll, 0.1);
        rocketGroup.rotation.y = THREE.MathUtils.lerp(rocketGroup.rotation.y, targetYaw, 0.1);
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update rocket orientation when telemetry prop updates
  useEffect(() => {
    // Handled in animation loop lerp
  }, [telemetry]);

  return (
    <div className="relative w-full h-full min-h-[360px] flex items-center justify-center overflow-hidden rounded-lg">
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      
      {/* Tactical Canvas Overlay Headers */}
      <div className="absolute top-3 left-4 pointer-events-none">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800">
          PRIMARY ROCKET ATTITUDE (3D ORIENTATION)
        </span>
      </div>

      {/* Crosshair Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
        <div className="w-32 h-[1px] bg-cyan-400"></div>
        <div className="h-32 w-[1px] bg-cyan-400 absolute"></div>
        <div className="w-24 h-24 rounded-full border border-cyan-400 absolute"></div>
      </div>
    </div>
  );
}
