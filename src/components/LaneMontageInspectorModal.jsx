import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Maximize2 } from 'lucide-react';

const colorGradeStyle = {
  filter: 'saturate(1.28) contrast(1.13) brightness(1.06) hue-rotate(-2deg)',
};

function ColorGradeOverlay() {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/[0.10] via-transparent to-black/[0.16] mix-blend-overlay" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_34px_rgba(255,255,255,0.08),inset_0_-28px_45px_rgba(0,0,0,0.22)]" />
    </>
  );
}

export default function LaneMontageInspectorModal({ images, title, onClose }) {
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'mask' | 'result' | 'assist'

  // Listen for Escape key and manage body scroll locking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    
    // Lock body scrolling while full-screen lightbox is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, [onClose]);

  const tabs = [
    { id: 'grid', label: 'All Stages (Montage)' },
    { id: 'mask', label: '1. Binary Lane Mask', src: images?.mask },
    { id: 'result', label: '2. Detected Lane Overlay', src: images?.result },
    { id: 'assist', label: '3. Lane Confidence + Offset', src: images?.assist }
  ];

  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/94 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8 cursor-pointer select-none"
    >
      {/* Top Header & Tab Controls */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-5xl flex items-center justify-between gap-4 z-[10000] cursor-default"
      >
        <div className="text-left space-y-0.5">
          <h3 className="text-white font-bold font-heading text-base sm:text-lg">
            {title || "Computer Vision-Based Lane Assist"}
          </h3>
          <p className="text-zinc-400 font-mono text-xs">
            Computer Vision Pipeline Inspection
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2.5 rounded-full bg-black/80 border border-white/20 text-white/80 hover:text-white hover:bg-black transition-colors cursor-pointer shadow-2xl"
          aria-label="Close inspector modal"
        >
          <X size={20} />
        </button>
      </div>

      {/* Tab Selector Pill Bar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="my-3 z-[10000] flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 shadow-xl cursor-default"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main High-Res Display Area */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl flex-1 flex items-center justify-center cursor-default min-h-0 py-2"
      >
        {activeTab === 'grid' ? (
          /* High-Res 3-Tile Montage View */
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-3 aspect-[16/10] md:aspect-[16/9] max-h-[75vh] p-2 bg-black rounded-2xl border border-zinc-800 shadow-2xl">
            {/* Left Tile (Mask) */}
            <div className="relative rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 group">
              <img
                src={images?.mask}
                alt="Binary Lane Mask"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#0A0A0C]/90 border border-white/20 text-white font-mono text-xs font-bold shadow-md backdrop-blur-md">
                Binary Lane Mask
              </div>
            </div>

            {/* Right Tiles Stack */}
            <div className="flex flex-col gap-3 h-full">
              <div className="relative flex-1 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <img
                  src={images?.result}
                  alt="Detected Lane Overlay"
                  className="w-full h-full object-cover"
                  style={colorGradeStyle}
                />
                <ColorGradeOverlay />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#0A0A0C]/90 border border-white/20 text-white font-mono text-xs font-bold shadow-md backdrop-blur-md">
                  Detected Lane Overlay
                </div>
              </div>

              <div className="relative flex-1 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950">
                <img
                  src={images?.assist}
                  alt="Lane Confidence + Offset"
                  className="w-full h-full object-cover"
                  style={colorGradeStyle}
                />
                <ColorGradeOverlay />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-[#0A0A0C]/90 border border-white/20 text-white font-mono text-xs font-bold shadow-md backdrop-blur-md">
                  Lane Confidence + Offset
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Single Stage High-Res Full View */
          <div className="relative max-w-[90vw] max-h-[75vh] flex items-center justify-center">
            <img
              src={tabs.find((t) => t.id === activeTab)?.src}
              alt={tabs.find((t) => t.id === activeTab)?.label}
              className="max-w-[90vw] max-h-[75vh] object-contain rounded-xl border border-zinc-800 shadow-2xl"
              style={activeTab === 'result' || activeTab === 'assist' ? colorGradeStyle : undefined}
            />
          </div>
        )}
      </div>

      {/* Footer Navigation Tip */}
      <div className="text-zinc-500 font-mono text-xs z-[10000]">
        Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Esc</kbd> or click outside to close
      </div>
    </div>,
    document.body
  );
}
