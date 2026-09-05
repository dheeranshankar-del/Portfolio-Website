import React from 'react';
import { ChevronDown } from 'lucide-react';
import TextScramble from './TextScramble';
import TypewriterText from './TypewriterText';
import { assetPath } from '../utils/assetPath';

export default function HeroSection({ onExploreProjects }) {
  return (
    <section className="relative min-h-[100svh] sm:min-h-screen flex flex-col justify-center items-center text-center px-5 sm:px-4 z-10 pt-28 sm:pt-20 pb-28 sm:pb-24 overflow-hidden">
      
      {/* 1. Main Heading: "Hey, I'm Dheeran" */}
      <h1 className="w-full max-w-[360px] sm:max-w-4xl text-[42px] sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[0.98] sm:leading-tight font-heading mb-4 sm:mb-3 text-white">
        <span className="text-white block sm:inline">Hey, I'm </span>
        <span className="text-white block sm:inline-block min-h-[1.05em]">
          <TextScramble text="Dheeran" delay={150} />
        </span>
      </h1>

      {/* 2. Single-Line Subtitle: "Electrical Engineering @ [YorkU logo] YorkU • Arbalest Rocketry" */}
      <div className="w-full max-w-[330px] sm:max-w-none text-[15px] sm:text-[19px] font-medium text-white/80 tracking-normal mb-7 sm:mb-8 flex items-center justify-center flex-wrap gap-x-2 gap-y-1 leading-relaxed">
        <span>Electrical Engineering</span>
        <span className="font-semibold text-white inline-flex items-center gap-1.5">
          @
          <img
            src={assetPath("/yorku-u-logo.png")}
            alt="York University Red Logo Mark"
            className="h-[17px] sm:h-[19px] w-auto inline-block rounded-[3.5px] shadow-sm select-none translate-y-[0.5px]"
          />
          <span className="font-bold text-white">YorkU</span>
        </span>
        <span className="hidden sm:inline text-white/80 mx-1.5 font-bold">•</span>
        <span className="w-full sm:w-auto text-white/90">Arbalest Rocketry</span>
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
