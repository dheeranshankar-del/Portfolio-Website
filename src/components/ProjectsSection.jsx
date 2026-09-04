import React, { useEffect, useRef, useState } from 'react';
import { projectsData } from '../data/portfolioData';
import PcbInspectorModal from './PcbInspectorModal';
import LaneMontageInspectorModal from './LaneMontageInspectorModal';
import { Maximize2, ExternalLink } from 'lucide-react';
import { assetPath } from '../utils/assetPath';

export default function ProjectsSection({ onSelectProject }) {
  return (
    <div className="w-full space-y-24">
      {projectsData.map((project) => (
        <EditorialProjectSection 
          key={project.id} 
          project={project} 
        />
      ))}
    </div>
  );
}

function EditorialProjectSection({ project }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [videoHover, setVideoHover] = useState(false);
  const [pcbAutoHighlight, setPcbAutoHighlight] = useState(false);

  const handleTypewriterComplete = () => {
    setPcbAutoHighlight(true);
    setTimeout(() => {
      setPcbAutoHighlight(false);
    }, 2500);
  };

  const isAlternate = project.layout === 'alternate';
  const isRover = project.layout === 'rover-card';
  const isMontage = project.layout === 'montage-card';

  // Section Observer: Play entrance animation ONLY ONCE per page load; remain permanently visible afterwards
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const section = sectionRef.current;
    const video = videoRef.current;

    if (!section) return;

    if (prefersReducedMotion) {
      setIsVisible(true);
      if (video) video.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (video) video.play().catch(() => {});
            // Disconnect immediately after playing once so entrance animation NEVER replays or resets during session
            observer.disconnect();
          }
        });
      },
      { 
        threshold: project.highlights ? 0.45 : 0.15,
        rootMargin: project.highlights ? "-5% 0px -10% 0px" : "0px"
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`project-section relative z-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <div className="project-content">
        {isMontage ? (
          /* Project 04: Computer Vision-Based Lane Assist 3-Image Montage Card Layout (Montage LEFT, Text RIGHT) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Column (45% Montage Card on Desktop) */}
            <div className="md:col-span-5 order-1 md:order-1 project-media">
              <InteractiveMontageCard 
                images={project.images} 
                title={project.title} 
              />
            </div>

            {/* Right Column (55% Text Content on Desktop) */}
            <div className="md:col-span-7 order-2 md:order-2 space-y-4 text-left">
              {/* Project Meta */}
              <div className="project-meta font-mono text-xs sm:text-sm text-white/50">
                <span className="font-bold text-white/80">{project.number}</span>
                <span className="mx-2 text-white/30">·</span>
                <span className="text-white/75 font-semibold">{project.org}</span>
                {project.category && (
                  <>
                    <span className="mx-2 text-white/30">·</span>
                    <span>{project.category}</span>
                  </>
                )}
              </div>

              {/* Project Title */}
              <h2 className="project-title text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                {project.title}
              </h2>

              {/* Project Description */}
              <p className="project-description text-base sm:text-lg text-white/75 leading-relaxed font-normal">
                {project.shortDesc}
              </p>

              {/* Project Tech Tags */}
              <div className="project-tags flex flex-wrap gap-2 pt-2">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.10] text-xs font-mono text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : isRover ? (
          /* Project 03: Autonomous Rover with Sensor Fusion Hardware Showcase (Text LEFT, Image RIGHT) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Column (55% Text Content on Desktop) */}
            <div className="md:col-span-7 order-2 md:order-1 space-y-4 text-left">
              {/* Project Meta */}
              <div className="project-meta font-mono text-xs sm:text-sm text-white/50">
                <span className="font-bold text-white/80">{project.number}</span>
                <span className="mx-2 text-white/30">·</span>
                <span className="text-white/75 font-semibold">{project.org}</span>
                <span className="mx-2 text-white/30">·</span>
                <span>{project.category}</span>
              </div>

              {/* Project Title */}
              <h2 className="project-title text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                {project.title}
              </h2>

              {/* Project Description */}
              <p className="project-description text-base sm:text-lg text-white/75 leading-relaxed font-normal">
                {project.shortDesc}
              </p>

              {/* Project Tech Tags */}
              <div className="project-tags flex flex-wrap gap-2 pt-2">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.10] text-xs font-mono text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Column (45% Hardware Image Card with Cool Monochrome Silver SVG Callout Lines) */}
            <div className="md:col-span-5 order-1 md:order-2 project-media">
              <InteractiveRoverCard 
                image={project.image} 
                title={project.title} 
              />
            </div>
          </div>
        ) : isAlternate ? (
          /* Project 02: STM32 Development Board Layout (Image LEFT, Text RIGHT) */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Left Column (45% Stationary PCB Image Card) */}
            <div className="md:col-span-5 order-1 md:order-1 project-media">
              <InteractivePcbCard 
                image={project.image} 
                title={project.title} 
                isAutoHighlighted={pcbAutoHighlight}
              />
            </div>

            {/* Right Column (55% Text Content on Desktop) */}
            <div className="md:col-span-7 order-2 md:order-2 space-y-4 text-left">
              <div className="project-meta font-mono text-xs sm:text-sm text-white/50">
                <span className="font-bold text-white/80">{project.number}</span>
                <span className="mx-2 text-white/30">·</span>
                <span className="text-white/75 font-semibold">{project.org}</span>
                {project.category && (
                  <>
                    <span className="mx-2 text-white/30">·</span>
                    <span>{project.category}</span>
                  </>
                )}
              </div>

              <h2 className="project-title text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
                {project.title}
              </h2>

              {project.highlights ? (
                <TypewriterHighlights 
                  highlights={project.highlights} 
                  isVisible={isVisible} 
                  onComplete={handleTypewriterComplete}
                />
              ) : (
                <p className="project-description text-base sm:text-lg text-white/75 leading-relaxed font-normal">
                  {project.shortDesc}
                </p>
              )}

              <div className="project-tags flex flex-wrap items-center gap-2 pt-2">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md bg-white/[0.05] border border-white/[0.10] text-xs font-mono text-white/80"
                  >
                    {t}
                  </span>
                ))}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.08] hover:bg-white/[0.16] border border-white/[0.18] text-white hover:text-cyan-300 text-xs font-mono font-semibold transition-all ml-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={12} className="opacity-80" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Project 01: Clean Centered Editorial Layout with Demo Video */
          <div>
            <div className="space-y-4 text-left">
              <div className="project-meta font-mono text-xs sm:text-sm text-white/50 flex items-center flex-wrap gap-x-2 gap-y-1">
                {project.id === 'arbalest-telemetry' && (
                  <img
                    src={assetPath("/arbalest-logo.png")}
                    alt="Arbalest Rocketry Logo"
                    className="h-[18px] sm:h-[22px] w-auto inline-block opacity-80 select-none pointer-events-none mr-1"
                  />
                )}
                <span className="font-bold text-white/80">{project.number}</span>
                <span className="text-white/30">·</span>
                <span className="text-white/75 font-semibold">{project.org}</span>
                {project.category && (
                  <>
                    <span className="text-white/30">·</span>
                    <span>{project.category}</span>
                  </>
                )}
              </div>

              <h2 className="project-title text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight inline-block">
                {project.title}
              </h2>

              <p className="project-description text-base sm:text-lg text-white/75 leading-relaxed font-normal">
                {project.shortDesc}
              </p>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center mt-6 sm:mt-8 project-media max-w-5xl mx-auto">
              {/* Left Column (5 Cols on Desktop): Apple-Style Storytelling Narrative */}
              <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
                <TelemetryAppleStoryline isVisible={isVisible} />
              </div>

              {/* Right Column (7 Cols on Desktop): Larger Vertical Demo Video */}
              <div className="lg:col-span-7 flex justify-center lg:justify-start items-center order-1 lg:order-2 lg:pl-4">
                <div 
                  onMouseEnter={() => setVideoHover(true)}
                  onMouseLeave={() => setVideoHover(false)}
                  className="project-video-wrap relative group cursor-default"
                >
                  <video
                    ref={videoRef}
                    src={project.hardwareVideo}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                  
                  <div className={`transition-opacity duration-200 ${videoHover ? 'opacity-100' : 'opacity-0'}`}>
                    <VideoScrubber videoRef={videoRef} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* Sub-Component: Apple-Style Typewriter Highlights for Project 02 */
function TypewriterHighlights({ highlights, isVisible, onComplete }) {
  const [activeRow, setActiveRow] = useState(0);
  const [labelCharCount, setLabelCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isVisible || isFinished) return;

    if (activeRow >= highlights.length) {
      setIsFinished(true);
      if (onComplete) onComplete();
      return;
    }

    const currentItem = highlights[activeRow];

    // Phase 1: Type out Label
    if (labelCharCount < currentItem.label.length) {
      const timer = setTimeout(() => {
        setLabelCharCount((prev) => prev + 1);
      }, 20);
      return () => clearTimeout(timer);
    }

    // Phase 2: Type out Description
    if (descCharCount < currentItem.desc.length) {
      const timer = setTimeout(() => {
        setDescCharCount((prev) => prev + 1);
      }, 14);
      return () => clearTimeout(timer);
    }

    // Phase 3: Pause briefly before next row
    const pauseTimer = setTimeout(() => {
      setActiveRow((prev) => prev + 1);
      setLabelCharCount(0);
      setDescCharCount(0);
    }, 120);

    return () => clearTimeout(pauseTimer);
  }, [isVisible, activeRow, labelCharCount, descCharCount, isFinished, highlights, onComplete]);

  return (
    <div className="space-y-2.5 py-1">
      {highlights.map((item, i) => {
        const isPast = isFinished || i < activeRow;
        const isCurrent = !isFinished && i === activeRow;

        const displayedLabel = isPast
          ? item.label
          : isCurrent
          ? item.label.slice(0, labelCharCount)
          : "";

        const isLabelTyping = isCurrent && labelCharCount < item.label.length;

        const displayedDesc = isPast
          ? item.desc
          : isCurrent && labelCharCount >= item.label.length
          ? item.desc.slice(0, descCharCount)
          : "";

        const isDescTyping = isCurrent && labelCharCount >= item.label.length && descCharCount < item.desc.length;

        return (
          <div key={i} className="grid grid-cols-[105px_16px_1fr] sm:grid-cols-[118px_20px_1fr] items-center min-h-[26px]">
            {/* Feature Label */}
            <span className="font-mono text-xs font-bold text-white/90 tracking-wider uppercase flex items-center">
              {displayedLabel}
              {isLabelTyping && (
                <span className="inline-block w-[2px] h-[13px] bg-white/90 ml-0.5 animate-pulse" />
              )}
            </span>

            {/* Vertical Divider */}
            <span className={`text-xs font-mono select-none transition-opacity duration-300 ${
              isPast || (isCurrent && labelCharCount >= item.label.length)
                ? 'text-white/25 opacity-100'
                : 'opacity-0'
            }`}>
              │
            </span>

            {/* Description */}
            <span className="text-white/80 font-sans font-normal text-sm sm:text-base flex items-center">
              {displayedDesc}
              {isDescTyping && (
                <span className="inline-block w-[2px] h-[15px] bg-white/90 ml-0.5 animate-pulse" />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Sub-Component: Apple-Style Storytelling Telemetry Flow */
function TelemetryAppleStoryline({ isVisible }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      title: "IMU sensing",
      spec: "BNO055 · 100 Hz",
      desc: "Captures orientation and acceleration"
    },
    {
      title: "Data acquisition",
      spec: "Arduino · C/C++",
      desc: "Processes and packages sensor data"
    },
    {
      title: "UDP transport",
      spec: "Low-latency networking",
      desc: "Streams telemetry to the ground station"
    },
    {
      title: "Ground station",
      spec: "Python · PyQt6",
      desc: "Visualizes live orientation and system data"
    }
  ];

  // Auto-cycle active highlight smoothly every 2.8s once visible
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  return (
    <div className="py-2 space-y-5 sm:space-y-6">
      <h3 className="text-xl sm:text-2xl font-semibold font-heading text-white tracking-tight">
        How it works
      </h3>

      <div className="relative pl-6 border-l border-white/10 space-y-6 sm:space-y-7">
        {steps.map((step, idx) => {
          const isActive = activeIndex === idx;

          return (
            <div
              key={step.title}
              onClick={() => setActiveIndex(idx)}
              style={{ transitionDelay: `${idx * 150}ms` }}
              className={`relative cursor-pointer group transition-all duration-500 transform ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-2'
              }`}
            >
              {/* Active Step White Indicator Bar */}
              <div 
                className={`absolute -left-[25px] top-0 bottom-0 w-[2px] bg-white transition-all duration-500 ${
                  isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                }`}
              />

              <div className={`transition-all duration-500 space-y-1 ${
                isActive ? 'opacity-100 translate-x-1' : 'opacity-50 hover:opacity-85'
              }`}>
                <h4 className="text-lg sm:text-xl font-semibold font-heading text-white tracking-tight">
                  {step.title}
                </h4>
                <div className="text-xs sm:text-sm font-mono text-cyan-300/90 font-medium">
                  {step.spec}
                </div>
                <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Sub-Component: Minimal Custom Video Scrubber Bar */
function VideoScrubber({ videoRef }) {
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
    e.stopPropagation();
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
    e.stopPropagation();
    setIsDragging(true);
    handleSeek(e);

    const handleMouseMove = (moveEvent) => {
      moveEvent.stopPropagation();
      handleSeek(moveEvent);
    };

    const handleMouseUp = (upEvent) => {
      upEvent.stopPropagation();
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

  const handleKeyDown = (e) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video || !video.duration || isNaN(video.duration)) return;

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 2);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      video.currentTime = Math.min(video.duration, video.currentTime + 2);
    }
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
      onKeyDown={handleKeyDown}
      className="absolute bottom-0 inset-x-0 h-6 flex items-end cursor-pointer z-30 group/scrubber px-3 pb-2.5 outline-none select-none"
      title="Click or drag to seek video"
    >
      <div className="w-full h-1 group-hover/scrubber:h-1.5 bg-white/20 rounded-full overflow-hidden relative transition-all duration-200">
        <div
          className="h-full bg-white rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        className={`absolute bottom-[7px] -translate-x-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md transition-opacity duration-150 pointer-events-none ${
          isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover/scrubber:opacity-100'
        }`}
        style={{ left: `calc(12px + (100% - 24px) * ${progress / 100})` }}
      />
    </div>
  );
}

/* Sub-Component: 100% Stationary PCB Engineering Card (Project 02) */
function InteractivePcbCard({ image, title, isAutoHighlighted }) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isDirectlyHovered, setIsDirectlyHovered] = useState(false);

  const showLabels = isDirectlyHovered || isAutoHighlighted;

  return (
    <>
      <div
        onMouseEnter={() => setIsDirectlyHovered(true)}
        onMouseLeave={() => setIsDirectlyHovered(false)}
        onClick={() => setIsInspectorOpen(true)}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl cursor-pointer"
        aria-label={`${title} hardware inspection card`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover block"
        />

        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-30 ${showLabels ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-[34%] left-[16%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>U1 · STM32 MCU</span>
          </div>

          <div className="absolute top-[26%] left-[52%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>U2 · 3.3V Regulator</span>
          </div>

          <div className="absolute top-[50%] left-[72%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>J1 · USB</span>
          </div>

          <div className="absolute top-[6%] left-[22%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>J2 · GPIO Header</span>
          </div>

          <div className="absolute top-[6%] left-[52%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>J3 · GPIO Header</span>
          </div>

          <div className="absolute top-[82%] left-[20%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            <span>J4 · GPIO Header</span>
          </div>

          <div className="absolute top-[82%] left-[52%] flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0A0A0C] border border-zinc-700 text-white font-mono text-[11px] font-bold shadow-2xl">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>SW1 · User Button</span>
          </div>
        </div>
      </div>

      {isInspectorOpen && (
        <PcbInspectorModal
          image={image}
          alt={title}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}
    </>
  );
}

/* Sub-Component: Cool Monochrome Soft White/Silver Aerospace Interactive Rover Card (Project 03) */
function InteractiveRoverCard({ image, title }) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isDirectlyHovered, setIsDirectlyHovered] = useState(false);

  const callouts = [
    {
      id: "arduino",
      label: "Arduino Uno",
      lines: ["Arduino Uno"],
      labelPos: { x: 15, y: 22 },
      lineStart: { x: 25, y: 24 },
      target: { x: 43, y: 36 }
    },
    {
      id: "esp32",
      label: "ESP32-C3",
      lines: ["ESP32-C3"],
      labelPos: { x: 12, y: 46 },
      lineStart: { x: 21, y: 48 },
      target: { x: 36, y: 49 }
    },
    {
      id: "ultrasonic",
      label: "Ultrasonic sensor",
      lines: ["Ultrasonic sensor"],
      labelPos: { x: 12, y: 77 },
      lineStart: { x: 26, y: 77 },
      target: { x: 33, y: 64 }
    },
    {
      id: "motors",
      label: "Motor controllers",
      lines: ["Motor controllers"],
      labelPos: { x: 62, y: 81 },
      lineStart: { x: 62, y: 81 },
      target: { x: 48, y: 70 }
    },
    {
      id: "battery",
      label: "2x Li-ion cells / 3700 mAh",
      lines: ["2x Li-ion cells", "3700 mAh"],
      labelPos: { x: 63, y: 6 },
      lineStart: { x: 63, y: 12 },
      target: { x: 55, y: 31 }
    }
  ];

  return (
    <>
      <div
        tabIndex={0}
        aria-label="Autonomous Rover hardware build showing Arduino Uno, ESP32-C3, Ultrasonic sensor, Motor controllers, and 2x Li-ion cells 3700 mAh. Click to inspect full screen image."
        onMouseEnter={() => setIsDirectlyHovered(true)}
        onMouseLeave={() => setIsDirectlyHovered(false)}
        onFocus={() => setIsDirectlyHovered(true)}
        onBlur={() => setIsDirectlyHovered(false)}
        onClick={() => setIsInspectorOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsInspectorOpen(true);
          }
        }}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <img
          src={image}
          alt="Autonomous Rover with Sensor Fusion hardware build"
          className="w-full h-full object-cover block transition-all duration-300 group-hover:brightness-105"
        />

        <div className="sr-only">
          <h3>Labeled Rover Hardware Subsystems:</h3>
          <ul>
            {callouts.map((c) => (
              <li key={c.id}>{c.label}</li>
            ))}
          </ul>
        </div>

        <div className={`absolute inset-0 transition-opacity duration-300 ease-out z-30 ${
          isDirectlyHovered ? 'opacity-100' : 'opacity-100 sm:opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
        }`}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-hidden">
            {callouts.map((c) => (
              <line
                key={`line-${c.id}`}
                x1={`${c.lineStart.x}%`}
                y1={`${c.lineStart.y}%`}
                x2={`${c.target.x}%`}
                y2={`${c.target.y}%`}
                stroke="rgba(245, 247, 250, 0.85)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.9"
                style={{ filter: "drop-shadow(0 0 3px rgba(255, 255, 255, 0.4))" }}
              />
            ))}
          </svg>

          {callouts.map((c) => (
            <React.Fragment key={c.id}>
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#F5F7FA] border border-white/80 shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse z-30 pointer-events-none"
                style={{ top: `${c.target.y}%`, left: `${c.target.x}%` }}
              />

              <div
                className="absolute px-2.5 py-1 rounded-md bg-[#0A0A0C]/90 border border-white/20 text-white font-mono text-[9px] sm:text-[10px] md:text-[11px] font-bold shadow-[0_10px_25px_rgba(0,0,0,0.85)] backdrop-blur-md z-30 pointer-events-none whitespace-nowrap flex items-center gap-1.5 transition-all duration-300"
                style={{ top: `${c.labelPos.y}%`, left: `${c.labelPos.x}%` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#F5F7FA] animate-pulse flex-shrink-0" />
                <div className="leading-tight text-left">
                  {c.lines.map((line, lIdx) => (
                    <div key={lIdx} className={lIdx === 0 ? "text-white font-bold" : "text-zinc-400 font-normal text-[9px]"}>
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {isInspectorOpen && (
        <PcbInspectorModal
          image={image}
          alt={title}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}
    </>
  );
}

/* Sub-Component Tile with base crisp image */
function ChromaticTile({ src, alt, label, isHovered, className = '' }) {
  return (
    <div className={`relative h-full rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-950 group/tile ${className}`}>
      {/* 1. Base Original Crisp Image (Visible at all times as robust fallback) */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover block transition-all duration-300 group-hover/tile:scale-[1.01]"
      />

      {/* Small Translucent Label Chip */}
      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#0A0A0C]/90 border border-white/20 text-white font-mono text-[9px] sm:text-[10px] font-bold shadow-md backdrop-blur-md z-10">
        {label}
      </div>
    </div>
  );
}

/* Sub-Component: 3-Image Montage Card Layout for Computer Vision Lane Assist (Project 04) */
function InteractiveMontageCard({ images, title }) {
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const cardRef = useRef(null);
  const motionVideoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const hasMotionVideo = Boolean(images?.motion || images?.motionWebm);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(media.matches);

    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);

    return () => {
      media.removeEventListener('change', updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const video = motionVideoRef.current;
    if (!video || !hasMotionVideo || prefersReducedMotion) return;

    if (isInView) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hasMotionVideo, isInView, prefersReducedMotion]);

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
      <div
        ref={cardRef}
        tabIndex={0}
        aria-label="Computer Vision-Based Lane Assist 3-image montage showing Binary Lane Mask, Detected Lane Overlay, and Lane Confidence with Offset. Click to view full screen."
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={handlePointerLeave}
        onClick={() => setIsInspectorOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsInspectorOpen(true);
          }
        }}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-xl cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300 hover:border-zinc-700 p-1.5 sm:p-2"
      >
        {/* Upper-Right Fullscreen / Expand Icon Button (Revealed on Hover / Focus) */}
        <div 
          className="absolute top-3 right-3 z-30 p-2 rounded-lg bg-black/85 border border-white/20 text-white/80 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-200 shadow-xl backdrop-blur-md hover:text-white hover:bg-black"
          aria-hidden="true"
        >
          <Maximize2 size={16} />
        </div>

        {/* Computer Vision Animated Horizontal Left-to-Right Scanline Sweep Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
          <div className={`h-full w-[2px] bg-gradient-to-b from-transparent via-white/50 to-transparent absolute top-0 left-0 transition-opacity duration-300 ${
            isHovered ? 'opacity-100 animate-scanline-horizontal' : 'opacity-0'
          }`} />
        </div>

        {/* Base 3-Tile Responsive Montage Grid (Serves as permanent underlying fallback & base structure) */}
        {hasMotionVideo && !prefersReducedMotion ? (
          <video
            ref={motionVideoRef}
            className="relative z-0 block w-full h-full object-cover rounded-xl pointer-events-none transition-all duration-300 group-hover:brightness-105"
            poster={images?.motionPoster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label="Animated lane assist processing montage"
          >
            {images?.motionWebm && <source src={images.motionWebm} type="video/webm" />}
            {images?.motion && <source src={images.motion} type="video/mp4" />}
          </video>
        ) : (
          <div className="w-full h-full grid grid-cols-2 gap-1.5 sm:gap-2 transition-all duration-300 group-hover:brightness-105">
            {/* Large Left Tile (Binary Lane Mask) */}
            <ChromaticTile
              src={images?.mask}
              alt="Binary Lane Mask"
              label="Binary Lane Mask"
              isHovered={isHovered}
            />

            {/* Right Column (2 Stacked Tiles) */}
            <div className="flex flex-col gap-1.5 sm:gap-2 h-full">
              {/* Top-Right Tile (Detected Lane Overlay) */}
              <ChromaticTile
                src={images?.result}
                alt="Detected Lane Overlay"
                label="Detected Lane Overlay"
                isHovered={isHovered}
                className="flex-1"
              />

              {/* Bottom-Right Tile (Lane Confidence + Offset) */}
              <ChromaticTile
                src={images?.assist}
                alt="Lane Confidence + Offset"
                label="Lane Confidence + Offset"
                isHovered={isHovered}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* High-Res Fullscreen Lightbox Inspector */}
      {isInspectorOpen && (
        <LaneMontageInspectorModal
          images={images}
          title={title}
          onClose={() => setIsInspectorOpen(false)}
        />
      )}
    </>
  );
}
