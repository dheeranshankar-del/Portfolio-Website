import React, { useEffect, useState } from 'react';

export default function ClickGalaxyOverlay() {
  const [galaxies, setGalaxies] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Ignore clicks on zero-coordinate synthetic events
      if (e.clientX === 0 && e.clientY === 0) return;

      const id = Date.now() + Math.random();
      const x = e.clientX;
      const y = e.clientY;

      // Random variations for rotation, size, and particles
      const baseRotation = Math.floor(Math.random() * 360);
      const scale = 0.85 + Math.random() * 0.3; // 0.85 to 1.15 (~50px to 65px bloom)
      
      // Generate 4 to 6 faint star particles
      const particleCount = 4 + Math.floor(Math.random() * 3);
      const particles = Array.from({ length: particleCount }).map((_, idx) => {
        const angle = (idx * (360 / particleCount)) + (Math.random() * 30 - 15);
        const rad = (angle * Math.PI) / 180;
        const distance = 14 + Math.random() * 16; // 14px to 30px outward drift
        return {
          id: idx,
          dx: Math.cos(rad) * distance,
          dy: Math.sin(rad) * distance,
          size: 1 + Math.random() * 1.2, // 1px to 2.2px
          opacity: 0.4 + Math.random() * 0.4,
        };
      });

      const newGalaxy = { id, x, y, baseRotation, scale, particles };

      setGalaxies((prev) => {
        // Cap active galaxies to max 5
        const updated = prev.length >= 5 ? prev.slice(prev.length - 4) : prev;
        return [...updated, newGalaxy];
      });

      // Automatically remove from DOM after 1500ms animation finishes
      setTimeout(() => {
        setGalaxies((prev) => prev.filter((g) => g.id !== id));
      }, 1500);
    };

    window.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  if (galaxies.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none" aria-hidden="true">
      <style>{`
        @keyframes miniGalaxyFade {
          0% {
            transform: translate(-50%, -50%) scale(0.25) rotate(0deg);
            opacity: 0;
          }
          18% {
            transform: translate(-50%, -50%) scale(0.85) rotate(6deg);
            opacity: 0.32;
          }
          55% {
            transform: translate(-50%, -50%) scale(1.05) rotate(16deg);
            opacity: 0.22;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3) rotate(28deg);
            opacity: 0;
          }
        }

        @keyframes starParticleDrift {
          0% {
            transform: translate(0, 0) scale(0.3);
            opacity: 0;
          }
          20% {
            opacity: var(--p-op);
          }
          100% {
            transform: translate(var(--p-dx), var(--p-dy)) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      {galaxies.map((g) => (
        <div
          key={g.id}
          style={{
            left: `${g.x}px`,
            top: `${g.y}px`,
            animation: 'miniGalaxyFade 1400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-none w-[60px] h-[60px]"
        >
          {/* Outer Soft Dark Blue / Violet / Smoky Gray Nebula Bloom Cloud */}
          <div
            style={{
              transform: `rotate(${g.baseRotation}deg) scale(${g.scale})`,
            }}
            className="w-full h-full rounded-full pointer-events-none blur-[7px]"
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: 'radial-gradient(circle at 45% 45%, rgba(99, 102, 241, 0.35) 0%, rgba(49, 46, 129, 0.25) 35%, rgba(30, 41, 59, 0.15) 70%, transparent 100%)',
              }}
            />
          </div>

          {/* Secondary Layer: Faint Asymmetric Oval Core */}
          <div
            style={{
              transform: `rotate(${g.baseRotation + 45}deg) scale(${g.scale * 0.7})`,
            }}
            className="absolute inset-1 rounded-[40%] blur-[5px] pointer-events-none opacity-70"
          >
            <div 
              className="w-full h-full rounded-[40%]"
              style={{
                background: 'radial-gradient(ellipse at 50% 50%, rgba(199, 210, 254, 0.30) 0%, rgba(99, 102, 241, 0.15) 50%, transparent 100%)',
              }}
            />
          </div>

          {/* 4 to 6 Faint Star Particles */}
          {g.particles.map((p) => (
            <div
              key={p.id}
              style={{
                '--p-dx': `${p.dx}px`,
                '--p-dy': `${p.dy}px`,
                '--p-op': p.opacity,
                left: '50%',
                top: '50%',
                width: `${p.size}px`,
                height: `${p.size}px`,
                animation: 'starParticleDrift 1400ms ease-out forwards',
              }}
              className="absolute rounded-full bg-slate-100 shadow-[0_0_2px_#ffffff] pointer-events-none"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
