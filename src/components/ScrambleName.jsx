import React, { useState, useEffect, useRef, useCallback } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({
  char,
  isDescrambling = false,
  isRandomGlitching = false,
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

  useEffect(() => {
    const isActive = isHovered || isDescrambling || isRandomGlitching;
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
  }, [isHovered, isDescrambling, isRandomGlitching, startScramble, stopScramble]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  const isActive = isHovered || isDescrambling || isRandomGlitching;

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

  // decodeIndex: -1 means full descramble inactive.
  // 0 to text.length during full matrix descramble.
  const [decodeIndex, setDecodeIndex] = useState(-1);

  // randomGlitchIndex: -1 means no 10s random letter glitch active.
  const [randomGlitchIndex, setRandomGlitchIndex] = useState(-1);

  const hoveredCountRef = useRef(0);
  const pendingRandomGlitchRef = useRef(false);
  const pendingDescrambleRef = useRef(false);
  const descrambleTimeoutRef = useRef(null);
  const randomGlitchTimeoutRef = useRef(null);
  const interval10sRef = useRef(null);
  const isInViewRef = useRef(isInView);
  const prevGlitchTriggerRef = useRef(glitchTrigger);

  isInViewRef.current = isInView;

  const stopDescramble = useCallback(() => {
    if (descrambleTimeoutRef.current) {
      clearTimeout(descrambleTimeoutRef.current);
      descrambleTimeoutRef.current = null;
    }
    setDecodeIndex(-1);
  }, []);

  const stopRandomGlitch = useCallback(() => {
    if (randomGlitchTimeoutRef.current) {
      clearTimeout(randomGlitchTimeoutRef.current);
      randomGlitchTimeoutRef.current = null;
    }
    setRandomGlitchIndex(-1);
  }, []);

  // Trigger one random letter glitch (used every 10s)
  const triggerRandomLetterGlitch = useCallback(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isInViewRef.current) return;

    if (descrambleTimeoutRef.current !== null) return;

    if (hoveredCountRef.current > 0) {
      pendingRandomGlitchRef.current = true;
      return;
    }

    const nonSpaceIndices = text
      .split('')
      .map((c, i) => (c !== ' ' ? i : null))
      .filter((i) => i !== null);

    if (nonSpaceIndices.length === 0) return;

    const randomIndex = nonSpaceIndices[Math.floor(Math.random() * nonSpaceIndices.length)];
    setRandomGlitchIndex(randomIndex);

    if (randomGlitchTimeoutRef.current) {
      clearTimeout(randomGlitchTimeoutRef.current);
    }

    randomGlitchTimeoutRef.current = setTimeout(() => {
      setRandomGlitchIndex(-1);
    }, 1000);
  }, [text]);

  const startDescramble = useCallback(() => {
    stopDescramble();
    stopRandomGlitch();

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !isInViewRef.current) {
      return;
    }

    const runStep = (step) => {
      if (!isInViewRef.current) {
        setDecodeIndex(-1);
        return;
      }
      if (step > text.length) {
        setDecodeIndex(-1);
        return;
      }

      setDecodeIndex(step);

      const duration = step < text.length && text[step] === ' ' ? 40 : 85;

      descrambleTimeoutRef.current = setTimeout(() => {
        runStep(step + 1);
      }, duration);
    };

    runStep(0);
  }, [text, stopDescramble, stopRandomGlitch]);

  const reset10sTimer = useCallback(() => {
    if (interval10sRef.current) {
      clearInterval(interval10sRef.current);
      interval10sRef.current = null;
    }

    if (isInView) {
      interval10sRef.current = setInterval(() => {
        triggerRandomLetterGlitch();
      }, 10000);
    }
  }, [isInView, triggerRandomLetterGlitch]);

  // Hover callbacks
  const handleHoverStart = useCallback(() => {
    hoveredCountRef.current += 1;
  }, []);

  const handleHoverEnd = useCallback(() => {
    hoveredCountRef.current = Math.max(0, hoveredCountRef.current - 1);
    if (hoveredCountRef.current === 0 && pendingRandomGlitchRef.current) {
      pendingRandomGlitchRef.current = false;
      triggerRandomLetterGlitch();
    }
  }, [triggerRandomLetterGlitch]);

  // Viewport entrance triggers the full-name glitch and starts the 10s random
  // single-letter glitch while the About section stays visible.
  useEffect(() => {
    if (isInView) {
      startDescramble();
      pendingDescrambleRef.current = false;
      reset10sTimer();
    } else {
      stopDescramble();
      stopRandomGlitch();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
        interval10sRef.current = null;
      }
      pendingRandomGlitchRef.current = false;
    }

    return () => {
      stopDescramble();
      stopRandomGlitch();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
      }
    };
  }, [isInView, startDescramble, reset10sTimer, stopDescramble, stopRandomGlitch]);

  // Nav click trigger handler (plays full descramble once on click)
  useEffect(() => {
    if (glitchTrigger !== prevGlitchTriggerRef.current) {
      prevGlitchTriggerRef.current = glitchTrigger;
      if (isInView) {
        startDescramble();
        reset10sTimer();
      } else {
        pendingDescrambleRef.current = true;
      }
    }
  }, [glitchTrigger, isInView, startDescramble, reset10sTimer]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => {
        const isDescrambling = decodeIndex !== -1 && index >= decodeIndex;
        const isRandomGlitching = index === randomGlitchIndex;
        return (
          <ScrambleLetter
            key={index}
            char={char}
            isDescrambling={isDescrambling}
            isRandomGlitching={isRandomGlitching}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        );
      })}
    </span>
  );
}
