import React from 'react';
import { FileText } from 'lucide-react';
import { LinkedinIcon, GithubIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900/80 bg-black py-10 px-6 sm:px-12 md:px-16 relative z-10 text-left">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        {/* Left Side: Footer Text */}
        <div className="flex flex-col justify-start text-left space-y-1">
          <div className="text-white text-[13px] sm:text-[14px] font-semibold tracking-tight font-body">
            © 2026 Dheeran Shankar. All Rights Reserved.
          </div>
          <div className="text-zinc-500 text-[12px] sm:text-[13px] font-normal tracking-normal font-body">
            Electrical Engineering @ York University
          </div>
        </div>

        {/* Right Side: Matching Minimal Icon Links */}
        <div className="flex items-center gap-5">
          <a
            href={personalInfo.socials.linkedin}
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <LinkedinIcon size={19} />
          </a>

          <a
            href={personalInfo.socials.github}
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <GithubIcon size={19} />
          </a>

          <a
            href={personalInfo.socials.resume}
            aria-label="Resume"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-white transition-colors duration-200"
          >
            <FileText size={19} strokeWidth={1.75} />
          </a>
        </div>

      </div>
    </footer>
  );
}
