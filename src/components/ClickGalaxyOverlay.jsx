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

      // Base rotation and scale (110px to 140px size)
      const baseRotation = Math.floor(Math.random() * 360);
      const scale = 0.9 + Math.random() * 0.3; // 0.9 to 1.2

      // Generate 2 logarithmic spiral arm dust clouds
      const cloudArmNodes = [];
      const numNodes = 24;
      for (let i = 0; i < numNodes; i++) {
        const armIndex = i % 2; // 2 spiral arms
        const t = (i / numNodes) * Math.PI * 2.2;
        const armOffset = armIndex * Math.PI;
        const radius = 6 + t * 7; // Expanding spiral radius
        const angle = t + armOffset + (Math.random() * 0.3 - 0.15);

        const nodeX = Math.cos(angle) * radius;
        const nodeY = Math.sin(angle) * radius;
        const size = 20 + Math.random() * 24;

        // Vivid dusty cyan / periwinkle blue hues matching astronomical photo
        const colorHue = armIndex === 0
          ? 'rgba(125, 175, 235, 0.55)'
          : 'rgba(95, 140, 210, 0.50)';

        cloudArmNodes.push({
          id: i,
          x: nodeX,
          y: nodeY,
          size,
          background: `radial-gradient(circle at 50% 50%, ${colorHue} 0%, rgba(45, 75, 125, 0.35) 45%, transparent 80%)`,
          borderRadius: `${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}% ${40 + Math.random() * 20}%`,
          blur: 4 + Math.floor(Math.random() * 4),
        });
      }

      // Generate 25 to 35 crisp, bright star points (yellow-gold core stars & bright white outer stars)
      const starCount = 28 + Math.floor(Math.random() * 8);
      const stars = Array.from({ length: starCount }).map((_, idx) => {
        const isCoreStar = idx < 8;
        const angle = Math.random() * Math.PI * 2;
        const radius = isCoreStar ? Math.random() * 18 : Math.random() * 52;
        const size = isCoreStar ? 1.8 + Math.random() * 1.8 : 1.0 + Math.random() * 1.6;

        const isYellowStar = idx % 3 === 0 || isCoreStar; // ~33% bright yellow-gold stars

        return {
          id: idx,
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          size,
          color: isYellowStar ? 'bg-amber-300' : 'bg-white',
          shadow: isYellowStar
            ? 'shadow-[0_0_5px_#fde047,0_0_10px_#eab308]'
            : 'shadow-[0_0_4px_#ffffff,0_0_8px_#38bdf8]',
          opacity: 0.75 + Math.random() * 0.25,
          twinkleDelay: Math.floor(Math.random() * 800),
        };
      });

      const newGalaxy = { id, x, y, baseRotation, scale, cloudArmNodes, stars };

      setGalaxies((prev) => {
        const updated = prev.length >= 6 ? prev.slice(prev.length - 5) : prev;
        return [...updated, newGalaxy];
      });

      // Remove after 2200ms animation finishes
      setTimeout(() => {
        setGalaxies((prev) => prev.filter((g) => g.id !== id));
      }, 2200);
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
        @keyframes realGalaxyLifecycle {
          0% {
            transform: translate(-50%, -50%) scale(0.2) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          40% {
            transform: translate(-50%, -50%) scale(0.95) rotate(6deg);
            opacity: 0.90;
          }
          65% {
            transform: translate(-50%, -50%) scale(1.05) rotate(14deg);
            opacity: 0.75;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.25) rotate(22deg);
            opacity: 0;
          }
        }

        @keyframes realStarTwinkle {
          0%, 100% { opacity: var(--star-op); transform: translate(-50%, -50%) scale(1); }
          50% { opacity: calc(var(--star-op) * 0.5); transform: translate(-50%, -50%) scale(0.75); }
        }
      `}</style>

      {galaxies.map((g) => (
        <div
          key={g.id}
          style={{
            left: `${g.x}px`,
            top: `${g.y}px`,
            animation: 'realGalaxyLifecycle 2200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-none w-[130px] h-[130px]"
        >
          {/* Main Rotating Container */}
          <div
            style={{
              transform: `rotate(${g.baseRotation}deg) scale(${g.scale})`,
            }}
            className="w-full h-full relative pointer-events-none"
          >
            {/* Bright Warm Gold Galactic Core Glow */}
            <div
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.85) 0%, rgba(234, 179, 8, 0.55) 30%, rgba(180, 83, 9, 0.30) 55%, transparent 80%)',
              }}
              className="absolute inset-4 rounded-full blur-[6px] pointer-events-none"
            />

            {/* Dusty Cyan & Periwinkle Spiral Arm Clouds */}
            {g.cloudArmNodes.map((node) => (
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

            {/* Crisp Bright Yellow-Gold & White Star Points */}
            {g.stars.map((s) => (
              <div
                key={s.id}
                style={{
                  '--star-op': s.opacity,
                  left: `calc(50% + ${s.x}px)`,
                  top: `calc(50% + ${s.y}px)`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  animation: `realStarTwinkle 1100ms ease-in-out ${s.twinkleDelay}ms infinite`,
                }}
                className={`absolute rounded-full pointer-events-none ${s.color} ${s.shadow}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
