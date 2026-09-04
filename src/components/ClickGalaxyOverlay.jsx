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

      // Asymmetrical cloud shape offset layers (3 irregular organic blobs)
      const cloudBlobs = [
        {
          id: 1,
          borderRadius: '42% 58% 70% 30% / 45% 45% 55% 55%',
          transform: `rotate(${Math.floor(Math.random() * 45)}deg) scale(${0.9 + Math.random() * 0.2})`,
          background: 'radial-gradient(ellipse at 40% 40%, rgba(56, 75, 112, 0.40) 0%, rgba(30, 41, 59, 0.25) 55%, transparent 85%)',
          blur: ' blur-[9px]',
        },
        {
          id: 2,
          borderRadius: '60% 40% 30% 70% / 50% 30% 70% 50%',
          transform: `rotate(${Math.floor(Math.random() * 90 + 45)}deg) scale(${0.75 + Math.random() * 0.25}) translate(12%, -8%)`,
          background: 'radial-gradient(ellipse at 50% 60%, rgba(100, 116, 139, 0.35) 0%, rgba(30, 41, 59, 0.18) 60%, transparent 80%)',
          blur: ' blur-[7px]',
        },
        {
          id: 3,
          borderRadius: '35% 65% 55% 45% / 60% 40% 60% 40%',
          transform: `rotate(${Math.floor(Math.random() * 120 + 110)}deg) scale(${0.6 + Math.random() * 0.3}) translate(-10%, 14%)`,
          background: 'radial-gradient(circle at 45% 45%, rgba(148, 163, 184, 0.38) 0%, rgba(51, 65, 85, 0.20) 50%, transparent 75%)',
          blur: ' blur-[5px]',
        },
      ];

      // Generate 5 to 8 static, randomized internal star points (no explosion)
      const starCount = 5 + Math.floor(Math.random() * 4);
      const stars = Array.from({ length: starCount }).map((_, idx) => {
        // Random offset within -28px to +28px relative to center
        const offsetX = (Math.random() - 0.5) * 52;
        const offsetY = (Math.random() - 0.5) * 52;
        const size = 1.0 + Math.random() * 1.4; // 1.0px to 2.4px
        const isWarmYellow = Math.random() < 0.25; // 25% chance of pale warm yellow star

        return {
          id: idx,
          x: offsetX,
          y: offsetY,
          size,
          color: isWarmYellow ? 'bg-amber-100/90' : 'bg-slate-100/90',
          shadow: isWarmYellow ? 'shadow-[0_0_2px_rgba(254,243,199,0.8)]' : 'shadow-[0_0_2px_rgba(255,255,255,0.8)]',
          opacity: 0.35 + Math.random() * 0.45,
          twinkleDelay: Math.floor(Math.random() * 600),
        };
      });

      const newGalaxy = { id, x, y, baseRotation, scale, cloudBlobs, stars };

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
        @keyframes irregularGalaxyLifecycle {
          0% {
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          15% {
            opacity: 0.15;
          }
          35% {
            transform: translate(-50%, -50%) scale(0.85) rotate(4deg);
            opacity: 0.32;
          }
          60% {
            transform: translate(-50%, -50%) scale(1.02) rotate(9deg);
            opacity: 0.28;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.22) rotate(16deg);
            opacity: 0;
          }
        }

        @keyframes starPointTwinkle {
          0%, 100% { opacity: var(--star-op); }
          50% { opacity: calc(var(--star-op) * 0.4); }
        }
      `}</style>

      {galaxies.map((g) => (
        <div
          key={g.id}
          style={{
            left: `${g.x}px`,
            top: `${g.y}px`,
            animation: 'irregularGalaxyLifecycle 2000ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
            transformOrigin: 'center center',
          }}
          className="absolute pointer-events-none w-[75px] h-[75px]"
        >
          {/* Main Rotating Container for Irregular Cloud Layers */}
          <div
            style={{
              transform: `rotate(${g.baseRotation}deg) scale(${g.scale})`,
            }}
            className="w-full h-full relative pointer-events-none"
          >
            {/* Multi-Layered Asymmetrical Dusty Blue-Gray Cloud Blobs */}
            {g.cloudBlobs.map((blob) => (
              <div
                key={blob.id}
                style={{
                  borderRadius: blob.borderRadius,
                  transform: blob.transform,
                  background: blob.background,
                }}
                className={`absolute inset-0 pointer-events-none ${blob.blur}`}
              />
            ))}

            {/* Static Internal Star Points (No Outward Particle Burst) */}
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
