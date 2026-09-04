import React, { useState, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Navbar({ activeTab, setActiveTab }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimerRef = useRef(null);

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 200);
  };

  return (
    <header className="site-header">
      {/* 1. Left Region: Empty Spacer */}
      <div className="header-spacer" />

      {/* 2. Absolute Center Region: Segmented Nav Pill */}
      <div className="segmented-nav-wrapper">
        <nav className="nav-pill" aria-label="Primary navigation">
          <div
            className={`nav-indicator ${
              activeTab === 'about' || activeTab === 'info' ? 'nav-indicator--right' : ''
            }`}
            aria-hidden="true"
          />

          <button
            className={`nav-toggle ${
              activeTab === 'projects' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>

          <button
            className={`nav-toggle ${
              activeTab === 'about' || activeTab === 'info' ? 'is-active' : ''
            }`}
            onClick={() => setActiveTab('about')}
          >
            About
          </button>
        </nav>
      </div>

      {/* 3. Right Region: External Links */}
      <div className="external-links">
        <a
          href={personalInfo.socials.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link group"
        >
          <span>LinkedIn</span>
          <ArrowUpRight size={13} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        <a
          href={personalInfo.socials.github}
          target="_blank"
          rel="noopener noreferrer"
          className="external-link group"
        >
          <span>GitHub</span>
          <ArrowUpRight size={13} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>

        {/* Resume Link + Hover Preview Container */}
        <div
          className="relative inline-block group/resume"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <a
            href={personalInfo.socials.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="external-link group"
          >
            <span>Resume</span>
            <ArrowUpRight size={13} strokeWidth={1.75} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>

          {/* Floating Preview Card */}
          <div
            className={`absolute right-0 top-full pt-1.5 z-[99999] transition-all duration-200 ease-out hidden sm:block ${
              isHovered
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-1 pointer-events-none group-hover/resume:opacity-100 group-hover/resume:translate-y-0 group-hover/resume:pointer-events-auto'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <a
              href={personalInfo.socials.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-[96px] h-[126px] rounded-lg bg-[#0A0A0C] border border-zinc-800/90 shadow-[0_15px_35px_rgba(0,0,0,0.90)] p-0.5 overflow-hidden group/card hover:border-zinc-600 transition-colors"
            >
              <div className="relative w-full h-full bg-white rounded-[5px] overflow-hidden border border-zinc-800/30">
                <img
                  src="/resume-preview.png"
                  alt="Resume Thumbnail Preview"
                  className="w-full h-full object-cover object-top block"
                />

                <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors pointer-events-none" />
              </div>
            </a>
          </div>
        </div>

      </div>
    </header>
  );
}
