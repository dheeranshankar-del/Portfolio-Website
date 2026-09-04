import React, { useEffect, useRef } from 'react';

function SingleRollingChart({ title, data, color, minVal, maxVal, unit }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = canvas.parentElement.clientWidth || 300);
    const height = (canvas.height = 70);

    ctx.clearRect(0, 0, width, height);

    // Dark background
    ctx.fillStyle = '#060608';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    if (!data || data.length < 2) return;

    // Draw curve
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const range = maxVal - minVal || 1;
    const step = width / (data.length - 1);

    data.forEach((val, idx) => {
      const x = idx * step;
      const normalized = (val - minVal) / range;
      const y = height - (normalized * (height - 12) + 6);

      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Fill gradient
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, color === '#FFFFFF' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(212, 212, 216, 0.15)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();

    // Overlay text
    const lastVal = data[data.length - 1];
    ctx.fillStyle = '#F4F4F5';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${lastVal > 0 ? '+' : ''}${lastVal.toFixed(2)}${unit}`, width - 6, 14);

  }, [data, color, minVal, maxVal, unit]);

  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded p-2 overflow-hidden">
      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400 mb-1 uppercase">
        <span>{title}</span>
        <span className="text-[9px] text-zinc-500">ROLLING 5 S</span>
      </div>
      <div className="w-full h-[70px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
    </div>
  );
}

export default function RollingGraphs({ history }) {
  return (
    <div className="space-y-2">
      <SingleRollingChart
        title="ROLL (°)"
        data={history.roll}
        color="#FFFFFF"
        minVal={-360}
        maxVal={360}
        unit="°"
      />
      <SingleRollingChart
        title="PITCH (°)"
        data={history.pitch}
        color="#E4E4E7"
        minVal={-45}
        maxVal={45}
        unit="°"
      />
      <SingleRollingChart
        title="YAW (°)"
        data={history.yaw}
        color="#A1A1AA"
        minVal={-30}
        maxVal={30}
        unit="°"
      />
      <SingleRollingChart
        title="AZ (m/s²)"
        data={history.az}
        color="#71717A"
        minVal={-20}
        maxVal={150}
        unit="m/s²"
      />
    </div>
  );
}
