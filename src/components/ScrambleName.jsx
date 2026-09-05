import React, { useState, useEffect, useRef, useCallback } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({
  char,
  isWaveActive = false,
  onHoverStart,
  onHoverEnd
}) {
  if (char === ' ') {
    return <span className="whitespace-pre"> </span>;
  }

  const [displayChar, setDisplayChar] = useState(char);
  const [isHovered, setIsHovered] = useState(false);
  const [glitchStyle, setGlitchStyle] = useState({ x: 0, y: 0, color: 'text-white' });

  const intervalRef = useRef(null);

  const startScramble = useCallback(() => {
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
  }, []);

  const stopScramble = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayChar(char);
    setGlitchStyle({ x: 0, y: 0, color: 'text-white' });
  }, [char]);

  // Handle wave activation or hover state change
  useEffect(() => {
    const isActive = isHovered || isWaveActive;
    if (isActive) {
      startScramble();
    } else {
      stopScramble();
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, isWaveActive, startScramble, stopScramble]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  const isActive = isHovered || isWaveActive;

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
      className={`inline-block cursor-pointer select-none focus:outline-none min-w-[0.62em] text-center ${
        isActive ? `${glitchStyle.color} font-mono` : 'text-white'
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
  glitchTrigger = 0,
  className = ''
}) {
  if (!text) return null;

  const [waveIndex, setWaveIndex] = useState(-1);
  const hoveredCountRef = useRef(0);
  const pendingWaveRef = useRef(false);
  const waveTimeoutRef = useRef(null);
  const interval10sRef = useRef(null);
  const isInViewRef = useRef(isInView);
  const prevGlitchTriggerRef = useRef(glitchTrigger);

  isInViewRef.current = isInView;

  const stopWave = useCallback(() => {
    if (waveTimeoutRef.current) {
      clearTimeout(waveTimeoutRef.current);
      waveTimeoutRef.current = null;
    }
    setWaveIndex(-1);
  }, []);

  const startWave = useCallback(() => {
    stopWave();

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isInViewRef.current) {
      return;
    }

    const runStep = (step) => {
      if (!isInViewRef.current) {
        setWaveIndex(-1);
        return;
      }
      if (step >= text.length) {
        setWaveIndex(-1);
        return;
      }

      setWaveIndex(step);

      // Duration per character step: spaces 50ms, letters 150ms
      const duration = text[step] === ' ' ? 50 : 150;

      waveTimeoutRef.current = setTimeout(() => {
        runStep(step + 1);
      }, duration);
    };

    runStep(0);
  }, [text, stopWave]);

  const attemptWaveOrQueue = useCallback(() => {
    if (hoveredCountRef.current > 0) {
      pendingWaveRef.current = true;
    } else {
      pendingWaveRef.current = false;
      startWave();
    }
  }, [startWave]);

  const reset10sTimer = useCallback(() => {
    if (interval10sRef.current) {
      clearInterval(interval10sRef.current);
      interval10sRef.current = null;
    }

    if (isInView) {
      interval10sRef.current = setInterval(() => {
        attemptWaveOrQueue();
      }, 10000);
    }
  }, [isInView, attemptWaveOrQueue]);

  // Handle hover callbacks from individual letters
  const handleHoverStart = useCallback(() => {
    hoveredCountRef.current += 1;
  }, []);

  const handleHoverEnd = useCallback(() => {
    hoveredCountRef.current = Math.max(0, hoveredCountRef.current - 1);
    if (hoveredCountRef.current === 0 && pendingWaveRef.current) {
      pendingWaveRef.current = false;
      startWave();
    }
  }, [startWave]);

  // Viewport entrance & exit handler
  useEffect(() => {
    if (isInView) {
      startWave();
      reset10sTimer();
    } else {
      stopWave();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
        interval10sRef.current = null;
      }
      pendingWaveRef.current = false;
    }

    return () => {
      stopWave();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
      }
    };
  }, [isInView, startWave, reset10sTimer, stopWave]);

  // Nav click trigger handler
  useEffect(() => {
    if (glitchTrigger !== prevGlitchTriggerRef.current) {
      prevGlitchTriggerRef.current = glitchTrigger;
      if (isInView) {
        startWave();
        reset10sTimer();
      }
    }
  }, [glitchTrigger, isInView, startWave, reset10sTimer]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => (
        <ScrambleLetter
          key={index}
          char={char}
          isWaveActive={index === waveIndex}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
        />
      ))}
    </span>
  );
}
