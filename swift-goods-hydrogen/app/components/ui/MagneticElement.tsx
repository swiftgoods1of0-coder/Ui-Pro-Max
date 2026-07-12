;

import { useEffect, useRef, useCallback, type ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MagneticElementProps {
  children: ReactNode;
  /** How strongly the element is attracted to the cursor (0–1). Default 0.3. */
  strength?: number;
  /** Activation radius in pixels around the element center. Default 200. */
  radius?: number;
  /** Extra classes forwarded to the outer wrapper. */
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function MagneticElement({
  children,
  strength = 0.3,
  radius = 200,
  className,
}: MagneticElementProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isInsideRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0 });

  // -----------------------------------------------------------------------
  // Apply magnetic translation toward the cursor
  // -----------------------------------------------------------------------
  const animate = useCallback(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = mouseRef.current.x - centerX;
    const dy = mouseRef.current.y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < radius) {
      // Proportional pull: closer cursor → stronger displacement
      const pull = 1 - distance / radius;
      const tx = dx * pull * strength;
      const ty = dy * pull * strength;

      el.style.transition = 'none';
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    }

    if (isInsideRef.current) {
      rafRef.current = requestAnimationFrame(animate);
    }
  }, [strength, radius]);

  // -----------------------------------------------------------------------
  // Mouse event handlers
  // -----------------------------------------------------------------------
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };

      const el = wrapperRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius && !isInsideRef.current) {
        isInsideRef.current = true;
        rafRef.current = requestAnimationFrame(animate);
      } else if (distance >= radius && isInsideRef.current) {
        isInsideRef.current = false;
        cancelAnimationFrame(rafRef.current);
        // Spring back with a smooth cubic-bezier transition
        el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
        el.style.transform = 'translate3d(0, 0, 0)';
      }
    },
    [radius, animate],
  );

  const handleMouseLeave = useCallback(() => {
    isInsideRef.current = false;
    cancelAnimationFrame(rafRef.current);

    const el = wrapperRef.current;
    if (!el) return;

    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    el.style.transform = 'translate3d(0, 0, 0)';
  }, []);

  // -----------------------------------------------------------------------
  // Lifecycle — attach / detach listeners
  // -----------------------------------------------------------------------
  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return

    // Listen on `window` so we detect the cursor even before it physically
    // enters the wrapper div (the activation radius can be larger).
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------
  return (
    <div ref={wrapperRef} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}
