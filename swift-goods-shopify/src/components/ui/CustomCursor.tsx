'use client';

import React, { useEffect, useRef, useCallback } from 'react';

type CursorState = 'default' | 'button' | 'product' | 'click';

interface CursorPosition {
  x: number;
  y: number;
}

interface CursorConfig {
  ringSize: number;
  ringOpacity: number;
  ringFill: boolean;
  showLabel: string | null;
  dotAsRing: boolean;
  ringBorderColor: string;
}

const CURSOR_CONFIGS: Record<CursorState, CursorConfig> = {
  default: {
    ringSize: 40,
    ringOpacity: 1,
    ringFill: false,
    showLabel: null,
    dotAsRing: false,
    ringBorderColor: 'rgba(255,255,255,0.85)',
  },
  button: {
    ringSize: 60,
    ringOpacity: 1,
    ringFill: true,
    showLabel: 'VIEW',
    dotAsRing: false,
    ringBorderColor: 'rgba(255,255,255,0.85)',
  },
  product: {
    ringSize: 60,
    ringOpacity: 1,
    ringFill: false,
    showLabel: 'EXPLORE',
    dotAsRing: false,
    ringBorderColor: '#c9a84c',
  },
  click: {
    ringSize: 40,
    ringOpacity: 1,
    ringFill: false,
    showLabel: null,
    dotAsRing: true,
    ringBorderColor: 'rgba(255,255,255,0.85)',
  },
};

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

export default function CustomCursor() {
  // DOM refs
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Position state refs (no re-renders)
  const mousePos = useRef<CursorPosition>({ x: -100, y: -100 });
  const ringPos = useRef<CursorPosition>({ x: -100, y: -100 });
  const rafId = useRef<number>(0);
  const cursorState = useRef<CursorState>('default');
  const isVisible = useRef<boolean>(false);
  const isClickHeld = useRef<boolean>(false);

  // Hide native cursor
  useEffect(() => {
    if (isTouchDevice()) return;
    document.body.style.cursor = 'none';
    return () => {
      document.body.style.cursor = '';
    };
  }, []);

  const applyConfig = useCallback((state: CursorState) => {
    const config = CURSOR_CONFIGS[state];
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!ring || !dot) return;

    const halfSize = config.ringSize / 2;

    // Ring transitions
    ring.style.width = `${config.ringSize}px`;
    ring.style.height = `${config.ringSize}px`;
    ring.style.marginLeft = `-${halfSize}px`;
    ring.style.marginTop = `-${halfSize}px`;
    ring.style.opacity = `${config.ringOpacity}`;
    ring.style.borderColor = config.ringBorderColor;
    ring.style.backgroundColor = config.ringFill
      ? 'rgba(255,255,255,0.1)'
      : 'transparent';

    // Dot transitions
    if (config.dotAsRing) {
      // Click state: dot becomes a ring
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.marginLeft = '-6px';
      dot.style.marginTop = '-6px';
      dot.style.backgroundColor = 'transparent';
      dot.style.border = '1.5px solid #c9a84c';
      dot.style.borderRadius = '50%';
    } else {
      dot.style.width = '8px';
      dot.style.height = '8px';
      dot.style.marginLeft = '-4px';
      dot.style.marginTop = '-4px';
      dot.style.backgroundColor = '#c9a84c';
      dot.style.border = 'none';
      dot.style.borderRadius = '50%';
    }

    // Label
    if (label) {
      if (config.showLabel) {
        label.textContent = config.showLabel;
        label.style.opacity = '1';
        label.style.transform = 'translate(-50%, -50%) scale(1)';
      } else {
        label.style.opacity = '0';
        label.style.transform = 'translate(-50%, -50%) scale(0.7)';
      }
    }
  }, []);

  // Lerp animation loop
  const animateCursor = useCallback(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) {
      rafId.current = requestAnimationFrame(animateCursor);
      return;
    }

    // Dot: exact follow
    dot.style.left = `${mousePos.current.x}px`;
    dot.style.top = `${mousePos.current.y}px`;

    // Ring: lerp follow (0.08 = slow, luxurious)
    const lerpFactor = 0.08;
    ringPos.current.x += (mousePos.current.x - ringPos.current.x) * lerpFactor;
    ringPos.current.y += (mousePos.current.y - ringPos.current.y) * lerpFactor;
    ring.style.left = `${ringPos.current.x}px`;
    ring.style.top = `${ringPos.current.y}px`;

    rafId.current = requestAnimationFrame(animateCursor);
  }, []);

  // Detect cursor context from element
  const detectState = useCallback((el: Element | null): CursorState => {
    if (isClickHeld.current) return 'click';
    if (!el) return 'default';

    // Walk up DOM to check for data-cursor overrides or semantic elements
    let node: Element | null = el;
    while (node && node !== document.body) {
      const dataCursor = node.getAttribute('data-cursor');
      if (dataCursor === 'product') return 'product';
      if (dataCursor === 'button') return 'button';
      if (dataCursor === 'default') return 'default';

      const tag = node.tagName?.toLowerCase();
      if (tag === 'a' || tag === 'button') return 'button';

      // Product card detection
      if (
        node.classList.contains('product-card') ||
        node.getAttribute('data-type') === 'product'
      ) {
        return 'product';
      }

      node = node.parentElement;
    }
    return 'default';
  }, []);

  const setState = useCallback(
    (state: CursorState) => {
      if (cursorState.current === state) return;
      cursorState.current = state;
      applyConfig(state);
    },
    [applyConfig]
  );

  useEffect(() => {
    if (isTouchDevice()) return;

    // Start animation loop
    rafId.current = requestAnimationFrame(animateCursor);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // Show cursors when first moving
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }

      // Detect state from element under cursor
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!isClickHeld.current) {
        setState(detectState(el));
      }
    };

    const handleMouseDown = () => {
      isClickHeld.current = true;
      setState('click');
    };

    const handleMouseUp = () => {
      isClickHeld.current = false;
      const el = document.elementFromPoint(
        mousePos.current.x,
        mousePos.current.y
      );
      setState(detectState(el));
    };

    const handleMouseLeave = () => {
      isVisible.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const handleMouseEnter = () => {
      isVisible.current = true;
      if (dotRef.current) dotRef.current.style.opacity = '1';
      if (ringRef.current) ringRef.current.style.opacity = '1';
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Hide native cursors on all interactive elements
    const styleEl = document.createElement('style');
    styleEl.id = 'swift-cursor-style';
    styleEl.textContent = `
      *, *::before, *::after { cursor: none !important; }
    `;
    document.head.appendChild(styleEl);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.getElementById('swift-cursor-style')?.remove();
    };
  }, [animateCursor, detectState, setState]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && isTouchDevice()) return null;

  return (
    <>
      {/* Gold dot — exact follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '8px',
          height: '8px',
          marginLeft: '-4px',
          marginTop: '-4px',
          backgroundColor: '#c9a84c',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'left, top',
          transition: 'width 300ms cubic-bezier(0.76,0,0.24,1), height 300ms cubic-bezier(0.76,0,0.24,1), background-color 300ms ease, border 300ms ease',
        }}
      />

      {/* White stroke ring — lerp follow */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '40px',
          height: '40px',
          marginLeft: '-20px',
          marginTop: '-20px',
          border: '1.5px solid rgba(255,255,255,0.85)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          opacity: 0,
          willChange: 'left, top',
          transition:
            'width 400ms cubic-bezier(0.76,0,0.24,1), height 400ms cubic-bezier(0.76,0,0.24,1), margin 400ms cubic-bezier(0.76,0,0.24,1), border-color 300ms ease, background-color 300ms ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Label inside ring */}
        <span
          ref={labelRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%) scale(0.7)',
            opacity: 0,
            fontFamily: 'var(--font-impact, "Bebas Neue", sans-serif)',
            fontSize: '9px',
            letterSpacing: '0.15em',
            color: '#f5f5f5',
            whiteSpace: 'nowrap',
            userSelect: 'none',
            transition: 'opacity 250ms ease, transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </>
  );
}
