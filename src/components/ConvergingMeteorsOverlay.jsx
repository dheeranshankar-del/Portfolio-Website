import React, { useEffect, useRef } from 'react';

export default function ConvergingMeteorsOverlay({ isTriggered }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isTriggered) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let startTime = null;
    const duration = 900; // 900ms

    // Set canvas dimensions to match container bounds
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    updateSize();

    const width = canvas.width;
    const height = canvas.height;

    // Video center and left edge calculations
    const centerX = width / 2;
    const centerY = height / 2;
    const videoHalfWidth = 170; // 340px / 2
    const safeGap = 75; // Fades out completely 75px BEFORE the video left edge

    // Define Trajectory: Starts at left edge (4%), Ends 75px BEFORE the video left edge
    const leftVideoEdge = centerX - videoHalfWidth;
    const starStart = { x: width * 0.04, y: height * 0.22 };
    const starEnd = { x: Math.max(20, leftVideoEdge - safeGap), y: centerY - 15 };

    // Atmospheric drag deceleration curve
    const atmosphericProgress = (t) => {
      const k = 3.0;
      return Math.log(1 + k * t) / Math.log(1 + k);
    };

    // Micro ionization dust particles
    const particles = [];
    const numDust = 12;
    for (let i = 0; i < numDust; i++) {
      particles.push({
        spawnT: 0.1 + Math.random() * 0.7,
        offsetX: (Math.random() - 0.5) * 5,
        offsetY: (Math.random() - 0.5) * 5,
        life: 0.2 + Math.random() * 0.25,
        size: 0.8 + Math.random() * 1.2,
      });
    }

    const drawFrame = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(1, elapsed / duration);

      ctx.clearRect(0, 0, width, height);

      if (progress < 1) {
        const p = atmosphericProgress(progress);

        // Intensity curve fading to 0 BEFORE progress completes
        const fadeCutoff = Math.min(1, progress / 0.88);
        const intensity = Math.sin(Math.PI * Math.pow(fadeCutoff, 0.85)) * (1 - Math.pow(progress, 3));

        if (intensity > 0.005) {
          // --- Single Horizontal Shooting Star ---
          const headX = starStart.x + (starEnd.x - starStart.x) * p;
          const headY = starStart.y + (starEnd.y - starStart.y) * p;
          const angle = Math.atan2(starEnd.y - starStart.y, starEnd.x - starStart.x);

          const tailLen = 110 * intensity;
          const tailX = headX - Math.cos(angle) * tailLen;
          const tailY = headY - Math.sin(angle) * tailLen;

          // Draw Plasma Trail
          const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.65, `rgba(230, 240, 255, ${0.45 * intensity})`);
          grad.addColorStop(0.92, `rgba(245, 250, 255, ${0.85 * intensity})`);
          grad.addColorStop(1, `rgba(255, 255, 255, ${0.98 * intensity})`);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(headX, headY);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2.0 * intensity;
          ctx.lineCap = 'round';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.75)';
          ctx.shadowBlur = 9 * intensity;
          ctx.stroke();

          // Draw Head Core
          const headRad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 4.5 * intensity);
          headRad.addColorStop(0, '#FFFFFF');
          headRad.addColorStop(0.4, `rgba(240, 245, 255, ${0.85 * intensity})`);
          headRad.addColorStop(1, 'rgba(200, 220, 255, 0)');

          ctx.beginPath();
          ctx.arc(headX, headY, 4.5 * intensity, 0, Math.PI * 2);
          ctx.fillStyle = headRad;
          ctx.fill();
          ctx.restore();

          // --- Micro Ionization Dust Particles ---
          particles.forEach((pt) => {
            if (p >= pt.spawnT && p <= pt.spawnT + pt.life) {
              const particleAge = (p - pt.spawnT) / pt.life;
              const particleAlpha = Math.sin(Math.PI * particleAge) * intensity * 0.6;

              const lag = particleAge * 30;
              const px = headX - Math.cos(angle) * lag + pt.offsetX;
              const py = headY - Math.sin(angle) * lag + pt.offsetY;

              ctx.save();
              ctx.beginPath();
              ctx.arc(px, py, pt.size * (1 - particleAge * 0.5), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${particleAlpha})`;
              ctx.shadowColor = '#FFFFFF';
              ctx.shadowBlur = 4;
              ctx.fill();
              ctx.restore();
            }
          });
        }

        animationFrameId = requestAnimationFrame(drawFrame);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTriggered]);

  return (
    <canvas
      ref={canvasRef}
      className="hidden md:block absolute inset-0 w-full h-full pointer-events-none z-20"
    />
  );
}
