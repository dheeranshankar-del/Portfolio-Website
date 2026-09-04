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

      // Click Targeting Safeguard: ONLY trigger when clicking empty background space!
      // Do NOT trigger on links, buttons, text, images, videos, nav, modals, or content cards.
      const target = e.target;
      if (
        target &&
        target.closest &&
        target.closest(
          'a, button, input, textarea, select, [role="button"], video, img, svg, p, h1, h2, h3, h4, h5, h6, nav, header, footer, .project-content, .project-card, modal'
        )
      ) {
        return;
      }

      const id = Date.now() + Math.random();
      const x = e.clientX;
      const y = e.clientY;

      // Generate 5 to 10 extremely small background stars scattered in 35-60px area
      const starCount = 5 + Math.floor(Math.random() * 6);
      const stars = Array.from({ length: starCount }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 0.75) * 28; // Up to ~28px radius (56px diameter area)
        
        // Micro stationary drift (0 to 0.6px maximum)
        const microDriftX = (Math.random() - 0.5) * 1.2;
        const microDriftY = (Math.random() - 0.5) * 1.2;

        // Size: Mostly ~1.0px, max 1-2 stars reach ~1.5px-1.8px
        const isSlightlyLarger = idx === 0 || (idx === 1 && starCount > 7);
        const size = isSlightlyLarger ? 1.4 + Math.random() * 0.4 : 0.9 + Math.random() * 0.3;

        // Color & Opacity matching background starfield (dim white / off-white & subtle slate-blue)
        const isCoolBlue = Math.random() < 0.25;
        const colorClass = isCoolBlue ? 'bg-slate-300/80' : 'bg-white/80';
        const opacity = isCoolBlue ? 0.30 + Math.random() * 0.25 : 0.35 + Math.random() * 0.35;

        return {
          id: idx,
          posX: Math.cos(angle) * dist,
          posY: Math.sin(angle) * dist,
          microDriftX,
          microDriftY,
          size,
          colorClass,
          opacity,
        };
      });

      const newCluster = { id, x, y, stars };

      setClusters((prev) => {
        const updated = prev.length >= 6 ? prev.slice(prev.length - 5) : prev;
        return [...updated, newCluster];
      });

      // Completely remove from DOM after 1700ms total lifetime
      setTimeout(() => {
        setClusters((prev) => prev.filter((c) => c.id !== id));
      }, 1700);
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
        @keyframes subtleStarFade {
          0% {
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          55% {
            opacity: 0.85;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes subtleStarLifecycle {
          0% {
            opacity: 0;
            transform: translate(var(--pos-x), var(--pos-y)) scale(0.6);
          }
          20% {
            opacity: var(--star-op);
            transform: translate(var(--pos-x), var(--pos-y)) scale(1);
          }
          60% {
            opacity: calc(var(--star-op) * 0.85);
            transform: translate(calc(var(--pos-x) + var(--drift-x)), calc(var(--pos-y) + var(--drift-y))) scale(0.95);
          }
          100% {
            opacity: 0;
            transform: translate(calc(var(--pos-x) + var(--drift-x)), calc(var(--pos-y) + var(--drift-y))) scale(0.6);
          }
        }
      `}</style>

      {clusters.map((c) => (
        <div
          key={c.id}
          style={{
            left: `${c.x}px`,
            top: `${c.y}px`,
            animation: 'subtleStarFade 1700ms ease-in-out forwards',
          }}
          className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 w-1 h-1"
        >
          {c.stars.map((s) => (
            <div
              key={s.id}
              style={{
                '--pos-x': `${s.posX}px`,
                '--pos-y': `${s.posY}px`,
                '--drift-x': `${s.microDriftX}px`,
                '--drift-y': `${s.microDriftY}px`,
                '--star-op': s.opacity,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animation: `subtleStarLifecycle 1700ms cubic-bezier(0.25, 1, 0.5, 1) forwards`,
              }}
              className={`absolute rounded-full pointer-events-none ${s.colorClass}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
