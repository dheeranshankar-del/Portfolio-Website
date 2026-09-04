import React, { useEffect, useRef } from 'react';

export default function AboutStarTrail({ isInView }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const strandsRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, lastX: 0, lastY: 0, hasMoved: false, isInside: false });

  useEffect(() => {
    // 1. Accessibility & Touch/Mobile Checks
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (prefersReducedMotion || isTouchDevice) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. High-DPI Crisp Resizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // 3. Initialize 4 Tejas-inspired Orbital Follower Strands with Spring Physics
    const NUM_STRANDS = 4;
    strandsRef.current = Array.from({ length: NUM_STRANDS }, (_, i) => ({
      angleOffset: i * (Math.PI * 2 / NUM_STRANDS),
      radius: 2.5 + i * 2.0,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      stiffness: 0.16 - i * 0.018,
      damping: 0.80 + i * 0.01,
      points: []
    }));

    // 5. Orbital Shooting Star Render Loop
    const render = () => {
      const now = performance.now();

      if (!isInView) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        strandsRef.current.forEach((s) => (s.points = []));
        animFrameRef.current = null;
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mouse = mouseRef.current;

      // Update spring-physics position for each orbital strand
      if (mouse.hasMoved && mouse.isInside) {
        const speed = Math.hypot(mouse.vx, mouse.vy);
        const wave = Math.sin(now * 0.006);

        strandsRef.current.forEach((strand, idx) => {
          // Calculate orbital target position lagging behind cursor velocity
          const orbitAngle = strand.angleOffset + wave * 0.6;
          const targetX = mouse.x + Math.cos(orbitAngle) * (strand.radius + Math.min(speed * 0.12, 8));
          const targetY = mouse.y + Math.sin(orbitAngle) * (strand.radius + Math.min(speed * 0.12, 8));

          // Spring acceleration towards orbital target
          const ax = (targetX - strand.x) * strand.stiffness;
          const ay = (targetY - strand.y) * strand.stiffness;

          strand.vx = (strand.vx + ax) * strand.damping;
          strand.vy = (strand.vy + ay) * strand.damping;

          strand.x += strand.vx;
          strand.y += strand.vy;

          // Record historical points with 550ms fade-out lifetime
          strand.points.push({
            x: strand.x,
            y: strand.y,
            time: now,
            maxAge: 550 + idx * 40
          });
        });
      }

      // Draw fluid multi-strand orbital curves
      let hasActivePoints = false;

      strandsRef.current.forEach((strand, strandIdx) => {
        strand.points = strand.points.filter((p) => now - p.time < p.maxAge);
        const points = strand.points;

        if (points.length >= 3) {
          hasActivePoints = true;

          const baseAlphas = [0.12, 0.20, 0.32, 0.45];
          const baseWidths = [1.6, 1.2, 0.8, 0.5];

          // Pass 1: Subtle Cool-Cyan Edge Glow
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = baseWidths[strandIdx % baseWidths.length] + 1.2;

          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];

            const ageProgress = (now - p2.time) / p2.maxAge;
            const alpha = Math.max(0, (1 - ageProgress) * (baseAlphas[strandIdx % baseAlphas.length] * 0.35));

            ctx.beginPath();
            ctx.strokeStyle = `rgba(56, 189, 248, ${alpha.toFixed(3)})`; // Cyan edge glow

            if (i === 1) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            } else {
              const xc = (p1.x + p2.x) / 2;
              const yc = (p1.y + p2.y) / 2;
              ctx.moveTo(points[i - 2].x, points[i - 2].y);
              ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
            }
            ctx.stroke();
          }
          ctx.restore();

          // Pass 2: White/Silver Core Shooting Star Line
          ctx.save();
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.lineWidth = baseWidths[strandIdx % baseWidths.length];

          for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];

            const ageProgress = (now - p2.time) / p2.maxAge;
            const alpha = Math.max(0, (1 - ageProgress) * baseAlphas[strandIdx % baseAlphas.length]);

            ctx.beginPath();
            ctx.strokeStyle = `rgba(245, 247, 250, ${alpha.toFixed(3)})`; // Crisp white/silver core

            if (i === 1) {
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
            } else {
              const xc = (p1.x + p2.x) / 2;
              const yc = (p1.y + p2.y) / 2;
              ctx.moveTo(points[i - 2].x, points[i - 2].y);
              ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
            }
            ctx.stroke();
          }
          ctx.restore();
        }
      });

      // Keep loop active while section is in view and mouse inside or points fading
      if (isInView && (hasActivePoints || mouseRef.current.isInside)) {
        animFrameRef.current = requestAnimationFrame(render);
      } else {
        animFrameRef.current = null;
      }
    };

    const startRenderLoop = () => {
      if (!animFrameRef.current && isInView) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // 4. Pointer Motion Tracking inside About Section Container
    const handlePointerMove = (e) => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const mouse = mouseRef.current;

      if (mouse.hasMoved) {
        mouse.vx = x - mouse.lastX;
        mouse.vy = y - mouse.lastY;
      } else {
        mouse.hasMoved = true;
      }

      mouse.x = x;
      mouse.y = y;
      mouse.lastX = x;
      mouse.lastY = y;
      mouse.isInside = true;

      startRenderLoop();
    };

    const handlePointerEnter = () => {
      mouseRef.current.isInside = true;
      startRenderLoop();
    };

    const handlePointerLeave = () => {
      mouseRef.current.isInside = false;
      mouseRef.current.hasMoved = false;
    };

    if (isInView && (mouseRef.current.isInside || mouseRef.current.hasMoved)) {
      startRenderLoop();
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (parentEl) {
        parentEl.removeEventListener('pointermove', handlePointerMove);
        parentEl.removeEventListener('pointerenter', handlePointerEnter);
        parentEl.removeEventListener('pointerleave', handlePointerLeave);
      }
      resizeObserver.disconnect();
    };
  }, [isInView]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
