import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function VideoLightboxModal({ src, initialTime, onClose, onSyncTime }) {
  const modalVideoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Sync initial playback time & manage body scroll lock + Escape key
  useEffect(() => {
    const video = modalVideoRef.current;
    if (video) {
      video.currentTime = initialTime || 0;
      video.play().catch(() => {});
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow || 'auto';
    };
  }, []);

  const handleClose = () => {
    const video = modalVideoRef.current;
    if (video && onSyncTime) {
      onSyncTime(video.currentTime);
    }
    onClose();
  };

  return createPortal(
    <div 
      onClick={handleClose}
      className="fixed inset-0 z-[9999] bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-pointer animate-fadeIn select-none"
    >
      {/* Top-Right Small Close X Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClose();
        }}
        className="absolute top-5 right-5 z-[10000] p-2.5 rounded-full bg-black/80 border border-white/20 text-white/80 hover:text-white hover:bg-black transition-colors cursor-pointer shadow-2xl"
        title="Close video (Esc)"
      >
        <X size={20} />
      </button>

      {/* Enlarged Centered Video Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center cursor-default group/modalvideo rounded-xl overflow-hidden shadow-2xl border border-white/10"
      >
        <video
          ref={modalVideoRef}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
        />

        {/* Minimal Custom Scrubber (Appears ONLY on Hovering the Enlarged Video) */}
        <div className={`absolute bottom-0 inset-x-0 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <ModalVideoScrubber videoRef={modalVideoRef} />
        </div>
      </div>
    </div>,
    document.body
  );
}

/* Sub-Component: Modal Custom Video Scrubber */
function ModalVideoScrubber({ videoRef }) {
  const scrubberRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration && !isNaN(video.duration)) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [videoRef]);

  const handleSeek = (e) => {
    const video = videoRef.current;
    const scrubber = scrubberRef.current;
    if (!video || !scrubber || !video.duration || isNaN(video.duration)) return;

    const rect = scrubber.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = offsetX / rect.width;
    
    video.currentTime = percentage * video.duration;
    setProgress(percentage * 100);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    handleSeek(e);

    const handleMouseMove = (moveEvent) => handleSeek(moveEvent);
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleMouseMove);
    window.addEventListener('touchend', handleMouseUp);
  };

  return (
    <div
      ref={scrubberRef}
      role="slider"
      aria-label="Video progress scrubber"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      tabIndex={0}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      className="w-full h-7 flex items-end cursor-pointer px-3 pb-2.5 select-none"
    >
      <div className="w-full h-1 hover:h-1.5 bg-white/20 rounded-full overflow-hidden relative transition-all duration-200">
        <div className="h-full bg-white rounded-full" style={{ width: `${progress}%` }} />
      </div>

      <div
        className={`absolute bottom-[7px] -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md transition-opacity duration-150 pointer-events-none ${
          isDragging ? 'opacity-100 scale-125' : 'opacity-100'
        }`}
        style={{ left: `calc(12px + (100% - 24px) * ${progress / 100})` }}
      />
    </div>
  );
}
