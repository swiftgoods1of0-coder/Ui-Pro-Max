'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CursorState = 'default' | 'hover' | 'product' | 'click';

interface Position {
  x: number;
  y: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(pointer: coarse)').matches;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CustomCursor() {
  // -- DOM refs ---------------------------------------------------------------
  const dotRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  // -- Position tracking refs (mutated every frame, never triggers re-renders) -
  const mousePos = useRef<Position>({ x: -200, y: -200 });
  const lerpPos = useRef<Position>({ x: -200, y: -200 });

  // -- RAF handle & mount flag ------------------------------------------------
  const rafHandle = useRef<number>(0);
  const isMounted = useRef<boolean>(false);

  // -- Click-held flag so mousemove does not clobber the click state ----------
  const isClickHeld = useRef<boolean>(false);

  // -- Cursor state -----------------------------------------------------------
  // useState drives JSX re-renders (circle appearance).
  // cursorStateRef gives the RAF loop and event handlers instant access.
  const [cursorState, setCursorState] = useState<CursorState>('default');
  const cursorStateRef = useRef<CursorState>('default');

  const applyState = useCallback((next: CursorState) => {
    if (cursorStateRef.current === next) return;
    cursorStateRef.current = next;
    setCursorState(next);
  }, []);

  // -- Hover detection --------------------------------------------------------
  const detectState = useCallback((el: Element | null): CursorState => {
    if (isClickHeld.current) return 'click';
    if (!el) return 'default';

    let node: Element | null = el;
    while (node && node !== document.body) {
      const dataCursor = node.getAttribute('data-cursor');

      // Explicit product override
      if (
        dataCursor === 'product' ||
        node.classList.contains('product-card')
      ) {
        return 'product';
      }

      // Generic interactive — any [data-cursor] not otherwise classified
      if (dataCursor !== null) return 'hover';

      const tag = node.tagName?.toLowerCase();
      if (tag === 'a' || tag === 'button') return 'hover';

      node = node.parentElement;
    }
    return 'default';
  }, []);

  // -- Animation loop (runs once for the lifetime of the component) ----------
  const animate = useCallback(() => {
    if (!isMounted.current) return;

    // Lerp the circle toward the mouse
    lerpPos.current.x = lerp(lerpPos.current.x, mousePos.current.x, 0.08);
    lerpPos.current.y = lerp(lerpPos.current.y, mousePos.current.y, 0.08);

    // Dot: exact mouse position via CSS transform
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
    }

    // Circle: smoothly lerped position via CSS transform
    if (circleRef.current) {
      circleRef.current.style.transform = `translate(${lerpPos.current.x}px, ${lerpPos.current.y}px)`;
    }

    // Pause the loop once the circle has converged — no GPU work when idle
    if (
      Math.abs(mousePos.current.x - lerpPos.current.x) < 0.15 &&
      Math.abs(mousePos.current.y - lerpPos.current.y) < 0.15
    ) {
      rafHandle.current = 0;
      return;
    }

    rafHandle.current = requestAnimationFrame(animate);
  }, []);

  // -- Mount / unmount effects -----------------------------------------------

  // 1. Hide real cursor on mount, restore on unmount
  useEffect(() => {
    if (isTouchDevice()) return;
    document.body.style.cursor = 'none';

    // Inject global style so interactive children also get cursor:none
    const style = document.createElement('style');
    style.id = '__swift-cursor-none__';
    style.textContent = '*, *::before, *::after { cursor: none !important; }';
    document.head.appendChild(style);

    return () => {
      document.body.style.cursor = '';
      document.getElementById('__swift-cursor-none__')?.remove();
    };
  }, []);

  // 2. Event listeners + RAF loop
  useEffect(() => {
    if (isTouchDevice()) return;

    isMounted.current = true;

    // Kick off the animation loop
    rafHandle.current = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isClickHeld.current) {
        // Use elementFromPoint for accurate target even through overlapping layers
        const el = document.elementFromPoint(e.clientX, e.clientY);
        applyState(detectState(el));
      }

      // Restart the loop if it paused after convergence
      if (!rafHandle.current) {
        rafHandle.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseDown = () => {
      isClickHeld.current = true;
      applyState('click');
    };

    const handleMouseUp = (e: MouseEvent) => {
      isClickHeld.current = false;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      applyState(detectState(el));
    };

    const handleMouseLeave = () => {
      // Move off-screen when cursor leaves the window
      mousePos.current.x = -200;
      mousePos.current.y = -200;
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      isMounted.current = false;
      cancelAnimationFrame(rafHandle.current);

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [animate, applyState, detectState]);

  // -- Don't render anything on touch devices --------------------------------
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (isTouchDevice()) setIsTouch(true);
  }, []);
  if (isTouch) return null;

  // ---------------------------------------------------------------------------
  // Derived styles from cursorState
  // ---------------------------------------------------------------------------

  // Dot
  const dotSize = cursorState === 'click' ? 16 : 8;
  const dotOffset = -(dotSize / 2);
  const dotBg = cursorState === 'click' ? 'transparent' : '#c9a84c';
  const dotBorder =
    cursorState === 'click' ? '1.5px solid #c9a84c' : '1.5px solid transparent';

  // Circle
  const circleSize =
    cursorState === 'hover' || cursorState === 'product' ? 60 : 40;
  const circleOffset = -(circleSize / 2);

  const circleBorderColor =
    cursorState === 'product' ? '#c9a84c' : 'white';

  const circleBg =
    cursorState === 'hover' || cursorState === 'product'
      ? 'rgba(255,255,255,0.1)'
      : 'transparent';

  const showLabel = cursorState === 'hover' || cursorState === 'product';
  const labelText = cursorState === 'product' ? 'EXPLORE' : 'VIEW';

  // ---------------------------------------------------------------------------
  // JSX
  // ---------------------------------------------------------------------------

  return (
    <>
      {/* ── Small gold dot — tracks mouse exactly ── */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          // Positioned at (0,0); transform moves it to the mouse
          position: 'fixed',
          top: 0,
          left: 0,
          // Center on the cursor point
          marginTop: dotOffset,
          marginLeft: dotOffset,
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: dotBg,
          border: dotBorder,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          transition: [
            'width 200ms cubic-bezier(0.76,0,0.24,1)',
            'height 200ms cubic-bezier(0.76,0,0.24,1)',
            'margin 200ms cubic-bezier(0.76,0,0.24,1)',
            'background-color 200ms ease',
            'border 200ms ease',
          ].join(', '),
        }}
      />

      {/* ── Large lerped circle — lags behind for a smooth luxurious feel ── */}
      <div
        ref={circleRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          // Center on the lerped point
          marginTop: circleOffset,
          marginLeft: circleOffset,
          width: circleSize,
          height: circleSize,
          borderRadius: '50%',
          border: `1.5px solid ${circleBorderColor}`,
          backgroundColor: circleBg,
          pointerEvents: 'none',
          zIndex: 9998,
          willChange: 'transform',
          // Smooth appearance transitions (NOT position — that's handled by RAF)
          transition: [
            'width 350ms cubic-bezier(0.76,0,0.24,1)',
            'height 350ms cubic-bezier(0.76,0,0.24,1)',
            'margin 350ms cubic-bezier(0.76,0,0.24,1)',
            'background-color 300ms ease',
            'border-color 300ms ease',
            'opacity 250ms ease',
          ].join(', '),
          // Flex to center the label text
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Label — only rendered when in hover / product state */}
        <span
          style={{
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#c9a84c',
            lineHeight: 1,
            userSelect: 'none',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            opacity: showLabel ? 1 : 0,
            transform: showLabel ? 'scale(1)' : 'scale(0.6)',
            transition: [
              'opacity 250ms ease',
              'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
            ].join(', '),
          }}
        >
          {labelText}
        </span>
      </div>
    </>
  );
}
