'use client';

import { useState, useEffect, useRef } from 'react';

const SMOOTHING = 0.15;
const MAX_SPEED = 50;
const THRESHOLD = 0.005;

export function useScrollVelocity(): number {
  const [velocity, setVelocity] = useState(0);
  const state = useRef({ lastY: 0, lastT: 0, smoothed: 0, rafId: 0 });

  useEffect(() => {
    const s = state.current;
    s.lastY = window.scrollY;
    s.lastT = performance.now();

    const tick = () => {
      const now = performance.now();
      const dt = now - s.lastT;

      if (dt > 0) {
        const currentY = window.scrollY;
        const raw = ((currentY - s.lastY) / dt) * 16 / MAX_SPEED;
        const clamped = Math.max(-1, Math.min(1, raw));
        s.smoothed = s.smoothed + (clamped - s.smoothed) * SMOOTHING;

        if (Math.abs(s.smoothed) < THRESHOLD) s.smoothed = 0;

        // Only trigger a React re-render when value meaningfully changes
        setVelocity(prev => {
          const next = s.smoothed;
          return Math.abs(next - prev) > THRESHOLD ? next : prev;
        });

        s.lastY = currentY;
        s.lastT = now;
      }

      s.rafId = requestAnimationFrame(tick);
    };

    s.rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(s.rafId);
  }, []);

  return velocity;
}
