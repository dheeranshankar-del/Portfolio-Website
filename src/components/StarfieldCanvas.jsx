import React, { useEffect, useRef } from 'react';
import { assetPath } from '../utils/assetPath';

export default function StarfieldCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse movement parallax state
    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetMouseX = width / 2;
    let targetMouseY = height / 2;

    const handleMouseMove = (e) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // -------------------------------------------------------------
    // ASTROPHOTOGRAPHY STAR FIELD WITH 0.035 PARALLAX DISPLACEMENT
    // -------------------------------------------------------------
    const stars = [];
    const contrastMultiplier = 0.75;

    // Define 3 Real Open Cluster Centers
    const openClusters = [
      { x: width * 0.84, y: height * 0.18, radius: Math.min(width, height) * 0.08, count: 65 },
      { x: width * 0.14, y: height * 0.22, radius: Math.min(width, height) * 0.07, count: 48 },
      { x: width * 0.88, y: height * 0.78, radius: Math.min(width, height) * 0.06, count: 42 }
    ];

    // Define Dark Interstellar Void Patches
    const darkVoids = [
      { x: width * 0.25, y: height * 0.55, radius: Math.min(width, height) * 0.15 },
      { x: width * 0.70, y: height * 0.72, radius: Math.min(width, height) * 0.18 }
    ];

    const inDarkVoid = (x, y) => {
      return darkVoids.some(v => Math.hypot(x - v.x, y - v.y) < v.radius);
    };

    // 1. Generate Organic Open Cluster Stars
    openClusters.forEach(cluster => {
      for (let i = 0; i < cluster.count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.pow(Math.random(), 1.6) * cluster.radius;
        const x = cluster.x + Math.cos(angle) * dist + (Math.random() - 0.5) * 12;
        const y = cluster.y + Math.sin(angle) * dist + (Math.random() - 0.5) * 12;

        const rand = Math.random();
        let size, alpha;
        if (rand < 0.85) {
          size = Math.random() * 0.5 + 0.15;
          alpha = (Math.random() * 0.6 + 0.2) * contrastMultiplier;
        } else {
          size = Math.random() * 0.4 + 0.7;
          alpha = (Math.random() * 0.4 + 0.4) * contrastMultiplier;
        }

        stars.push({ x, y, size, alpha, category: 'cluster', color: '#FFFFFF' });
      }
    });

    // 2. Sparse Major Stars with Diffraction Spikes
    const spikePositions = [
      { x: width * 0.82, y: height * 0.16 },
      { x: width * 0.16, y: height * 0.20 },
      { x: width * 0.90, y: height * 0.80 },
      { x: width * 0.08, y: height * 0.75 },
      { x: width * 0.78, y: height * 0.40 },
      { x: width * 0.22, y: height * 0.10 },
      { x: width * 0.92, y: height * 0.30 },
      { x: width * 0.06, y: height * 0.45 },
      { x: width * 0.85, y: height * 0.65 },
      { x: width * 0.40, y: height * 0.12 }
    ];

    spikePositions.forEach(pos => {
      stars.push({
        x: pos.x + (Math.random() - 0.5) * 20,
        y: pos.y + (Math.random() - 0.5) * 20,
        size: Math.random() * 0.5 + 1.3,
        alpha: (Math.random() * 0.3 + 0.65) * contrastMultiplier,
        category: 'spike',
        color: '#FFFFFF'
      });
    });

    // 3. Generate Natural Field Star Dust
    const targetTotalStars = 1350;
    while (stars.length < targetTotalStars) {
      const candidateX = Math.random() * width;
      const candidateY = Math.random() * height;

      if (inDarkVoid(candidateX, candidateY)) continue;
      if (candidateY < 88 && Math.random() < 0.50) continue;

      const rand = Math.random();
      let size, alpha;
      if (rand < 0.86) {
        size = Math.random() * 0.45 + 0.15;
        alpha = (Math.random() * 0.65 + 0.15) * contrastMultiplier;
      } else {
        size = Math.random() * 0.4 + 0.6;
        alpha = (Math.random() * 0.4 + 0.4) * contrastMultiplier;
      }

      stars.push({ x: candidateX, y: candidateY, size, alpha, category: 'field', color: '#FFFFFF' });
    }

    // -------------------------------------------------------------
    // ATMOSPHERIC SHOOTING STAR RHYTHM (NEVER MORE THAN 1 AT ONCE)
    // -------------------------------------------------------------
    let currentShootingStar = null;
    // Initial delay: ~8 seconds
    let nextSpawnTime = Date.now() + 8000;

    const getNextDelay = () => {
      // 20% chance of a longer 30-45s pause, 80% chance of 14-26s interval
      return Math.random() < 0.2
        ? 30000 + Math.random() * 15000
        : 14000 + Math.random() * 12000;
    };

    const spawnShootingStar = () => {
      if (prefersReducedMotion) return;
      const isMajor = Math.random() < 0.25; // 25% major/brighter, 75% small/subtle
      const fromLeft = Math.random() > 0.35;
      
      const startX = fromLeft ? (Math.random() * (width * 0.5)) : (width * 0.5 + Math.random() * (width * 0.4));
      const startY = Math.random() * (height * 0.25) + (height * 0.04);
      
      const angle = (fromLeft ? 0.35 : Math.PI - 0.35) + (Math.random() - 0.5) * 0.2;
      const durationSec = isMajor ? (1.1 + Math.random() * 0.3) : (0.8 + Math.random() * 0.3); // 0.8s - 1.4s
      const totalFrames = Math.round(durationSec * 60);

      const targetDist = isMajor ? (width * 0.25 + Math.random() * (width * 0.15)) : (width * 0.12 + Math.random() * (width * 0.1));
      const speed = targetDist / totalFrames;

      currentShootingStar = {
        x: startX,
        y: startY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        length: isMajor ? 180 : 110,
        progress: 0,
        totalFrames,
        maxAlpha: isMajor ? 0.85 : 0.55,
        lineWidth: isMajor ? 1.8 : 1.1
      };
    };

    const render = () => {
      const now = Date.now();
      mouseX += (targetMouseX - mouseX) * 0.045;
      mouseY += (targetMouseY - mouseY) * 0.045;

      ctx.clearRect(0, 0, width, height);

      // Render Astrophotography Background Stars
      stars.forEach((star) => {
        const parallaxFactor = prefersReducedMotion ? 0 : (star.size * 0.035);
        const px = star.x + (mouseX - width / 2) * parallaxFactor;
        const py = star.y + (mouseY - height / 2) * parallaxFactor;

        ctx.fillStyle = '#FFFFFF';
        ctx.globalAlpha = star.alpha;

        ctx.beginPath();
        ctx.arc(px, py, star.size, 0, Math.PI * 2);
        ctx.fill();

        if (star.category === 'spike') {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 0.4;
          ctx.globalAlpha = star.alpha * 0.45;

          const spikeLength = star.size * 5;
          ctx.beginPath();
          ctx.moveTo(px - spikeLength, py);
          ctx.lineTo(px + spikeLength, py);
          ctx.moveTo(px, py - spikeLength);
          ctx.lineTo(px, py + spikeLength);
          ctx.stroke();
        }
      });

      // -------------------------------------------------------------
      // ATMOSPHERIC SHOOTING STAR RENDER (NATURAL VARIABLE RHYTHM)
      // -------------------------------------------------------------
      if (!currentShootingStar && now > nextSpawnTime) {
        spawnShootingStar();
        nextSpawnTime = now + getNextDelay();
      }

      if (currentShootingStar) {
        const s = currentShootingStar;
        s.progress++;
        s.x += s.dx;
        s.y += s.dy;

        const p = s.progress / s.totalFrames;

        if (p >= 1.0 || s.x < -200 || s.x > width + 200 || s.y > height * 0.50) {
          currentShootingStar = null;
        } else {
          let currentAlpha = 0;
          if (p < 0.20) {
            currentAlpha = (p / 0.20) * s.maxAlpha;
          } else if (p < 0.70) {
            currentAlpha = s.maxAlpha;
          } else {
            currentAlpha = (1 - (p - 0.70) / 0.30) * s.maxAlpha;
          }

          const tailX = s.x - (s.dx / Math.hypot(s.dx, s.dy)) * s.length;
          const tailY = s.y - (s.dy / Math.hypot(s.dx, s.dy)) * s.length;

          // Luminous meteor trail gradient
          const trailGrad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
          trailGrad.addColorStop(0, '#FFFFFF');
          trailGrad.addColorStop(0.25, 'rgba(255, 255, 255, 0.75)');
          trailGrad.addColorStop(0.60, 'rgba(200, 230, 255, 0.30)');
          trailGrad.addColorStop(1, 'transparent');

          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = s.lineWidth;
          ctx.globalAlpha = Math.max(currentAlpha, 0);
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Meteor core head glow
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#FFFFFF';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.lineWidth * 0.9, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${assetPath('/outer-space-background.jpg')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(0.48) contrast(1.08) saturate(0.82) hue-rotate(16deg)',
            opacity: 0.9
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 42%, rgba(34, 88, 160, 0.24), rgba(6, 18, 42, 0.20) 34%, rgba(0, 0, 0, 0.62) 72%, rgba(0, 0, 0, 0.92) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.54), rgba(0, 0, 0, 0.72) 58%, rgba(0, 0, 0, 0.82))
            `
          }}
        />
      </div>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
    </>
  );
}
