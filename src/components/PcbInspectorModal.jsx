import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function PcbInspectorModal({ image, alt, onClose }) {
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

  // Render modal into document.body using React Portal to isolate from section layout stacking
  return createPortal(
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-fadeIn select-none"
    >
      {/* Top-Right Small Close X Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-5 right-5 z-[10000] p-2.5 rounded-full bg-black/80 border border-white/20 text-white/80 hover:text-white hover:bg-black transition-colors cursor-pointer shadow-2xl"
        title="Close image (Esc)"
      >
        <X size={20} />
      </button>

      {/* Enlarged Centered Image Container (e.stopPropagation prevents closing when clicking directly on image) */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center cursor-default"
      >
        <img
          src={image}
          alt={alt || "Enlarged PCB Layout"}
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl shadow-2xl border border-white/10"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
      </div>
    </div>,
    document.body
  );
}
