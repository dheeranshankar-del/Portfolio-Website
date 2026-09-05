import React, { useState, useEffect, useRef, useCallback } from 'react';

const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*!@?><{}[]=+/~';
const GLITCH_COLORS = ['text-white', 'text-cyan-400', 'text-rose-500', 'text-emerald-400', 'text-white/60'];

function ScrambleLetter({
  char,
  isDescrambling = false,
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

  // Handle active scramble state (either hover or active descramble step)
  useEffect(() => {
    const isActive = isHovered || isDescrambling;
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
  }, [isHovered, isDescrambling, startScramble, stopScramble]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHoverStart) onHoverStart();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHoverEnd) onHoverEnd();
  };

  const isActive = isHovered || isDescrambling;

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

  // decodeIndex: -1 means fully resolved.
  // When active (0 to text.length), letters at index >= decodeIndex actively scramble.
  // Letters at index < decodeIndex are resolved to their clean character.
  const [decodeIndex, setDecodeIndex] = useState(-1);

  const hoveredCountRef = useRef(0);
  const pendingDescrambleRef = useRef(false);
  const descrambleTimeoutRef = useRef(null);
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

  const startDescramble = useCallback(() => {
    stopDescramble();

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

      // Duration per step: space advances faster, letters resolve every ~85ms
      const duration = step < text.length && text[step] === ' ' ? 40 : 85;

      descrambleTimeoutRef.current = setTimeout(() => {
        runStep(step + 1);
      }, duration);
    };

    runStep(0);
  }, [text, stopDescramble]);

  const attemptDescrambleOrQueue = useCallback(() => {
    if (hoveredCountRef.current > 0) {
      pendingDescrambleRef.current = true;
    } else {
      pendingDescrambleRef.current = false;
      startDescramble();
    }
  }, [startDescramble]);

  const reset10sTimer = useCallback(() => {
    if (interval10sRef.current) {
      clearInterval(interval10sRef.current);
      interval10sRef.current = null;
    }

    if (isInView) {
      interval10sRef.current = setInterval(() => {
        attemptDescrambleOrQueue();
      }, 10000);
    }
  }, [isInView, attemptDescrambleOrQueue]);

  // Hover handlers from child letters
  const handleHoverStart = useCallback(() => {
    hoveredCountRef.current += 1;
  }, []);

  const handleHoverEnd = useCallback(() => {
    hoveredCountRef.current = Math.max(0, hoveredCountRef.current - 1);
    if (hoveredCountRef.current === 0 && pendingDescrambleRef.current) {
      pendingDescrambleRef.current = false;
      startDescramble();
    }
  }, [startDescramble]);

  // Viewport entrance & exit listener
  useEffect(() => {
    if (isInView) {
      startDescramble();
      reset10sTimer();
    } else {
      stopDescramble();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
        interval10sRef.current = null;
      }
      pendingDescrambleRef.current = false;
    }

    return () => {
      stopDescramble();
      if (interval10sRef.current) {
        clearInterval(interval10sRef.current);
      }
    };
  }, [isInView, startDescramble, reset10sTimer, stopDescramble]);

  // Nav click trigger listener
  useEffect(() => {
    if (glitchTrigger !== prevGlitchTriggerRef.current) {
      prevGlitchTriggerRef.current = glitchTrigger;
      if (isInView) {
        startDescramble();
        reset10sTimer();
      }
    }
  }, [glitchTrigger, isInView, startDescramble, reset10sTimer]);

  return (
    <span className={className}>
      {text.split('').map((char, index) => {
        const isDescrambling = decodeIndex !== -1 && index >= decodeIndex;
        return (
          <ScrambleLetter
            key={index}
            char={char}
            isDescrambling={isDescrambling}
            onHoverStart={handleHoverStart}
            onHoverEnd={handleHoverEnd}
          />
        );
      })}
    </span>
  );
}
