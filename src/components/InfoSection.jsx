import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, FileText } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import ScrambleName from './ScrambleName';
import { assetPath } from '../utils/assetPath';

/* Easter Egg: Single-burst electrical shock after 3 continuous seconds in About viewport */
function ElectricalShockLetter({ char, trigger }) {
  const [animating, setAnimating] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (!trigger || hasTriggered) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    setHasTriggered(true);
    setAnimating(true);

    const timer = setTimeout(() => {
      setAnimating(false);
    }, 1000); // 1000ms total strike & afterglow fade

    return () => clearTimeout(timer);
  }, [trigger, hasTriggered]);

  if (!animating) {
    return <span>{char}</span>;
  }

  return (
    <span className="relative inline-block">
      {/* Micro Lightning Bolt SVG (Strikes onto the 'i' dot for ~120ms) */}
      <svg
        className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-2.5 h-4 pointer-events-none z-20 animate-[dwellBolt_140ms_ease-out_forwards]"
        viewBox="0 0 10 18"
        fill="none"
      >
        <path
          d="M 6 0 L 2.5 7 L 6.5 8 L 3 16"
          stroke="#38BDF8"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_3px_#38BDF8]"
        />
        <path
          d="M 6 0 L 2.5 7 L 6.5 8 L 3 16"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Micro Impact Sparks (fade over ~450ms) */}
      <span className="absolute -top-0.5 -left-1 w-1 h-1 rounded-full bg-[#FFFFFF] shadow-[0_0_4px_#38BDF8] animate-[dwellSparkL_450ms_ease-out_forwards] pointer-events-none" />
      <span className="absolute -top-1 -right-1 w-0.5 h-0.5 rounded-full bg-[#E0F2FE] shadow-[0_0_4px_#60A5FA] animate-[dwellSparkR_450ms_ease-out_forwards] pointer-events-none" />

      {/* Letter 'i': impact flash → blue-white glow → gradual fade back to normal (1000ms total) */}
      <span className="inline-block animate-[dwellJitterGlow_1000ms_ease-out_forwards]">
        {char}
      </span>
    </span>
  );
}

export default function InfoSection() {
  const sectionRef = useRef(null);
  const [isDwellTriggered, setIsDwellTriggered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const hasEverFired = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let dwellTimer = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Start 5-second continuous dwell timer if not fired yet
          if (!hasEverFired.current && !dwellTimer) {
            dwellTimer = setTimeout(() => {
              hasEverFired.current = true;
              setIsDwellTriggered(true);
            }, 5000);
          }
        } else {
          setIsInView(false);
          // Cancel/reset timer immediately if user scrolls away before 5s!
          if (dwellTimer) {
            clearTimeout(dwellTimer);
            dwellTimer = null;
          }
        }
      },
      { threshold: 0.4 } // Section must be meaningfully visible in viewport
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (dwellTimer) {
        clearTimeout(dwellTimer);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about-section"
      className="py-24 sm:py-32 px-6 max-w-[700px] mx-auto z-10 relative scroll-mt-20 text-left overflow-hidden rounded-3xl"
    >
      {/* Keyframe Animations for 3-Second Dwell Electrical Shock */}
      <style>{`
        @keyframes dwellBolt {
          0% { opacity: 0; transform: translate(-50%, -6px) scale(0.5); }
          20% { opacity: 1; transform: translate(-50%, 0) scale(1); }
          70% { opacity: 0.9; transform: translate(-50%, 1px) scale(1); }
          100% { opacity: 0; transform: translate(-50%, 2px) scale(0.2); }
        }
        @keyframes dwellSparkL {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          30% { opacity: 1; transform: translate(-3px, -2px) scale(1); }
          100% { opacity: 0; transform: translate(-5px, -3px) scale(0); }
        }
        @keyframes dwellSparkR {
          0% { opacity: 0; transform: translate(0, 0) scale(0); }
          30% { opacity: 1; transform: translate(3px, -1px) scale(1); }
          100% { opacity: 0; transform: translate(5px, -3px) scale(0); }
        }
        @keyframes dwellJitterGlow {
          0% { transform: translate(0, 0); color: inherit; text-shadow: none; }
          10% { transform: translate(1.5px, -1px); color: #FFFFFF; text-shadow: 0 0 8px #38BDF8, 0 0 16px #38BDF8; }
          25% { transform: translate(-1px, 1px); color: #E0F2FE; text-shadow: 0 0 6px #38BDF8, 0 0 12px #0EA5E9; }
          45% { transform: translate(0.5px, -0.5px); color: #BAE6FD; text-shadow: 0 0 4px #0EA5E9; }
          70% { transform: translate(0, 0); color: #F0F9FF; text-shadow: 0 0 2px rgba(56, 189, 248, 0.4); }
          100% { transform: translate(0, 0); color: inherit; text-shadow: none; }
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
            <ScrambleName text="Dheeran Shankar" isInView={isInView} />
          </h2>
          <div className="text-[16px] sm:text-[18px] font-medium text-white/80 tracking-normal flex items-center flex-wrap gap-y-1">
            <span>Electr<ElectricalShockLetter char="i" trigger={isDwellTriggered} />cal Engineering</span>
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
