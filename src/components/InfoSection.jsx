import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Mail, FileText } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import ScrambleName from './ScrambleName';
import { assetPath } from '../utils/assetPath';

export default function InfoSection() {
  const sectionRef = useRef(null);

  const [hasScrambledName, setHasScrambledName] = useState(false);
  const [isSectionVisible, setIsSectionVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsSectionVisible(true);
      setHasScrambledName(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Smooth scroll entrance fade-in like project sections
          setIsSectionVisible(true);

          // Lock name scramble ONCE on initial viewport entry
          setHasScrambledName(true);
        }
      },
      { 
        threshold: 0.45, // Requires 45% of About section to be in viewport
        rootMargin: "-5% 0px -10% 0px" // Trigger when user is genuinely in the section
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
      id="about-section"
      className={`pt-32 sm:pt-44 pb-24 sm:pb-32 px-6 max-w-[700px] mx-auto z-10 relative scroll-mt-20 text-left overflow-hidden rounded-3xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isSectionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
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
              Electrical Engineering
            </span>
            <span className="font-semibold text-white ml-1.5 inline-flex items-center gap-1.5">
              @
              <img
                src={assetPath("/yorku-u-logo.png")}
                alt="York University Red Logo Mark"
                className="h-[16px] sm:h-[18px] w-auto inline-block rounded-[2px] shadow-sm select-none translate-y-[1px]"
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
