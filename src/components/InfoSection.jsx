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

          // Start 15-second continuous dwell timer for signal interference on 'Electrical'
          if (!hasTriggeredRef.current && !dwellTimerRef.current) {
            dwellTimerRef.current = setTimeout(() => {
              const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              if (!prefersReduced && electricalRef.current) {
                hasTriggeredRef.current = true;
                setIsGlitching(true);

                if (glitchTimerRef.current) clearTimeout(glitchTimerRef.current);
                glitchTimerRef.current = setTimeout(() => {
                  setIsGlitching(false);
                }, 750); // 750ms CRT TV turn-off duration
              }
            }, 15000); // 15 continuous seconds in viewport
          }
        } else {
          // Reset 15s timer immediately if user scrolls away before 15 seconds!
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
      {/* Keyframe Animations for Black & White CRT TV Unplugged / Turn-Off Effect */}
      <style>{`
        .electrical-word.glitching {
          position: relative;
          display: inline-block;
          animation: crtUnplug 750ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
          filter: grayscale(100%);
        }
        .electrical-word.glitching::before,
        .electrical-word.glitching::after {
          content: 'Electrical';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          color: #ffffff;
          pointer-events: none;
          filter: grayscale(100%);
        }
        /* Top Horizontal Stretch Slice */
        .electrical-word.glitching::before {
          text-shadow: -2px 0 #ffffff;
          animation: crtSliceTop 750ms linear forwards;
        }
        /* Bottom Horizontal Stretch Slice */
        .electrical-word.glitching::after {
          text-shadow: 2px 0 #ffffff;
          animation: crtSliceBottom 750ms linear forwards;
        }

        @keyframes crtUnplug {
          0% {
            transform: scale(1) translate(0);
            filter: grayscale(100%) brightness(100%);
            opacity: 1;
          }
          15% {
            transform: scaleX(1.35) scaleY(0.75) translate(-3px, 0);
            filter: grayscale(100%) brightness(250%) contrast(300%);
            opacity: 1;
          }
          32% {
            transform: scaleX(1.6) scaleY(0.08) translate(2px, 0);
            filter: grayscale(100%) brightness(400%) contrast(500%);
            text-shadow: 0 0 6px #ffffff;
            opacity: 1;
          }
          48% {
            transform: scaleX(0.12) scaleY(0.02) translate(0, 0);
            filter: grayscale(100%) brightness(600%);
            opacity: 0.95;
          }
          62% {
            transform: scaleX(0.01) scaleY(0.01);
            filter: grayscale(100%) brightness(800%);
            opacity: 0.3;
          }
          75% {
            transform: scale(0);
            opacity: 0;
            filter: grayscale(100%) brightness(0);
          }
          100% {
            transform: scale(1) translate(0);
            opacity: 1;
            filter: none;
          }
        }

        @keyframes crtSliceTop {
          0% { clip-path: inset(0 0 100% 0); opacity: 0; }
          15% { clip-path: inset(0 0 50% 0); transform: scaleX(1.4) translate(-6px, 0); opacity: 0.9; }
          32% { clip-path: inset(0 0 70% 0); transform: scaleX(1.8) translate(-10px, 0); opacity: 0.8; }
          48% { clip-path: inset(0 0 90% 0); transform: scaleX(0.2) translate(0, 0); opacity: 0.5; }
          62% { opacity: 0; }
          100% { opacity: 0; }
        }

        @keyframes crtSliceBottom {
          0% { clip-path: inset(100% 0 0 0); opacity: 0; }
          15% { clip-path: inset(50% 0 0 0); transform: scaleX(1.4) translate(6px, 0); opacity: 0.9; }
          32% { clip-path: inset(70% 0 0 0); transform: scaleX(1.8) translate(10px, 0); opacity: 0.8; }
          48% { clip-path: inset(90% 0 0 0); transform: scaleX(0.2) translate(0, 0); opacity: 0.5; }
          62% { opacity: 0; }
          100% { opacity: 0; }
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
