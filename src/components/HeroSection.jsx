import React from 'react';
import { ChevronDown } from 'lucide-react';
import TextScramble from './TextScramble';
import TypewriterText from './TypewriterText';
import { assetPath } from '../utils/assetPath';

export default function HeroSection({ onExploreProjects }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-4 z-10 pt-20 pb-24">
      
      {/* 1. Main Heading: "Hey, I'm Dheeran" */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-4xl leading-tight font-heading mb-3 text-white">
        <span className="text-white">Hey, I'm </span>
        <span className="text-white inline-block">
          <TextScramble text="Dheeran" delay={150} />
        </span>
      </h1>

      {/* 2. Single-Line Subtitle: "Electrical Engineering @ [YorkU logo] YorkU • Arbalest Rocketry" */}
      <div className="text-[17px] sm:text-[19px] font-medium text-white/80 tracking-normal mb-8 flex items-center justify-center flex-wrap gap-y-1">
        <span>Electrical Engineering</span>
        <span className="font-semibold text-white ml-1.5 flex items-center gap-1.5">
          @
          <img
            src={assetPath("/yorku-u-logo.png")}
            alt="York University Red Logo Mark"
            className="h-[15px] sm:h-[16px] w-auto inline-block rounded-[2px] shadow-sm select-none"
          />
          YorkU
        </span>
        <span className="text-white/80 mx-2 font-bold">•</span>
        <span className="text-white/90">Arbalest Rocketry</span>
      </div>

      {/* 3. Single-Strip Glass Status Badge: "Focused on: Embedded Systems" */}
      <div className="flex items-center justify-center">
        <TypewriterText />
      </div>

      {/* 4. Scroll Down Indicator (Positioned at bottom of 100vh hero) */}
      <div 
        onClick={onExploreProjects}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer flex flex-col items-center gap-1.5 text-white/70 hover:text-white transition-colors group"
      >
        <span className="text-[11px] font-mono tracking-widest uppercase text-white/60 group-hover:text-white font-medium">View Projects</span>
        <ChevronDown size={18} className="animate-bounce text-white/80 group-hover:text-white" />
      </div>

    </section>
  );
}
