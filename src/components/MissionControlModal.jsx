import React, { useState, useEffect } from 'react';
import { X, Radio, Terminal, Cpu, Layers, Activity, Server, ShieldCheck, Zap } from 'lucide-react';
import Rocket3DCanvas from './missionControl/Rocket3DCanvas';
import ArtificialHorizon from './missionControl/ArtificialHorizon';
import RollingGraphs from './missionControl/RollingGraphs';
import AccelBars from './missionControl/AccelBars';

export default function MissionControlModal({ onClose }) {
  const [activeTab, setActiveTab] = useState('casestudy'); // 'casestudy' | 'dashboard'
  const [metSeconds, setMetSeconds] = useState(60);

  const [telemetry, setTelemetry] = useState({
    roll: 310.44,
    pitch: 4.31,
    yaw: 0.62,
    ax: 0.76,
    ay: -0.16,
    az: 10.06,
    altitude: 3420.5,
    velocity: 142.8,
    flightState: "POWERED FLIGHT",
    gpsStatus: "3D LOCK (14 SAT)",
    totalPackets: 9686,
    packetRate: 100.0,
    signalQuality: "EXCELLENT"
  });

  const [history, setHistory] = useState({
    roll: Array(50).fill(310.44),
    pitch: Array(50).fill(4.31),
    yaw: Array(50).fill(0.62),
    az: Array(50).fill(98.7)
  });

  const [timing, setTiming] = useState({
    packetRate: 100.0,
    packetInterval: 9.21,
    packetJitter: 2.86,
    fps: 60.0,
    lastAge: 1.1,
    displayDelay: 1.2
  });

  const [logConsole, setLogConsole] = useState([
    "[00:00:58.210] [UDP_RX] PKT_ID: 9682 | ROLL: 309.8° PITCH: 4.2° | BATT: 12.6V | NOMINAL",
    "[00:00:58.820] [UDP_RX] PKT_ID: 9683 | ROLL: 310.1° PITCH: 4.3° | BATT: 12.6V | NOMINAL",
    "[00:00:59.410] [UDP_RX] PKT_ID: 9684 | ROLL: 310.3° PITCH: 4.3° | BATT: 12.6V | NOMINAL",
    "[00:01:00.000] [UDP_RX] PKT_ID: 9686 | ROLL: 310.4° PITCH: 4.3° | BATT: 12.6V | NOMINAL"
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setMetSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMet = (sec) => {
    const hrs = String(Math.floor(sec / 3600)).padStart(2, '0');
    const mins = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `T+${hrs}:${mins}:${s}`;
  };

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += 0.05;

      const newRoll = (310.44 + Math.sin(t * 1.2) * 12 + Math.cos(t * 0.5) * 8) % 360;
      const newPitch = 4.31 + Math.sin(t * 0.8) * 3 + Math.cos(t * 1.5) * 1.5;
      const newYaw = 0.62 + Math.sin(t * 0.6) * 1.8;
      const newAx = 0.76 + (Math.random() - 0.5) * 0.1;
      const newAy = -0.16 + (Math.random() - 0.5) * 0.08;
      const newAz = 10.06 + Math.sin(t * 2) * 1.2;
      const newAlt = 3420.5 + t * 4.2;
      const newVel = 142.8 + Math.sin(t) * 1.5;

      setTelemetry((prev) => ({
        ...prev,
        roll: newRoll,
        pitch: newPitch,
        yaw: newYaw,
        ax: newAx,
        ay: newAy,
        az: newAz,
        altitude: newAlt,
        velocity: newVel,
        totalPackets: prev.totalPackets + 1
      }));

      setHistory((prev) => ({
        roll: [...prev.roll.slice(1), newRoll],
        pitch: [...prev.pitch.slice(1), newPitch],
        yaw: [...prev.yaw.slice(1), newYaw],
        az: [...prev.az.slice(1), newAz * 9.81]
      }));

      setTiming((prev) => ({
        ...prev,
        packetInterval: 9.1 + (Math.random() - 0.5) * 0.3,
        fps: 60.0 + (Math.random() - 0.5) * 0.5
      }));

      if (Math.floor(t * 20) % 15 === 0) {
        const timeStamp = new Date().toISOString().substring(11, 23);
        const logLine = `[${timeStamp}] [UDP_RX] PKT_ID: ${Math.floor(9686 + t * 10)} | ROLL: ${newRoll.toFixed(1)}° PITCH: ${newPitch.toFixed(1)}° | BATT: 12.6V | NOMINAL`;
        setLogConsole((prevLogs) => [...prevLogs.slice(-6), logLine]);
      }

    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-2xl overflow-y-auto">
      
      <div className="w-full max-w-6xl h-[92vh] bg-[#09090C] border border-white/10 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden text-zinc-200">
        
        {/* Header Bar */}
        <div className="bg-[#050507] border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-white">
                REAL-TIME ROCKET TELEMETRY GROUND STATION
              </div>
              <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 mt-0.5">
                <img
                  src="/arbalest-logo.png"
                  alt="Arbalest Rocketry Logo"
                  className="h-[14px] w-auto inline-block opacity-75 select-none"
                />
                <span>Arbalest Rocketry Club · DAQ & Telemetry System</span>
              </div>
            </div>
          </div>

          {/* MET Clock */}
          <div className="hidden md:flex items-center gap-6 font-mono text-xs">
            <div className="bg-zinc-900 border border-zinc-700 px-3 py-1 rounded text-white font-bold tracking-wider">
              MET {formatMet(metSeconds)}
            </div>
            <div className="flex items-center gap-2 text-zinc-300">
              <Radio size={14} className="animate-pulse text-emerald-400" />
              <span className="text-[11px]">UDP LINK [100.0 PKT/S]</span>
            </div>
          </div>

          {/* Modal Navigation Tabs & Close */}
          <div className="flex items-center gap-3">
            <div className="flex bg-zinc-900 rounded p-0.5 border border-zinc-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab('casestudy')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'casestudy' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Project Case Study
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1 rounded transition-colors ${
                  activeTab === 'dashboard' ? 'bg-white text-zinc-950 font-bold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Live Interactive Dashboard
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors border border-zinc-800"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        {activeTab === 'casestudy' ? (
          <div className="flex-1 p-6 overflow-y-auto space-y-10 max-w-4xl mx-auto">
            
            {/* Title & Technical Summary Header */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-white/50 uppercase tracking-widest">
                TECHNICAL CASE STUDY & DEEP DIVE
              </div>
              <h2 className="text-3xl font-extrabold text-white font-heading tracking-tight">
                Real-Time Rocket Telemetry Ground Station
              </h2>
              <p className="text-zinc-300 text-sm leading-relaxed">
                A real-time telemetry system that streams IMU data over UDP and visualizes rocket orientation, acceleration, flight data, and system health through a custom-built Python ground station interface.
              </p>
            </div>

            {/* Video Showcase Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-white/80 uppercase tracking-wider font-semibold">
                1. High-Resolution Software Dashboard Capture
              </h3>
              <div className="rounded-xl overflow-hidden bg-black border border-white/10 aspect-video shadow-2xl">
                <video
                  src="/projects/ground-station-demo.mp4"
                  poster="/projects/rocket-ground-station.png"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Full-screen recording showing real-time 100Hz IMU sensor fusion, artificial horizon PFD, rolling telemetry graphs, and 3D rocket orientation rendering.
              </p>
            </div>

            {/* Physical Hardware Setup Video Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-mono text-white/80 uppercase tracking-wider font-semibold">
                2. Physical Test-Bench & IMU Hardware Setup
              </h3>
              <div className="flex justify-center bg-black/80 p-4 rounded-xl border border-white/10">
                <div className="max-w-[240px] aspect-[9/16] rounded-lg overflow-hidden border border-white/10 bg-black">
                  <video
                    src="/projects/hardware-demo.mov"
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <p className="text-xs text-zinc-400 font-mono text-center">
                Live hardware demonstration — physical IMU movement immediately updates orientation in the ground station UI over UDP.
              </p>
            </div>

            {/* Architecture Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 border border-zinc-800 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                  <Server size={18} className="text-white" />
                  <span>UDP Communication Flow</span>
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Streams binary packed UDP packets at 100 Hz. Packet payload contains CRC-16 checksums, sequence counters, Euler angles (roll, pitch, yaw), accelerometer vectors, and system health status.
                </p>
              </div>

              <div className="glass-panel p-5 border border-zinc-800 space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2 font-heading">
                  <Zap size={18} className="text-white" />
                  <span>Performance Metrics</span>
                </h4>
                <ul className="text-xs text-zinc-300 space-y-1.5 font-mono">
                  <li>• Data Rate: <span className="text-emerald-400 font-bold">100.0 pkt/s</span></li>
                  <li>• End-to-End Latency: <span className="text-white font-bold">&lt; 1.2 ms</span></li>
                  <li>• Rendering Framerate: <span className="text-white font-bold">60.0 FPS</span></li>
                  <li>• Packet Loss: <span className="text-emerald-400 font-bold">0.00%</span></li>
                </ul>
              </div>
            </div>

          </div>
        ) : (
          /* Live Interactive Dashboard Tab */
          <div className="flex-1 p-3 grid grid-cols-1 lg:grid-cols-12 gap-3 overflow-y-auto bg-[#050507]">
            
            {/* LEFT COLUMN: Attitude Readouts + Artificial Horizon + Link Metrics (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              
              {/* ATTITUDE Readouts */}
              <div className="bg-zinc-950 border border-zinc-800 rounded p-3 space-y-2">
                <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wide">
                  ATTITUDE (IMU SENSOR FUSION)
                </div>

                {/* ROLL */}
                <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800">
                  <div className="text-[9px] font-mono text-zinc-400">ROLL</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {telemetry.roll > 0 ? `+${telemetry.roll.toFixed(2)}` : telemetry.roll.toFixed(2)}°
                  </div>
                </div>

                {/* PITCH */}
                <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800">
                  <div className="text-[9px] font-mono text-zinc-400">PITCH</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {telemetry.pitch > 0 ? `+${telemetry.pitch.toFixed(2)}` : telemetry.pitch.toFixed(2)}°
                  </div>
                </div>

                {/* YAW */}
                <div className="bg-zinc-900/60 p-2 rounded border border-zinc-800">
                  <div className="text-[9px] font-mono text-zinc-400">YAW</div>
                  <div className="text-xl font-mono font-bold text-white">
                    {telemetry.yaw > 0 ? `+${telemetry.yaw.toFixed(2)}` : telemetry.yaw.toFixed(2)}°
                  </div>
                </div>
              </div>

              {/* ARTIFICIAL HORIZON */}
              <ArtificialHorizon roll={telemetry.roll} pitch={telemetry.pitch} />

              {/* LINK METRICS */}
              <div className="bg-zinc-950 border border-zinc-800 rounded p-3 text-xs font-mono space-y-2">
                <div className="text-[11px] text-zinc-400 uppercase">LINK METRICS</div>
                <div className="flex justify-between text-zinc-300">
                  <span>PKT RATE:</span>
                  <span className="text-white font-bold">{telemetry.packetRate.toFixed(1)} pkt/s</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>TOTAL PKT:</span>
                  <span className="text-zinc-100 font-bold">{telemetry.totalPackets}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>SIGNAL:</span>
                  <span className="text-emerald-400 font-bold">{telemetry.signalQuality}</span>
                </div>
              </div>

            </div>

            {/* CENTER COLUMN: 3D Rocket Viewport + Status Bar (6 cols) */}
            <div className="lg:col-span-6 flex flex-col space-y-3">
              
              {/* 3D Rocket Viewport */}
              <div className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative min-h-[360px]">
                <Rocket3DCanvas telemetry={telemetry} />
              </div>

              {/* Telemetry Status Bar */}
              <div className="bg-zinc-950 border border-zinc-800 rounded p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-zinc-500">ALTITUDE</div>
                  <div className="text-sm font-bold text-white">{telemetry.altitude.toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">VELOCITY</div>
                  <div className="text-sm font-bold text-white">{telemetry.velocity.toFixed(1)} m/s</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">FLIGHT STATE</div>
                  <div className="text-xs font-bold text-emerald-400">{telemetry.flightState}</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">GPS STATUS</div>
                  <div className="text-xs font-bold text-zinc-200">{telemetry.gpsStatus}</div>
                </div>
              </div>

              {/* Packet Log Console */}
              <div className="bg-zinc-950 border border-zinc-800 rounded p-2.5 font-mono text-[10px] space-y-1">
                <div className="flex items-center gap-2 text-zinc-400 border-b border-zinc-800 pb-1 mb-1">
                  <Terminal size={12} className="text-white" />
                  <span>LIVE UDP TELEMETRY STREAM LOG</span>
                </div>
                <div className="space-y-0.5 max-h-24 overflow-y-auto">
                  {logConsole.map((log, idx) => (
                    <div key={idx} className="text-zinc-400 hover:text-white">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Accelerometer + Rolling Graphs (3 cols) */}
            <div className="lg:col-span-3 space-y-3">
              <AccelBars accel={{ ax: telemetry.ax, ay: telemetry.ay, az: telemetry.az }} timing={timing} />
              <RollingGraphs history={history} />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
