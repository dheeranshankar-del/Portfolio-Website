import React, { useState, useEffect, useRef } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({ char }) {
  if (char === ' ') {
    return <span className="whitespace-pre"> </span>;
  }

  const [displayChar, setDisplayChar] = useState(char);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, y: 0, color: 'text-white' });
  const intervalRef = useRef(null);

  const startScramble = () => {
    setIsHovered(true);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const randomChar = CHAR_SET[Math.floor(Math.random() * CHAR_SET.length)];
      setDisplayChar(randomChar);

      // Raw position jitter (-1px to 1px) and chromatic color flicker
      const randomX = Math.round((Math.random() - 0.5) * 3);
      const randomY = Math.round((Math.random() - 0.5) * 3);
      const randomColor = GLITCH_COLORS[Math.floor(Math.random() * GLITCH_COLORS.length)];

      setGlitchStyle({
        x: randomX,
        y: randomY,
        color: randomColor
      });
    }, 30);
  };

  const stopScramble = () => {
    setIsHovered(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayChar(char);
    setGlitchStyle({ x: 0, y: 0, color: 'text-white' });
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <span
      tabIndex={0}
      onMouseEnter={startScramble}
      onMouseLeave={stopScramble}
      onFocus={startScramble}
      onBlur={stopScramble}
      style={
        isHovered
          ? { transform: `translate(${glitchStyle.x}px, ${glitchStyle.y}px)` }
          : undefined
      }
      className={`inline-block cursor-pointer select-none focus:outline-none ${
        isHovered ? `${glitchStyle.color} font-mono` : 'text-white'
      }`}
      aria-label={displayChar}
    >
      {displayChar}
    </span>
  );
}

export default function ScrambleName({ text, className = '' }) {
  if (!text) return null;

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <ScrambleLetter key={index} char={char} />
      ))}
    </span>
  );
}
