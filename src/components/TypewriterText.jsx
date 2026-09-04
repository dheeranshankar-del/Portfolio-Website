import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

const SPECIALTIES = [
  'Embedded Systems',
  'Hardware Development',
  'PCB Design',
  'Machine Learning',
  'Computer Vision',
  'Robotics',
  'Avionics',
  'Aerospace',
  'FPGA Development',
  'ASIC Development',
  'System Integration',
  'System Controls',
  'Automation'
];

export default function TypewriterText() {
  const [currentSpecialtyIndex, setCurrentSpecialtyIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fullText = SPECIALTIES[currentSpecialtyIndex];
    
    // Speed settings: typing 60ms/char, deleting 35ms/char, pause at full word 1.4s
    const typingSpeed = isDeleting ? 35 : 60;
    const pauseDuration = 1400;

    const handleType = () => {
      if (!isDeleting) {
        // Typing forward
        const nextText = fullText.slice(0, currentText.length + 1);
        setCurrentText(nextText);

        if (nextText === fullText) {
          // Pause at completed word before deleting
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        // Deleting backward
        const nextText = fullText.slice(0, currentText.length - 1);
        setCurrentText(nextText);

        if (nextText === '') {
          setIsDeleting(false);
          setCurrentSpecialtyIndex((prev) => (prev + 1) % SPECIALTIES.length);
        }
      }
    };

    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentSpecialtyIndex]);

  return (
    /* Clean Premium Status Badge - Single Glass Strip, Zero Inner Borders */
    <div className="inline-flex items-center gap-3.5 h-[46px] px-5 rounded-full bg-white/[0.04] border border-white/[0.09] backdrop-blur-md shadow-lg text-sm sm:text-base">
      <Cpu size={16} className="text-white/70 flex-none" aria-hidden="true" />
      <span className="text-white/70 font-medium">Focused on:</span>
      <span className="font-mono font-semibold text-white min-w-[210px] text-left">
        {currentText}
        <span className="animate-pulse text-white/90 font-mono ml-0.5">|</span>
      </span>
    </div>
  );
}
