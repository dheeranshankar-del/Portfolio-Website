import React from 'react';

export default function AccelBars({ accel, timing }) {
  return (
    <div className="space-y-3">
      
      {/* Accelerometer Bar Meters */}
      <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
        <div className="text-[11px] font-mono text-zinc-400 mb-2 uppercase tracking-wide">
          ACCELEROMETER
        </div>

        {/* AX */}
        <div className="mb-2">
          <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
            <span>AX</span>
            <span className="text-white font-bold">{accel.ax > 0 ? `+${accel.ax.toFixed(2)}` : accel.ax.toFixed(2)}g</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${Math.min(Math.max(((accel.ax + 5) / 10) * 100, 5), 100)}%` }}
            />
          </div>
        </div>

        {/* AY */}
        <div className="mb-2">
          <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
            <span>AY</span>
            <span className="text-white font-bold">{accel.ay > 0 ? `+${accel.ay.toFixed(2)}` : accel.ay.toFixed(2)}g</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-150"
              style={{ width: `${Math.min(Math.max(((accel.ay + 5) / 10) * 100, 5), 100)}%` }}
            />
          </div>
        </div>

        {/* AZ */}
        <div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-300 mb-1">
            <span>AZ</span>
            <span className="text-white font-bold">{accel.az > 0 ? `+${accel.az.toFixed(2)}` : accel.az.toFixed(2)}g</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded overflow-hidden">
            <div
              className="h-full bg-zinc-300 transition-all duration-150 shadow-[0_0_10px_rgba(255,255,255,0.4)]"
              style={{ width: `${Math.min(Math.max((accel.az / 15) * 100, 5), 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Timing & Performance Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded p-3">
        <div className="text-[11px] font-mono text-zinc-400 mb-2 uppercase tracking-wide">
          TIMING & PERFORMANCE
        </div>
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex justify-between text-zinc-400">
            <span>PACKET RATE (HZ)</span>
            <span className="text-emerald-400 font-bold">{timing.packetRate.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>PACKET INTERVAL (MS)</span>
            <span className="text-zinc-200">{timing.packetInterval.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>PACKET JITTER (MS)</span>
            <span className="text-zinc-200">{timing.packetJitter.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>GUI FPS</span>
            <span className="text-white font-bold">{timing.fps.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>LAST PACKET AGE (MS)</span>
            <span className="text-zinc-200">{timing.lastAge.toFixed(1)}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>ESTIMATED DISPLAY DELAY (MS)</span>
            <span className="text-zinc-200">{timing.displayDelay.toFixed(1)}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
