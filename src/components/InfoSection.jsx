import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, FileText } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import ScrambleName from './ScrambleName';
import { assetPath } from '../utils/assetPath';

export default function InfoSection() {
  const sectionRef = useRef(null);
  const electricalRef = useRef(null);

  const [hasScrambledName, setHasScrambledName] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const hasTriggeredRef = useRef(false);
  const dwellTimerRef = useRef(null);
  const glitchTimerRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Lock name scramble ONCE on initial viewport entry
          setHasScrambledName(true);

          // Start 10-second continuous dwell timer for signal interference on 'Electrical'
          if (!hasTriggeredRef.current && !dwellTimerRef.current) {
            dwellTimerRef.current = setTimeout(() => {
              const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              if (!prefersReduced && electricalRef.current) {
                hasTriggeredRef.current = true;
                setIsGlitching(true);

                if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
                glitchTimerRef.current = setTimeout(() => {
                  setIsGlitching(false);
                }, 650); // 650ms corrupted video frame duration
              }
            }, 10000); // 10 continuous seconds in viewport
          }
        } else {
          // Reset 10s timer immediately if user scrolls away before 10 seconds!
          if (dwellTimerRef.current) {
            clearTimeout(dwellTimerRef.current);
            dwellTimerRef.current = null;
          }
        }
      },
      { threshold: 0.4 } // Section must be 40% visible in viewport
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (dwellTimerRef.current) {
        clearTimeout(dwellTimerRef.current);
        dwellTimerRef.current = null;
      }
      if (glitchTimerRef.current) {
        clearTimeout(glitchTimerRef.current);
        glitchTimerRef.current = null;
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="py-24 sm:py-32 px-6 max-w-[700px] mx-auto z-10 relative scroll-mt-20 text-left overflow-hidden rounded-3xl"
    >
      {/* Keyframe Animations for CRT Scanline & Chromatic RGB Slice Glitch Effect */}
      <style>{`
        .electrical-word.glitching {
          position: relative;
          display: inline-block;
          animation: glitchMain 650ms steps(1, end) forwards;
        }
        .electrical-word.glitching::before,
        .electrical-word.glitching::after {
          content: 'Electrical';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        /* Top / Left Chromatic Shift Slice (Cyan #00F0FF) */
        .electrical-word.glitching::before {
          color: #00f0ff;
          text-shadow: -2px 0 #00f0ff;
          animation: glitchSlice1 650ms steps(2, end) forwards;
        }
        /* Bottom / Right Chromatic Shift Slice (Magenta/Red #FF0055) */
        .electrical-word.glitching::after {
          color: #ff0055;
          text-shadow: 2px 0 #ff0055;
          animation: glitchSlice2 650ms steps(2, end) forwards;
        }

        @keyframes glitchMain {
          0% { transform: translate(0); }
          12% { transform: translate(-3px, 1px) skewX(-4deg); filter: contrast(180%) brightness(130%); }
          25% { transform: translate(3px, -1px) skewX(4deg); filter: contrast(150%); }
          38% { transform: translate(-2px, -1px) skewX(-2deg); }
          50% { transform: translate(4px, 2px) skewX(5deg); filter: contrast(200%) brightness(140%); }
          65% { transform: translate(-3px, 1px) skewX(-3deg); }
          80% { transform: translate(2px, -1px); filter: contrast(120%); }
          100% { transform: translate(0) skewX(0); filter: none; }
        }

        @keyframes glitchSlice1 {
          0% { clip-path: inset(0 0 0 0); opacity: 0; }
          10% { clip-path: inset(15% 0 65% 0); transform: translate(-5px, -1px); opacity: 0.95; }
          25% { clip-path: inset(70% 0 10% 0); transform: translate(4px, 1px); opacity: 0.95; }
          40% { clip-path: inset(5% 0 75% 0); transform: translate(-6px, 0); opacity: 1; }
          60% { clip-path: inset(50% 0 25% 0); transform: translate(5px, -2px); opacity: 0.95; }
          75% { clip-path: inset(35% 0 45% 0); transform: translate(-3px, 1px); opacity: 0.9; }
          100% { clip-path: inset(0 0 0 0); opacity: 0; }
        }

        @keyframes glitchSlice2 {
          0% { clip-path: inset(0 0 0 0); opacity: 0; }
          12% { clip-path: inset(65% 0 15% 0); transform: translate(5px, 1px); opacity: 0.95; }
          28% { clip-path: inset(10% 0 80% 0); transform: translate(-4px, -1px); opacity: 0.95; }
          45% { clip-path: inset(40% 0 30% 0); transform: translate(6px, 2px); opacity: 1; }
          68% { clip-path: inset(80% 0 5% 0); transform: translate(-5px, -1px); opacity: 0.95; }
          85% { clip-path: inset(20% 0 60% 0); transform: translate(3px, 0); opacity: 0.9; }
          100% { clip-path: inset(0 0 0 0); opacity: 0; }
        }
      `}</style>

      {/* Faint Background Diagonal Trailing Accent Line */}
      <div 
        className="absolute -top-12 -left-16 w-[450px] h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform -rotate-12 pointer-events-none z-0" 
        aria-hidden="true"
      />

      <div className="space-y-8 relative z-10">
        
        {/* Top: Name + Subheading matching exact Hero Subtitle Typography */}
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
            <ScrambleName text="Dheeran Shankar" isInView={hasScrambledName} />
          </h2>
          <div className="text-[16px] sm:text-[18px] font-medium text-white/80 tracking-normal flex items-center flex-wrap gap-y-1">
            <span>
              <span
                ref={electricalRef}
                className={`electrical-word inline-block ${
                  isGlitching ? 'glitching' : ''
                }`}
              >
                Electrical
              </span>
              &nbsp;Engineering
            </span>
            <span className="font-semibold text-white ml-1.5 flex items-center gap-1.5">
              @
              <img
                src={assetPath("/yorku-u-logo.png")}
                alt="York University Red Logo Mark"
                className="h-[17px] w-auto inline-block rounded-[2px] shadow-sm select-none"
              />
              York University
            </span>
          </div>
        </div>

        {/* Short Simple Body Copy Paragraph Block */}
        <div className="space-y-5 text-white/80 text-base sm:text-[17px] leading-relaxed font-normal">
          <p>
            I'm a 3rd year Electrical Engineering student focused on building hardware and software systems.
          </p>
          <p>
            My work spans real-time telemetry, embedded systems, microcontrollers, PCB design, robotics, and computer vision.
          </p>
          <p>
            Currently, I’m developing telemetry systems with Arbalest Rocketry while exploring embedded engineering, power systems, and electrical protection.
          </p>
        </div>

        {/* Subtle Inline Contact Links */}
        <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-mono text-white/50 border-t border-white/10">
          <a
            href={personalInfo.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <LinkedinIcon size={14} />
            <span>LinkedIn</span>
            <ArrowUpRight size={12} />
          </a>

          <a
            href={personalInfo.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <GithubIcon size={14} />
            <span>GitHub</span>
            <ArrowUpRight size={12} />
          </a>

          <a
            href={personalInfo.socials.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <FileText size={14} />
            <span>Resume</span>
            <ArrowUpRight size={12} />
          </a>

          {/* Plain Text Email (Non-hyperlink) */}
          <div className="flex items-center gap-1.5 text-white/50 select-text">
            <Mail size={14} />
            <span>{personalInfo.email}</span>
          </div>
        </div>

      </div>
    </section>
  );
}
