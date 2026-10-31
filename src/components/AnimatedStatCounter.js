import React, { useState, useEffect, useRef } from 'react';

/**
 * Parses numeric statistics strings like "1000+", "80+", "8.00", "4+"
 */
export function parseStatValue(val) {
  const str = String(val).trim();
  const match = str.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { prefix: '', num: 0, suffix: str, decimals: 0, isNumeric: false };
  }
  const prefix = match[1] || '';
  const numStr = match[2];
  const suffix = match[3] || '';
  const num = parseFloat(numStr);
  const decimalPart = numStr.split('.')[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  return { prefix, num, suffix, decimals, isNumeric: true };
}

// Ease-out quartic curve: smooth acceleration, gentle deceleration into final number
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

const AnimatedStatCounter = ({ value, inView, duration = 1800 }) => {
  const { prefix, num, suffix, decimals, isNumeric } = parseStatValue(value);

  // Check reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initial formatted display string
  const initialDisplay = () => {
    if (prefersReducedMotion || !isNumeric) return String(value);
    return decimals > 0 ? (0).toFixed(decimals) : '0';
  };

  const [displayNum, setDisplayNum] = useState(initialDisplay);
  const hasAnimatedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    // If reduced motion or non-numeric, show final value immediately
    if (prefersReducedMotion || !isNumeric) {
      setDisplayNum(decimals > 0 ? num.toFixed(decimals) : String(num));
      return;
    }

    // Only start animating when inView becomes true for the first time
    if (!inView || hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentVal = easedProgress * num;

      if (decimals > 0) {
        setDisplayNum(currentVal.toFixed(decimals));
      } else {
        setDisplayNum(String(Math.floor(currentVal)));
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        // Guarantee exact final value on completion
        setDisplayNum(decimals > 0 ? num.toFixed(decimals) : String(num));
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [inView, num, decimals, duration, prefersReducedMotion, isNumeric]);

  return (
    <span className="stat-counter-value" aria-label={String(value)}>
      {prefix && <span className="stat-prefix">{prefix}</span>}
      <span className="stat-number">{displayNum}</span>
      {suffix && <span className="stat-suffix">{suffix}</span>}
    </span>
  );
};

export default AnimatedStatCounter;
