;

import { useEffect, useRef, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const scrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateProgress = useCallback(() => {
    const bar = barRef.current;
    if (!bar) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    bar.style.width = `${progress}%`;
  }, []);

  useEffect(() => {
    // Initial measurement
    updateProgress();

    const handleScroll = () => {
      // Mark as actively scrolling for the pulse animation
      if (barRef.current) {
        barRef.current.style.animationPlayState = 'running';
      }
      scrollingRef.current = true;

      // Clear previous timeout
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Stop pulse after scrolling stops
      scrollTimeoutRef.current = setTimeout(() => {
        scrollingRef.current = false;
        if (barRef.current) {
          barRef.current.style.animationPlayState = 'paused';
          barRef.current.style.opacity = '1';
        }
      }, 150);

      // Use rAF for smooth visual updates
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current !== null) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [updateProgress]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '2px',
        zIndex: 9999,
        pointerEvents: 'none',
        background: 'transparent',
      }}
    >
      <div
        ref={barRef}
        style={{
          height: '100%',
          width: '0%',
          background: 'linear-gradient(90deg, #c9a84c, #e6c870)',
          boxShadow: '0 0 8px rgba(201,168,76,0.4)',
          transition: 'width 0.1s linear',
          animationName: 'scrollPulse',
          animationDuration: '1.2s',
          animationIterationCount: 'infinite',
          animationTimingFunction: 'ease-in-out',
          animationPlayState: 'paused',
        }}
      />
    </div>
  );
}
