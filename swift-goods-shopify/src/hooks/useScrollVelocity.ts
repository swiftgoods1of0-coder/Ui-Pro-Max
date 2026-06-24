'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const SMOOTHING_FACTOR = 0.15;
const MAX_SCROLL_SPEED = 50;

export function useScrollVelocity(): number {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(0);
  const smoothedVelocity = useRef(0);
  const rafId = useRef<number>(0);

  const lerp = useCallback((current: number, target: number, factor: number): number => {
    return current + (target - current) * factor;
  }, []);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastTime.current = performance.now();

    const update = () => {
      const now = performance.now();
      const dt = now - lastTime.current;

      if (dt > 0) {
        const currentScrollY = window.scrollY;
        const delta = currentScrollY - lastScrollY.current;
        const rawVelocity = (delta / dt) * 16;

        const normalizedVelocity = Math.max(
          -1,
          Math.min(1, rawVelocity / MAX_SCROLL_SPEED)
        );

        smoothedVelocity.current = lerp(
          smoothedVelocity.current,
          normalizedVelocity,
          SMOOTHING_FACTOR
        );

        if (Math.abs(smoothedVelocity.current) < 0.001) {
          smoothedVelocity.current = 0;
        }

        setVelocity(smoothedVelocity.current);

        lastScrollY.current = currentScrollY;
        lastTime.current = now;
      }

      rafId.current = requestAnimationFrame(update);
    };

    rafId.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(rafId.current);
    };
  }, [lerp]);

  return velocity;
}
