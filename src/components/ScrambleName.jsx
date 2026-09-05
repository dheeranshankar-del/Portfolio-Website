import React, { useState, useEffect, useRef } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({ char, isSweepActive, isHovered, onMouseEnter, onMouseLeave }) {
  if (char === ' ') {
    return <span className="whitespace-pre"> </span>;
  }

  const [displayChar, setDisplayChar] = useState(char);
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, y: 0, color: 'text-white' });
  const intervalRef = useRef(null);

  const isActive = isHovered || isSweepActive;

  useEffect(() => {
    if (isActive) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const randomChar = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
        setDisplayChar(randomChar);

        const randomX = Math.round((Math.random() - 0.5) * 3);
        const randomY = Math.round((Math.random() - 0.5) * 3);
        const randomColor = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];

        setGlitchStyle({
          x: randomX,
          y: randomY,
          color: randomColor
        });
      }, 65);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setDisplayChar(char);
      setGlitchStyle({ x: 0, y: 0, color: 'text-white' });
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, char]);

  return (
    <span
      tabIndex={0}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
      onBlur={onMouseLeave}
      style={
        isActive
          ? { transform: `translate(${glitchStyle.x}px, ${glitchStyle.y}px)` }
          : undefined
      }
      className={`inline-block cursor-pointer select-none focus:outline-none transition-colors duration-75 ${
        isActive ? `${glitchStyle.color} font-mono` : 'text-white font-heading'
      }`}
      aria-label={char}
    >
      {displayChar}
    </span>
  );
}

export default function ScrambleName({
  text = 'Dheeran Shankar',
  isInView = false,
  triggerCount = 0,
  className = ''
}) {
  if (!text) return null;

  const [activeSweepIndex, setActiveSweepIndex] = useState(-1);
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  const hasScrambledOnScroll = useRef(false);
  const prevTriggerCount = useRef(triggerCount);
  const sweepTimeoutRef = useRef(null);

  const runSweepAnimation = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);

    const chars = text.split('');
    const totalChars = chars.length;
    const stepDuration = 90; // ~90ms per step -> 15 * 2 * 90ms = 2700ms total (~2.7s)

    let step = 0;
    const totalSteps = totalChars * 2;

    const tick = () => {
      if (step < totalChars) {
        // Forward pass (Left to Right)
        setActiveSweepIndex(step);
      } else if (step < totalSteps) {
        // Backward pass (Right to Left)
        const backwardIndex = totalChars - 1 - (step - totalChars);
        setActiveSweepIndex(backwardIndex);
      } else {
        // Restore original name perfectly
        setActiveSweepIndex(-1);
        return;
      }

      step++;
      sweepTimeoutRef.current = setTimeout(tick, stepDuration);
    };

    tick();
  };

  // 1. Viewport scroll entrance trigger (ONCE per page load)
  useEffect(() => {
    if (isInView && !hasScrambledOnScroll.current) {
      hasScrambledOnScroll.current = true;
      runSweepAnimation();
    }
  }, [isInView]);

  // 2. Nav click trigger (whenever triggerCount increments)
  useEffect(() => {
    if (triggerCount > prevTriggerCount.current) {
      prevTriggerCount.current = triggerCount;
      runSweepAnimation();
    }
  }, [triggerCount]);

  useEffect(() => {
    return () => {
      if (sweepTimeoutRef.current) clearTimeout(sweepTimeoutRef.current);
    };
  }, []);

  return (
    <span className={`inline-block ${className}`}>
      {text.split('').map((char, index) => (
        <ScrambleLetter
          key={index}
          char={char}
          isSweepActive={index === activeSweepIndex}
          isHovered={hoveredIndex === index}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(-1)}
        />
      ))}
    </span>
  );
}
