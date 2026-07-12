;

import { useEffect, useCallback, useRef } from 'react';

interface Use3DTiltOptions {
  maxTilt?: number;
  glowColor?: string;
  scale?: number;
}

export function use3DTilt(
  ref: React.RefObject<HTMLElement | null>,
  options?: Use3DTiltOptions
) {
  const {
    maxTilt = 8,
    glowColor = 'rgba(201,168,76,0.15)',
    scale = 1.02,
  } = options ?? {};

  const rafId = useRef<number>(0);
  const isHovering = useRef(false);
  const currentMouse = useRef({ x: 0, y: 0 });

  const applyTransform = useCallback(
    (el: HTMLElement, rotateX: number, rotateY: number, glowX: number, glowY: number, currentScale: number) => {
      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${currentScale}, ${currentScale}, ${currentScale})`;

      // Shift the glow shadow opposite to tilt direction for a realistic ambient light feel
      const shadowX = -glowX * 20;
      const shadowY = -glowY * 20;
      el.style.boxShadow = `${shadowX}px ${shadowY}px 40px 0px ${glowColor}`;
    },
    [glowColor]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // Normalize mouse position to [-1, 1] relative to element center
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;

      currentMouse.current = { x, y };

      if (!isHovering.current) return;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        if (!ref.current) return;
        // rotateY follows horizontal mouse, rotateX follows inverted vertical mouse
        const rotateY = currentMouse.current.x * maxTilt;
        const rotateX = -currentMouse.current.y * maxTilt;
        applyTransform(ref.current, rotateX, rotateY, currentMouse.current.x, currentMouse.current.y, scale);
      });
    },
    [ref, maxTilt, scale, applyTransform]
  );

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    isHovering.current = true;
    // Remove transition for responsive tracking while hovering
    el.style.transition = 'none';
  }, [ref]);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    isHovering.current = false;
    cancelAnimationFrame(rafId.current);

    // Smooth transition back to flat
    el.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    el.style.boxShadow = `0px 0px 0px 0px ${glowColor}`;
  }, [ref, glowColor]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial styles
    el.style.willChange = 'transform, box-shadow';
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId.current);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);

      // Clean up inline styles on unmount
      el.style.willChange = '';
      el.style.transform = '';
      el.style.boxShadow = '';
      el.style.transition = '';
    };
  }, [ref, handleMouseMove, handleMouseEnter, handleMouseLeave]);
}
