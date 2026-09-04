import React, { useEffect, useState, useRef } from 'react';

const MATRIX_GLYPHS = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZμΔΩΨΦλΣ';

export default function TextScramble({ 
  text = "Dheeran", 
  className = "", 
  delay = 150, 
  triggerOnLoad = true 
}) {
  const [displayText, setDisplayText] = useState(() => 
    text.split('').map(c => ({ char: c, locked: true, active: false }))
  );
  const [isScrambling, setIsScrambling] = useState(false);
  const animationFrameRef = useRef(null);

  const startSequentialLockIn = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    
    const targetText = text;
    const length = targetText.length;
    setIsScrambling(true);

    let frame = 0;
    // Initial scramble phase so all letters scramble together first
    const initialScrambleFrames = 8;
    // Each character locks in sequentially every 7 frames (~115ms per letter)
    const lockFramesPerChar = 7;

    const update = () => {
      frame++;

      // Compute lock-in index taking initial scramble frames into account
      const effectiveFrame = Math.max(0, frame - initialScrambleFrames);
      const currentLockIndex = Math.floor(effectiveFrame / lockFramesPerChar);

      if (currentLockIndex >= length && frame > initialScrambleFrames) {
        // Complete lock-in achieved
        setDisplayText(
          targetText.split('').map(c => ({ char: c, locked: true, active: false }))
        );
        setIsScrambling(false);
        return;
      }

      const nextDisplay = [];
      for (let i = 0; i < length; i++) {
        if (targetText[i] === ' ') {
          nextDisplay.push({ char: ' ', locked: true, active: false });
        } else if (frame <= initialScrambleFrames) {
          // Initial all-character Matrix scramble phase
          const randomGlyph = MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
          nextDisplay.push({ char: randomGlyph, locked: false, active: i === 0 });
        } else if (i < currentLockIndex) {
          // Locked in actual letter
          nextDisplay.push({ char: targetText[i], locked: true, active: false });
        } else if (i === currentLockIndex) {
          // Currently decoding / locking in this exact character (Pure Specular Ice-White Glow)
          const randomGlyph = MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
          nextDisplay.push({ char: randomGlyph, locked: false, active: true });
        } else {
          // Future character rapidly scrambling
          const randomGlyph = MATRIX_GLYPHS[Math.floor(Math.random() * MATRIX_GLYPHS.length)];
          nextDisplay.push({ char: randomGlyph, locked: false, active: false });
        }
      }

      setDisplayText(nextDisplay);
      animationFrameRef.current = requestAnimationFrame(update);
    };

    update();
  };

  useEffect(() => {
    if (!triggerOnLoad) return;

    const timeoutId = setTimeout(() => {
      startSequentialLockIn();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [text, delay, triggerOnLoad]);

  return (
    <span
      tabIndex={0}
      role="button"
      aria-label={`Decode animation for ${text}`}
      onClick={startSequentialLockIn}
      onMouseEnter={() => {
        if (!isScrambling) startSequentialLockIn();
      }}
      onFocus={() => {
        if (!isScrambling) startSequentialLockIn();
      }}
      className={`inline-block cursor-pointer select-none font-heading tracking-tight focus:outline-none ${className}`}
      title="Hover or focus to trigger Matrix decoding animation"
    >
      {displayText.length === 0
        ? text
        : displayText.map((item, idx) => (
            <span
              key={idx}
              className={
                item.active
                  ? 'text-white font-mono font-bold inline-block animate-pulse drop-shadow-[0_0_14px_rgba(255,255,255,0.95)] scale-110 transition-transform'
                  : item.locked
                  ? 'text-white transition-colors duration-150'
                  : 'text-white/35 font-mono font-normal'
              }
            >
              {item.char}
            </span>
          ))}
    </span>
  );
}
