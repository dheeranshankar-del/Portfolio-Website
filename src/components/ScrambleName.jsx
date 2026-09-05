import React, { useState, useEffect, useRef } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({ char, autoGlitch = false, autoGlitchDuration = 2400 }) {
  if (char === ' ') {
    return <span className="whitespace-pre"> </span>;
  }

  const [displayChar, setDisplayChar] = useState(char);
  const [isHovered, setIsHovered] = useState(false);
  const [isAutoGlitching, setIsAutoGlitching] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, y: 0, color: 'text-white' });

  const intervalRef = useRef(null);
  const autoTimeoutRef = useRef(null);

  const startScramble = () => {
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
    }, 75);
  };

  const stopScramble = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayChar(char);
    setGlitchStyle({ x: 0, y: 0, color: 'text-white' });
  };

  useEffect(() => {
    if (autoGlitch) {
      setIsAutoGlitching(true);
      startScramble();

      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      autoTimeoutRef.current = setTimeout(() => {
        setIsAutoGlitching(false);
        stopScramble();
      }, autoGlitchDuration);
    }

    return () => {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    };
  }, [autoGlitch, autoGlitchDuration]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    startScramble();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!isAutoGlitching) {
      stopScramble();
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const isActive = isHovered || isAutoGlitching;

  return (
    <span
      tabIndex={0}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
      style={
        isActive
          ? { transform: `translate(${glitchStyle.x}px, ${glitchStyle.y}px)` }
          : undefined
      }
      className={`inline-block cursor-pointer select-none focus:outline-none ${
        isActive ? `${glitchStyle.color} font-mono` : 'text-white'
      }`}
      aria-label={displayChar}
    >
      {displayChar}
    </span>
  );
}

export default function ScrambleName({
  text,
  isInView = false,
  className = ''
}) {
  if (!text) return null;

  const [randomGlitchIndex, setRandomGlitchIndex] = useState(-1);

  useEffect(() => {
    if (isInView) {
      const nonSpaceIndices = text
        .split('')
        .map((c, i) => (c !== ' ' ? i : null))
        .filter((i) => i !== null);

      if (nonSpaceIndices.length > 0) {
        const randomIndex = nonSpaceIndices[Math.floor(Math.random() * nonSpaceIndices.length)];
        setRandomGlitchIndex(randomIndex);
      }
    }
  }, [isInView, text]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <ScrambleLetter
          key={index}
          char={char}
          autoGlitch={index === randomGlitchIndex && isInView}
          autoGlitchDuration={2400}
        />
      ))}
    </span>
  );
}
