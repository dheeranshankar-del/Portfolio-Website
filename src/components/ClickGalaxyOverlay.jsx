import React, { useEffect, useState } from 'react';

export default function ClickGalaxyOverlay() {
  const [clusters, setClusters] = useState([]);

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

      // Generate a cluster of 16 to 24 sparkling mini star dots
      const starCount = 16 + Math.floor(Math.random() * 9);
      const stars = Array.from({ length: starCount }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.pow(Math.random(), 0.7) * 36; // Concentrated towards center, expanding up to 36px
        const driftX = Math.cos(angle) * (radius + 6 + Math.random() * 8);
        const driftY = Math.sin(angle) * (radius + 6 + Math.random() * 8);
        const size = 1.0 + Math.random() * 1.8; // 1px to 2.8px

        // Star colors: pure white, ice blue, and soft gold
        const colorType = idx % 4;
        let colorClass = 'bg-white';
        let shadowClass = 'shadow-[0_0_3px_#ffffff]';

        if (colorType === 1) {
          colorClass = 'bg-sky-200';
          shadowClass = 'shadow-[0_0_3px_#bae6fd]';
        } else if (colorType === 2) {
          colorClass = 'bg-amber-200';
          shadowClass = 'shadow-[0_0_4px_#fef08a]';
        }

        return {
          id: idx,
          startX: Math.cos(angle) * radius,
          startY: Math.sin(angle) * radius,
          driftX,
          driftY,
          size,
          colorClass,
          shadowClass,
          opacity: 0.65 + Math.random() * 0.35,
          twinkleDuration: 600 + Math.floor(Math.random() * 500),
        };
      });

      const newCluster = { id, x, y, stars };

      setClusters((prev) => {
        const updated = prev.length >= 6 ? prev.slice(prev.length - 5) : prev;
        return [...updated, newCluster];
      });

      // Remove cluster after 1100ms
      setTimeout(() => {
        setClusters((prev) => prev.filter((c) => c.id !== id));
      }, 1100);
    };

    window.addEventListener('click', handleClick, { capture: true });

    return () => {
      window.removeEventListener('click', handleClick, { capture: true });
    };
  }, []);

  if (clusters.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none" aria-hidden="true">
      <style>{`
        @keyframes starClusterFade {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          65% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes starPointFloat {
          0% {
            transform: translate(var(--start-x), var(--start-y)) scale(0.3);
            opacity: 0;
          }
          25% {
            opacity: var(--star-op);
            transform: translate(var(--start-x), var(--start-y)) scale(1.2);
          }
          100% {
            transform: translate(var(--drift-x), var(--drift-y)) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>

      {clusters.map((c) => (
        <div
          key={c.id}
          style={{
            left: `${c.x}px`,
            top: `${c.y}px`,
            animation: 'starClusterFade 1100ms ease-out forwards',
          }}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-1 h-1"
        >
          {c.stars.map((s) => (
            <div
              key={s.id}
              style={{
                '--start-x': `${s.startX}px`,
                '--start-y': `${s.startY}px`,
                '--drift-x': `${s.driftX}px`,
                '--drift-y': `${s.driftY}px`,
                '--star-op': s.opacity,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animation: `starPointFloat 1100ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
              }}
              className={`absolute rounded-full pointer-events-none ${s.colorClass} ${s.shadowClass}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
