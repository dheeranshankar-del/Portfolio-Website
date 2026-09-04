import React, { useEffect, useState } from 'react';

export default function ClickGalaxyOverlay() {
  const [galaxies, setGalaxies] = useState([]);

  useEffect(() => {
    const handleClick = (e) => {
      // Respect prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Ignore synthetic 0,0 clicks
      if (e.clientX === 0 && e.clientY === 0) return;

      const id = Date.now() + Math.random();
      const x = e.clientX;
      const y = e.clientY;

      // Base rotation and scale variation (55px to 80px target size)
      const baseRotation = Math.floor(Math.random() * 360);
      const scale = 0.85 + Math.random() * 0.3; // 0.85 to 1.15

      // Asymmetrical cloud shape offset layers (mottled dusty periwinkle/blue clumps)
      const cloudNodes = Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx * (360 / 12)) + (Math.random() * 40 - 20);
        const rad = (angle * Math.PI) / 180;
        const dist = 4 + Math.random() * 22; // 4px to 26px radius
        const size = 16 + Math.random() * 20; // 16px to 36px node size

        // Palette sampled from reference photo: periwinkle, slate-blue, dusty cyan
        const colorHue = idx % 3 === 0 
          ? 'rgba(112, 144, 192, 0.35)' 
          : idx % 3 === 1 
          ? 'rgba(91, 123, 154, 0.30)' 
          : 'rgba(138, 158, 167, 0.25)';

        return {
          id: idx,
          x: Math.cos(rad) * dist,
          y: Math.sin(rad) * dist,
          size,
          background: `radial-gradient(circle at 50% 50%, ${colorHue} 0%, rgba(30, 41, 59, 0.15) 55%, transparent 85%)`,
          borderRadius: `${35 + Math.random() * 30}% ${35 + Math.random() * 30}% ${35 + Math.random() * 30}% ${35 + Math.random() * 30}%`,
          blur: 5 + Math.floor(Math.random() * 5), // 5px to 9px blur
        };
      });

      // Generate yellow-gold & cool-white star points matching reference photo
      const starCount = 8 + Math.floor(Math.random() * 6);
      const stars = Array.from({ length: starCount }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 32; // up to 32px spread
        const size = 1.0 + Math.random() * 1.6; // 1.0px to 2.6px
        
        // Reference photo has prominent yellow-gold star points peppered around
        const isYellowStar = idx < 4; // 3-4 yellow stars per galaxy

        return {
          id: idx,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size,
          color: isYellowStar ? 'bg-amber-400' : 'bg-slate-100/90',
          shadow: isYellowStar ? 'shadow-[0_0_3px_#facc15]' : 'shadow-[0_0_2px_rgba(255,255,255,0.8)]',
          opacity: isYellowStar ? 0.85 : 0.4 + Math.random() * 0.4,
          twinkleDelay: Math.floor(Math.random() * 600),
        };
      });

      const newGalaxy = { id, x, y, baseRotation, scale, cloudNodes, stars };

      setGalaxies((prev) => {
        const updated = prev.length >= 5 ? prev.slice(prev.length - 4) : prev;
        return [...updated, newGalaxy];
      });

      // Remove after 2000ms animation finishes
      setTimeout(() => {
        setGalaxies((prev) => prev.filter((g) => g.id !== id));
      }, 2000);
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
        @keyframes astronomicalGalaxyLifecycle {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.15;
          }
          35% {
            transform: translate(-50%, -50%) scale(0.85) rotate(3deg);
            opacity: 0.32;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.02) rotate(7deg);
            opacity: 0.28;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.22) rotate(14deg);
            opacity: 0;
          }
        }

        @keyframes starPointTwinkle {
          0%, 100% { opacity: var(--star-op); }
          50% { opacity: calc(var(--star-op) * 0.45); }
        }
      `}</style>

      {galaxies.map((g) => (
        <div
          key={g.id}
          style={{
            left: `${g.x}px`,
            top: `${g.y}px`,
            animation: 'astronomicalGalaxyLifecycle 2000ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-none w-[80px] h-[80px]"
        >
          {/* Main Rotating Container for Irregular Cloud & Star Layers */}
          <div
            style={{
              transform: `rotate(${g.baseRotation}deg) scale(${g.scale})`,
            }}
            className="w-full h-full relative pointer-events-none"
          >
            {/* Center Pale Gold / Warm Core Glow (Sampled from Reference Core) */}
            <div
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.35) 0%, rgba(197, 160, 89, 0.18) 40%, transparent 80%)',
              }}
              className="absolute inset-2 rounded-full blur-[8px] pointer-events-none"
            />

            {/* Mottled Periwinkle & Slate-Blue Cloud Clump Nodes */}
            {g.cloudNodes.map((node) => (
              <div
                key={node.id}
                style={{
                  left: `calc(50% + ${node.x}px - ${node.size / 2}px)`,
                  top: `calc(50% + ${node.y}px - ${node.size / 2}px)`,
                  width: `${node.size}px`,
                  height: `${node.size}px`,
                  borderRadius: node.borderRadius,
                  background: node.background,
                  filter: `blur(${node.blur}px)`,
                }}
                className="absolute pointer-events-none"
              />
            ))}

            {/* Yellow-Gold & Cool-White Star Points */}
            {g.stars.map((s) => (
              <div
                key={s.id}
                style={{
                  '--star-op': s.opacity,
                  left: `calc(50% + ${s.x}px)`,
                  top: `calc(50% + ${s.y}px)`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  animation: `starPointTwinkle 1200ms ease-in-out ${s.twinkleDelay}ms infinite`,
                }}
                className={`absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 ${s.color} ${s.shadow}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
