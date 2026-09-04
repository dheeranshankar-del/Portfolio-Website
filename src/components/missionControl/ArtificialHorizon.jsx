import React, { useEffect, useRef } from 'react';

export default function ArtificialHorizon({ roll = 0, pitch = 0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const size = 160;
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2 - 4;
    const cx = size / 2;
    const cy = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Save state for clipping circular instrument
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    // Rotate and translate horizon based on Roll & Pitch
    ctx.translate(cx, cy);
    ctx.rotate((roll * Math.PI) / 180);

    // Pitch translation: ~1.5 pixels per pitch degree
    const pitchOffset = pitch * 1.5;
    ctx.translate(0, pitchOffset);

    // Upper Sky Blue half
    ctx.fillStyle = '#1e3a8a'; // Deep aerospace blue sky
    ctx.fillRect(-size, -size * 2, size * 2, size * 2);

    // Lower Ground Earth Brown half
    ctx.fillStyle = '#78350f'; // Earth brown
    ctx.fillRect(-size, 0, size * 2, size * 2);

    // Horizon Center Line
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.stroke();

    // Pitch Ladder Lines (+10, +20, -10, -20)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';

    [-20, -10, 10, 20].forEach((p) => {
      const y = -p * 1.5;
      const w = Math.abs(p) === 20 ? 36 : 24;
      ctx.beginPath();
      ctx.moveTo(-w / 2, y);
      ctx.lineTo(w / 2, y);
      ctx.stroke();

      ctx.fillText(`${Math.abs(p)}°`, w / 2 + 10, y + 3);
    });

    ctx.restore();

    // Outer Ring Bezel
    ctx.strokeStyle = '#00F2FE';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Outer Roll Index Triangular pointer at top
    ctx.fillStyle = '#00F2FE';
    ctx.beginPath();
    ctx.moveTo(cx, cy - radius + 2);
    ctx.lineTo(cx - 5, cy - radius + 10);
    ctx.lineTo(cx + 5, cy - radius + 10);
    ctx.closePath();
    ctx.fill();

    // Fixed Reticle (Aircraft/Rocket wings in center)
    ctx.strokeStyle = '#FFD700'; // Gold reticle
    ctx.lineWidth = 3;

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();

    // Left wing reticle
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy);
    ctx.lineTo(cx - 10, cy);
    ctx.lineTo(cx - 10, cy + 6);
    ctx.stroke();

    // Right wing reticle
    ctx.beginPath();
    ctx.moveTo(cx + 30, cy);
    ctx.lineTo(cx + 10, cy);
    ctx.lineTo(cx + 10, cy + 6);
    ctx.stroke();

  }, [roll, pitch]);

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-950/60 rounded-lg border border-slate-800">
      <div className="text-[10px] font-mono text-slate-400 mb-2 uppercase tracking-wider">
        ARTIFICIAL HORIZON (PFD)
      </div>
      <canvas ref={canvasRef} className="rounded-full shadow-[0_0_20px_rgba(0,242,254,0.2)]" />
      <div className="mt-2 text-xs font-mono text-cyan-300">
        P: {pitch > 0 ? `+${pitch.toFixed(1)}` : pitch.toFixed(1)}° | R: {roll > 0 ? `+${roll.toFixed(1)}` : roll.toFixed(1)}°
      </div>
    </div>
  );
}
