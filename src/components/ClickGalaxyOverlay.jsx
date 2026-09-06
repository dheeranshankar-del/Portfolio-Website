import React, { useEffect, useRef } from 'react';

export default function ClickGalaxyOverlay() {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const maxParticles = 200;

    let lastMouseX = null;
    let lastMouseY = null;
    let isMouseOverInteractive = false;

    // Helper: Check if an element or its parent is interactive UI
    const isInteractiveElement = (target) => {
      if (!target || !target.closest) return false;
      return !!target.closest(
        'a, button, input, textarea, select, [role="button"], video, img, svg, p, h1, h2, h3, h4, h5, h6, nav, header, footer, .project-content, .project-card, modal'
      );
    };

    // Spawn a trail particle at (x, y) with optional velocity delta
    const spawnTrailParticle = (x, y, dx = 0, dy = 0) => {
      if (particles.length >= maxParticles) {
        particles.shift();
      }

      const isCoolBlue = Math.random() < 0.3;
      const size = Math.random() < 0.15 ? Math.random() * 0.8 + 1.6 : Math.random() * 0.7 + 0.6;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 0.4 + 0.1;

      particles.push({
        x,
        y,
        vx: dx * 0.12 + Math.cos(angle) * speed,
        vy: dy * 0.12 + Math.sin(angle) * speed,
        size,
        alpha: Math.random() * 0.35 + 0.65,
        maxLife: Math.floor(Math.random() * 25 + 35), // ~40-60 frames (~0.7s - 1.0s)
        life: 0,
        color: isCoolBlue ? '#bae6fd' : '#ffffff',
        shadowColor: isCoolBlue ? 'rgba(186, 230, 253, 0.8)' : 'rgba(255, 255, 255, 0.8)'
      });
    };

    // Spawn a radial burst of stardust stars (on click)
    const spawnClickBurst = (clickX, clickY) => {
      const burstCount = Math.floor(Math.random() * 6) + 12; // 12-17 stars
      for (let i = 0; i < burstCount; i++) {
        if (particles.length >= maxParticles) particles.shift();

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.6 + 0.4;
        const isCoolBlue = Math.random() < 0.25;
        const isLarger = i < 2;

        particles.push({
          x: clickX,
          y: clickY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: isLarger ? Math.random() * 0.5 + 1.8 : Math.random() * 0.6 + 0.8,
          alpha: isCoolBlue ? Math.random() * 0.3 + 0.6 : Math.random() * 0.25 + 0.7,
          maxLife: Math.floor(Math.random() * 30 + 45), // ~0.8s - 1.2s
          life: 0,
          color: isCoolBlue ? '#bae6fd' : '#ffffff',
          shadowColor: isCoolBlue ? 'rgba(186, 230, 253, 0.9)' : 'rgba(255, 255, 255, 0.9)'
        });
      }
    };

    // Helper: Check if cursor position or target is within the About section
    const isInsideAboutSection = (target, x, y) => {
      const aboutEl = document.getElementById('about-section');
      if (!aboutEl) return false;

      if (target && aboutEl.contains(target)) {
        return true;
      }

      const rect = aboutEl.getBoundingClientRect();
      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= rect.bottom
      );
    };

    // Mouse move handler: generate continuous smooth trail along path (About section only)
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Only generate trail when cursor is inside the About section
      if (!isInsideAboutSection(e.target, x, y)) {
        lastMouseX = null;
        lastMouseY = null;
        return;
      }

      isMouseOverInteractive = isInteractiveElement(e.target);

      if (!isMouseOverInteractive && lastMouseX !== null && lastMouseY !== null) {
        const dx = x - lastMouseX;
        const dy = y - lastMouseY;
        const dist = Math.hypot(dx, dy);

        // Interpolate trail points for fast mouse movement
        if (dist > 3) {
          const steps = Math.min(Math.floor(dist / 6), 8);
          for (let i = 0; i <= steps; i++) {
            const t = i / Math.max(steps, 1);
            const interpX = lastMouseX + dx * t;
            const interpY = lastMouseY + dy * t;
            if (Math.random() < 0.75) {
              spawnTrailParticle(interpX, interpY, dx, dy);
            }
          }
        }
      }

      lastMouseX = x;
      lastMouseY = y;
    };

    // Click handler: trigger star burst when clicking empty space in About section
    const handleClick = (e) => {
      if (e.clientX === 0 && e.clientY === 0) return;
      if (!isInsideAboutSection(e.target, e.clientX, e.clientY)) return;
      if (isInteractiveElement(e.target)) return;

      spawnClickBurst(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick, { capture: true });

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Smooth deceleration
        p.vy *= 0.96;

        const lifeProgress = p.life / p.maxLife;
        if (lifeProgress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        // Smooth fade-in then fade-out curve
        let currentAlpha = p.alpha;
        if (lifeProgress < 0.15) {
          currentAlpha = (lifeProgress / 0.15) * p.alpha;
        } else {
          currentAlpha = (1 - (lifeProgress - 0.15) / 0.85) * p.alpha;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, currentAlpha);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.shadowColor;
        ctx.shadowBlur = 4;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick, { capture: true });
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden select-none"
      aria-hidden="true"
    />
  );
}
